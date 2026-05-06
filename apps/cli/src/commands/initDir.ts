import { mkdir, stat } from "node:fs/promises";
import { tryCreate } from "./fsUtils";
import { TInitStepResult } from "./types";

export async function createDir(
  backtrailDir: string,
): Promise<TInitStepResult> {
  let result: TInitStepResult = { created: [], skipped: [], errors: [] };

  let status = await tryCreate(
    async () => {
      let statResult = await stat(backtrailDir);
      return statResult.isDirectory() ? "exists" : "not-dir";
    },
    async () => {
      await mkdir(backtrailDir, { recursive: true });
      return "created";
    },
  );

  if (status === "not-dir") {
    result.errors.push(".backtrail/ exists but is not a directory");
  } else if (status === "exists") {
    result.skipped.push(".backtrail/");
  } else {
    result.created.push(".backtrail/");
  }

  return result;
}
