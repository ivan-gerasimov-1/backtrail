import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cli } from "./cli";

let mockInit = vi.hoisted(() => vi.fn());

vi.mock("./commands/init", () => ({
  init: (...args: unknown[]) => mockInit(...args),
}));

describe("backtrail cli", () => {
  beforeEach(() => {
    mockInit.mockReset();
    mockInit.mockResolvedValue({
      success: true,
      created: [".backtrail/", ".backtrail/adl.md"],
      skipped: [".backtrail/tasks.md"],
      errors: [],
    });
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    process.exitCode = undefined;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("registers init command", () => {
    let command = cli();

    expect(command.commands.map((subcommand) => subcommand.name())).toContain(
      "init",
    );
  });

  it("invokes init command from cli", async () => {
    let command = cli();

    await command.parseAsync(["init"], { from: "user" });

    expect(mockInit).toHaveBeenCalledWith({ cwd: process.cwd() });
    expect(console.log).toHaveBeenCalledWith("created .backtrail/");
    expect(console.log).toHaveBeenCalledWith("created .backtrail/adl.md");
    expect(console.log).toHaveBeenCalledWith("skipped .backtrail/tasks.md");
    expect(console.error).not.toHaveBeenCalled();
  });

  it("sets exit code on init failure", async () => {
    mockInit.mockResolvedValue({
      success: false,
      created: [],
      skipped: [],
      errors: [".backtrail/ exists but is not a directory"],
    });

    let command = cli();

    await command.parseAsync(["init"], { from: "user" });

    expect(console.error).toHaveBeenCalledWith(
      "error .backtrail/ exists but is not a directory",
    );
    expect(process.exitCode).toBe(1);
  });
});
