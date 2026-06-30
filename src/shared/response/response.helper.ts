import type { ApiResponse } from "@shared/types";

export function successResponse<T>(data: T, requestId: string): ApiResponse<T> {
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

export function errorResponse(
  code: string,
  message: string,
  requestId: string,
  details?: unknown
): ApiResponse<null> {
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
