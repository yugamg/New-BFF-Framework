"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const index_1 = require("../../config/index");
const vtex_id_gateway_1 = require("./integrations/vtex-id/vtex-id.gateway");
class AuthService {
    vtexIdGateway;
    constructor(vtexIdGateway = new vtex_id_gateway_1.VtexIdGateway()) {
        this.vtexIdGateway = vtexIdGateway;
    }
    async startClassicSignin(request) {
        return this.vtexIdGateway.startAuthentication({
            scope: index_1.config.vtex.account,
        }, request);
    }
    async validateClassicSignin(body, cookies, request) {
        return this.vtexIdGateway.classicValidate({
            login: body.username,
            password: body.password,
            cookies,
        }, request);
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map