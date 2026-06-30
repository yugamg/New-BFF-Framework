import type { TransformOperation } from "../../transformer/transform.types";
export interface TransformRule {
    from: string[];
    transformKey?: TransformOperation;
    options?: {
        postProcess?: (value: unknown) => unknown;
    };
}
export type TransformConfig = Record<string, TransformRule>;
//# sourceMappingURL=transformationConfig.types.d.ts.map