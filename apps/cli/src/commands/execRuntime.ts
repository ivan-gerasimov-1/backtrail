import { spawn } from "node:child_process";

import { buildExecArguments, EXEC_BINARY } from "./execRuntimeConfig";
import { IExecResult, TExecRuntimeOptions } from "./types";

type TSpawnError = Error & {
  code?: string;
};

export async function runExec(options: TExecRuntimeOptions): Promise<IExecResult> {
  try {
    let childProcess = spawn(EXEC_BINARY, buildExecArguments(options), {
      cwd: options.cwd,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let settled = false;
    let resolvePromise = (_result: IExecResult) => {};
    let resolveResult = (result: IExecResult) => {
      if (settled) {
        return result;
      }

      settled = true;
      resolvePromise(result);
      return result;
    };

    childProcess.stdout?.setEncoding("utf8");
    childProcess.stderr?.setEncoding("utf8");

    childProcess.stdout?.on("data", (chunk: string) => {
      stdout += chunk;
      process.stdout.write(chunk);
    });

    childProcess.stderr?.on("data", (chunk: string) => {
      stderr += chunk;
      process.stderr.write(chunk);

      let configErrorMessage = buildConfigDirErrorMessage(chunk);

      if (configErrorMessage && !settled) {
        resolveResult({
          success: false,
          output: stdout.trimEnd(),
          errors: [configErrorMessage],
        });
        childProcess.kill("SIGKILL");
      }
    });

    return new Promise<IExecResult>((resolve) => {
      resolvePromise = resolve;

      childProcess.once("error", (error: TSpawnError) => {
        resolveResult({
          success: false,
          output: stdout.trimEnd(),
          errors: [buildSpawnErrorMessage(error)],
        });
      });

      childProcess.once("close", (exitCode: number | null, signal) => {
        if (settled) {
          return;
        }

        if (exitCode === 0) {
          resolveResult({
            success: true,
            output: stdout.trimEnd(),
            errors: [],
          });
          return;
        }

        resolveResult({
          success: false,
          output: stdout.trimEnd(),
          errors: buildExitErrorMessages(exitCode, signal, stderr),
        });
      });
    });
  } catch (error) {
    let message = error instanceof Error ? error.message : String(error);

    return {
      success: false,
      output: "",
      errors: [message],
    };
  }
}

function buildSpawnErrorMessage(error: TSpawnError) {
  if (error.code === "ENOENT") {
    return "PI Coding Agent executable not found. Install `pi` and try again.";
  }

  return error.message;
}

function buildConfigDirErrorMessage(chunk: string) {
  if (!chunk.includes("EPERM")) {
    return null;
  }

  if (!chunk.includes(".pi/agent") && !chunk.includes("PI_CODING_AGENT_DIR")) {
    return null;
  }

  return [
    "PI Coding Agent cannot write config dir.",
    "Set `PI_CODING_AGENT_DIR` to a writable path or fix permissions for `~/.pi/agent`.",
  ].join(" ");
}

function buildExitErrorMessages(
  exitCode: number | null,
  signal: NodeJS.Signals | null,
  stderr: string,
) {
  let errors: string[] = [];

  if (exitCode === null) {
    errors.push(
      `PI Coding Agent exited without status${signal ? ` after signal ${signal}` : ""}.`,
    );
  } else {
    errors.push(`PI Coding Agent exited with code ${exitCode}.`);
  }

  let trimmedStderr = stderr.trim();

  if (trimmedStderr.length > 0) {
    errors.push(trimmedStderr);
  }

  return errors;
}
