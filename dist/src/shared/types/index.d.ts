import type { FastifyReply, FastifyRequest } from "fastify";
declare module "fastify" {
    interface FastifySchema {
        description?: string;
        summary?: string;
        tags?: readonly string[];
    }
}
export interface ResponseMeta {
    requestId: string;
    timestamp: string;
}
export interface ApiErrorBody {
    code: string;
    message: string;
    details?: unknown;
}
export interface ApiResponse<T = unknown> {
    success: boolean;
    data: T | null;
    error: ApiErrorBody | null;
    meta: ResponseMeta;
}
export type AppRequest<Body = unknown, Params = unknown, Query = unknown> = FastifyRequest<{
    Body: Body;
    Params: Params;
    Querystring: Query;
}>;
export type AppReply = FastifyReply;
//# sourceMappingURL=index.d.ts.map