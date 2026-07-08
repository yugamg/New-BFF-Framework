import { config } from "@config/index";
import { HEADERS, HTTP_METHODS } from "@shared/constants/http";
import { AppError } from "@shared/errors/app.error";
import { mapToAppError } from "@shared/errors/errorRegistry";
import { HttpClient } from "@shared/http/http.client";
import type { FastifyRequest } from "fastify";
import type {
  AppTokenResponse,
  ClassicValidateParams,
  ClassicValidateResponse,
  SendAccessKeyParams,
  SendAccessKeyResponse,
  StartAuthenticationParams,
  StartAuthenticationResponse,
} from "./vtex-id.types";

const VTEX_ID_PATHS = {
  AUTHENTICATION_START: "/api/vtexid/pub/authentication/start",
  CLASSIC_VALIDATE: "/api/vtexid/pub/authentication/classic/validate",
  APP_TOKEN: "/api/vtexid/apptoken/login",
  SEND_ACCESS_KEY: "/api/vtexid/pub/authentication/accesskey/send",
} as const;

function assertSuccessfulAuth(authStatus: string | undefined): void {
  if (!authStatus || authStatus === "Success") {
    return;
  }

  const mappedError = mapToAppError("vtexId", { code: authStatus, authStatus });

  throw mappedError ?? AppError.unauthorized("AUTH_ERROR", "Authentication failed", { authStatus });
}

function rethrowWithAuthStatus(error: unknown): never {
  if (AppError.isAppError(error) && error.details) {
    const authStatus = (error.details as Record<string, unknown>).authStatus;
    if (typeof authStatus === "string") {
      assertSuccessfulAuth(authStatus);
    }
  }

  throw error;
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

  async appToken(request?: FastifyRequest): Promise<{ data: AppTokenResponse; cookies: string }> {
    return this.http.request<AppTokenResponse>(VTEX_ID_PATHS.APP_TOKEN, {
      method: HTTP_METHODS.POST,
      body: {
        appkey: config.vtex.apiAppKey,
        appToken: config.vtex.apiAppToken,
      },
      logContext: {
        request,
        externalService: "vtexId",
      },
    });
  }

  async sendAccessKey(
    params: SendAccessKeyParams,
    request?: FastifyRequest
  ): Promise<{ data: SendAccessKeyResponse; cookies: string }> {
    try {
      const result = await this.http.request<SendAccessKeyResponse>(
        this.http.buildUrl(VTEX_ID_PATHS.SEND_ACCESS_KEY, { email: params.email }),
        {
          method: HTTP_METHODS.POST,
          headers: params.cookies ? { [HEADERS.COOKIE]: params.cookies } : undefined,
          logContext: {
            request,
            externalService: "vtexId",
          },
        }
      );

      assertSuccessfulAuth(result.data.authStatus);
      return result;
    } catch (error) {
      rethrowWithAuthStatus(error);
    }
  }
}
