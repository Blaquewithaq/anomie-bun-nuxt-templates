/* eslint-disable no-console */
import { exec } from "child_process";
import { promisify } from "util";
import chalk from "chalk";
import ora from "ora";
import { rimraf } from "rimraf";

let full = false;

if (process.argv.length > 2) {
  switch (process.argv[2]) {
    case "--full":
      full = true;
      break;
    default:
      break;
  }
}

// Directories and files to clean
const directories: string[] = [
  "dist",
  ".nuxt",
  ".output",
  "node_modules/.cache",
  "node_modules/.vite",
];

const files: string[] = [".eslintcache"];

if (full) {
  directories.push("node_modules");
  files.push("bun.lockb");
}

// Clean directories and files
async function clean() {
  await rimraf(directories, {});
  await rimraf(files, {});
}

// Prepare
async function prepare() {
  const execAsync = promisify(exec);
  await execAsync("bun install");
}

// Run
(async () => {
  console.log(chalk.cyan("> Anomie CLI"));
  const spinner = ora().start();
  spinner.color = "magenta";
  spinner.spinner = "arc";
  spinner.text = chalk.yellow("cleaning...");

  await clean();

  if (!full) {
    await prepare();
  }

  spinner.succeed(chalk.green("clean"));
})();
