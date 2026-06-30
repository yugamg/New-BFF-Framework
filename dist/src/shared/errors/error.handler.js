"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFastifyError = handleFastifyError;
const http_1 = require("../constants/http");
const app_error_1 = require("../errors/app.error");
const response_helper_1 = require("../response/response.helper");
const request_1 = require("../utils/request");
function handleFastifyError(error, request, reply) {
    const requestId = (0, request_1.getRequestId)(request);
    if (app_error_1.AppError.isAppError(error)) {
        reply
            .status(error.statusCode)
            .send((0, response_helper_1.errorResponse)(error.code, error.message, requestId, error.details));
        return;
    }
    if ("validation" in error && error.validation) {
        reply
            .status(http_1.HTTP_STATUS.BAD_REQUEST)
            .send((0, response_helper_1.errorResponse)("VALIDATION_ERROR", error.message, requestId, error.validation));
        return;
    }
    request.log.error({ err: error }, "Unhandled request error");
    reply
        .status(http_1.HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send((0, response_helper_1.errorResponse)("INTERNAL_ERROR", "An unexpected error occurred", requestId));
}
//# sourceMappingURL=error.handler.js.map