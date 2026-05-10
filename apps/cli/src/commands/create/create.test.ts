import { beforeEach, describe, expect, it, vi } from "vitest";

import { create } from "./create";

let mockRunExec = vi.hoisted(() => vi.fn());

vi.mock("../execRuntime", () => ({
  runExec: (...args: unknown[]) => mockRunExec(...args),
}));

describe("backtrail create command", () => {
  beforeEach(() => {
    mockRunExec.mockReset();
    mockRunExec.mockResolvedValue({
      success: true,
      output: "agent result",
      errors: [],
    });
  });

  it("passes creation skill and selected context to shared runtime", async () => {
    await create({
      cwd: "/project",
      changeName: "CHANGE-00003",
      featureName: "FEATURE-00003",
      promptParts: ["draft", "brief"],
    });

    expect(mockRunExec).toHaveBeenCalledWith({
      cwd: "/project",
      changeName: "CHANGE-00003",
      featureName: "FEATURE-00003",
      promptParts: ["draft", "brief"],
      skillPrompt: "/skill:backtrail-create",
      model: "5.5",
      reasoningEffort: "low",
    });
  });

  it("passes prompt without optional change or feature context", async () => {
    await create({
      cwd: "/project",
      promptParts: ["draft", "brief"],
    });

    expect(mockRunExec).toHaveBeenCalledWith({
      cwd: "/project",
      promptParts: ["draft", "brief"],
      skillPrompt: "/skill:backtrail-create",
      model: "5.5",
      reasoningEffort: "low",
    });
  });

  it("passes force flag to shared runtime", async () => {
    await create({
      cwd: "/project",
      force: true,
      promptParts: ["draft", "brief"],
    });

    expect(mockRunExec).toHaveBeenCalledWith({
      cwd: "/project",
      force: true,
      promptParts: ["draft", "brief"],
      skillPrompt: "/skill:backtrail-create",
      model: "5.5",
      reasoningEffort: "low",
    });
  });
});
