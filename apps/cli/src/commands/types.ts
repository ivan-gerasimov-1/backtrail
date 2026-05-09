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
  promptParts: string[];
};
