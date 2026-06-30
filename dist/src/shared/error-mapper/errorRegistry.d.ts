export interface MappedError {
    statusCode: number;
    code: string;
    message: string;
}
type ServiceErrorMap = Record<string, MappedError>;
export declare function preloadErrorMappings(mappings: Record<string, ServiceErrorMap>): void;
export declare function resolveMappedError(service: string | undefined, statusCode: number, details: unknown): MappedError | undefined;
export {};
//# sourceMappingURL=errorRegistry.d.ts.map