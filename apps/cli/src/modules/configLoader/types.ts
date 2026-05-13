export type TBacktrailConfig = Record<string, unknown>;

export type TConfigSource = "default" | "explicit";

export type TConfigLoadOptions = {
  cwd: string;
  configPath?: string;
};

export type TConfigLoadContext = {
  configPath: string;
  source: TConfigSource;
};

export type TConfigLoadResult = {
  success: boolean;
  config: TBacktrailConfig;
  configPath: string;
  source: TConfigSource;
  errors: string[];
};

export type TConfigParseSuccess = {
  success: true;
  config: TBacktrailConfig;
};

export type TConfigParseFailure = {
  success: false;
  errors: string[];
};
