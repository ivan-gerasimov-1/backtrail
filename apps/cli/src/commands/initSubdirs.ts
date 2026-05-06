import { mkdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { tryCreate } from "./fsUtils";
import { TInitStepResult } from "./types";

const DEFAULT_DIRS = ["adrs", "changes", "features", "tasks"];

export async function createSubdirs(
  backtrailDir: string,
): Promise<TInitStepResult> {
  let result: TInitStepResult = { created: [], skipped: [], errors: [] };

  for (let dir of DEFAULT_DIRS) {
    let dirPath = join(backtrailDir, dir);
    let status = await tryCreate(
      async () => {
        let statResult = await stat(dirPath);
        return statResult.isDirectory() ? "exists" : "not-dir";
      },
      async () => {
        await mkdir(dirPath, { recursive: true });
        return "created";
      },
    );

    if (status === "not-dir") {
      result.errors.push(`.backtrail/${dir}/ exists but is not a directory`);
    } else if (status === "exists") {
      result.skipped.push(`.backtrail/${dir}/`);
    } else {
      result.created.push(`.backtrail/${dir}/`);
    }
  }

  return result;
}
