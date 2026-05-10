import { vi } from "vitest";

export let mockFs = {
  stat: vi.fn(),
  mkdir: vi.fn(),
  writeFile: vi.fn(),
};

export let mockPath = {
  join: (...args: string[]) => args.join("/"),
};

export function enoent(): Error & { code: string } {
  return Object.assign(new Error("ENOENT"), { code: "ENOENT" });
}

export function isDir() {
  return { isDirectory: () => true };
}

export function isFile() {
  return { isDirectory: () => false };
}

export function resetMocks() {
  mockFs.stat.mockReset();
  mockFs.mkdir.mockReset();
  mockFs.writeFile.mockReset();
}
