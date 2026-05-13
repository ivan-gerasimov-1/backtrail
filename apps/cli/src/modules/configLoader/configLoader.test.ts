import { resolve } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { IFileSystem } from "../fileSystem/types";

import { ConfigLoader } from "./configLoader";
import { DEFAULT_CONFIG_PATH } from "./constants";

function buildEnoentError(): Error & { code: string } {
  return Object.assign(new Error("ENOENT"), { code: "ENOENT" });
}

describe("backtrail config loader", () => {
  let configLoader: ConfigLoader;
  let fileSystem: IFileSystem;
  let readFile: ReturnType<typeof vi.fn<IFileSystem["readFile"]>>;
  let isMissingFile: ReturnType<typeof vi.fn<IFileSystem["isMissingFile"]>>;

  beforeEach(() => {
    readFile = vi.fn<IFileSystem["readFile"]>();
    isMissingFile = vi.fn<IFileSystem["isMissingFile"]>();
    fileSystem = {
      readFile,
      isMissingFile,
    };
    configLoader = new ConfigLoader(fileSystem);
  });

  it("loads valid config JSON from default path", async () => {
    readFile.mockResolvedValue('{"workspace":"alpha"}');

    let result = await configLoader.load({ cwd: "/project" });

    expect(readFile).toHaveBeenCalledWith(resolve("/project", DEFAULT_CONFIG_PATH));
    expect(result).toEqual({
      success: true,
      config: { workspace: "alpha" },
      configPath: resolve("/project", DEFAULT_CONFIG_PATH),
      source: "default",
      errors: [],
    });
  });

  it("loads valid config JSON from explicit path", async () => {
    readFile.mockResolvedValue('{"workspace":"beta"}');

    let result = await configLoader.load({
      cwd: "/project",
      configPath: "workspace/backtrail.json",
    });

    expect(readFile).toHaveBeenCalledWith(
      resolve("/project", "workspace/backtrail.json"),
    );
    expect(result).toEqual({
      success: true,
      config: { workspace: "beta" },
      configPath: resolve("/project", "workspace/backtrail.json"),
      source: "explicit",
      errors: [],
    });
  });

  it("treats missing default config as defaults", async () => {
    let error = buildEnoentError();
    readFile.mockRejectedValue(error);
    isMissingFile.mockReturnValue(true);

    let result = await configLoader.load({ cwd: "/project" });

    expect(isMissingFile).toHaveBeenCalledWith(error);
    expect(result).toEqual({
      success: true,
      config: {},
      configPath: resolve("/project", DEFAULT_CONFIG_PATH),
      source: "default",
      errors: [],
    });
  });

  it("fails when explicit config path is missing", async () => {
    let error = buildEnoentError();
    readFile.mockRejectedValue(error);

    let result = await configLoader.load({
      cwd: "/project",
      configPath: "missing.json",
    });

    expect(isMissingFile).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      config: {},
      configPath: resolve("/project", "missing.json"),
      source: "explicit",
      errors: [`Unable to read config file ${resolve("/project", "missing.json")}: ENOENT`],
    });
  });

  it("fails when config JSON is malformed", async () => {
    readFile.mockResolvedValue("{broken");

    let result = await configLoader.load({ cwd: "/project" });

    expect(result.success).toBe(false);
    expect(result.config).toEqual({});
    expect(result.configPath).toBe(resolve("/project", DEFAULT_CONFIG_PATH));
    expect(result.source).toBe("default");
    expect(result.errors[0]).toContain("contains invalid JSON");
  });

  it("fails when config JSON is not an object", async () => {
    readFile.mockResolvedValue("[]");

    let result = await configLoader.load({ cwd: "/project" });

    expect(result).toEqual({
      success: false,
      config: {},
      configPath: resolve("/project", DEFAULT_CONFIG_PATH),
      source: "default",
      errors: [
        `Config file ${resolve("/project", DEFAULT_CONFIG_PATH)} must contain a JSON object.`,
      ],
    });
  });
});
