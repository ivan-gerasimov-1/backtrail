import {
  buildExecArguments as buildSharedExecArguments,
  buildExecPrompt as buildSharedExecPrompt,
  EXEC_BINARY,
} from "./execRuntimeConfig";
import { TExecOptions, type TExecRuntimeOptions } from "./types";

export { EXEC_BINARY };
export const EXEC_SKILL = "/skill:backtrail-implement";
export const EXEC_MODEL = "5.4-mini";
export const EXEC_REASONING_EFFORT = "medium";

export function buildExecPrompt(options: TExecOptions) {
  return buildSharedExecPrompt({
    ...options,
    skillPrompt: EXEC_SKILL,
  });
}

export function buildExecArguments(options: TExecOptions) {
  return buildSharedExecArguments({
    ...options,
    skillPrompt: EXEC_SKILL,
    model: EXEC_MODEL,
    reasoningEffort: EXEC_REASONING_EFFORT,
  } satisfies TExecRuntimeOptions);
}
