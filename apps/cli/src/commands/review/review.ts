import {
  REVIEW_MODEL,
  REVIEW_REASONING_EFFORT,
  REVIEW_SKILL,
} from "./reviewConfig";
import { runExec } from "../execRuntime";
import { TExecOptions } from "../types";

export async function review(options: TExecOptions) {
  return runExec({
    ...options,
    skillPrompt: REVIEW_SKILL,
    model: REVIEW_MODEL,
    reasoningEffort: REVIEW_REASONING_EFFORT,
  });
}
