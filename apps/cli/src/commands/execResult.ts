import { IExecResult } from "./types";

export function handleExecResult(result: IExecResult) {
  for (let errorMessage of result.errors) {
    console.error(`error ${errorMessage}`);
  }

  if (!result.success) {
    process.exitCode = 1;
  }

  return result;
}
