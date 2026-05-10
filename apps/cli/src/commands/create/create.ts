import {
  CREATE_MODEL,
  CREATE_REASONING_EFFORT,
  CREATE_SKILL,
} from "./createConfig";
import { runExec } from "../execRuntime";
import { TExecOptions } from "../types";

export async function create(options: TExecOptions) {
  return runExec({
    ...options,
    skillPrompt: CREATE_SKILL,
    model: CREATE_MODEL,
    reasoningEffort: CREATE_REASONING_EFFORT,
  });
}
