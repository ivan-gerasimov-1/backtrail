import {
  buildExecArguments as buildSharedExecArguments,
  buildExecPrompt as buildSharedExecPrompt,
  EXEC_BINARY,
  EXEC_MODEL,
  type TExecPromptOptions,
} from "./execRuntimeConfig";
import { TExecOptions } from "./types";

export { EXEC_BINARY, EXEC_MODEL };
export const EXEC_CREATE_SKILL = "/skill:backtrail-create";

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
  } satisfies TExecPromptOptions);
}
