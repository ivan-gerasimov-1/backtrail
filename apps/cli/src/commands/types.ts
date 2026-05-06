export interface IInitResult {
  success: boolean;
  created: string[];
  skipped: string[];
  errors: string[];
}

export type TInitStepResult = Omit<IInitResult, "success">;

export type TInitOptions = {
  cwd: string;
};
