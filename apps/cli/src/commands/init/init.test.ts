import { describe, it, expect, beforeEach, vi } from "vitest";
import { init } from "./init";
import {
  mockFs,
  mockPath,
  enoent,
  isDir,
  isFile,
  resetMocks,
} from "./init.test.utils";

vi.mock("node:fs/promises", () => ({
  stat: async (...args: unknown[]) => mockFs.stat(...args),
  mkdir: async (...args: unknown[]) => mockFs.mkdir(...args),
  writeFile: async (...args: unknown[]) => mockFs.writeFile(...args),
}));

vi.mock("node:path", () => ({
  join: (...args: string[]) => mockPath.join(...args),
}));

describe("backtrail init command", () => {
  beforeEach(resetMocks);

  describe("fresh init", () => {
    it("should create .backtrail directory with required index files", async () => {
      mockFs.stat.mockRejectedValue(enoent());

      let result = await init({ cwd: "/project" });

      expect(result.success).toBe(true);
      expect(mockFs.mkdir).toHaveBeenCalledWith("/project/.backtrail", {
        recursive: true,
      });
      expect(mockFs.mkdir).toHaveBeenCalledWith("/project/.backtrail/adrs", {
        recursive: true,
      });
      expect(mockFs.mkdir).toHaveBeenCalledWith("/project/.backtrail/changes", {
        recursive: true,
      });
      expect(mockFs.mkdir).toHaveBeenCalledWith(
        "/project/.backtrail/features",
        {
          recursive: true,
        },
      );
      expect(mockFs.mkdir).toHaveBeenCalledWith("/project/.backtrail/tasks", {
        recursive: true,
      });
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        "/project/.backtrail/adl.md",
        expect.any(String),
        "utf-8",
      );
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        "/project/.backtrail/changes.md",
        expect.any(String),
        "utf-8",
      );
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        "/project/.backtrail/features.md",
        expect.any(String),
        "utf-8",
      );
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        "/project/.backtrail/tasks.md",
        expect.any(String),
        "utf-8",
      );
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        "/project/.backtrail/backtrail.config.json",
        "{}\n",
        "utf-8",
      );
    });

    it("should report created files in result", async () => {
      mockFs.stat.mockRejectedValue(enoent());

      let result = await init({ cwd: "/project" });

      expect(result.created).toContain(".backtrail/");
      expect(result.created).toContain(".backtrail/adl.md");
      expect(result.created).toContain(".backtrail/changes.md");
      expect(result.created).toContain(".backtrail/features.md");
      expect(result.created).toContain(".backtrail/tasks.md");
      expect(result.created).toContain(".backtrail/backtrail.config.json");
      expect(result.created).toContain(".backtrail/adrs/");
      expect(result.created).toContain(".backtrail/changes/");
      expect(result.created).toContain(".backtrail/features/");
      expect(result.created).toContain(".backtrail/tasks/");
      expect(result.skipped).toHaveLength(0);
      expect(result.errors).toHaveLength(0);
    });

    it("should exit with success on fresh init", async () => {
      mockFs.stat.mockRejectedValue(enoent());

      let result = await init({ cwd: "/project" });
      expect(result.success).toBe(true);
    });
  });

  describe("idempotent init", () => {
    it("should not overwrite existing files", async () => {
      mockFs.stat.mockImplementation(async (path: string) => {
        if (path === "/project/.backtrail/changes.md") return isFile();
        return isDir();
      });

      let result = await init({ cwd: "/project" });

      expect(result.skipped).toContain(".backtrail/changes.md");
      expect(mockFs.writeFile).not.toHaveBeenCalledWith(
        "/project/.backtrail/changes.md",
        expect.any(String),
        "utf-8",
      );
    });

    it("should not overwrite existing config file", async () => {
      mockFs.stat.mockImplementation(async (path: string) => {
        if (path === "/project/.backtrail/backtrail.config.json") {
          return isFile();
        }
        return isDir();
      });

      let result = await init({ cwd: "/project" });

      expect(result.skipped).toContain(".backtrail/backtrail.config.json");
      expect(mockFs.writeFile).not.toHaveBeenCalledWith(
        "/project/.backtrail/backtrail.config.json",
        "{}\n",
        "utf-8",
      );
    });

    it("should report skipped files in result", async () => {
      mockFs.stat.mockResolvedValue(isDir());

      let result = await init({ cwd: "/project" });

      expect(result.skipped).toContain(".backtrail/");
      expect(result.created).toHaveLength(0);
    });
  });

  describe("partial existing state", () => {
    it("should create missing files while preserving existing ones", async () => {
      mockFs.stat.mockImplementation(async (path: string) => {
        if (
          path === "/project/.backtrail" ||
          path === "/project/.backtrail/changes.md"
        ) {
          return path.endsWith(".md") ? isFile() : isDir();
        }
        throw enoent();
      });

      let result = await init({ cwd: "/project" });

      expect(result.skipped).toContain(".backtrail/");
      expect(result.skipped).toContain(".backtrail/changes.md");
      expect(result.created).toContain(".backtrail/adl.md");
      expect(result.created).toContain(".backtrail/features.md");
      expect(result.created).toContain(".backtrail/tasks.md");
    });

    it("should report both created and skipped files", async () => {
      mockFs.stat.mockImplementation(async (path: string) => {
        if (
          path === "/project/.backtrail" ||
          path === "/project/.backtrail/changes.md"
        ) {
          return path.endsWith(".md") ? isFile() : isDir();
        }
        throw enoent();
      });

      let result = await init({ cwd: "/project" });

      expect(result.skipped.length).toBeGreaterThan(0);
      expect(result.created.length).toBeGreaterThan(0);
    });
  });

  describe("filesystem failure", () => {
    it("should handle .backtrail existing as a file", async () => {
      mockFs.stat.mockImplementation(async (path: string) => {
        if (path === "/project/.backtrail") return isFile();
        throw enoent();
      });

      let result = await init({ cwd: "/project" });

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should handle subdir existing as a file", async () => {
      mockFs.stat.mockImplementation(async (path: string) => {
        if (path === "/project/.backtrail/adrs") return isFile();
        return isDir();
      });

      let result = await init({ cwd: "/project" });

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe("current working directory behavior", () => {
    it("should use provided cwd option", async () => {
      mockFs.stat.mockRejectedValue(enoent());

      await init({ cwd: "/project" });

      expect(mockFs.mkdir).toHaveBeenCalledWith("/project/.backtrail", {
        recursive: true,
      });
    });
  });

  describe("edge cases", () => {
    it("should handle .backtrail existing as a file (not directory)", async () => {
      mockFs.stat.mockImplementation(async (path: string) => {
        if (path === "/project/.backtrail") return isFile();
        throw enoent();
      });

      let result = await init({ cwd: "/project" });

      expect(result.success).toBe(false);
      expect(result.errors).toContain(
        ".backtrail/ exists but is not a directory",
      );
    });

    it("should populate empty .backtrail directory", async () => {
      mockFs.stat.mockImplementation(async (path: string) => {
        if (path === "/project/.backtrail") return isDir();
        throw enoent();
      });

      let result = await init({ cwd: "/project" });

      expect(result.created.length).toBeGreaterThan(0);
      expect(result.success).toBe(true);
    });
  });

  describe("error handling", () => {
    it("should catch and report filesystem errors", async () => {
      mockFs.stat.mockRejectedValue(enoent());
      mockFs.mkdir.mockRejectedValue(new Error("Permission denied"));

      let result = await init({ cwd: "/project" });

      expect(result.success).toBe(false);
      expect(result.errors).toContain("Permission denied");
    });
  });
});
