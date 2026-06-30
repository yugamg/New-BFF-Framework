import type { FastifyReply, FastifyRequest } from "fastify";
import type { PermissionCheck } from "./permission.types";
interface PermissionPreHandlerOptions {
    permissions: PermissionCheck[];
    publicRoute?: boolean;
}
export declare function checkPermissionPreHandler(options: PermissionPreHandlerOptions): (_request: FastifyRequest, _reply: FastifyReply) => Promise<void>;
export {};
//# sourceMappingURL=permission.prehandler.d.ts.map