import type { FastifyRequest } from "fastify";
import type { z } from "zod";
export declare function getRequestId(request: FastifyRequest): string;
export declare function getCorrelationId(request: FastifyRequest): string;
export declare function validateRequest<TSchema extends z.ZodTypeAny>(schema: TSchema, value: unknown): z.infer<TSchema>;
//# sourceMappingURL=request.d.ts.map