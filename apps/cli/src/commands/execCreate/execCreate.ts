import {
  EXEC_CREATE_MODEL,
  EXEC_CREATE_REASONING_EFFORT,
  EXEC_CREATE_SKILL,
} from "./execCreateConfig";
import { runExec } from "../execRuntime";
import { TExecOptions } from "../types";

export async function execCreate(options: TExecOptions) {
  return runExec({
    ...options,
    skillPrompt: EXEC_CREATE_SKILL,
    model: EXEC_CREATE_MODEL,
    reasoningEffort: EXEC_CREATE_REASONING_EFFORT,
  });
}
