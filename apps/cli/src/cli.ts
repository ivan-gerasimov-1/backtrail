import { Command } from "commander";
import { cwd } from "node:process";

import { execCreate } from "./commands/execCreate";
import { execImplement } from "./commands/execImplement";
import { handleExecResult } from "./commands/execResult";
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

  let execCommand = command
    .command("exec")
    .description("Run explicit exec subcommands")
    .showHelpAfterError();

  execCommand
    .command("implement [promptParts...]")
    .option("-c, --change <name>", "Backtrail change name")
    .option("-t, --task <name>", "Backtrail task name")
    .option("-f, --feature <name>", "Backtrail feature name")
    .description(
      "Run implementation skill flow. Optional flags: -c, --change <name>; -t, --task <name>; -f, --feature <name>.",
    )
    .action(
      async (
        promptParts: string[] | undefined,
        options: { change?: string; task?: string; feature?: string },
      ) => {
        console.log("Agent started to work.");

        let result = await execImplement({
          cwd: cwd(),
          changeName: options.change,
          taskName: options.task,
          featureName: options.feature,
          promptParts: promptParts ?? [],
        });

        handleExecResult(result);
      },
    );

  execCommand
    .command("create [promptParts...]")
    .option("-c, --change <name>", "Backtrail change name")
    .option("-f, --feature <name>", "Backtrail feature name")
    .description(
      "Run Backtrail creation flow. Optional flags: -c, --change <name>; -f, --feature <name>.",
    )
    .action(
      async (
        promptParts: string[] | undefined,
        options: { change?: string; feature?: string },
      ) => {
        console.log("Agent started to work.");

        let result = await execCreate({
          cwd: cwd(),
          changeName: options.change,
          featureName: options.feature,
          promptParts: promptParts ?? [],
        });

        handleExecResult(result);
      },
    );

  return command;
}
