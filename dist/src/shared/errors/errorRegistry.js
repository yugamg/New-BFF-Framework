"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToAppError = mapToAppError;
const app_error_1 = require("../errors/app.error");
// Keep this simple: add one section per downstream service and one entry per known error.
const errorRegistry = {
    vtexId: {
        WrongCredentials: {
            statusCode: 401,
            errorCode: "AUTH_INVALID_CREDENTIALS",
            message: "Invalid email or password",
        },
        BlockedUser: {
            statusCode: 403,
            errorCode: "AUTH_ACCOUNT_LOCKED",
            message: "Account is blocked. Please contact support.",
        },
        InvalidEmail: {
            statusCode: 400,
            errorCode: "AUTH_INVALID_EMAIL",
            message: "Invalid email address",
        },
        ExceededUsageLimits: {
            statusCode: 429,
            errorCode: "AUTH_EXCEEDED_USAGE_LIMITS",
            message: "Too many attempts. Please try again later.",
        },
        WeakPassword: {
            statusCode: 400,
            errorCode: "AUTH_WEAK_PASSWORD",
            message: "Password does not meet strength requirements",
        },
        PasswordAlreadyUsed: {
            statusCode: 400,
            errorCode: "AUTH_PASSWORD_ALREADY_USED",
            message: "Password was recently used. Please choose a different one.",
        },
    },
};
function getErrorKey(details) {
    if (!details || typeof details !== "object") {
        return undefined;
    }
    const candidate = details;
    const value = candidate.code ?? candidate.error ?? candidate.message;
    return typeof value === "string" ? value : undefined;
}
function mapToAppError(service, details) {
    if (!service) {
        return undefined;
    }
    const serviceRegistry = errorRegistry[service];
    if (!serviceRegistry) {
        return undefined;
    }
    const errorKey = getErrorKey(details);
    const normalizedError = errorKey ? serviceRegistry[errorKey] : undefined;
    if (!normalizedError) {
        return undefined;
    }
    return new app_error_1.AppError(normalizedError.statusCode, normalizedError.errorCode, normalizedError.message, details);
}
//# sourceMappingURL=errorRegistry.js.map