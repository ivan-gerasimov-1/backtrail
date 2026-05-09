import { Command } from "commander";
import { cwd } from "node:process";

import { exec } from "./commands/exec";
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

  command
    .command("exec [promptParts...]")
    .option("-c, --change <name>", "Backtrail change name")
    .option("-t, --task <name>", "Backtrail task name")
    .description(
      "Run predefined PI Coding Agent flow. Optional flags: -c, --change <name>; -t, --task <name>.",
    )
    .action(async (promptParts: string[] | undefined, options: { change?: string; task?: string }) => {
      console.log("Agent started to work.");

      let result = await exec({
        cwd: cwd(),
        changeName: options.change,
        taskName: options.task,
        promptParts: promptParts ?? [],
      });

      for (let errorMessage of result.errors) {
        console.error(`error ${errorMessage}`);
      }

      if (!result.success) {
        process.exitCode = 1;
      }
    });

  return command;
}
