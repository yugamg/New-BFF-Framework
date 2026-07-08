import { config } from "@config/index";
import { HEADERS, HTTP_METHODS } from "@shared/constants/http";
import { HttpClient } from "@shared/http/http.client";
import type { FastifyRequest } from "fastify";
import { getVtexAppToken } from "../../utils/vtexAppToken";
import type {
  CheckCustomerRegStatusParams,
  CheckCustomerRegStatusResponse,
} from "./rsg-vtex-core.types";

const RSG_VTEX_CORE_PATHS = {
  CUSTOMER_REG_STATUS: "/customer/status",
} as const;

export class RsgVtexCoreGateway {
  private readonly http = new HttpClient(config.rsgVtexCore.baseUrl, config.rsgVtexCore.timeoutMs);

  async checkCustomerRegStatus(
    params: CheckCustomerRegStatusParams,
    request?: FastifyRequest
  ): Promise<{ data: CheckCustomerRegStatusResponse; cookies: string }> {
    const token = params.token ?? (await getVtexAppToken(request));

    return this.http.request<CheckCustomerRegStatusResponse>(
      this.http.buildUrl(RSG_VTEX_CORE_PATHS.CUSTOMER_REG_STATUS),
      {
        method: HTTP_METHODS.GET,
        headers: {
          [HEADERS.VTEX_ID_CLIENT_AUTH_COOKIE]: token,
          [HEADERS.X_CUSTOMER_EMAIL]: params.email,
        },
        logContext: {
          request,
          externalService: "rsgVtexCore",
        },
      }
    );
  }
}
