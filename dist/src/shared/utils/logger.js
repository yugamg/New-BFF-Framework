"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redactHeaders = redactHeaders;
exports.requestLoggerWithTimestamp = requestLoggerWithTimestamp;
const SENSITIVE_HEADERS = new Set([
    "authorization",
    "cookie",
    "set-cookie",
    "x-vtex-api-appkey",
    "x-vtex-api-apptoken",
]);
function redactHeaders(headers) {
    return Object.fromEntries(Object.entries(headers).map(([key, value]) => [
        key,
        SENSITIVE_HEADERS.has(key.toLowerCase()) ? "[REDACTED]" : value,
    ]));
}
function requestLoggerWithTimestamp(entry, request) {
    request?.log.info({
        timestamp: new Date().toISOString(),
        ...entry,
    }, "BFF pipeline event");
}
//# sourceMappingURL=logger.js.map