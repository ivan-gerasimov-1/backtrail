import {
  buildExecArguments as buildSharedExecArguments,
  buildExecPrompt as buildSharedExecPrompt,
  EXEC_BINARY,
} from "../execRuntimeConfig";
import { TExecOptions, type TExecRuntimeOptions } from "../types";

export { EXEC_BINARY };
export const CREATE_SKILL = "/skill:backtrail-create";
export const CREATE_MODEL = "5.5";
export const CREATE_REASONING_EFFORT = "low";

export function buildCreatePrompt(options: TExecOptions) {
  return buildSharedExecPrompt({
    ...options,
    skillPrompt: CREATE_SKILL,
  });
}

export function buildCreateArguments(options: TExecOptions) {
  return buildSharedExecArguments({
    ...options,
    skillPrompt: CREATE_SKILL,
    model: CREATE_MODEL,
    reasoningEffort: CREATE_REASONING_EFFORT,
  } satisfies TExecRuntimeOptions);
}
