import { HTTP_STATUS } from "@shared/constants/http";

export class AppError extends Error {
  constructor(
    readonly statusCode: number,
    readonly code: string,
    message: string,
    readonly details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }

  static badRequest(code: string, message: string, details?: unknown): AppError {
    return new AppError(HTTP_STATUS.BAD_REQUEST, code, message, details);
  }

  static unauthorized(code: string, message: string, details?: unknown): AppError {
    return new AppError(HTTP_STATUS.UNAUTHORIZED, code, message, details);
  }

  static forbidden(code: string, message: string, details?: unknown): AppError {
    return new AppError(HTTP_STATUS.FORBIDDEN, code, message, details);
  }

  static notFound(code: string, message: string, details?: unknown): AppError {
    return new AppError(HTTP_STATUS.NOT_FOUND, code, message, details);
  }

  static conflict(code: string, message: string, details?: unknown): AppError {
    return new AppError(HTTP_STATUS.CONFLICT, code, message, details);
  }

  static tooManyRequests(code: string, message: string, details?: unknown): AppError {
    return new AppError(HTTP_STATUS.TOO_MANY_REQUESTS, code, message, details);
  }

  static serviceUnavailable(code: string, message: string, details?: unknown): AppError {
    return new AppError(HTTP_STATUS.SERVICE_UNAVAILABLE, code, message, details);
  }

  static internal(code: string, message: string, details?: unknown): AppError {
    return new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, code, message, details);
  }

  static isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
  }
}
