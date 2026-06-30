"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
const http_1 = require("../constants/http");
class AppError extends Error {
    statusCode;
    code;
    details;
    constructor(statusCode, code, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.name = "AppError";
    }
    static badRequest(code, message, details) {
        return new AppError(http_1.HTTP_STATUS.BAD_REQUEST, code, message, details);
    }
    static unauthorized(code, message, details) {
        return new AppError(http_1.HTTP_STATUS.UNAUTHORIZED, code, message, details);
    }
    static forbidden(code, message, details) {
        return new AppError(http_1.HTTP_STATUS.FORBIDDEN, code, message, details);
    }
    static notFound(code, message, details) {
        return new AppError(http_1.HTTP_STATUS.NOT_FOUND, code, message, details);
    }
    static conflict(code, message, details) {
        return new AppError(http_1.HTTP_STATUS.CONFLICT, code, message, details);
    }
    static tooManyRequests(code, message, details) {
        return new AppError(http_1.HTTP_STATUS.TOO_MANY_REQUESTS, code, message, details);
    }
    static serviceUnavailable(code, message, details) {
        return new AppError(http_1.HTTP_STATUS.SERVICE_UNAVAILABLE, code, message, details);
    }
    static internal(code, message, details) {
        return new AppError(http_1.HTTP_STATUS.INTERNAL_SERVER_ERROR, code, message, details);
    }
    static isAppError(error) {
        return error instanceof AppError;
    }
}
exports.AppError = AppError;
//# sourceMappingURL=app.error.js.map