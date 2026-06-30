"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildServer = buildServer;
const index_1 = require("./src/config/index");
const cors_1 = __importDefault(require("@fastify/cors"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const routes_1 = require("./src/modules/routes");
const http_1 = require("./src/shared/constants/http");
const app_error_1 = require("./src/shared/errors/app.error");
const error_handler_1 = require("./src/shared/errors/error.handler");
const request_context_plugin_1 = __importDefault(require("./src/shared/plugins/request-context.plugin"));
const response_helper_1 = require("./src/shared/response/response.helper");
const schema_helper_1 = require("./src/shared/schema/schema.helper");
const request_1 = require("./src/shared/utils/request");
const fastify_1 = __importDefault(require("fastify"));
async function buildServer() {
    const fastify = (0, fastify_1.default)({
        logger: {
            level: index_1.config.logLevel,
            ...(index_1.config.logPretty
                ? {
                    transport: {
                        target: "pino-pretty",
                        options: {
                            colorize: true,
                            translateTime: "SYS:standard",
                            ignore: "pid,hostname",
                        },
                    },
                }
                : {}),
        },
        genReqId: (req) => req.headers[http_1.HEADERS.REQUEST_ID] ??
            `req-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        schemaErrorFormatter: (errors) => app_error_1.AppError.badRequest("VALIDATION_ERROR", "Invalid request payload", errors),
        trustProxy: true,
    });
    await fastify.register(cors_1.default, {
        origin: index_1.config.frontendOrigin,
        credentials: true,
    });
    await fastify.register(request_context_plugin_1.default);
    if (!index_1.config.isProduction) {
        await fastify.register(swagger_1.default, {
            openapi: {
                info: {
                    title: "RSG BFF New API",
                    description: "Pilot RSG Backend For Frontend framework",
                    version: "0.1.0",
                },
            },
        });
        await fastify.register(swagger_ui_1.default, {
            routePrefix: "/docs",
            uiConfig: {
                docExpansion: "list",
                deepLinking: true,
            },
        });
    }
    fastify.setErrorHandler(error_handler_1.handleFastifyError);
    fastify.addSchema({ $id: "common400ResponseSchema", ...schema_helper_1.badRequestJsonSchema });
    fastify.addSchema({ $id: "common500ResponseSchema", ...schema_helper_1.internalServerErrorJsonSchema });
    await (0, routes_1.registerDomainRoutes)(fastify);
    fastify.setNotFoundHandler(async (request, reply) => {
        return reply
            .status(http_1.HTTP_STATUS.NOT_FOUND)
            .send((0, response_helper_1.errorResponse)("NOT_FOUND", `Route ${request.method} ${request.url} not found`, (0, request_1.getRequestId)(request)));
    });
    return fastify;
}
async function start() {
    const server = await buildServer();
    await server.listen({
        port: index_1.config.port,
        host: "127.0.0.1",
        listenTextResolver: (address) => `RSG BFF New listening at ${address}`,
    });
}
if (require.main === module) {
    start().catch((error) => {
        // Startup failures happen before request logging exists.
        process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
        process.exit(1);
    });
}
//# sourceMappingURL=server.js.map