import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cli } from "./cli";

let mockInit = vi.hoisted(() => vi.fn());
let mockExecImplement = vi.hoisted(() => vi.fn());
let mockExecCreate = vi.hoisted(() => vi.fn());
let mockExecReview = vi.hoisted(() => vi.fn());

vi.mock("./commands/init/init", () => ({
  init: (...args: unknown[]) => mockInit(...args),
}));

vi.mock("./commands/execImplement/execImplement", () => ({
  execImplement: (...args: unknown[]) => mockExecImplement(...args),
}));

vi.mock("./commands/execCreate/execCreate", () => ({
  execCreate: (...args: unknown[]) => mockExecCreate(...args),
}));

vi.mock("./commands/execReview/execReview", () => ({
  execReview: (...args: unknown[]) => mockExecReview(...args),
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
    mockExecReview.mockReset();
    mockExecReview.mockResolvedValue({
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

  it("registers top-level workflow commands", () => {
    let command = cli();

    expect(command.commands.map((subcommand) => subcommand.name())).toContain(
      "create",
    );
    expect(command.commands.map((subcommand) => subcommand.name())).toContain(
      "implement",
    );
    expect(command.commands.map((subcommand) => subcommand.name())).toContain(
      "review",
    );
    expect(command.commands.map((subcommand) => subcommand.name())).not.toContain(
      "exec",
    );
  });

  it("registers top-level implement short options", () => {
    let command = cli();
    let implementCommand = command.commands.find(
      (subcommand) => subcommand.name() === "implement",
    );

    expect(implementCommand?.options.map((option) => option.flags)).toContain(
      "-c, --change <name>",
    );
    expect(implementCommand?.options.map((option) => option.flags)).toContain(
      "-t, --task <name>",
    );
    expect(implementCommand?.options.map((option) => option.flags)).toContain(
      "-F, --feature <name>",
    );
    expect(implementCommand?.options.map((option) => option.flags)).toContain(
      "-f, --force",
    );
  });

  it("registers top-level create short options", () => {
    let command = cli();
    let createCommand = command.commands.find(
      (subcommand) => subcommand.name() === "create",
    );

    expect(createCommand?.options.map((option) => option.flags)).toContain(
      "-c, --change <name>",
    );
    expect(createCommand?.options.map((option) => option.flags)).toContain(
      "-F, --feature <name>",
    );
    expect(createCommand?.options.map((option) => option.flags)).toContain(
      "-f, --force",
    );
  });

  it("registers top-level review short options", () => {
    let command = cli();
    let reviewCommand = command.commands.find(
      (subcommand) => subcommand.name() === "review",
    );

    expect(reviewCommand?.options.map((option) => option.flags)).toContain(
      "-c, --change <name>",
    );
    expect(reviewCommand?.options.map((option) => option.flags)).toContain(
      "-t, --task <name>",
    );
    expect(reviewCommand?.options.map((option) => option.flags)).toContain(
      "-F, --feature <name>",
    );
    expect(reviewCommand?.options.map((option) => option.flags)).toContain(
      "-f, --force",
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

  it("invokes top-level implement command from cli", async () => {
    let command = cli();

    await command.parseAsync(
      ["implement", "-c", "CHANGE-00002", "-t", "TASK-00001", "-f", "fix", "docs"],
      { from: "user" },
    );

    expect(console.log).toHaveBeenCalledWith("Agent started to work.");
    expect(mockExecImplement).toHaveBeenCalledWith({
      cwd: process.cwd(),
      changeName: "CHANGE-00002",
      taskName: "TASK-00001",
      featureName: undefined,
      force: true,
      promptParts: ["fix", "docs"],
    });
    expect(console.error).not.toHaveBeenCalled();
  });

  it("invokes top-level implement command with feature context from cli", async () => {
    let command = cli();

    await command.parseAsync(
      [
        "implement",
        "-c",
        "CHANGE-00003",
        "-F",
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

  it("invokes top-level create command from cli", async () => {
    let command = cli();

    await command.parseAsync(
      ["create", "-c", "CHANGE-00003", "-F", "FEATURE-00003", "--force", "draft", "brief"],
      { from: "user" },
    );

    expect(console.log).toHaveBeenCalledWith("Agent started to work.");
    expect(mockExecCreate).toHaveBeenCalledWith({
      cwd: process.cwd(),
      changeName: "CHANGE-00003",
      featureName: "FEATURE-00003",
      force: true,
      promptParts: ["draft", "brief"],
    });
    expect(console.error).not.toHaveBeenCalled();
  });

  it("invokes top-level review command from cli", async () => {
    let command = cli();

    await command.parseAsync(
      [
        "review",
        "-c",
        "CHANGE-00006",
        "-t",
        "TASK-00010",
        "-F",
        "FEATURE-00006",
        "--force",
        "review",
        "implementation",
      ],
      { from: "user" },
    );

    expect(console.log).toHaveBeenCalledWith("Agent started to work.");
    expect(mockExecReview).toHaveBeenCalledWith({
      cwd: process.cwd(),
      changeName: "CHANGE-00006",
      taskName: "TASK-00010",
      featureName: "FEATURE-00006",
      force: true,
      promptParts: ["review", "implementation"],
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

  it("sets exit code on top-level implement failure", async () => {
    mockExecImplement.mockResolvedValue({
      success: false,
      output: "",
      errors: ["PI Coding Agent executable not found. Install `pi` and try again."],
    });

    let command = cli();

    await command.parseAsync(["implement", "-c", "CHANGE-00002", "-t", "TASK-00001"], {
      from: "user",
    });

    expect(console.error).toHaveBeenCalledWith(
      "error PI Coding Agent executable not found. Install `pi` and try again.",
    );
    expect(process.exitCode).toBe(1);
  });

  it("sets exit code on top-level create failure", async () => {
    mockExecCreate.mockResolvedValue({
      success: false,
      output: "",
      errors: ["PI Coding Agent executable not found. Install `pi` and try again."],
    });

    let command = cli();

    await command.parseAsync(["create", "-c", "CHANGE-00003", "-F", "FEATURE-00003"], {
      from: "user",
    });

    expect(console.error).toHaveBeenCalledWith(
      "error PI Coding Agent executable not found. Install `pi` and try again.",
    );
    expect(process.exitCode).toBe(1);
  });

  it("sets exit code on top-level review failure", async () => {
    mockExecReview.mockResolvedValue({
      success: false,
      output: "",
      errors: ["PI Coding Agent executable not found. Install `pi` and try again."],
    });

    let command = cli();

    await command.parseAsync(["review", "-c", "CHANGE-00006", "-t", "TASK-00010"], {
      from: "user",
    });

    expect(console.error).toHaveBeenCalledWith(
      "error PI Coding Agent executable not found. Install `pi` and try again.",
    );
    expect(process.exitCode).toBe(1);
  });

  it("allows top-level implement without change and task options", async () => {
    let command = cli();

    await command.parseAsync(["implement", "fix"], { from: "user" });

    expect(mockExecImplement).toHaveBeenCalledWith({
      cwd: process.cwd(),
      changeName: undefined,
      taskName: undefined,
      featureName: undefined,
      promptParts: ["fix"],
    });
  });

  it("allows top-level create without change and feature options", async () => {
    let command = cli();

    await command.parseAsync(["create", "draft"], { from: "user" });

    expect(mockExecCreate).toHaveBeenCalledWith({
      cwd: process.cwd(),
      changeName: undefined,
      featureName: undefined,
      promptParts: ["draft"],
    });
  });

  it("allows top-level review without change, task, or feature options", async () => {
    let command = cli();

    await command.parseAsync(["review", "review"], { from: "user" });

    expect(mockExecReview).toHaveBeenCalledWith({
      cwd: process.cwd(),
      changeName: undefined,
      taskName: undefined,
      featureName: undefined,
      promptParts: ["review"],
    });
  });
});
