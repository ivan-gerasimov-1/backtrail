import { TExecRuntimeOptions } from "./types";

export const EXEC_BINARY = "pi";

export type TExecPromptOptions = Omit<
  TExecRuntimeOptions,
  "cwd" | "model" | "reasoningEffort"
> & {
  skillPrompt: string;
};

export function buildExecPrompt(options: TExecPromptOptions) {
  let promptParts: string[] = [options.skillPrompt];

  if (options.changeName) {
    promptParts.push(`change: ${options.changeName}`);
  }

  if (options.taskName) {
    promptParts.push(`task: ${options.taskName}`);
  }

  if (options.featureName) {
    promptParts.push(`feature: ${options.featureName}`);
  }

  let extraPrompt = options.promptParts.join(" ").trim();

  if (extraPrompt.length > 0) {
    promptParts.push(extraPrompt);
  }

  return promptParts.join(" ");
}

export function buildExecArguments(options: TExecRuntimeOptions) {
  return [
    "--print",
    "--provider",
    "openai-codex",
    "--model",
    `gpt-${options.model}`,
    "--thinking",
    options.reasoningEffort,
    buildExecPrompt(options),
  ];
}
