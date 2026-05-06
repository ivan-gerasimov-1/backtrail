import { join } from "node:path";
import { IInitResult, TInitOptions } from "./types";
import { createDir } from "./initDir";
import { createSubdirs } from "./initSubdirs";
import { createIndexFiles } from "./initFiles";

/**
 * Initialize Backtrail in the current directory.
 * Creates .backtrail directory with required index files.
 * Does not overwrite existing files.
 */
export async function init(options: TInitOptions): Promise<IInitResult> {
  let backtrailDir = join(options.cwd, ".backtrail");

  let created: string[] = [];
  let skipped: string[] = [];
  let errors: string[] = [];

  try {
    let dirResult = await createDir(backtrailDir);
    created.push(...dirResult.created);
    skipped.push(...dirResult.skipped);
    errors.push(...dirResult.errors);

    if (errors.length > 0) {
      return { success: false, created, skipped, errors };
    }

    let subdirsResult = await createSubdirs(backtrailDir);
    created.push(...subdirsResult.created);
    skipped.push(...subdirsResult.skipped);
    errors.push(...subdirsResult.errors);

    let filesResult = await createIndexFiles(backtrailDir);
    created.push(...filesResult.created);
    skipped.push(...filesResult.skipped);
    errors.push(...filesResult.errors);

    return { success: errors.length === 0, created, skipped, errors };
  } catch (error) {
    let message = error instanceof Error ? error.message : String(error);
    return { success: false, created, skipped, errors: [...errors, message] };
  }
}
