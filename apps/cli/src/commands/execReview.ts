import {
  EXEC_REVIEW_MODEL,
  EXEC_REVIEW_REASONING_EFFORT,
  EXEC_REVIEW_SKILL,
} from "./execReviewConfig";
import { runExec } from "./execRuntime";
import { TExecOptions } from "./types";

export async function execReview(options: TExecOptions) {
  return runExec({
    ...options,
    skillPrompt: EXEC_REVIEW_SKILL,
    model: EXEC_REVIEW_MODEL,
    reasoningEffort: EXEC_REVIEW_REASONING_EFFORT,
  });
}
