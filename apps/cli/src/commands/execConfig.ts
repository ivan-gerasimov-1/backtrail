import { TExecOptions } from "./types";

export const EXEC_BINARY = "pi";
export const EXEC_MODEL = "openai-codex/gpt-5.4-mini:medium";
export const EXEC_SKILL = "/skill:backtrail-implement";

export function buildExecPrompt(options: TExecOptions) {
  let promptParts: string[] = [EXEC_SKILL];

  if (options.changeName) {
    promptParts.push(`change: ${options.changeName}`);
  }

  if (options.taskName) {
    promptParts.push(`task: ${options.taskName}`);
  }

  let extraPrompt = options.promptParts.join(" ").trim();

  if (extraPrompt.length > 0) {
    promptParts.push(extraPrompt);
  }

  return promptParts.join(" ");
}

export function buildExecArguments(options: TExecOptions) {
  return ["--print", "--model", EXEC_MODEL, buildExecPrompt(options)];
}
