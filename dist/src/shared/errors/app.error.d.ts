export declare class AppError extends Error {
    readonly statusCode: number;
    readonly code: string;
    readonly details?: unknown | undefined;
    constructor(statusCode: number, code: string, message: string, details?: unknown | undefined);
    static badRequest(code: string, message: string, details?: unknown): AppError;
    static unauthorized(code: string, message: string, details?: unknown): AppError;
    static forbidden(code: string, message: string, details?: unknown): AppError;
    static notFound(code: string, message: string, details?: unknown): AppError;
    static conflict(code: string, message: string, details?: unknown): AppError;
    static tooManyRequests(code: string, message: string, details?: unknown): AppError;
    static serviceUnavailable(code: string, message: string, details?: unknown): AppError;
    static internal(code: string, message: string, details?: unknown): AppError;
    static isAppError(error: unknown): error is AppError;
}
//# sourceMappingURL=app.error.d.ts.map