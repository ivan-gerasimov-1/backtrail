import { beforeEach, describe, expect, it, vi } from "vitest";

import { execImplement } from "./execImplement";

let mockRunExec = vi.hoisted(() => vi.fn());

vi.mock("./execRuntime", () => ({
  runExec: (...args: unknown[]) => mockRunExec(...args),
}));

describe("backtrail exec implement command", () => {
  beforeEach(() => {
    mockRunExec.mockReset();
    mockRunExec.mockResolvedValue({
      success: true,
      output: "agent result",
      errors: [],
    });
  });

  it("passes implementation skill and selected context to shared runtime", async () => {
    await execImplement({
      cwd: "/project",
      changeName: "CHANGE-00002",
      taskName: "TASK-00001",
      featureName: "FEATURE-00003",
      promptParts: ["fix", "docs"],
    });

    expect(mockRunExec).toHaveBeenCalledWith({
      cwd: "/project",
      changeName: "CHANGE-00002",
      taskName: "TASK-00001",
      featureName: "FEATURE-00003",
      promptParts: ["fix", "docs"],
      skillPrompt: "/skill:backtrail-implement",
      model: "5.4-mini",
      reasoningEffort: "medium",
    });
  });

  it("passes prompt without optional change or task context", async () => {
    await execImplement({
      cwd: "/project",
      promptParts: ["fix", "docs"],
    });

    expect(mockRunExec).toHaveBeenCalledWith({
      cwd: "/project",
      promptParts: ["fix", "docs"],
      skillPrompt: "/skill:backtrail-implement",
      model: "5.4-mini",
      reasoningEffort: "medium",
    });
  });
});
