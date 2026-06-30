import type { FastifyRequest } from "fastify";

const SENSITIVE_HEADERS = new Set([
  "authorization",
  "cookie",
  "set-cookie",
  "x-vtex-api-appkey",
  "x-vtex-api-apptoken",
]);

export function redactHeaders(headers: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [
      key,
      SENSITIVE_HEADERS.has(key.toLowerCase()) ? "[REDACTED]" : value,
    ])
  );
}

export function requestLoggerWithTimestamp(
  entry: Record<string, unknown>,
  request?: FastifyRequest
): void {
  request?.log.info(
    {
      timestamp: new Date().toISOString(),
      ...entry,
    },
    "BFF pipeline event"
  );
}
