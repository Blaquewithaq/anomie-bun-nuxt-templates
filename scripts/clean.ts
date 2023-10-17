import { exec } from "child_process";
import { promisify } from "util";
import chalk from "chalk";
import ora from "ora";
import { rimraf } from "rimraf";

// Directories and files to clean
const directories: string[] = [
  "dist",
  ".nuxt",
  ".output",
  "node_modules/.cache",
  "node_modules/.vite",
];

const files: string[] = [".eslintcache"];

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
  const spinner = ora().start();
  spinner.color = "magenta";
  spinner.spinner = "aesthetic";
  spinner.text = chalk.yellow(" Cleaning...");

  await clean();
  await prepare();

  spinner.succeed(chalk.green("Cleaned"));
})();
