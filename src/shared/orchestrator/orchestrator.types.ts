export enum OrchestratorMode {
  series = "series",
  parallel = "parallel",
}

export interface TaskResult<TData = unknown> {
  data: TData;
  cookies?: string;
}

export interface TaskWithRetry<TData = unknown> {
  name: string;
  fn: (previousResult?: TaskResult) => Promise<TaskResult<TData>>;
  validate?: (result: TaskResult<TData>) => boolean;
  transformationOptions?: {
    transformConfigKey?: string;
    rootPath?: string;
  };
}

export interface OrchestratorOptions {
  mode?: OrchestratorMode;
  continueOnError?: boolean;
}
