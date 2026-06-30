"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDomainRoutes = registerDomainRoutes;
const auth_routes_1 = require("./auth/auth.routes");
const health_routes_1 = require("./health/health.routes");
const http_1 = require("../shared/constants/http");
const domainRoutes = [
    {
        name: "health",
        routes: health_routes_1.healthRoutes,
    },
    {
        name: "auth",
        routes: auth_routes_1.authRoutes,
        options: { prefix: http_1.API_PREFIX },
    },
];
async function registerDomainRoutes(fastify) {
    for (const domainRoute of domainRoutes) {
        fastify.log.info({ domain: domainRoute.name }, "Registering BFF domain routes");
        await fastify.register(domainRoute.routes, domainRoute.options ?? {});
    }
}
//# sourceMappingURL=routes.js.map