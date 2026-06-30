import type { FastifyRequest } from "fastify";
import type { ClassicValidateParams, ClassicValidateResponse, StartAuthenticationParams, StartAuthenticationResponse } from "./vtex-id.types";
export declare class VtexIdGateway {
    private readonly http;
    startAuthentication(params: StartAuthenticationParams, request?: FastifyRequest): Promise<{
        data: StartAuthenticationResponse;
        cookies: string;
    }>;
    classicValidate(params: ClassicValidateParams, request?: FastifyRequest): Promise<{
        data: ClassicValidateResponse;
        cookies: string;
    }>;
}
//# sourceMappingURL=vtex-id.gateway.d.ts.map