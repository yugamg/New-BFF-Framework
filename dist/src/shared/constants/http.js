"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_PREFIX = exports.HEADERS = exports.HTTP_METHODS = exports.HTTP_STATUS = void 0;
exports.HTTP_STATUS = {
    OK: 200,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
};
exports.HTTP_METHODS = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    PATCH: "PATCH",
    DELETE: "DELETE",
};
exports.HEADERS = {
    REQUEST_ID: "x-request-id",
    CORRELATION_ID: "x-correlation-id",
    CONTENT_TYPE: "content-type",
    COOKIE: "cookie",
    SET_COOKIE: "set-cookie",
};
exports.API_PREFIX = "/api/v1";
//# sourceMappingURL=http.js.map