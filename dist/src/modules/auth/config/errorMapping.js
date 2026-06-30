"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authErrorMappings = void 0;
exports.authErrorMappings = {
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
        HTTP_400: {
            statusCode: 400,
            errorCode: "AUTH_BAD_REQUEST",
            message: "Invalid authentication request",
        },
        HTTP_401: {
            statusCode: 401,
            errorCode: "AUTH_UNAUTHORIZED",
            message: "Authentication failed",
        },
        HTTP_403: {
            statusCode: 403,
            errorCode: "AUTH_FORBIDDEN",
            message: "Authentication is not allowed",
        },
    },
};
//# sourceMappingURL=errorMapping.js.map