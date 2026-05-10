import {
  buildExecArguments as buildSharedExecArguments,
  buildExecPrompt as buildSharedExecPrompt,
  EXEC_BINARY,
} from "../execRuntimeConfig";
import { TExecOptions, type TExecRuntimeOptions } from "../types";

export { EXEC_BINARY };
export const EXEC_CREATE_SKILL = "/skill:backtrail-create";
export const EXEC_CREATE_MODEL = "5.5";
export const EXEC_CREATE_REASONING_EFFORT = "low";

export function buildExecCreatePrompt(options: TExecOptions) {
  return buildSharedExecPrompt({
    ...options,
    skillPrompt: EXEC_CREATE_SKILL,
  });
}

export function buildExecCreateArguments(options: TExecOptions) {
  return buildSharedExecArguments({
    ...options,
    skillPrompt: EXEC_CREATE_SKILL,
    model: EXEC_CREATE_MODEL,
    reasoningEffort: EXEC_CREATE_REASONING_EFFORT,
  } satisfies TExecRuntimeOptions);
}
