"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("../constants/http");
const logger_1 = require("../utils/logger");
const request_1 = require("../utils/request");
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const requestContextPlugin = async (fastify) => {
    fastify.addHook("onRequest", async (request) => {
        try {
            request.log.info({
                requestId: request.id,
                correlationId: (0, request_1.getCorrelationId)(request),
                method: request.method,
                url: request.url,
                headers: (0, logger_1.redactHeaders)(request.headers),
            }, "Incoming BFF request");
        }
        catch {
            // silent fail: telemetry must not affect API responses
        }
    });
    fastify.addHook("onSend", async (request, reply, payload) => {
        try {
            reply.header(http_1.HEADERS.REQUEST_ID, request.id);
            reply.header(http_1.HEADERS.CORRELATION_ID, (0, request_1.getCorrelationId)(request));
        }
        catch {
            // silent fail: tracing headers are non-critical telemetry
        }
        return payload;
    });
};
exports.default = (0, fastify_plugin_1.default)(requestContextPlugin);
//# sourceMappingURL=request-context.plugin.js.map