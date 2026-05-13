import { Command } from "commander";
import { cwd } from "node:process";

import { create } from "./commands/create/create";
import { loadCommandConfig } from "./commands/commandConfig";
import { implement } from "./commands/implement/implement";
import { init } from "./commands/init/init";
import { review } from "./commands/review/review";
import { handleExecResult } from "./commands/execResult";

type TCommandConfigOptions = {
  config?: string;
};

type TImplementCommandOptions = TCommandConfigOptions & {
  change?: string;
  task?: string;
  feature?: string;
  force?: boolean;
};

type TCreateCommandOptions = TCommandConfigOptions & {
  change?: string;
  feature?: string;
  force?: boolean;
};

type TReviewCommandOptions = TCommandConfigOptions & {
  change?: string;
  task?: string;
  feature?: string;
  force?: boolean;
};

export function cli() {
  let command = new Command()
    .name("backtrail")
    .description("CLI for Backtrail workspace setup")
    .version("0.1.0")
    .showHelpAfterError();

  command
    .command("init")
    .option("--config <path>", "Backtrail config file path (default: .backtrail/backtrail.config.json)")
    .description("Initialize Backtrail files in current directory")
    .action(async (options: TCommandConfigOptions) => {
      let workingDirectory = cwd();

      if (!(await loadSharedConfig(workingDirectory, options.config))) {
        return;
      }

      let result = await init({ cwd: workingDirectory });

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
    .option("--config <path>", "Backtrail config file path (default: .backtrail/backtrail.config.json)")
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
        options: TImplementCommandOptions,
      ) => {
        let workingDirectory = cwd();

        if (!(await loadSharedConfig(workingDirectory, options.config))) {
          return;
        }

        console.log("Agent started to work.");

        let result = await implement({
          cwd: workingDirectory,
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
    .option("--config <path>", "Backtrail config file path (default: .backtrail/backtrail.config.json)")
    .option("-c, --change <name>", "Backtrail change name")
    .option("-F, --feature <name>", "Backtrail feature name")
    .option("-f, --force", "Avoid clarification questions and proceed with available context")
    .description(
      "Run Backtrail creation flow. Optional flags: -c, --change <name>; -F, --feature <name>; -f, --force.",
    )
    .action(
      async (
        promptParts: string[] | undefined,
        options: TCreateCommandOptions,
      ) => {
        let workingDirectory = cwd();

        if (!(await loadSharedConfig(workingDirectory, options.config))) {
          return;
        }

        console.log("Agent started to work.");

        let result = await create({
          cwd: workingDirectory,
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
    .option("--config <path>", "Backtrail config file path (default: .backtrail/backtrail.config.json)")
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
        options: TReviewCommandOptions,
      ) => {
        let workingDirectory = cwd();

        if (!(await loadSharedConfig(workingDirectory, options.config))) {
          return;
        }

        console.log("Agent started to work.");

        let result = await review({
          cwd: workingDirectory,
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

async function loadSharedConfig(workingDirectory: string, configPath?: string) {
  let result = await loadCommandConfig({
    cwd: workingDirectory,
    ...(configPath ? { configPath } : {}),
  });

  if (result.success) {
    return true;
  }

  for (let errorMessage of result.errors) {
    console.error(`error ${errorMessage}`);
  }

  process.exitCode = 1;
  return false;
}
