/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import * as fs from "fs";
import * as os from "os";
import { exec, execSync } from "child_process";
import fetch from "node-fetch";
import chalk from "chalk";
import ora from "ora";

const devDir = ".dev";
const downloadDir = `${devDir}/mkcert`;
const certsDir = "certificates";
const env = {
  CAROOT: `${downloadDir}/ca`,
  NODE_EXTRA_CA_CERTS: `${downloadDir}/ca/rootCA.pem`,
  NODE_TLS_REJECT_UNAUTHORIZED: "0",
};

if (!fs.existsSync(devDir)) {
  fs.mkdirSync(devDir);
}

// If linux then sudo
if (os.platform() === "linux") {
  execSync("sudo echo 'sudo enabled'");
}

// -----------------------------------

interface DownloadData {
  platform: string;
  arch: string;
  fileExtension: string;
  latestVersion: string;
  name: string;
  url: string;
  savePath: string;
}

// -----------------------------------

// Gather system info and download info
async function getDownloadData(): Promise<DownloadData> {
  const githubRepo = "https://github.com/FiloSottile/mkcert/releases";

  const platform = (): string => {
    switch (os.platform()) {
      case "win32":
        return "windows";
      case "darwin":
        return "darwin";
      case "linux":
        return "linux";
      default:
        return "unsupported";
    }
  };

  const arch = (): string => {
    switch (os.arch()) {
      case "x64":
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
      throw new Error(
        `Failed to fetch releases. Status code: ${response.status}`,
      );
    }
  };

  const name = async (): Promise<string> => {
    return `mkcert-${await latestVersion()}-${platform()}-${arch()}${fileExtension()}`;
  };

  const downloadUrl = async () => {
    return `${githubRepo}/download/${await latestVersion()}/${await name()}`;
  };

  const savePath = async (): Promise<string> => {
    return `${downloadDir}/${await name()}`;
  };

  return {
    platform: platform(),
    arch: arch(),
    fileExtension: fileExtension(),
    latestVersion: await latestVersion(),
    name: await name(),
    url: await downloadUrl(),
    savePath: await savePath(),
  };
}

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
        spinner.succeed("mkcert downloaded");

        if (
          downloadData.platform === "linux" ||
          downloadData.platform === "darwin"
        ) {
          exec(`chmod +x "${downloadData.savePath}"`);
        }
      });
    } else {
      spinner.fail(
        `Failed to download mkcert. Status code: ${response.status}`,
      );
    }
  } catch (error: any) {
    spinner.fail(error.message);
  }
}

// Test mkcert is working
function testDownload(downloadData: DownloadData) {
  const spinner = ora("Testing mkcert is working...").start();

  const cmd = `"${downloadData.savePath}"`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      spinner.fail(error.message);
      return;
    }

    if (stderr) {
      spinner.fail(stderr);
      return;
    }

    if (stdout.includes("Usage of mkcert:")) {
      spinner.succeed("mkcert is working");
    } else {
      spinner.fail("Failed to test mkcert");
    }
  });
}

// Generate .env file
function generateEnvFile() {
  const spinner = ora("Generating .env file...").start();

  const envFile = `# mkcert
CAROOT="${env.CAROOT}"
NODE_EXTRA_CA_CERTS="${env.NODE_EXTRA_CA_CERTS}"
NODE_TLS_REJECT_UNAUTHORIZED="${env.NODE_TLS_REJECT_UNAUTHORIZED}"`;

  fs.writeFileSync(`${downloadDir}/.env`, envFile);

  if (fs.existsSync(`${downloadDir}/.env`)) {
    spinner.succeed(".env file generated");
  } else {
    spinner.fail("Failed to generate .env file");
  }
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
  const spinner = ora("Checking for mkcert...").start();

  if (fs.existsSync(downloadData.savePath)) {
    spinner.succeed("mkcert found");
    testDownload(downloadData);
  } else {
    spinner.warn("mkcert not found");
    await download(downloadData);

    // wait 2 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000));

    testDownload(downloadData);
    generateEnvFile();
  }
}

// Remove mkcert from the temp directory
function uninstall() {
  const spinner = ora("Removing mkcert...").start();

  if (fs.existsSync(downloadDir)) {
    fs.rmSync(downloadDir, { recursive: true });
  }

  spinner.succeed("mkcert removed");
}

// > TASKS

// Certificate info
function getCertInfo() {
  return {
    hosts: ["localhost", "127.0.0.1"],
    certPath: `${certsDir}/localhost-cert.pem`,
    keyPath: `${certsDir}/localhost-key.pem`,
  };
}

// Create a new local CA
async function createLocalCA() {
  if (process.env.CAROOT !== env.CAROOT) {
    console.log(
      chalk.red(
        `CAROOT is not set to ${env.CAROOT}. Please set it to ${env.CAROOT} and try again.`,
      ),
    );
    console.log("process.env.CAROOT", process.env.CAROOT);
    return;
  }

  if (!fs.existsSync(env.CAROOT)) {
    fs.mkdirSync(env.CAROOT);
  }

  const downloadData = await getDownloadData();

  const spinner = ora("Creating a new local CA...").start();
  const cmd = `"${downloadData.savePath}" -install`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      spinner.fail(error.message);
      return;
    }

    if (stderr) {
      spinner.fail(stderr);
      return;
    }

    if (stdout.includes("The local CA is now installed")) {
      spinner.succeed("Local CA created");
      console.log(stdout);
    } else {
      spinner.fail("Failed to create local CA");
    }
  });
}

// Create certificates
async function createCerts() {
  const spinner = ora("Creating certificates...").start();

  if (!fs.existsSync(certsDir)) {
    fs.mkdirSync(certsDir);
  }

  const downloadData = await getDownloadData();
  const certInfo = getCertInfo();

  const cmd = `"${downloadData.savePath}" -key-file "${
    certInfo.keyPath
  }" -cert-file "${certInfo.certPath}" ${certInfo.hosts.join(" ")}`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      spinner.fail(error.message);
      return;
    }

    if (stderr) {
      spinner.fail(stderr);
      return;
    }

    if (
      stdout.includes("Created a new certificate valid for the following names")
    ) {
      spinner.succeed("Certificates generated");
      console.log(stdout);
    } else {
      spinner.fail("Failed to generate certificates");
    }
  });
}

// Install and create certificates
async function installAndCreateCerts() {
  await install();
  await createLocalCA();
  await createCerts();
}

// > MAIN ENTRY POINT
if (process.argv.length > 2) {
  switch (process.argv[2]) {
    case "--install":
      await install();
      break;
    case "--uninstall":
      uninstall();
      break;
    case "--create-ca":
      await createLocalCA();
      break;
    case "--create-certs":
      await createCerts();
      break;
    case "--install-and-create-certs":
      await installAndCreateCerts();
      break;
    default:
      console.log("Invalid argument");
      break;
  }
}
