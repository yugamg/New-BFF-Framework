import type { ApiResponse } from "../types";
export declare function successResponse<T>(data: T, requestId: string): ApiResponse<T>;
export declare function errorResponse(code: string, message: string, requestId: string, details?: unknown): ApiResponse<null>;
//# sourceMappingURL=response.helper.d.ts.map