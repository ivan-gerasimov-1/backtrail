import { Command } from "commander";
import { cwd } from "node:process";

import { init } from "./commands/init";

export function cli() {
  let command = new Command()
    .name("backtrail")
    .description("CLI for Backtrail workspace setup")
    .version("0.1.0");

  command
    .command("init")
    .description("Initialize Backtrail files in current directory")
    .action(async () => {
      let result = await init({ cwd: cwd() });

      for (let createdPath of result.created) {
        console.log(`created ${createdPath}`);
      }

      for (let skippedPath of result.skipped) {
        console.log(`skipped ${skippedPath}`);
      }

      for (let errorMessage of result.errors) {
        console.error(`error ${errorMessage}`);
      }

      if (!result.success) {
        process.exitCode = 1;
      }
    });

  return command;
}
