import {
  OrchestratorMode,
  type OrchestratorOptions,
  type TaskResult,
  type TaskWithRetry,
} from "@shared/orchestrator/orchestrator.types";
import { transformUtility } from "@shared/transformer/transform";
import { requestLoggerWithTimestamp } from "@shared/utils/logger";
import type { FastifyRequest } from "fastify";

async function runTask<TData>(
  task: TaskWithRetry<TData>,
  previousResult?: TaskResult,
  request?: FastifyRequest
): Promise<TaskResult<TData>> {
  try {
    requestLoggerWithTimestamp({ taskName: task.name, taskStatus: "started" }, request);
    const result = await task.fn(previousResult);

    if (task.validate && !task.validate(result)) {
      throw new Error(`Task ${task.name} failed validation`);
    }

    const transformedResult = applyTransformation(task, result, request);
    requestLoggerWithTimestamp({ taskName: task.name, taskStatus: "completed" }, request);
    return transformedResult;
  } catch (error) {
    requestLoggerWithTimestamp(
      { taskName: task.name, taskStatus: "failed", errorMessage: (error as Error).message },
      request
    );
    throw error;
  }
}

function readPath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, part) => {
    if (current === null || typeof current !== "object") {
      return undefined;
    }

    return (current as Record<string, unknown>)[part];
  }, source);
}

function applyTransformation<TData>(
  task: TaskWithRetry<TData>,
  result: TaskResult<TData>,
  request?: FastifyRequest
): TaskResult<TData> {
  const transformConfigKey = task.transformationOptions?.transformConfigKey;

  if (!transformConfigKey) {
    return result;
  }

  requestLoggerWithTimestamp(
    {
      taskName: task.name,
      taskStatus: "transforming",
      transformConfigKey,
      rootPath: task.transformationOptions?.rootPath,
    },
    request
  );

  const dataToTransform = task.transformationOptions?.rootPath
    ? readPath(result.data, task.transformationOptions.rootPath)
    : result.data;

  return {
    ...result,
    data: transformUtility({ data: dataToTransform, transformConfigKey, request }) as TData,
  };
}

export async function orchestrator(
  tasks: TaskWithRetry[],
  options: OrchestratorOptions = {},
  request?: FastifyRequest
): Promise<TaskResult[]> {
  const mode = options.mode ?? OrchestratorMode.series;

  if (mode === OrchestratorMode.parallel) {
    const settled = await Promise.allSettled(
      tasks.map((task) => runTask(task, undefined, request))
    );

    return settled.map((result) => {
      if (result.status === "fulfilled") {
        return result.value;
      }

      if (options.continueOnError) {
        return { data: null };
      }

      throw result.reason;
    });
  }

  const results: TaskResult[] = [];
  let previousResult: TaskResult | undefined;

  for (const task of tasks) {
    try {
      const result = await runTask(task, previousResult, request);
      results.push(result);
      previousResult = result;
    } catch (error) {
      if (!options.continueOnError) {
        throw error;
      }

      previousResult = { data: null };
      results.push(previousResult);
    }
  }

  return results;
}
