"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preloadErrorMappings = preloadErrorMappings;
exports.resolveMappedError = resolveMappedError;
const registry = {};
function preloadErrorMappings(mappings) {
    for (const [service, serviceMappings] of Object.entries(mappings)) {
        registry[service] = {
            ...registry[service],
            ...serviceMappings,
        };
    }
}
function getErrorKey(details) {
    if (!details || typeof details !== "object") {
        return undefined;
    }
    const candidate = details;
    const value = candidate.code ?? candidate.error ?? candidate.message;
    return typeof value === "string" ? value : undefined;
}
function resolveMappedError(service, statusCode, details) {
    if (!service) {
        return undefined;
    }
    const serviceRegistry = registry[service];
    if (!serviceRegistry) {
        return undefined;
    }
    const errorKey = getErrorKey(details);
    return ((errorKey ? serviceRegistry[errorKey] : undefined) ?? serviceRegistry[`HTTP_${statusCode}`]);
}
//# sourceMappingURL=errorRegistry.js.map