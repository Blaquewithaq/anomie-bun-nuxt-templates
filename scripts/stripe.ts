/* eslint-disable no-console */
import * as fs from "fs";
import * as os from "os";
import { exec, fork } from "child_process";
import AdmZip from "adm-zip";
import fetch from "node-fetch";
import chalk from "chalk";
import ora from "ora";

const devDir = ".dev";
const downloadDir = `${devDir}/stripe`;

if (!fs.existsSync(devDir)) {
  fs.mkdirSync(devDir);
}

// -----------------------------------

interface DownloadData {
  platform: string;
  arch: string;
  fileExtension: string;
  zipExtension: string;
  latestVersion: string;
  name: string;
  url: string;
  savePath: string;
}

// -----------------------------------

// Gather system info and download info
async function getDownloadData(): Promise<DownloadData> {
  const githubRepo = "https://github.com/stripe/stripe-cli/releases";

  const platform = (): string => {
    switch (os.platform()) {
      case "win32":
        return "windows";
      case "darwin":
        return "mac-os";
      case "linux":
        return "linux";
      default:
        return "unsupported";
    }
  };

  const arch = (): string => {
    switch (os.arch()) {
      case "x64":
        if (platform() === "windows") {
          return "x86_64";
        }

        return "amd64";
      case "arm":
        return "arm";
      case "arm64":
        return "arm64";
      default:
        return "unsupported";
    }
  };

  const fileExtension = (): string => {
    switch (os.platform()) {
      case "win32":
        return ".exe";
      default:
        return "";
    }
  };

  const zipExtension = (): string => {
    switch (os.platform()) {
      case "win32":
        return ".zip";
      default:
        return ".tar.gz";
    }
  };

  const latestVersion = async (): Promise<string> => {
    const parts = githubRepo.split("/");
    const owner = parts[3];
    const repo = parts[4];

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/releases`,
    );

    if (response.ok) {
      const releases = (await response.json()) as Array<{ tag_name: string }>;
      if (releases.length > 0) {
        return releases[0].tag_name;
      } else {
        throw new Error("No releases found in the repository.");
      }
    } else {
      return "";
    }
  };

  const formatTag = (tag: string) => {
    return tag.replace("v", "");
  };

  const name = async (): Promise<string> => {
    return `stripe_${formatTag(
      await latestVersion(),
    )}_${platform()}_${arch()}${zipExtension()}`;
  };

  const downloadUrl = async () => {
    return `${githubRepo}/download/${await latestVersion()}/${await name()}`;
  };

  const savePath = (): string => {
    return `${downloadDir}/stripe_cli${fileExtension()}`;
  };

  return {
    platform: platform(),
    arch: arch(),
    fileExtension: fileExtension(),
    zipExtension: zipExtension(),
    latestVersion: await latestVersion(),
    name: await name(),
    url: await downloadUrl(),
    savePath: await savePath(),
  };
}

console.log(await getDownloadData());

// Download file from GitHub
async function download(downloadData: DownloadData) {
  const spinner = ora(
    `Downloading ${downloadData.name} from GitHub...`,
  ).start();

  try {
    const response = await fetch(downloadData.url);

    if (response.ok) {
      const file = fs.createWriteStream(downloadData.savePath);
      response.body?.pipe(file);

      file.on("finish", () => {
        file.close();
        spinner.succeed("stripe downloaded");
      });
    } else {
      spinner.fail(
        `Failed to download stripe. Status code: ${response.status}`,
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    spinner.fail(error.message);
  }
}

function extractZip(downloadData: DownloadData) {
  const zipPath = `${downloadDir}/stripe_cli${downloadData.zipExtension}`;
  console.log(zipPath);
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(downloadDir, true);
  testProgram(downloadData);
}

function testProgram(downloadData: DownloadData) {
  const spinner = ora("Testing stripe is working...").start();

  const zipPath = `${downloadDir}/stripe${downloadData.fileExtension}`;
  const cmd = `"${zipPath}" --version`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      spinner.fail(error.message);
      return;
    }

    if (stderr) {
      spinner.fail(stderr);
      return;
    }

    console.log(`stdout: ${stdout}`);
    spinner.succeed("stripe is working");
  });
}

// Display system and download info
function displayInfo(downloadData: DownloadData) {
  console.log(chalk.bold.green("> System Info"));
  console.log(` - Platform: ${chalk.cyan(os.platform())}`);
  console.log(` - Arch: ${chalk.cyan(os.arch())}`);
  console.log(` - File Extension: ${chalk.yellow(downloadData.fileExtension)}`);

  console.log(chalk.bold.blue("> Download Info"));
  console.log(` - Name: ${chalk.yellow(downloadData.name)}`);
  console.log(` - Version: ${chalk.yellow(downloadData.latestVersion)}`);
  console.log(` - URL: ${chalk.blue.underline(downloadData.url)}`);
  console.log(` - Path: ${chalk.green(downloadData.savePath)}`);
  console.log();
}

// Install program to the temp directory
async function install() {
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir);
  }

  const downloadData = await getDownloadData();
  displayInfo(downloadData);
  const spinner = ora("Checking for stripe...").start();

  if (fs.existsSync(downloadData.savePath)) {
    spinner.succeed("stripe found");
  } else {
    spinner.warn("stripe not found");
    await download(downloadData);
  }
}

export function startWebhook(downloadData: DownloadData) {
  const filePath = `${downloadDir}/stripe${downloadData.fileExtension}`;
  // const cmd = `"${filePath}" listen --forward-to localhost:54321/functions/v1/`;

  console.log(filePath);
  fork(filePath, ["listen", "--forward-to", "localhost:54321/functions/v1/"]);
}

// > MAIN ENTRY POINT
if (process.argv.length > 2) {
  switch (process.argv[2]) {
    case "--install":
      install();
      break;
    case "--extract":
      extractZip(await getDownloadData());
      break;
    case "--start-webhooks":
      startWebhook(await getDownloadData());
      break;
    default:
      console.log("Invalid argument");
      break;
  }
}
