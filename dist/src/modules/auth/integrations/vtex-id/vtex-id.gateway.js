"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VtexIdGateway = void 0;
const index_1 = require("../../../../config/index");
const http_1 = require("../../../../shared/constants/http");
const app_error_1 = require("../../../../shared/errors/app.error");
const errorRegistry_1 = require("../../../../shared/errors/errorRegistry");
const http_client_1 = require("../../../../shared/http/http.client");
const VTEX_ID_PATHS = {
    AUTHENTICATION_START: "/api/vtexid/pub/authentication/start",
    CLASSIC_VALIDATE: "/api/vtexid/pub/authentication/classic/validate",
};
function assertSuccessfulAuth(authStatus) {
    if (!authStatus || authStatus === "Success") {
        return;
    }
    const mappedError = (0, errorRegistry_1.mapToAppError)("vtexId", { code: authStatus, authStatus });
    throw mappedError ?? app_error_1.AppError.unauthorized("AUTH_ERROR", "Authentication failed", { authStatus });
}
class VtexIdGateway {
    http = new http_client_1.HttpClient(index_1.config.vtex.baseUrl, index_1.config.vtex.timeoutMs);
    async startAuthentication(params, request) {
        return this.http.request(this.http.buildUrl(VTEX_ID_PATHS.AUTHENTICATION_START, { scope: params.scope }), {
            method: http_1.HTTP_METHODS.GET,
            logContext: {
                request,
                externalService: "vtexId",
            },
        });
    }
    async classicValidate(params, request) {
        const formData = new FormData();
        formData.append("login", params.login);
        formData.append("password", params.password);
        const result = await this.http.request(VTEX_ID_PATHS.CLASSIC_VALIDATE, {
            method: http_1.HTTP_METHODS.POST,
            body: formData,
            headers: params.cookies ? { [http_1.HEADERS.COOKIE]: params.cookies } : undefined,
            logContext: {
                request,
                externalService: "vtexId",
            },
        });
        assertSuccessfulAuth(result.data.authStatus);
        return result;
    }
}
exports.VtexIdGateway = VtexIdGateway;
//# sourceMappingURL=vtex-id.gateway.js.map