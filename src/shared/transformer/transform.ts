import type { TransformConfig } from "@shared/transformer/transform.types";
import { TransformOperation } from "@shared/transformer/transform.types";
import { transformationConfigRegistry } from "@shared/transformer/transformationRegistry";
import { requestLoggerWithTimestamp } from "@shared/utils/logger";
import type { FastifyRequest } from "fastify";

interface TransformUtilityInput {
  data: unknown | unknown[];
  transformConfigKey: string;
  request?: FastifyRequest;
}

function resolvePath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((current, part) => {
    if (current === null || typeof current !== "object") {
      return undefined;
    }

    return (current as Record<string, unknown>)[part];
  }, source);
}

function resolveFirstPath(source: unknown, paths: string[]): unknown {
  for (const path of paths) {
    const value = resolvePath(source, path);

    if (value !== undefined) {
      return value;
    }
  }

  return undefined;
}

function setNestedValue(output: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split(".");
  let current = output;

  for (const [index, key] of keys.entries()) {
    if (index === keys.length - 1) {
      current[key] = value;
      return;
    }

    const next = current[key];

    if (next === null || typeof next !== "object" || Array.isArray(next)) {
      current[key] = {};
    }

    current = current[key] as Record<string, unknown>;
  }
}

function applyTransformOperation(value: unknown, operation?: TransformOperation): unknown {
  if (operation === TransformOperation.PARSE_ARRAY) {
    if (typeof value === "string") {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return value ?? [];
  }

  return value;
}

function applyConfig(
  data: unknown,
  config: TransformConfig,
  transformConfigKey: string,
  request?: FastifyRequest
): Record<string, unknown> {
  const output: Record<string, unknown> = {};

  for (const [targetKey, rule] of Object.entries(config)) {
    let value = resolveFirstPath(data, rule.from);
    value = applyTransformOperation(value, rule.transformKey);

    if (rule.options?.postProcess) {
      value = rule.options.postProcess(value);
    }

    if (value !== undefined) {
      setNestedValue(output, targetKey, value);
    } else {
      requestLoggerWithTimestamp(
        {
          taskStatus: "failed",
          transformConfigKey,
          outputKey: targetKey,
          message: "No value found for transform output key",
        },
        request
      );
    }
  }

  return output;
}

export function transformUtility<T>({
  data,
  transformConfigKey,
  request,
}: TransformUtilityInput): T {
  const config = transformationConfigRegistry[transformConfigKey];

  if (!config) {
    requestLoggerWithTimestamp(
      {
        taskStatus: "failed",
        transformConfigKey,
        message: "No transform config found; returning raw data",
      },
      request
    );
    return data as T;
  }

  try {
    if (Array.isArray(data)) {
      return data.map((item) => applyConfig(item, config, transformConfigKey, request)) as T;
    }

    return applyConfig(data, config, transformConfigKey, request) as T;
  } catch (error) {
    requestLoggerWithTimestamp(
      {
        taskStatus: "failed",
        transformConfigKey,
        message: "Transform failed; returning raw data",
        errorMessage: (error as Error).message,
      },
      request
    );
    return data as T;
  }
}
