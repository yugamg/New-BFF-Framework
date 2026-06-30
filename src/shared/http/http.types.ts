import type { FastifyRequest } from "fastify";

export interface RetryConfig {
  retries: number;
  retryOn: number[];
  backoffFactor: number;
  initialDelayMs: number;
}

export interface HttpRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  timeoutMs?: number;
  retry?: Partial<RetryConfig>;
  logContext?: {
    request?: FastifyRequest;
    externalService: string;
  };
}

export interface FetchResult<T> {
  data: T;
  cookies: string;
  statusCode: number;
  headers: Headers;
}

export type HttpResponse<T> = FetchResult<T>;
