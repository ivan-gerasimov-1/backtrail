import { TExecOptions } from "./types";
import { runExec } from "./execRuntime";

export async function exec(options: TExecOptions) {
  return runExec(options);
}
