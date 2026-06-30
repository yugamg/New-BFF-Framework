import { HEADERS, HTTP_STATUS } from "@shared/constants/http";
import { AppError } from "@shared/errors/app.error";
import { mapToAppError } from "@shared/errors/errorRegistry";
import type { HttpRequestOptions, HttpResponse, RetryConfig } from "@shared/http/http.types";
import { redactHeaders, requestLoggerWithTimestamp } from "@shared/utils/logger";
import { getCorrelationId, getRequestId } from "@shared/utils/request";

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  retries: 2,
  retryOn: [429, 500, 502, 503, 504],
  backoffFactor: 2,
  initialDelayMs: 200,
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractResponseCookies(response: Response): string {
  const setCookies =
    (response.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie?.() ??
    response.headers
      .get(HEADERS.SET_COOKIE)
      ?.split(/,(?=\s*[\w-]+=)/)
      .map((cookie) => cookie.trim()) ??
    [];

  return setCookies
    .map((cookie) => cookie.split(";")[0].trim())
    .filter(Boolean)
    .join("; ");
}

function toSafeUrlForLogs(url: string): string {
  try {
    const parsedUrl = new URL(url);
    return `${parsedUrl.origin}${parsedUrl.pathname}`;
  } catch {
    return url;
  }
}

export class HttpClient {
  constructor(
    private readonly baseUrl: string,
    private readonly defaultTimeoutMs: number
  ) {}

  async request<T>(path: string, options: HttpRequestOptions = {}): Promise<HttpResponse<T>> {
    const url = path.startsWith("http") ? path : `${this.baseUrl}${path}`;
    const retry = { ...DEFAULT_RETRY_CONFIG, ...options.retry };
    let attempt = 0;

    while (attempt <= retry.retries) {
      requestLoggerWithTimestamp(
        {
          externalService: options.logContext?.externalService,
          externalServiceUrl: toSafeUrlForLogs(url),
          method: options.method ?? "GET",
          attempt: attempt + 1,
          event: "external-request-started",
        },
        options.logContext?.request
      );

      const response = await this.execute(url, options);

      if (response.ok) {
        requestLoggerWithTimestamp(
          {
            externalService: options.logContext?.externalService,
            externalServiceUrl: toSafeUrlForLogs(url),
            method: options.method ?? "GET",
            statusCode: response.status,
            event: "external-response-received",
          },
          options.logContext?.request
        );

        return {
          data: await this.parseJson<T>(response, url),
          cookies: extractResponseCookies(response),
          statusCode: response.status,
          headers: response.headers,
        };
      }

      if (!retry.retryOn.includes(response.status) || attempt >= retry.retries) {
        requestLoggerWithTimestamp(
          {
            externalService: options.logContext?.externalService,
            externalServiceUrl: toSafeUrlForLogs(url),
            method: options.method ?? "GET",
            statusCode: response.status,
            event: "external-response-failed",
          },
          options.logContext?.request
        );
        throw await this.mapError(response, options.logContext?.externalService);
      }

      attempt += 1;
      requestLoggerWithTimestamp(
        {
          externalService: options.logContext?.externalService,
          externalServiceUrl: toSafeUrlForLogs(url),
          method: options.method ?? "GET",
          statusCode: response.status,
          nextAttempt: attempt + 1,
          event: "external-request-retrying",
        },
        options.logContext?.request
      );
      await delay(retry.initialDelayMs * retry.backoffFactor ** attempt);
    }

    throw AppError.serviceUnavailable("SERVICE_UNAVAILABLE", `Failed calling ${url}`);
  }

  buildUrl(path: string, queryParams?: Record<string, string | undefined>): string {
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

  private async execute(url: string, options: HttpRequestOptions): Promise<Response> {
    const {
      body,
      timeoutMs = this.defaultTimeoutMs,
      headers,
      retry: _retry,
      logContext,
      ...rest
    } = options;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const outgoingHeaders: Record<string, string> = {
      ...(!(body instanceof FormData) && { [HEADERS.CONTENT_TYPE]: "application/json" }),
      ...(headers as Record<string, string> | undefined),
    };

    if (logContext?.request) {
      outgoingHeaders[HEADERS.REQUEST_ID] = getRequestId(logContext.request);
      outgoingHeaders[HEADERS.CORRELATION_ID] = getCorrelationId(logContext.request);
    }

    try {
      return await fetch(url, {
        ...rest,
        headers: outgoingHeaders,
        body:
          body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (error) {
      const message =
        (error as Error).name === "AbortError"
          ? `Request to ${url} timed out after ${timeoutMs}ms`
          : `Network error calling ${url}: ${(error as Error).message}`;
      requestLoggerWithTimestamp(
        {
          externalService: logContext?.externalService,
          externalServiceUrl: toSafeUrlForLogs(url),
          method: rest.method ?? "GET",
          headers: redactHeaders(outgoingHeaders),
          event: "external-request-error",
          errorMessage: (error as Error).message,
        },
        logContext?.request
      );
      throw AppError.serviceUnavailable("SERVICE_UNAVAILABLE", message);
    } finally {
      clearTimeout(timer);
    }
  }

  private async mapError(response: Response, externalService?: string): Promise<AppError> {
    let details: unknown;

    try {
      details = await response.json();
    } catch {
      details = undefined;
    }

    const mappedError = mapToAppError(externalService, details);

    if (mappedError) {
      return mappedError;
    }

    switch (response.status) {
      case HTTP_STATUS.BAD_REQUEST:
        return AppError.badRequest(
          "EXTERNAL_SERVICE_BAD_REQUEST",
          "Downstream rejected request",
          details
        );
      case HTTP_STATUS.UNAUTHORIZED:
        return AppError.unauthorized(
          "EXTERNAL_SERVICE_UNAUTHORIZED",
          "Downstream returned unauthorized",
          details
        );
      case HTTP_STATUS.FORBIDDEN:
        return AppError.forbidden(
          "EXTERNAL_SERVICE_FORBIDDEN",
          "Downstream returned forbidden",
          details
        );
      case HTTP_STATUS.NOT_FOUND:
        return AppError.notFound(
          "EXTERNAL_SERVICE_NOT_FOUND",
          "Downstream resource not found",
          details
        );
      case HTTP_STATUS.CONFLICT:
        return AppError.conflict(
          "EXTERNAL_SERVICE_CONFLICT",
          "Downstream returned conflict",
          details
        );
      case HTTP_STATUS.TOO_MANY_REQUESTS:
        return AppError.tooManyRequests(
          "EXTERNAL_SERVICE_RATE_LIMITED",
          "Downstream rate limit exceeded",
          details
        );
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        return AppError.serviceUnavailable(
          "EXTERNAL_SERVICE_UNAVAILABLE",
          "Downstream service unavailable",
          details
        );
      default:
        return AppError.internal(
          "EXTERNAL_SERVICE_UNEXPECTED_STATUS",
          `Downstream returned unexpected status ${response.status}`,
          details
        );
    }
  }

  private async parseJson<T>(response: Response, url: string): Promise<T> {
    try {
      return (await response.json()) as T;
    } catch (error) {
      throw AppError.internal(
        "EXTERNAL_SERVICE_INVALID_JSON",
        "Failed to parse downstream response",
        {
          externalServiceUrl: toSafeUrlForLogs(url),
          errorMessage: (error as Error).message,
        }
      );
    }
  }
}
