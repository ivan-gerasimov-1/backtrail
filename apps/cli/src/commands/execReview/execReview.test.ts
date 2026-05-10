import { beforeEach, describe, expect, it, vi } from "vitest";

import { buildExecReviewArguments, buildExecReviewPrompt } from "./execReviewConfig";
import { execReview } from "./execReview";

let mockRunExec = vi.hoisted(() => vi.fn());

vi.mock("../execRuntime", () => ({
  runExec: (...args: unknown[]) => mockRunExec(...args),
}));

describe("backtrail exec review command", () => {
  beforeEach(() => {
    mockRunExec.mockReset();
    mockRunExec.mockResolvedValue({
      success: true,
      output: "agent result",
      errors: [],
    });
  });

  it("passes review skill and selected context to shared runtime", async () => {
    await execReview({
      cwd: "/project",
      changeName: "CHANGE-00006",
      taskName: "TASK-00010",
      featureName: "FEATURE-00006",
      promptParts: ["review", "implementation"],
    });

    expect(mockRunExec).toHaveBeenCalledWith({
      cwd: "/project",
      changeName: "CHANGE-00006",
      taskName: "TASK-00010",
      featureName: "FEATURE-00006",
      promptParts: ["review", "implementation"],
      skillPrompt: "/skill:backtrail-review",
      model: "5.5",
      reasoningEffort: "low",
    });
  });

  it("passes prompt without optional change, task, or feature context", async () => {
    await execReview({
      cwd: "/project",
      promptParts: ["review", "implementation"],
    });

    expect(mockRunExec).toHaveBeenCalledWith({
      cwd: "/project",
      promptParts: ["review", "implementation"],
      skillPrompt: "/skill:backtrail-review",
      model: "5.5",
      reasoningEffort: "low",
    });
  });

  it("passes force flag to shared runtime", async () => {
    await execReview({
      cwd: "/project",
      force: true,
      promptParts: ["review", "implementation"],
    });

    expect(mockRunExec).toHaveBeenCalledWith({
      cwd: "/project",
      force: true,
      promptParts: ["review", "implementation"],
      skillPrompt: "/skill:backtrail-review",
      model: "5.5",
      reasoningEffort: "low",
    });
  });

  it("builds review prompt from change, task, feature, force, and free-form text", () => {
    expect(
      buildExecReviewPrompt({
        changeName: "CHANGE-00006",
        taskName: "TASK-00010",
        featureName: "FEATURE-00006",
        force: true,
        promptParts: ["review", "implementation"],
      }),
    ).toBe(
      "/skill:backtrail-review change: CHANGE-00006 task: TASK-00010 feature: FEATURE-00006 Do not ask user questions. Proceed with available context, while preserving explicit safety and Backtrail skill guardrails. review implementation",
    );
  });

  it("builds review arguments with model and reasoning defaults", () => {
    expect(
      buildExecReviewArguments({
        cwd: "/project",
        changeName: "CHANGE-00006",
        promptParts: ["review"],
      }),
    ).toEqual([
      "--print",
      "--provider",
      "openai-codex",
      "--model",
      "gpt-5.5",
      "--thinking",
      "low",
      "/skill:backtrail-review change: CHANGE-00006 review",
    ]);
  });
});
