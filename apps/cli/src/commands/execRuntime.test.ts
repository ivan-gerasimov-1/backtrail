import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  buildExecArguments,
  buildExecPrompt,
  EXEC_BINARY,
} from "./execRuntimeConfig";
import { runExec } from "./execRuntime";

let mockSpawn = vi.hoisted(() => vi.fn());

vi.mock("node:child_process", () => ({
  spawn: (...args: unknown[]) => mockSpawn(...args),
}));

type TMockSignal = NodeJS.Signals | null;

interface IMockStream {
  setEncoding(encoding: string): void;
  on(event: "data", listener: (...args: unknown[]) => void): IMockStream;
  emitData(chunk: string): void;
}

interface IMockChildProcess {
  stdout: IMockStream;
  stderr: IMockStream;
  once(event: "error" | "close", listener: (...args: unknown[]) => void): IMockChildProcess;
  kill(signal?: NodeJS.Signals): boolean;
  emitError(error: Error & { code?: string }): void;
  emitClose(exitCode: number | null, signal: TMockSignal): void;
}

function createMockStream(): IMockStream {
  let listeners: Array<(...args: unknown[]) => void> = [];
  let mockStream: IMockStream;

  mockStream = {
    setEncoding() {},
    on(event, listener) {
      if (event === "data") {
        listeners.push(listener);
      }

      return mockStream;
    },
    emitData(chunk) {
      for (let listener of listeners) {
        listener(chunk);
      }
    },
  };

  return mockStream;
}

function createMockChildProcess(): IMockChildProcess {
  let errorListeners: Array<(...args: unknown[]) => void> = [];
  let closeListeners: Array<(...args: unknown[]) => void> = [];

  let childProcess: IMockChildProcess = {
    stdout: createMockStream(),
    stderr: createMockStream(),
    once(event, listener) {
      if (event === "error") {
        errorListeners.push(listener);
      }

      if (event === "close") {
        closeListeners.push(listener);
      }

      return childProcess;
    },
    kill() {
      return true;
    },
    emitError(error) {
      for (let listener of errorListeners) {
        listener(error);
      }
    },
    emitClose(exitCode, signal) {
      for (let listener of closeListeners) {
        listener(exitCode, signal);
      }
    },
  };

  return childProcess;
}

describe("backtrail exec runtime", () => {
  beforeEach(() => {
    mockSpawn.mockReset();
  });

  it("spawns PI Coding Agent with predefined args", async () => {
    let childProcess = createMockChildProcess();
    mockSpawn.mockReturnValue(childProcess);

    let resultPromise = runExec({
      cwd: "/project",
      changeName: "CHANGE-00002",
      taskName: "TASK-00001",
      promptParts: [],
      skillPrompt: "/skill:backtrail-implement",
    });

    childProcess.emitClose(0, null);

    let result = await resultPromise;

    expect(mockSpawn).toHaveBeenCalledWith(
      EXEC_BINARY,
      buildExecArguments({
        changeName: "CHANGE-00002",
        taskName: "TASK-00001",
        promptParts: [],
        skillPrompt: "/skill:backtrail-implement",
      }),
      {
        cwd: "/project",
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
    expect(result.success).toBe(true);
    expect(result.output).toBe("");
    expect(result.errors).toHaveLength(0);
  });

  it("captures agent output on success", async () => {
    let childProcess = createMockChildProcess();
    mockSpawn.mockReturnValue(childProcess);

    let resultPromise = runExec({
      cwd: "/project",
      changeName: "CHANGE-00002",
      taskName: "TASK-00001",
      promptParts: ["extra", "context"],
      skillPrompt: "/skill:backtrail-implement",
    });

    childProcess.stdout.emitData("agent result");
    childProcess.emitClose(0, null);

    let result = await resultPromise;

    expect(result.success).toBe(true);
    expect(result.output).toBe("agent result");
    expect(result.errors).toHaveLength(0);
  });

  it("reports spawn failure as actionable error", async () => {
    let childProcess = createMockChildProcess();
    mockSpawn.mockReturnValue(childProcess);

    let resultPromise = runExec({
      cwd: "/project",
      changeName: "CHANGE-00002",
      taskName: "TASK-00001",
      promptParts: [],
      skillPrompt: "/skill:backtrail-implement",
    });

    childProcess.emitError(
      Object.assign(new Error("spawn pi ENOENT"), {
        code: "ENOENT",
      }),
    );

    let result = await resultPromise;

    expect(result.success).toBe(false);
    expect(result.errors).toContain(
      "PI Coding Agent executable not found. Install `pi` and try again.",
    );
  });

  it("reports non-zero exit with stderr", async () => {
    let childProcess = createMockChildProcess();
    mockSpawn.mockReturnValue(childProcess);

    let resultPromise = runExec({
      cwd: "/project",
      changeName: "CHANGE-00002",
      taskName: "TASK-00001",
      promptParts: [],
      skillPrompt: "/skill:backtrail-implement",
    });

    childProcess.stderr.emitData("agent failed");
    childProcess.emitClose(1, null);

    let result = await resultPromise;

    expect(result.success).toBe(false);
    expect(result.errors).toContain("PI Coding Agent exited with code 1.");
    expect(result.errors).toContain("agent failed");
  });

  it("reports config dir permission failure from stderr", async () => {
    let childProcess = createMockChildProcess();
    mockSpawn.mockReturnValue(childProcess);

    let resultPromise = runExec({
      cwd: "/project",
      changeName: "CHANGE-00002",
      taskName: "TASK-00001",
      promptParts: [],
      skillPrompt: "/skill:backtrail-implement",
    });

    childProcess.stderr.emitData(
      "Warning: (startup session lookup, global settings) EPERM: operation not permitted, mkdir '/Users/ivan/.pi/agent/settings.json.lock'",
    );

    let result = await resultPromise;

    expect(result.success).toBe(false);
    expect(result.errors).toContain(
      "PI Coding Agent cannot write config dir. Set `PI_CODING_AGENT_DIR` to a writable path or fix permissions for `~/.pi/agent`.",
    );
  });

  it("builds prompt from change, task, and free-form text", () => {
    expect(
      buildExecPrompt({
        changeName: "CHANGE-00002",
        taskName: "TASK-00001",
        promptParts: ["fix", "docs"],
        skillPrompt: "/skill:backtrail-create",
      }),
    ).toBe(
      "/skill:backtrail-create change: CHANGE-00002 task: TASK-00001 fix docs",
    );
  });

  it("builds prompt from change, feature, and free-form text", () => {
    expect(
      buildExecPrompt({
        changeName: "CHANGE-00003",
        featureName: "FEATURE-00003",
        promptParts: ["draft", "brief"],
        skillPrompt: "/skill:backtrail-create",
      }),
    ).toBe(
      "/skill:backtrail-create change: CHANGE-00003 feature: FEATURE-00003 draft brief",
    );
  });

  it("builds prompt without optional change or task", () => {
    expect(
      buildExecPrompt({
        promptParts: ["fix", "docs"],
        skillPrompt: "/skill:backtrail-create",
      }),
    ).toBe("/skill:backtrail-create fix docs");
  });
});
