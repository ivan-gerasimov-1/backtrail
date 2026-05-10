import { Command } from "commander";
import { cwd } from "node:process";

import { create } from "./commands/create/create";
import { execImplement } from "./commands/execImplement/execImplement";
import { execReview } from "./commands/execReview/execReview";
import { handleExecResult } from "./commands/execResult";
import { init } from "./commands/init/init";

export function cli() {
  let command = new Command()
    .name("backtrail")
    .description("CLI for Backtrail workspace setup")
    .version("0.1.0")
    .showHelpAfterError();

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
    .command("implement [promptParts...]")
    .option("-c, --change <name>", "Backtrail change name")
    .option("-t, --task <name>", "Backtrail task name")
    .option("-F, --feature <name>", "Backtrail feature name")
    .option("-f, --force", "Avoid clarification questions and proceed with available context")
    .description(
      "Run implementation skill flow. Optional flags: -c, --change <name>; -t, --task <name>; -F, --feature <name>; -f, --force.",
    )
    .action(
      async (
        promptParts: string[] | undefined,
        options: { change?: string; task?: string; feature?: string; force?: boolean },
      ) => {
        console.log("Agent started to work.");

        let result = await execImplement({
          cwd: cwd(),
          changeName: options.change,
          taskName: options.task,
          featureName: options.feature,
          ...(options.force ? { force: true } : {}),
          promptParts: promptParts ?? [],
        });

        handleExecResult(result);
      },
    );

  command
    .command("create [promptParts...]")
    .option("-c, --change <name>", "Backtrail change name")
    .option("-F, --feature <name>", "Backtrail feature name")
    .option("-f, --force", "Avoid clarification questions and proceed with available context")
    .description(
      "Run Backtrail creation flow. Optional flags: -c, --change <name>; -F, --feature <name>; -f, --force.",
    )
    .action(
      async (
        promptParts: string[] | undefined,
        options: { change?: string; feature?: string; force?: boolean },
      ) => {
        console.log("Agent started to work.");

        let result = await create({
          cwd: cwd(),
          changeName: options.change,
          featureName: options.feature,
          ...(options.force ? { force: true } : {}),
          promptParts: promptParts ?? [],
        });

        handleExecResult(result);
      },
    );

  command
    .command("review [promptParts...]")
    .option("-c, --change <name>", "Backtrail change name")
    .option("-t, --task <name>", "Backtrail task name")
    .option("-F, --feature <name>", "Backtrail feature name")
    .option("-f, --force", "Avoid clarification questions and proceed with available context")
    .description(
      "Run review skill flow. Optional flags: -c, --change <name>; -t, --task <name>; -F, --feature <name>; -f, --force.",
    )
    .action(
      async (
        promptParts: string[] | undefined,
        options: { change?: string; task?: string; feature?: string; force?: boolean },
      ) => {
        console.log("Agent started to work.");

        let result = await execReview({
          cwd: cwd(),
          changeName: options.change,
          taskName: options.task,
          featureName: options.feature,
          ...(options.force ? { force: true } : {}),
          promptParts: promptParts ?? [],
        });

        handleExecResult(result);
      },
    );

  return command;
}
