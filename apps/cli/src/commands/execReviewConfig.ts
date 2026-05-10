import {
  buildExecArguments as buildSharedExecArguments,
  buildExecPrompt as buildSharedExecPrompt,
  EXEC_BINARY,
  type TExecPromptOptions,
} from "./execRuntimeConfig";
import { TExecOptions, type TExecRuntimeOptions } from "./types";

export { EXEC_BINARY };
export const EXEC_REVIEW_SKILL = "/skill:backtrail-review";
export const EXEC_REVIEW_MODEL = "5.5";
export const EXEC_REVIEW_REASONING_EFFORT = "low";

export function buildExecReviewPrompt(
  options: Omit<TExecPromptOptions, "skillPrompt">,
) {
  return buildSharedExecPrompt({
    ...options,
    skillPrompt: EXEC_REVIEW_SKILL,
  });
}

export function buildExecReviewArguments(options: TExecOptions) {
  return buildSharedExecArguments({
    ...options,
    skillPrompt: EXEC_REVIEW_SKILL,
    model: EXEC_REVIEW_MODEL,
    reasoningEffort: EXEC_REVIEW_REASONING_EFFORT,
  } satisfies TExecRuntimeOptions);
}
