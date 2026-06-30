import type { FastifyRequest } from "fastify";
interface TransformUtilityInput {
    data: unknown | unknown[];
    transformConfigKey: string;
    request?: FastifyRequest;
}
export declare function transformUtility<T>({ data, transformConfigKey, request, }: TransformUtilityInput): T;
export {};
//# sourceMappingURL=transform.d.ts.map