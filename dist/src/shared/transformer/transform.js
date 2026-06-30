"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformUtility = transformUtility;
const transform_types_1 = require("../transformer/transform.types");
const transformationRegistry_1 = require("../transformer/transformationRegistry");
const logger_1 = require("../utils/logger");
function resolvePath(source, path) {
    return path.split(".").reduce((current, part) => {
        if (current === null || typeof current !== "object") {
            return undefined;
        }
        return current[part];
    }, source);
}
function resolveFirstPath(source, paths) {
    for (const path of paths) {
        const value = resolvePath(source, path);
        if (value !== undefined) {
            return value;
        }
    }
    return undefined;
}
function setNestedValue(output, path, value) {
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
        current = current[key];
    }
}
function applyTransformOperation(value, operation) {
    if (operation === transform_types_1.TransformOperation.PARSE_ARRAY) {
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
function applyConfig(data, config, transformConfigKey, request) {
    const output = {};
    for (const [targetKey, rule] of Object.entries(config)) {
        let value = resolveFirstPath(data, rule.from);
        value = applyTransformOperation(value, rule.transformKey);
        if (rule.options?.postProcess) {
            value = rule.options.postProcess(value);
        }
        if (value !== undefined) {
            setNestedValue(output, targetKey, value);
        }
        else {
            (0, logger_1.requestLoggerWithTimestamp)({
                taskStatus: "failed",
                transformConfigKey,
                outputKey: targetKey,
                message: "No value found for transform output key",
            }, request);
        }
    }
    return output;
}
function transformUtility({ data, transformConfigKey, request, }) {
    const config = transformationRegistry_1.transformationConfigRegistry[transformConfigKey];
    if (!config) {
        (0, logger_1.requestLoggerWithTimestamp)({
            taskStatus: "failed",
            transformConfigKey,
            message: "No transform config found; returning raw data",
        }, request);
        return data;
    }
    try {
        if (Array.isArray(data)) {
            return data.map((item) => applyConfig(item, config, transformConfigKey, request));
        }
        return applyConfig(data, config, transformConfigKey, request);
    }
    catch (error) {
        (0, logger_1.requestLoggerWithTimestamp)({
            taskStatus: "failed",
            transformConfigKey,
            message: "Transform failed; returning raw data",
            errorMessage: error.message,
        }, request);
        return data;
    }
}
//# sourceMappingURL=transform.js.map