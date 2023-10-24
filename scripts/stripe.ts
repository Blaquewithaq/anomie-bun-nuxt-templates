/* eslint-disable no-console */
import * as fs from "fs";
import * as os from "os";
import { exec, fork } from "child_process";
import { promisify } from "util";
import AdmZip from "adm-zip";
import fetch from "node-fetch";
import chalk from "chalk";
import ora from "ora";
import { config } from "dotenv";
config();

const debug = false;

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
        return "x86_64";
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
    return `${downloadDir}/stripe${zipExtension()}`;
  };

  return {
    platform: platform(),
    arch: arch(),
    fileExtension: fileExtension(),
    zipExtension: zipExtension(),
    latestVersion: await latestVersion(),
    name: await name(),
    url: await downloadUrl(),
    savePath: savePath(),
  };
}

// Download file from GitHub
async function download(downloadData: DownloadData): Promise<boolean> {
  let spinner;

  if (debug) {
    spinner = ora(" -- DEBUG: downloading...").start();
  }

  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir);
  }

  try {
    const response = await fetch(downloadData.url);

    if (response.ok) {
      const file = fs.createWriteStream(downloadData.savePath);
      await new Promise((resolve, reject) => {
        response.body?.pipe(file);
        file.on("finish", resolve);
        file.on("error", reject);
      });

      if (debug && spinner) {
        spinner.succeed(" -- DEBUG: downloaded");
      }

      await extractDownload(downloadData);
      return true;
    } else {
      if (debug && spinner) {
        spinner.fail(
          ` -- DEBUG: failed to download stripe-cli. Status code: ${response.status}`,
        );
      }
      return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (debug && spinner) {
      spinner.fail(error.message);
    }
    return false;
  }
}

// Extract download file
async function extractDownload(downloadData: DownloadData): Promise<boolean> {
  let spinner;

  if (debug) {
    spinner = ora(" -- DEBUG: extracting...").start();
  }

  const downloadPath = `${downloadDir}/stripe${downloadData.zipExtension}`;

  if (downloadData.zipExtension === ".zip") {
    const zip = new AdmZip(downloadPath);
    zip.extractAllTo(downloadDir, true);
  } else if (downloadData.zipExtension === ".tar.gz") {
    const execAsync = promisify(exec);
    await execAsync(`tar -xzf ${downloadPath} -C ${downloadDir}`);
  }

  if (!fs.existsSync(`${downloadDir}/stripe${downloadData.fileExtension}`)) {
    if (debug && spinner) {
      spinner.fail(" -- DEBUG: failed to extract");
    }
    return false;
  }

  if (debug && spinner) {
    spinner.succeed(" -- DEBUG: extracted");
  }
  return true;
}

async function testProgram(downloadData: DownloadData): Promise<boolean> {
  let spinner;

  if (debug) {
    spinner = ora(" -- DEBUG: testing...").start();
  }

  const zipPath = `${downloadDir}/stripe${downloadData.fileExtension}`;
  const cmd = `"${zipPath}" --version`;

  try {
    await promisify(exec)(cmd);
    if (debug && spinner) {
      spinner.succeed(" -- DEBUG: working");
    }
    return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (debug && spinner) {
      spinner.fail(error.message);
    }
    return false;
  }
}

// Auto-login using env variables
function login(downloadData: DownloadData) {
  let apiKey;

  if (!process.env.STRIPE_API_KEY) {
    apiKey = "STRIPE_API_KEY_NOT_SET";
  } else {
    apiKey = process.env.STRIPE_API_KEY;
  }

  const execPath = `${downloadDir}/stripe${downloadData.fileExtension}`;
  const cmd = `./${execPath} login --api-key ${apiKey}`;

  console.log(
    "  -- login to the stripe cli (copy/paste command)\n" +
      chalk.yellowBright(cmd),
  );
}

// Install program to the temp directory
async function install() {
  let spinner;

  if (!debug) {
    spinner = ora("-- installing stripe-cli...").start();
  }

  const downloadData = await getDownloadData();

  if (!fs.existsSync(downloadData.savePath)) {
    const downloaded = await download(downloadData);

    if (downloaded && (await testProgram(downloadData))) {
      if (!debug && spinner) {
        spinner.succeed("-- stripe-cli installed");
      }
    } else if (!debug && spinner) {
      spinner.fail("-- failed to install stripe-cli");
    }
  } else if (!debug && spinner) {
    spinner.succeed("-- stripe-cli already installed");
  }

  if (fs.existsSync(downloadData.savePath)) {
    login(downloadData);
  }
}

// -----------------------------------

// Start webhook server
async function startWebhookServer() {
  const downloadData = await getDownloadData();
  const filePath = `${downloadDir}/stripe${downloadData.fileExtension}`;

  fork(filePath, [
    "listen",
    "--forward-to",
    "localhost:3000/api/v1/webhooks/stripe",
  ]);
}

// -----------------------------------

// Main entry point
(async () => {
  if (process.argv.length > 2) {
    console.log(chalk.cyan("> Anomie CLI"));

    switch (process.argv[2]) {
      case "--install":
        await install();
        break;
      case "--start-webhooks":
        await startWebhookServer();
        break;
      default:
        console.log("Invalid argument");
        break;
    }
  }
})();
