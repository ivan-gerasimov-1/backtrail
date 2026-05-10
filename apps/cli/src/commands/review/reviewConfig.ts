import {
  buildExecArguments as buildSharedExecArguments,
  buildExecPrompt as buildSharedExecPrompt,
  EXEC_BINARY,
  type TExecPromptOptions,
} from "../execRuntimeConfig";
import { TExecOptions, type TExecRuntimeOptions } from "../types";

export { EXEC_BINARY };
export const REVIEW_SKILL = "/skill:backtrail-review";
export const REVIEW_MODEL = "5.5";
export const REVIEW_REASONING_EFFORT = "low";

export function buildReviewPrompt(
  options: Omit<TExecPromptOptions, "skillPrompt">,
) {
  return buildSharedExecPrompt({
    ...options,
    skillPrompt: REVIEW_SKILL,
  });
}

export function buildReviewArguments(options: TExecOptions) {
  return buildSharedExecArguments({
    ...options,
    skillPrompt: REVIEW_SKILL,
    model: REVIEW_MODEL,
    reasoningEffort: REVIEW_REASONING_EFFORT,
  } satisfies TExecRuntimeOptions);
}
