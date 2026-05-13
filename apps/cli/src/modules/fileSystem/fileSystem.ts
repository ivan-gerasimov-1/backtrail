import { readFile } from "node:fs/promises";
import { isErrnoException } from "../../commands/fsUtils";
import { IFileSystem } from "./types";

export class FileSystem implements IFileSystem {
  public async readFile(path: string) {
    return readFile(path, "utf-8");
  }

  public isMissingFile(error: Error) {
    return this.isErrnoException(error) && error.code === "ENOENT";
  }

  private isErrnoException(error: Error) {
    return isErrnoException(error)
  }
}