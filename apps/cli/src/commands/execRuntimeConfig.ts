import { TExecOptions } from "./types";

export const EXEC_BINARY = "pi";
export const EXEC_MODEL = "openai-codex/gpt-5.4-mini:medium";

export type TExecPromptOptions = Omit<TExecOptions, "cwd"> & {
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

export function buildExecArguments(options: TExecPromptOptions) {
  return ["--print", "--model", EXEC_MODEL, buildExecPrompt(options)];
}
