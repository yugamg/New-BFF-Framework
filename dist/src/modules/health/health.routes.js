"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRoutes = healthRoutes;
const http_1 = require("../../shared/constants/http");
const response_helper_1 = require("../../shared/response/response.helper");
const request_1 = require("../../shared/utils/request");
async function healthRoutes(fastify) {
    fastify.get("/health", async (request, reply) => {
        return reply.status(http_1.HTTP_STATUS.OK).send((0, response_helper_1.successResponse)({
            status: "ok",
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            service: "rsg-bff-new",
        }, (0, request_1.getRequestId)(request)));
    });
}
//# sourceMappingURL=health.routes.js.map