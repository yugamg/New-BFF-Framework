import { AppError } from "../errors/app.error";
export interface NormalizedError {
    statusCode: number;
    errorCode: string;
    message: string;
}
export declare function mapToAppError(service: string | undefined, details: unknown): AppError | undefined;
//# sourceMappingURL=errorRegistry.d.ts.map