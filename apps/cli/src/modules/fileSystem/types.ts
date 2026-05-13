export interface IFileSystem {
  readFile(path: string): Promise<string>

  isMissingFile(error: unknown): boolean
}