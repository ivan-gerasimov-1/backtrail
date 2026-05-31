import { defineCommand, parseArgs, runCommand, runMain } from "citty";
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

type TCommandRuntimeContext = {
  configLoaded: boolean;
  workingDirectory: string;
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

type TCommandOptionInfo = {
  flags: string;
};

type TCommandInfo = {
  name: () => string;
  options: TCommandOptionInfo[];
};

type TBacktrailCommand = {
  commands: TCommandInfo[];
  parseAsync: (args?: string[], options?: { from?: string }) => Promise<void>;
};

export function cli(): TBacktrailCommand {
  return {
    commands: [
      buildCommandInfo("init", ["--config <path>"]),
      buildCommandInfo("implement", [
        "--config <path>",
        "-c, --change <name>",
        "-t, --task <name>",
        "-F, --feature <name>",
        "-f, --force",
      ]),
      buildCommandInfo("create", [
        "--config <path>",
        "-c, --change <name>",
        "-F, --feature <name>",
        "-f, --force",
      ]),
      buildCommandInfo("review", [
        "--config <path>",
        "-c, --change <name>",
        "-t, --task <name>",
        "-F, --feature <name>",
        "-f, --force",
      ]),
    ],
    async parseAsync(args?: string[], options?: { from?: string }) {
      let rawArgs = options?.from === "user" ? args ?? [] : args ?? process.argv.slice(2);
      let runtimeContext = await loadRuntimeContext(rawArgs);
      let command = buildRootCommand(runtimeContext);

      if (options?.from === "user") {
        await runCommand(command, { rawArgs });
        return;
      }

      await runMain(command, { rawArgs });
    },
  };
}

function buildRootCommand(runtimeContext: TCommandRuntimeContext) {
  return defineCommand({
    meta: {
      name: "backtrail",
      description: "CLI for Backtrail workspace setup",
      version: "0.1.0",
    },
    args: {
      config: {
        type: "string",
        description: "Backtrail config file path (default: .backtrail/backtrail.config.json)",
        valueHint: "path",
      },
    },
    subCommands: {
      init: buildInitCommand(runtimeContext),
      implement: buildImplementCommand(runtimeContext),
      create: buildCreateCommand(runtimeContext),
      review: buildReviewCommand(runtimeContext),
    },
  });
}

function buildInitCommand(runtimeContext: TCommandRuntimeContext) {
  return defineCommand({
    meta: {
      name: "init",
      description: "Initialize Backtrail files in current directory",
    },
    args: {
      config: {
        type: "string",
        description: "Backtrail config file path (default: .backtrail/backtrail.config.json)",
        valueHint: "path",
      },
    },
    async run() {
      if (!runtimeContext.configLoaded) {
        return;
      }

      let result = await init({ cwd: runtimeContext.workingDirectory });

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
    },
  });
}

function buildImplementCommand(runtimeContext: TCommandRuntimeContext) {
  return defineCommand({
    meta: {
      name: "implement",
      description:
        "Run implementation skill flow. Optional flags: -c, --change <name>; -t, --task <name>; -F, --feature <name>; -f, --force.",
    },
    args: {
      config: {
        type: "string",
        description: "Backtrail config file path (default: .backtrail/backtrail.config.json)",
        valueHint: "path",
      },
      change: {
        type: "string",
        description: "Backtrail change name",
        valueHint: "name",
        alias: "c",
      },
      task: {
        type: "string",
        description: "Backtrail task name",
        valueHint: "name",
        alias: "t",
      },
      feature: {
        type: "string",
        description: "Backtrail feature name",
        valueHint: "name",
        alias: "F",
      },
      force: {
        type: "boolean",
        description: "Avoid clarification questions and proceed with available context",
        alias: "f",
      },
    },
    async run(context) {
      let options: TImplementCommandOptions = {
        change: context.args.change,
        task: context.args.task,
        feature: context.args.feature,
        force: context.args.force,
      };

      if (!runtimeContext.configLoaded) {
        return;
      }

      console.log("Agent started to work.");

      let result = await implement({
        cwd: runtimeContext.workingDirectory,
        changeName: options.change,
        taskName: options.task,
        featureName: options.feature,
        ...(options.force ? { force: true } : {}),
        promptParts: context.args._,
      });

      handleExecResult(result);
    },
  });
}

function buildCreateCommand(runtimeContext: TCommandRuntimeContext) {
  return defineCommand({
    meta: {
      name: "create",
      description:
        "Run Backtrail creation flow. Optional flags: -c, --change <name>; -F, --feature <name>; -f, --force.",
    },
    args: {
      config: {
        type: "string",
        description: "Backtrail config file path (default: .backtrail/backtrail.config.json)",
        valueHint: "path",
      },
      change: {
        type: "string",
        description: "Backtrail change name",
        valueHint: "name",
        alias: "c",
      },
      feature: {
        type: "string",
        description: "Backtrail feature name",
        valueHint: "name",
        alias: "F",
      },
      force: {
        type: "boolean",
        description: "Avoid clarification questions and proceed with available context",
        alias: "f",
      },
    },
    async run(context) {
      let options: TCreateCommandOptions = {
        change: context.args.change,
        feature: context.args.feature,
        force: context.args.force,
      };

      if (!runtimeContext.configLoaded) {
        return;
      }

      console.log("Agent started to work.");

      let result = await create({
        cwd: runtimeContext.workingDirectory,
        changeName: options.change,
        featureName: options.feature,
        ...(options.force ? { force: true } : {}),
        promptParts: context.args._,
      });

      handleExecResult(result);
    },
  });
}

function buildReviewCommand(runtimeContext: TCommandRuntimeContext) {
  return defineCommand({
    meta: {
      name: "review",
      description:
        "Run review skill flow. Optional flags: -c, --change <name>; -t, --task <name>; -F, --feature <name>; -f, --force.",
    },
    args: {
      config: {
        type: "string",
        description: "Backtrail config file path (default: .backtrail/backtrail.config.json)",
        valueHint: "path",
      },
      change: {
        type: "string",
        description: "Backtrail change name",
        valueHint: "name",
        alias: "c",
      },
      task: {
        type: "string",
        description: "Backtrail task name",
        valueHint: "name",
        alias: "t",
      },
      feature: {
        type: "string",
        description: "Backtrail feature name",
        valueHint: "name",
        alias: "F",
      },
      force: {
        type: "boolean",
        description: "Avoid clarification questions and proceed with available context",
        alias: "f",
      },
    },
    async run(context) {
      let options: TReviewCommandOptions = {
        change: context.args.change,
        task: context.args.task,
        feature: context.args.feature,
        force: context.args.force,
      };

      if (!runtimeContext.configLoaded) {
        return;
      }

      console.log("Agent started to work.");

      let result = await review({
        cwd: runtimeContext.workingDirectory,
        changeName: options.change,
        taskName: options.task,
        featureName: options.feature,
        ...(options.force ? { force: true } : {}),
        promptParts: context.args._,
      });

      handleExecResult(result);
    },
  });
}

function buildCommandInfo(name: string, optionFlags: string[]): TCommandInfo {
  return {
    name: () => name,
    options: optionFlags.map((flags) => ({ flags })),
  };
}

async function loadRuntimeContext(rawArgs: string[]): Promise<TCommandRuntimeContext> {
  let args = parseArgs(rawArgs, {
    config: {
      type: "string",
      description: "Backtrail config file path (default: .backtrail/backtrail.config.json)",
      valueHint: "path",
    },
  });
  let workingDirectory = cwd();
  let configPath = typeof args["config"] === "string" ? args["config"] : undefined;

  return {
    workingDirectory,
    configLoaded: await loadSharedConfig(workingDirectory, configPath),
  };
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
