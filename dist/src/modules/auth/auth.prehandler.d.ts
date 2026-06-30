import type { FastifyReply, FastifyRequest } from "fastify";
interface AuthPreHandlerOptions {
    publicRoute: boolean;
    permissions: Array<{
        resource: string;
        actionName: string;
    }>;
}
export declare function authPreHandler(options: AuthPreHandlerOptions): (_request: FastifyRequest, _reply: FastifyReply) => Promise<void>;
export {};
//# sourceMappingURL=auth.prehandler.d.ts.map