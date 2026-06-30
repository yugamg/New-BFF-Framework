"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classicSigninHandler = classicSigninHandler;
const index_1 = require("../../config/index");
const http_1 = require("../../shared/constants/http");
const orchestrator_1 = require("../../shared/orchestrator/orchestrator");
const orchestrator_types_1 = require("../../shared/orchestrator/orchestrator.types");
const response_helper_1 = require("../../shared/response/response.helper");
const session_store_1 = require("../../shared/session/session.store");
const cookie_1 = require("../../shared/utils/cookie");
const request_1 = require("../../shared/utils/request");
const auth_schema_1 = require("./auth.schema");
const vtex_id_gateway_1 = require("./integrations/vtex-id/vtex-id.gateway");
async function classicSigninHandler(request, reply) {
    const body = (0, request_1.validateRequest)(auth_schema_1.ClassicSigninRequestSchema, request.body);
    const vtexIdGateway = new vtex_id_gateway_1.VtexIdGateway();
    const [startAuthenticationResult, classicValidateResult] = await (0, orchestrator_1.orchestrator)([
        {
            name: "vtex-id.startAuthentication",
            fn: () => vtexIdGateway.startAuthentication({ scope: index_1.config.vtex.account }, request),
        },
        {
            name: "vtex-id.classicValidate",
            fn: (previousResult) => vtexIdGateway.classicValidate({
                login: body.username,
                password: body.password,
                cookies: previousResult?.cookies,
            }, request),
            transformationOptions: {
                transformConfigKey: "classicSigninAPI",
            },
        },
    ], { mode: orchestrator_types_1.OrchestratorMode.series }, request);
    const vtexCookies = (0, cookie_1.mergeCookies)(startAuthenticationResult.cookies, classicValidateResult.cookies).join("; ");
    const sessionId = (0, session_store_1.createSession)(vtexCookies);
    (0, session_store_1.setSessionCookie)(reply, sessionId);
    const data = classicValidateResult.data;
    reply.status(http_1.HTTP_STATUS.OK).send((0, response_helper_1.successResponse)(data, (0, request_1.getRequestId)(request)));
}
//# sourceMappingURL=auth.controller.js.map