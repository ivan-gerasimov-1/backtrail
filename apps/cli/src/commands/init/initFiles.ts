import { stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tryCreate } from "../fsUtils";
import { TInitStepResult } from "../types";

const EDefaultIndexFiles: Record<string, string> = {
  "adl.md":
    "# Backtrail Architecture Decision Log\n\n| ADR | Status | Date | Title / Summary |\n| ----- | ------ | ---- | --------------- |\n",
  "changes.md":
    "# Backtrail Changes\n\n| Change | Status | Date | ADRs | Blocked By | Blocks | Title / Summary |\n| ------ | ------ | ---- | ---- | ---------- | ------ | --------------- |\n",
  "features.md":
    "# Backtrail Features\n\n| Feature | Status | Date | Title / Summary |\n| ------- | ------ | ---- | --------------- |\n",
  "tasks.md":
    "# Backtrail Tasks\n\n| Task | Status | Date | Change | Blocked By | Blocks | Title / Summary |\n| ---- | ------ | ---- | ------ | ---------- | ------ | --------------- |\n",
};

export async function createIndexFiles(
  backtrailDir: string,
): Promise<TInitStepResult> {
  let result: TInitStepResult = { created: [], skipped: [], errors: [] };

  for (let [filename, content] of Object.entries(EDefaultIndexFiles)) {
    let filePath = join(backtrailDir, filename);
    let status = await tryCreate(
      async () => {
        await stat(filePath);
        return "exists";
      },
      async () => {
        await writeFile(filePath, content, "utf-8");
        return "created";
      },
    );

    if (status === "exists") {
      result.skipped.push(`.backtrail/${filename}`);
    } else {
      result.created.push(`.backtrail/${filename}`);
    }
  }

  return result;
}
