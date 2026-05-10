import {
  EXEC_MODEL,
  EXEC_REASONING_EFFORT,
  EXEC_SKILL,
} from "./execConfig";
import { runExec } from "./execRuntime";
import { TExecOptions } from "./types";

export async function execImplement(options: TExecOptions) {
  return runExec({
    ...options,
    skillPrompt: EXEC_SKILL,
    model: EXEC_MODEL,
    reasoningEffort: EXEC_REASONING_EFFORT,
  });
}
