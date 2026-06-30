import type { FastifyRequest } from "fastify";
import type { ClassicSigninRequest } from "./auth.types";
import { VtexIdGateway } from "./integrations/vtex-id/vtex-id.gateway";
export declare class AuthService {
    private readonly vtexIdGateway;
    constructor(vtexIdGateway?: VtexIdGateway);
    startClassicSignin(request?: FastifyRequest): Promise<{
        data: unknown;
        cookies: string;
    }>;
    validateClassicSignin(body: ClassicSigninRequest, cookies?: string, request?: FastifyRequest): Promise<{
        data: unknown;
        cookies: string;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map