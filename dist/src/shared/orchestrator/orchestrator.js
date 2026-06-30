"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orchestrator = orchestrator;
const orchestrator_types_1 = require("../orchestrator/orchestrator.types");
const transform_1 = require("../transformer/transform");
const logger_1 = require("../utils/logger");
async function runTask(task, previousResult, request) {
    try {
        (0, logger_1.requestLoggerWithTimestamp)({ taskName: task.name, taskStatus: "started" }, request);
        const result = await task.fn(previousResult);
        if (task.validate && !task.validate(result)) {
            throw new Error(`Task ${task.name} failed validation`);
        }
        const transformedResult = applyTransformation(task, result, request);
        (0, logger_1.requestLoggerWithTimestamp)({ taskName: task.name, taskStatus: "completed" }, request);
        return transformedResult;
    }
    catch (error) {
        (0, logger_1.requestLoggerWithTimestamp)({ taskName: task.name, taskStatus: "failed", errorMessage: error.message }, request);
        throw error;
    }
}
function readPath(source, path) {
    return path.split(".").reduce((current, part) => {
        if (current === null || typeof current !== "object") {
            return undefined;
        }
        return current[part];
    }, source);
}
function applyTransformation(task, result, request) {
    const transformConfigKey = task.transformationOptions?.transformConfigKey;
    if (!transformConfigKey) {
        return result;
    }
    (0, logger_1.requestLoggerWithTimestamp)({
        taskName: task.name,
        taskStatus: "transforming",
        transformConfigKey,
        rootPath: task.transformationOptions?.rootPath,
    }, request);
    const dataToTransform = task.transformationOptions?.rootPath
        ? readPath(result.data, task.transformationOptions.rootPath)
        : result.data;
    return {
        ...result,
        data: (0, transform_1.transformUtility)({ data: dataToTransform, transformConfigKey, request }),
    };
}
async function orchestrator(tasks, options = {}, request) {
    const mode = options.mode ?? orchestrator_types_1.OrchestratorMode.series;
    if (mode === orchestrator_types_1.OrchestratorMode.parallel) {
        const settled = await Promise.allSettled(tasks.map((task) => runTask(task, undefined, request)));
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
    const results = [];
    let previousResult;
    for (const task of tasks) {
        try {
            const result = await runTask(task, previousResult, request);
            results.push(result);
            previousResult = result;
        }
        catch (error) {
            if (!options.continueOnError) {
                throw error;
            }
            previousResult = { data: null };
            results.push(previousResult);
        }
    }
    return results;
}
//# sourceMappingURL=orchestrator.js.map