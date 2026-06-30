import { config } from "@config/index";
import { HEADERS, HTTP_METHODS } from "@shared/constants/http";
import { AppError } from "@shared/errors/app.error";
import { mapToAppError } from "@shared/errors/errorRegistry";
import { HttpClient } from "@shared/http/http.client";
import type { FastifyRequest } from "fastify";
import type {
  ClassicValidateParams,
  ClassicValidateResponse,
  StartAuthenticationParams,
  StartAuthenticationResponse,
} from "./vtex-id.types";

const VTEX_ID_PATHS = {
  AUTHENTICATION_START: "/api/vtexid/pub/authentication/start",
  CLASSIC_VALIDATE: "/api/vtexid/pub/authentication/classic/validate",
} as const;

function assertSuccessfulAuth(authStatus: string | undefined): void {
  if (!authStatus || authStatus === "Success") {
    return;
  }

  const mappedError = mapToAppError("vtexId", { code: authStatus, authStatus });

  throw mappedError ?? AppError.unauthorized("AUTH_ERROR", "Authentication failed", { authStatus });
}

export class VtexIdGateway {
  private readonly http = new HttpClient(config.vtex.baseUrl, config.vtex.timeoutMs);

  async startAuthentication(
    params: StartAuthenticationParams,
    request?: FastifyRequest
  ): Promise<{ data: StartAuthenticationResponse; cookies: string }> {
    return this.http.request<StartAuthenticationResponse>(
      this.http.buildUrl(VTEX_ID_PATHS.AUTHENTICATION_START, { scope: params.scope }),
      {
        method: HTTP_METHODS.GET,
        logContext: {
          request,
          externalService: "vtexId",
        },
      }
    );
  }

  async classicValidate(
    params: ClassicValidateParams,
    request?: FastifyRequest
  ): Promise<{ data: ClassicValidateResponse; cookies: string }> {
    const formData = new FormData();
    formData.append("login", params.login);
    formData.append("password", params.password);

    const result = await this.http.request<ClassicValidateResponse>(
      VTEX_ID_PATHS.CLASSIC_VALIDATE,
      {
        method: HTTP_METHODS.POST,
        body: formData,
        headers: params.cookies ? { [HEADERS.COOKIE]: params.cookies } : undefined,
        logContext: {
          request,
          externalService: "vtexId",
        },
      }
    );

    assertSuccessfulAuth(result.data.authStatus);
    return result;
  }
}
