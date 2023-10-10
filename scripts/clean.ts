import { exec } from "child_process";
import { promisify } from "util";
import chalk from "chalk";
import { consola } from "consola";
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
  consola.start(chalk.yellow("Cleaning..."));
  let spinner = ora("directories: cleaning...").start();
  await rimraf(directories, {});
  spinner.succeed("directories: " + chalk.green("cleaned"));

  spinner = ora("files: cleaning...").start();
  await rimraf(files, {});
  spinner.succeed("files: " + chalk.green("cleaned"));
}

// Prepare
async function prepare() {
  const spinner = ora("preparing...").start();
  const execAsync = promisify(exec);

  await execAsync("bun install");

  spinner.succeed(chalk.green("done"));
}

// Run
(async () => {
  await clean();
  await prepare();
})();
