export interface IInitResult {
  success: boolean;
  created: string[];
  skipped: string[];
  errors: string[];
}

export interface IExecResult {
  success: boolean;
  output: string;
  errors: string[];
}

export type TInitStepResult = Omit<IInitResult, "success">;

export type TInitOptions = {
  cwd: string;
};

export type TExecOptions = {
  cwd: string;
  changeName?: string;
  taskName?: string;
  featureName?: string;
  force?: boolean;
  promptParts: string[];
};

export type TExecRuntimeOptions = TExecOptions & {
  skillPrompt: string;
  model: string;
  reasoningEffort: string;
};
