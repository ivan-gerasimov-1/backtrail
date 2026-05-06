export interface IInitResult {
  success: boolean;
  created: string[];
  skipped: string[];
  errors: string[];
}

export type TInitOptions = {
  cwd: string;
};
