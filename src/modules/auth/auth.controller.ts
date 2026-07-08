import { config } from "@config/index";
import { HTTP_STATUS } from "@shared/constants/http";
import { AppError } from "@shared/errors/app.error";
import { orchestrator } from "@shared/orchestrator/orchestrator";
import { OrchestratorMode } from "@shared/orchestrator/orchestrator.types";
import { successResponse } from "@shared/response/response.helper";
import { createSession, setSessionCookie } from "@shared/session/session.store";
import { mergeCookies } from "@shared/utils/cookie";
import { getRequestId, validateRequest } from "@shared/utils/request";
import type { FastifyReply, FastifyRequest } from "fastify";
import { ClassicSigninRequestSchema, SendAccessKeyLoginRequestSchema } from "./auth.schema";
import type { ClassicSigninResponse } from "./auth.types";
import { RsgVtexCoreGateway } from "./integrations/rsg-vtex-core/rsg-vtex-core.gateway";
import {
  type CheckCustomerRegStatusResponse,
  CUSTOMER_REG_STATUS,
} from "./integrations/rsg-vtex-core/rsg-vtex-core.types";
import { VtexIdGateway } from "./integrations/vtex-id/vtex-id.gateway";

export async function classicSigninHandler(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const body = validateRequest(ClassicSigninRequestSchema, request.body);
  const vtexIdGateway = new VtexIdGateway();

  const [startAuthenticationResult, classicValidateResult] = await orchestrator(
    [
      {
        name: "vtex-id.startAuthentication",
        fn: () => vtexIdGateway.startAuthentication({ scope: config.vtex.account }, request),
      },
      {
        name: "vtex-id.classicValidate",
        fn: (previousResult) =>
          vtexIdGateway.classicValidate(
            {
              login: body.username,
              password: body.password,
              cookies: previousResult?.cookies,
            },
            request
          ),
        transformationOptions: {
          transformConfigKey: "classicSigninAPI",
        },
      },
    ],
    { mode: OrchestratorMode.series },
    request
  );

  const vtexCookies = mergeCookies(
    startAuthenticationResult.cookies,
    classicValidateResult.cookies
  ).join("; ");
  const sessionId = createSession(vtexCookies);
  setSessionCookie(reply, sessionId);

  const data = classicValidateResult.data as ClassicSigninResponse;

  reply.status(HTTP_STATUS.OK).send(successResponse(data, getRequestId(request)));
}

export async function sendAccessKeyLoginHandler(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const body = validateRequest(SendAccessKeyLoginRequestSchema, request.body);
  const rsgVtexCoreGateway = new RsgVtexCoreGateway();
  const vtexIdGateway = new VtexIdGateway();

  const [, startAuthenticationResult, sendAccessKeyResult] = await orchestrator(
    [
      {
        name: "rsg-vtex-core.checkCustomerRegStatus",
        fn: async () => {
          const result = await rsgVtexCoreGateway.checkCustomerRegStatus(
            { email: body.email },
            request
          );
          const status = (result.data as CheckCustomerRegStatusResponse).data.status;

          if (status !== CUSTOMER_REG_STATUS.REG_CREATED) {
            throw AppError.unauthorized("CUSTOMER_NOT_REGISTERED", "customer not registered", {
              sapCustomerStatus: status,
            });
          }

          return result;
        },
      },
      {
        name: "vtex-id.startAuthentication",
        fn: () => vtexIdGateway.startAuthentication({ scope: config.vtex.account }, request),
      },
      {
        name: "vtex-id.sendAccessKey",
        fn: (previousResult) =>
          vtexIdGateway.sendAccessKey(
            {
              email: body.email,
              cookies: previousResult?.cookies,
            },
            request
          ),
      },
    ],
    { mode: OrchestratorMode.series },
    request
  );

  const vtexCookies = mergeCookies(
    startAuthenticationResult.cookies,
    sendAccessKeyResult.cookies
  ).join("; ");
  const sessionId = createSession(vtexCookies);
  setSessionCookie(reply, sessionId);

  reply.status(HTTP_STATUS.NO_CONTENT).send();
}
