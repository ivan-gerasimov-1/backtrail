import { resolve } from "node:path";

import { isErrnoException } from "../../commands/fsUtils";
import { IFileSystem } from "../fileSystem/types";

import { DEFAULT_CONFIG_PATH } from "./constants";
import type {
  TBacktrailConfig,
  TConfigLoadContext,
  TConfigLoadOptions,
  TConfigLoadResult,
  TConfigParseFailure,
  TConfigParseSuccess,
  TConfigSource,
} from "./types";

export class ConfigLoader {
  public constructor(private readonly fileSystem: IFileSystem) { }

  public async load(options: TConfigLoadOptions): Promise<TConfigLoadResult> {
    let context = this.buildLoadContext(options);

    try {
      let rawConfig = await this.fileSystem.readFile(context.configPath);
      let parsedConfig = this.parseConfig(rawConfig, context.configPath);

      if (!parsedConfig.success) {
        return this.buildFailureResult(context, parsedConfig.errors);
      }

      return this.buildSuccessResult(context, parsedConfig.config);
    } catch (error: unknown) {
      if (!options.configPath && this.fileSystem.isMissingFile(error)) {
        return this.buildSuccessResult(context, {});
      }

      return this.buildFailureResult(context, [
        this.buildLoadErrorMessage(error, context.configPath),
      ]);
    }
  }

  private buildLoadContext(options: TConfigLoadOptions): TConfigLoadContext {
    let source: TConfigSource = options.configPath ? "explicit" : "default";
    let configPath = resolve(options.cwd, options.configPath ?? DEFAULT_CONFIG_PATH);

    return {
      configPath,
      source,
    };
  }

  private buildSuccessResult(
    context: TConfigLoadContext,
    config: TBacktrailConfig,
  ): TConfigLoadResult {
    return {
      success: true,
      config,
      configPath: context.configPath,
      source: context.source,
      errors: [],
    };
  }

  private buildFailureResult(
    context: TConfigLoadContext,
    errors: string[],
  ): TConfigLoadResult {
    return {
      success: false,
      config: {},
      configPath: context.configPath,
      source: context.source,
      errors,
    };
  }

  private parseConfig(
    contents: string,
    configPath: string,
  ): TConfigParseSuccess | TConfigParseFailure {
    let parsedContents: unknown;

    try {
      parsedContents = JSON.parse(contents);
    } catch (error: unknown) {
      return {
        success: false,
        errors: [this.buildMalformedJsonMessage(error, configPath)],
      };
    }

    if (!this.isBacktrailConfig(parsedContents)) {
      return {
        success: false,
        errors: [`Config file ${configPath} must contain a JSON object.`],
      };
    }

    return {
      success: true,
      config: parsedContents,
    };
  }

  private isBacktrailConfig(value: unknown): value is TBacktrailConfig {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  private buildMalformedJsonMessage(error: unknown, configPath: string) {
    let reason = error instanceof Error ? error.message : String(error);
    return `Config file ${configPath} contains invalid JSON: ${reason}`;
  }

  private buildLoadErrorMessage(error: unknown, configPath: string) {
    if (isErrnoException(error)) {
      return `Unable to read config file ${configPath}: ${error.code}`;
    }

    let reason = error instanceof Error ? error.message : String(error);
    return `Unable to read config file ${configPath}: ${reason}`;
  }
}
