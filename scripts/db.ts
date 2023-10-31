/* eslint-disable no-console */
import { exec } from "child_process";
import { promisify } from "util";
import chalk from "chalk";
// import ora from "ora";
// import { rimraf } from "rimraf";

async function verifyDependencies() {
  const execAsync = promisify(exec);
  await execAsync("bun install");
}

async function resetSupabaseDatabase() {
  const execAsync = promisify(exec);
  await execAsync("bun supabase:reset");
}

// async function resetPrismaDatabase() {
//   const execAsync = promisify(exec);
//   await execAsync("bun prisma:reset");
// }

// -----------------------------------

// Run
(async () => {
  console.log(chalk.cyan("> Anomie CLI"));
  await verifyDependencies();
  await resetSupabaseDatabase();
})();
