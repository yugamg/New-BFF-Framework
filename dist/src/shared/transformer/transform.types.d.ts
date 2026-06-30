export declare enum TransformOperation {
    PARSE_ARRAY = "PARSE_ARRAY"
}
export interface TransformRule {
    from: string[];
    transformKey?: TransformOperation;
    options?: {
        postProcess?: (value: unknown) => unknown;
    };
}
export type TransformConfig = Record<string, TransformRule>;
//# sourceMappingURL=transform.types.d.ts.map