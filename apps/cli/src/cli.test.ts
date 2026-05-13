import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cli } from "./cli";

let mockInit = vi.hoisted(() => vi.fn());
let mockImplement = vi.hoisted(() => vi.fn());
let mockCreate = vi.hoisted(() => vi.fn());
let mockReview = vi.hoisted(() => vi.fn());
let mockLoadCommandConfig = vi.hoisted(() => vi.fn());

vi.mock("./commands/init/init", () => ({
  init: (...args: unknown[]) => mockInit(...args),
}));

vi.mock("./commands/implement/implement", () => ({
  implement: (...args: unknown[]) => mockImplement(...args),
}));

vi.mock("./commands/create/create", () => ({
  create: (...args: unknown[]) => mockCreate(...args),
}));

vi.mock("./commands/review/review", () => ({
  review: (...args: unknown[]) => mockReview(...args),
}));

vi.mock("./commands/commandConfig", () => ({
  loadCommandConfig: (...args: unknown[]) => mockLoadCommandConfig(...args),
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
    mockImplement.mockReset();
    mockImplement.mockResolvedValue({
      success: true,
      output: "agent result",
      errors: [],
    });
    mockCreate.mockReset();
    mockCreate.mockResolvedValue({
      success: true,
      output: "agent result",
      errors: [],
    });
    mockReview.mockReset();
    mockReview.mockResolvedValue({
      success: true,
      output: "agent result",
      errors: [],
    });
    mockLoadCommandConfig.mockReset();
    mockLoadCommandConfig.mockResolvedValue({
      success: true,
      config: {},
      configPath: "/project/.backtrail/backtrail.config.json",
      source: "default",
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

  it("registers shared config option on init command", () => {
    let command = cli();
    let initCommand = command.commands.find(
      (subcommand) => subcommand.name() === "init",
    );

    expect(initCommand?.options.map((option) => option.flags)).toContain(
      "--config <path>",
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
      "--config <path>",
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
      "--config <path>",
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
      "--config <path>",
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

    expect(mockLoadCommandConfig).toHaveBeenCalledWith({
      cwd: process.cwd(),
    });
    expect(mockInit).toHaveBeenCalledWith({ cwd: process.cwd() });
    expect(mockLoadCommandConfig.mock.invocationCallOrder[0]!).toBeLessThan(
      mockInit.mock.invocationCallOrder[0]!,
    );
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

    expect(mockLoadCommandConfig).toHaveBeenCalledWith({
      cwd: process.cwd(),
    });
    expect(mockImplement).toHaveBeenCalledWith({
      cwd: process.cwd(),
      changeName: "CHANGE-00002",
      taskName: "TASK-00001",
      featureName: undefined,
      force: true,
      promptParts: ["fix", "docs"],
    });
    expect(mockLoadCommandConfig.mock.invocationCallOrder[0]!).toBeLessThan(
      mockImplement.mock.invocationCallOrder[0]!,
    );
    expect(console.log).toHaveBeenCalledWith("Agent started to work.");
    expect(console.error).not.toHaveBeenCalled();
  });

  it("invokes top-level implement command with feature context from cli", async () => {
    let command = cli();

    await command.parseAsync(
      ["implement", "-c", "CHANGE-00003", "-F", "FEATURE-00003", "fix", "docs"],
      { from: "user" },
    );

    expect(mockLoadCommandConfig).toHaveBeenCalledWith({
      cwd: process.cwd(),
    });
    expect(mockImplement).toHaveBeenCalledWith({
      cwd: process.cwd(),
      changeName: "CHANGE-00003",
      taskName: undefined,
      featureName: "FEATURE-00003",
      promptParts: ["fix", "docs"],
    });
    expect(mockLoadCommandConfig.mock.invocationCallOrder[0]!).toBeLessThan(
      mockImplement.mock.invocationCallOrder[0]!,
    );
    expect(console.log).toHaveBeenCalledWith("Agent started to work.");
    expect(console.error).not.toHaveBeenCalled();
  });

  it("invokes top-level create command from cli", async () => {
    let command = cli();

    await command.parseAsync(
      ["create", "--config", "workspace/backtrail.config.json", "-c", "CHANGE-00003", "-F", "FEATURE-00003", "--force", "draft", "brief"],
      { from: "user" },
    );

    expect(mockLoadCommandConfig).toHaveBeenCalledWith({
      cwd: process.cwd(),
      configPath: "workspace/backtrail.config.json",
    });
    expect(mockCreate).toHaveBeenCalledWith({
      cwd: process.cwd(),
      changeName: "CHANGE-00003",
      featureName: "FEATURE-00003",
      force: true,
      promptParts: ["draft", "brief"],
    });
    expect(mockLoadCommandConfig.mock.invocationCallOrder[0]!).toBeLessThan(
      mockCreate.mock.invocationCallOrder[0]!,
    );
    expect(console.log).toHaveBeenCalledWith("Agent started to work.");
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

    expect(mockLoadCommandConfig).toHaveBeenCalledWith({
      cwd: process.cwd(),
    });
    expect(mockReview).toHaveBeenCalledWith({
      cwd: process.cwd(),
      changeName: "CHANGE-00006",
      taskName: "TASK-00010",
      featureName: "FEATURE-00006",
      force: true,
      promptParts: ["review", "implementation"],
    });
    expect(mockLoadCommandConfig.mock.invocationCallOrder[0]!).toBeLessThan(
      mockReview.mock.invocationCallOrder[0]!,
    );
    expect(console.log).toHaveBeenCalledWith("Agent started to work.");
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
    mockImplement.mockResolvedValue({
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
    mockCreate.mockResolvedValue({
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
    mockReview.mockResolvedValue({
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

  it.each([
    {
      commandName: "init",
      commandArgs: ["init", "--config", "workspace/backtrail.config.json"],
      commandHandler: mockInit,
    },
    {
      commandName: "create",
      commandArgs: ["create", "--config", "workspace/backtrail.config.json"],
      commandHandler: mockCreate,
    },
    {
      commandName: "implement",
      commandArgs: ["implement", "--config", "workspace/backtrail.config.json"],
      commandHandler: mockImplement,
    },
    {
      commandName: "review",
      commandArgs: ["review", "--config", "workspace/backtrail.config.json"],
      commandHandler: mockReview,
    },
  ])(
    "bails before $commandName work when shared config load fails",
    async ({ commandArgs, commandHandler }) => {
      mockLoadCommandConfig.mockResolvedValueOnce({
        success: false,
        errors: ["Backtrail config invalid"],
      });

      let command = cli();

      await command.parseAsync(commandArgs, { from: "user" });

      expect(mockLoadCommandConfig).toHaveBeenCalledWith({
        cwd: process.cwd(),
        configPath: "workspace/backtrail.config.json",
      });
      expect(commandHandler).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith("error Backtrail config invalid");
      expect(process.exitCode).toBe(1);
    },
  );

  it("allows top-level implement without change and task options", async () => {
    let command = cli();

    await command.parseAsync(["implement", "fix"], { from: "user" });

    expect(mockLoadCommandConfig).toHaveBeenCalledWith({
      cwd: process.cwd(),
    });
    expect(mockImplement).toHaveBeenCalledWith({
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

    expect(mockLoadCommandConfig).toHaveBeenCalledWith({
      cwd: process.cwd(),
    });
    expect(mockCreate).toHaveBeenCalledWith({
      cwd: process.cwd(),
      changeName: undefined,
      featureName: undefined,
      promptParts: ["draft"],
    });
  });

  it("allows top-level review without change, task, or feature options", async () => {
    let command = cli();

    await command.parseAsync(["review", "review"], { from: "user" });

    expect(mockLoadCommandConfig).toHaveBeenCalledWith({
      cwd: process.cwd(),
    });
    expect(mockReview).toHaveBeenCalledWith({
      cwd: process.cwd(),
      changeName: undefined,
      taskName: undefined,
      featureName: undefined,
      promptParts: ["review"],
    });
  });
});
