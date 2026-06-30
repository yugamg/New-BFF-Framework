import { config } from "@config/index";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { registerDomainRoutes } from "@modules/routes";
import { HEADERS, HTTP_STATUS } from "@shared/constants/http";
import { AppError } from "@shared/errors/app.error";
import { handleFastifyError } from "@shared/errors/error.handler";
import requestContextPlugin from "@shared/plugins/request-context.plugin";
import { errorResponse } from "@shared/response/response.helper";
import { badRequestJsonSchema, internalServerErrorJsonSchema } from "@shared/schema/schema.helper";
import { getRequestId } from "@shared/utils/request";
import Fastify, { type FastifyInstance } from "fastify";

export async function buildServer(): Promise<FastifyInstance> {
  const fastify = Fastify({
    logger: {
      level: config.logLevel,
      ...(config.logPretty
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
    genReqId: (req) =>
      (req.headers[HEADERS.REQUEST_ID] as string | undefined) ??
      `req-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    schemaErrorFormatter: (errors) =>
      AppError.badRequest("VALIDATION_ERROR", "Invalid request payload", errors),
    trustProxy: true,
  });

  await fastify.register(cors, {
    origin: config.frontendOrigin,
    credentials: true,
  });
  await fastify.register(requestContextPlugin);

  if (!config.isProduction) {
    await fastify.register(swagger, {
      openapi: {
        info: {
          title: "RSG BFF New API",
          description: "Pilot RSG Backend For Frontend framework",
          version: "0.1.0",
        },
      },
    });
    await fastify.register(swaggerUi, {
      routePrefix: "/docs",
      uiConfig: {
        docExpansion: "list",
        deepLinking: true,
      },
    });
  }

  fastify.setErrorHandler(handleFastifyError);

  fastify.addSchema({ $id: "common400ResponseSchema", ...badRequestJsonSchema });
  fastify.addSchema({ $id: "common500ResponseSchema", ...internalServerErrorJsonSchema });
  await registerDomainRoutes(fastify);

  fastify.setNotFoundHandler(async (request, reply) => {
    return reply
      .status(HTTP_STATUS.NOT_FOUND)
      .send(
        errorResponse(
          "NOT_FOUND",
          `Route ${request.method} ${request.url} not found`,
          getRequestId(request)
        )
      );
  });

  return fastify;
}

async function start(): Promise<void> {
  const server = await buildServer();
  await server.listen({
    port: config.port,
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
