import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cli } from "./cli";

let mockInit = vi.hoisted(() => vi.fn());
let mockExec = vi.hoisted(() => vi.fn());

vi.mock("./commands/init", () => ({
  init: (...args: unknown[]) => mockInit(...args),
}));

vi.mock("./commands/exec", () => ({
  exec: (...args: unknown[]) => mockExec(...args),
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
    mockExec.mockReset();
    mockExec.mockResolvedValue({
      success: true,
      output: "agent result",
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

  it("registers exec command", () => {
    let command = cli();

    expect(command.commands.map((subcommand) => subcommand.name())).toContain(
      "exec",
    );
  });

  it("registers exec short options", () => {
    let command = cli();
    let execCommand = command.commands.find(
      (subcommand) => subcommand.name() === "exec",
    );

    expect(execCommand?.options.map((option) => option.flags)).toContain(
      "-c, --change <name>",
    );
    expect(execCommand?.options.map((option) => option.flags)).toContain(
      "-t, --task <name>",
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

  it("invokes exec command from cli", async () => {
    let command = cli();

    await command.parseAsync(
      ["exec", "-c", "CHANGE-00002", "-t", "TASK-00001", "fix", "docs"],
      { from: "user" },
    );

    expect(console.log).toHaveBeenCalledWith("Agent started to work.");
    expect(mockExec).toHaveBeenCalledWith({
      cwd: process.cwd(),
      changeName: "CHANGE-00002",
      taskName: "TASK-00001",
      promptParts: ["fix", "docs"],
    });
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

  it("sets exit code on exec failure", async () => {
    mockExec.mockResolvedValue({
      success: false,
      output: "",
      errors: ["PI Coding Agent executable not found. Install `pi` and try again."],
    });

    let command = cli();

    await command.parseAsync(
      ["exec", "-c", "CHANGE-00002", "-t", "TASK-00001"],
      { from: "user" },
    );

    expect(console.error).toHaveBeenCalledWith(
      "error PI Coding Agent executable not found. Install `pi` and try again.",
    );
    expect(process.exitCode).toBe(1);
  });

  it("allows exec without change and task options", async () => {
    let command = cli();

    await command.parseAsync(["exec", "fix"], { from: "user" });

    expect(mockExec).toHaveBeenCalledWith({
      cwd: process.cwd(),
      changeName: undefined,
      taskName: undefined,
      promptParts: ["fix"],
    });
  });
});
