"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpClient = void 0;
const http_1 = require("../constants/http");
const app_error_1 = require("../errors/app.error");
const errorRegistry_1 = require("../errors/errorRegistry");
const logger_1 = require("../utils/logger");
const request_1 = require("../utils/request");
const DEFAULT_RETRY_CONFIG = {
    retries: 2,
    retryOn: [429, 500, 502, 503, 504],
    backoffFactor: 2,
    initialDelayMs: 200,
};
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function extractResponseCookies(response) {
    const setCookies = response.headers.getSetCookie?.() ??
        response.headers
            .get(http_1.HEADERS.SET_COOKIE)
            ?.split(/,(?=\s*[\w-]+=)/)
            .map((cookie) => cookie.trim()) ??
        [];
    return setCookies
        .map((cookie) => cookie.split(";")[0].trim())
        .filter(Boolean)
        .join("; ");
}
function toSafeUrlForLogs(url) {
    try {
        const parsedUrl = new URL(url);
        return `${parsedUrl.origin}${parsedUrl.pathname}`;
    }
    catch {
        return url;
    }
}
class HttpClient {
    baseUrl;
    defaultTimeoutMs;
    constructor(baseUrl, defaultTimeoutMs) {
        this.baseUrl = baseUrl;
        this.defaultTimeoutMs = defaultTimeoutMs;
    }
    async request(path, options = {}) {
        const url = path.startsWith("http") ? path : `${this.baseUrl}${path}`;
        const retry = { ...DEFAULT_RETRY_CONFIG, ...options.retry };
        let attempt = 0;
        while (attempt <= retry.retries) {
            (0, logger_1.requestLoggerWithTimestamp)({
                externalService: options.logContext?.externalService,
                externalServiceUrl: toSafeUrlForLogs(url),
                method: options.method ?? "GET",
                attempt: attempt + 1,
                event: "external-request-started",
            }, options.logContext?.request);
            const response = await this.execute(url, options);
            if (response.ok) {
                (0, logger_1.requestLoggerWithTimestamp)({
                    externalService: options.logContext?.externalService,
                    externalServiceUrl: toSafeUrlForLogs(url),
                    method: options.method ?? "GET",
                    statusCode: response.status,
                    event: "external-response-received",
                }, options.logContext?.request);
                return {
                    data: await this.parseJson(response, url),
                    cookies: extractResponseCookies(response),
                    statusCode: response.status,
                    headers: response.headers,
                };
            }
            if (!retry.retryOn.includes(response.status) || attempt >= retry.retries) {
                (0, logger_1.requestLoggerWithTimestamp)({
                    externalService: options.logContext?.externalService,
                    externalServiceUrl: toSafeUrlForLogs(url),
                    method: options.method ?? "GET",
                    statusCode: response.status,
                    event: "external-response-failed",
                }, options.logContext?.request);
                throw await this.mapError(response, options.logContext?.externalService);
            }
            attempt += 1;
            (0, logger_1.requestLoggerWithTimestamp)({
                externalService: options.logContext?.externalService,
                externalServiceUrl: toSafeUrlForLogs(url),
                method: options.method ?? "GET",
                statusCode: response.status,
                nextAttempt: attempt + 1,
                event: "external-request-retrying",
            }, options.logContext?.request);
            await delay(retry.initialDelayMs * retry.backoffFactor ** attempt);
        }
        throw app_error_1.AppError.serviceUnavailable("SERVICE_UNAVAILABLE", `Failed calling ${url}`);
    }
    buildUrl(path, queryParams) {
        const url = new URL(`${this.baseUrl}${path}`);
        if (queryParams) {
            for (const [key, value] of Object.entries(queryParams)) {
                if (value !== undefined) {
                    url.searchParams.set(key, value);
                }
            }
        }
        return url.toString();
    }
    async execute(url, options) {
        const { body, timeoutMs = this.defaultTimeoutMs, headers, retry: _retry, logContext, ...rest } = options;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        const outgoingHeaders = {
            ...(!(body instanceof FormData) && { [http_1.HEADERS.CONTENT_TYPE]: "application/json" }),
            ...headers,
        };
        if (logContext?.request) {
            outgoingHeaders[http_1.HEADERS.REQUEST_ID] = (0, request_1.getRequestId)(logContext.request);
            outgoingHeaders[http_1.HEADERS.CORRELATION_ID] = (0, request_1.getCorrelationId)(logContext.request);
        }
        try {
            return await fetch(url, {
                ...rest,
                headers: outgoingHeaders,
                body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
                signal: controller.signal,
            });
        }
        catch (error) {
            const message = error.name === "AbortError"
                ? `Request to ${url} timed out after ${timeoutMs}ms`
                : `Network error calling ${url}: ${error.message}`;
            (0, logger_1.requestLoggerWithTimestamp)({
                externalService: logContext?.externalService,
                externalServiceUrl: toSafeUrlForLogs(url),
                method: rest.method ?? "GET",
                headers: (0, logger_1.redactHeaders)(outgoingHeaders),
                event: "external-request-error",
                errorMessage: error.message,
            }, logContext?.request);
            throw app_error_1.AppError.serviceUnavailable("SERVICE_UNAVAILABLE", message);
        }
        finally {
            clearTimeout(timer);
        }
    }
    async mapError(response, externalService) {
        let details;
        try {
            details = await response.json();
        }
        catch {
            details = undefined;
        }
        const mappedError = (0, errorRegistry_1.mapToAppError)(externalService, details);
        if (mappedError) {
            return mappedError;
        }
        switch (response.status) {
            case http_1.HTTP_STATUS.BAD_REQUEST:
                return app_error_1.AppError.badRequest("EXTERNAL_SERVICE_BAD_REQUEST", "Downstream rejected request", details);
            case http_1.HTTP_STATUS.UNAUTHORIZED:
                return app_error_1.AppError.unauthorized("EXTERNAL_SERVICE_UNAUTHORIZED", "Downstream returned unauthorized", details);
            case http_1.HTTP_STATUS.FORBIDDEN:
                return app_error_1.AppError.forbidden("EXTERNAL_SERVICE_FORBIDDEN", "Downstream returned forbidden", details);
            case http_1.HTTP_STATUS.NOT_FOUND:
                return app_error_1.AppError.notFound("EXTERNAL_SERVICE_NOT_FOUND", "Downstream resource not found", details);
            case http_1.HTTP_STATUS.CONFLICT:
                return app_error_1.AppError.conflict("EXTERNAL_SERVICE_CONFLICT", "Downstream returned conflict", details);
            case http_1.HTTP_STATUS.TOO_MANY_REQUESTS:
                return app_error_1.AppError.tooManyRequests("EXTERNAL_SERVICE_RATE_LIMITED", "Downstream rate limit exceeded", details);
            case http_1.HTTP_STATUS.SERVICE_UNAVAILABLE:
                return app_error_1.AppError.serviceUnavailable("EXTERNAL_SERVICE_UNAVAILABLE", "Downstream service unavailable", details);
            default:
                return app_error_1.AppError.internal("EXTERNAL_SERVICE_UNEXPECTED_STATUS", `Downstream returned unexpected status ${response.status}`, details);
        }
    }
    async parseJson(response, url) {
        try {
            return (await response.json());
        }
        catch (error) {
            throw app_error_1.AppError.internal("EXTERNAL_SERVICE_INVALID_JSON", "Failed to parse downstream response", {
                externalServiceUrl: toSafeUrlForLogs(url),
                errorMessage: error.message,
            });
        }
    }
}
exports.HttpClient = HttpClient;
//# sourceMappingURL=http.client.js.map