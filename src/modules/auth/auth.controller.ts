import { config } from "@config/index";
import { HTTP_STATUS } from "@shared/constants/http";
import { orchestrator } from "@shared/orchestrator/orchestrator";
import { OrchestratorMode } from "@shared/orchestrator/orchestrator.types";
import { successResponse } from "@shared/response/response.helper";
import { createSession, setSessionCookie } from "@shared/session/session.store";
import { mergeCookies } from "@shared/utils/cookie";
import { getRequestId, validateRequest } from "@shared/utils/request";
import type { FastifyReply, FastifyRequest } from "fastify";
import { ClassicSigninRequestSchema } from "./auth.schema";
import type { ClassicSigninResponse } from "./auth.types";
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
