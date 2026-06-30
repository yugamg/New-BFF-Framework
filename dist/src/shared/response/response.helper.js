"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = successResponse;
exports.errorResponse = errorResponse;
function successResponse(data, requestId) {
    return {
        success: true,
        data,
        error: null,
        meta: {
            requestId,
            timestamp: new Date().toISOString(),
        },
    };
}
function errorResponse(code, message, requestId, details) {
    return {
        success: false,
        data: null,
        error: {
            code,
            message,
            ...(details === undefined ? {} : { details }),
        },
        meta: {
            requestId,
            timestamp: new Date().toISOString(),
        },
    };
}
//# sourceMappingURL=response.helper.js.map