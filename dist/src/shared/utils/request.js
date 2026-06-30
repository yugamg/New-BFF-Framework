"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRequestId = getRequestId;
exports.getCorrelationId = getCorrelationId;
exports.validateRequest = validateRequest;
const http_1 = require("../constants/http");
const app_error_1 = require("../errors/app.error");
function getRequestId(request) {
    return request.id;
}
function getCorrelationId(request) {
    return request.headers[http_1.HEADERS.CORRELATION_ID] ?? request.id;
}
function validateRequest(schema, value) {
    const result = schema.safeParse(value);
    if (!result.success) {
        throw app_error_1.AppError.badRequest("VALIDATION_ERROR", "Invalid request payload", result.error.flatten());
    }
    return result.data;
}
//# sourceMappingURL=request.js.map