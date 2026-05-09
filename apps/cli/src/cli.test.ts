import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cli } from "./cli";

let mockInit = vi.hoisted(() => vi.fn());
let mockExecImplement = vi.hoisted(() => vi.fn());
let mockExecCreate = vi.hoisted(() => vi.fn());

vi.mock("./commands/init", () => ({
  init: (...args: unknown[]) => mockInit(...args),
}));

vi.mock("./commands/execImplement", () => ({
  execImplement: (...args: unknown[]) => mockExecImplement(...args),
}));

vi.mock("./commands/execCreate", () => ({
  execCreate: (...args: unknown[]) => mockExecCreate(...args),
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
    mockExecImplement.mockReset();
    mockExecImplement.mockResolvedValue({
      success: true,
      output: "agent result",
      errors: [],
    });
    mockExecCreate.mockReset();
    mockExecCreate.mockResolvedValue({
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

  it("registers exec parent command", () => {
    let command = cli();

    expect(command.commands.map((subcommand) => subcommand.name())).toContain(
      "exec",
    );
  });

  it("registers exec implement and create commands", () => {
    let command = cli();
    let execCommand = command.commands.find(
      (subcommand) => subcommand.name() === "exec",
    );

    expect(execCommand?.commands.map((subcommand) => subcommand.name())).toContain(
      "implement",
    );
    expect(execCommand?.commands.map((subcommand) => subcommand.name())).toContain(
      "create",
    );
  });

  it("registers exec implement short options", () => {
    let command = cli();
    let execCommand = command.commands.find(
      (subcommand) => subcommand.name() === "exec",
    );
    let implementCommand = execCommand?.commands.find(
      (subcommand) => subcommand.name() === "implement",
    );

    expect(implementCommand?.options.map((option) => option.flags)).toContain(
      "-c, --change <name>",
    );
    expect(implementCommand?.options.map((option) => option.flags)).toContain(
      "-t, --task <name>",
    );
    expect(implementCommand?.options.map((option) => option.flags)).toContain(
      "-f, --feature <name>",
    );
  });

  it("registers exec create short options", () => {
    let command = cli();
    let execCommand = command.commands.find(
      (subcommand) => subcommand.name() === "exec",
    );
    let createCommand = execCommand?.commands.find(
      (subcommand) => subcommand.name() === "create",
    );

    expect(createCommand?.options.map((option) => option.flags)).toContain(
      "-c, --change <name>",
    );
    expect(createCommand?.options.map((option) => option.flags)).toContain(
      "-f, --feature <name>",
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

  it("invokes exec implement command from cli", async () => {
    let command = cli();

    await command.parseAsync(
      ["exec", "implement", "-c", "CHANGE-00002", "-t", "TASK-00001", "fix", "docs"],
      { from: "user" },
    );

    expect(console.log).toHaveBeenCalledWith("Agent started to work.");
    expect(mockExecImplement).toHaveBeenCalledWith({
      cwd: process.cwd(),
      changeName: "CHANGE-00002",
      taskName: "TASK-00001",
      featureName: undefined,
      promptParts: ["fix", "docs"],
    });
    expect(console.error).not.toHaveBeenCalled();
  });

  it("invokes exec implement command with feature context from cli", async () => {
    let command = cli();

    await command.parseAsync(
      [
        "exec",
        "implement",
        "-c",
        "CHANGE-00003",
        "-f",
        "FEATURE-00003",
        "fix",
        "docs",
      ],
      { from: "user" },
    );

    expect(console.log).toHaveBeenCalledWith("Agent started to work.");
    expect(mockExecImplement).toHaveBeenCalledWith({
      cwd: process.cwd(),
      changeName: "CHANGE-00003",
      taskName: undefined,
      featureName: "FEATURE-00003",
      promptParts: ["fix", "docs"],
    });
    expect(console.error).not.toHaveBeenCalled();
  });

  it("invokes exec create command from cli", async () => {
    let command = cli();

    await command.parseAsync(
      ["exec", "create", "-c", "CHANGE-00003", "-f", "FEATURE-00003", "draft", "brief"],
      { from: "user" },
    );

    expect(console.log).toHaveBeenCalledWith("Agent started to work.");
    expect(mockExecCreate).toHaveBeenCalledWith({
      cwd: process.cwd(),
      changeName: "CHANGE-00003",
      featureName: "FEATURE-00003",
      promptParts: ["draft", "brief"],
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

  it("sets exit code on exec implement failure", async () => {
    mockExecImplement.mockResolvedValue({
      success: false,
      output: "",
      errors: ["PI Coding Agent executable not found. Install `pi` and try again."],
    });

    let command = cli();

    await command.parseAsync(
      ["exec", "implement", "-c", "CHANGE-00002", "-t", "TASK-00001"],
      { from: "user" },
    );

    expect(console.error).toHaveBeenCalledWith(
      "error PI Coding Agent executable not found. Install `pi` and try again.",
    );
    expect(process.exitCode).toBe(1);
  });

  it("sets exit code on exec create failure", async () => {
    mockExecCreate.mockResolvedValue({
      success: false,
      output: "",
      errors: ["PI Coding Agent executable not found. Install `pi` and try again."],
    });

    let command = cli();

    await command.parseAsync(
      ["exec", "create", "-c", "CHANGE-00003", "-f", "FEATURE-00003"],
      { from: "user" },
    );

    expect(console.error).toHaveBeenCalledWith(
      "error PI Coding Agent executable not found. Install `pi` and try again.",
    );
    expect(process.exitCode).toBe(1);
  });

  it("allows exec implement without change and task options", async () => {
    let command = cli();

    await command.parseAsync(["exec", "implement", "fix"], { from: "user" });

    expect(mockExecImplement).toHaveBeenCalledWith({
      cwd: process.cwd(),
      changeName: undefined,
      taskName: undefined,
      featureName: undefined,
      promptParts: ["fix"],
    });
  });

  it("allows exec create without change and feature options", async () => {
    let command = cli();

    await command.parseAsync(["exec", "create", "draft"], { from: "user" });

    expect(mockExecCreate).toHaveBeenCalledWith({
      cwd: process.cwd(),
      changeName: undefined,
      featureName: undefined,
      promptParts: ["draft"],
    });
  });
});
