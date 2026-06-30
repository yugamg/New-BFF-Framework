import { HEADERS } from "@shared/constants/http";
import { redactHeaders } from "@shared/utils/logger";
import { getCorrelationId } from "@shared/utils/request";
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

const requestContextPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("onRequest", async (request) => {
    try {
      request.log.info(
        {
          requestId: request.id,
          correlationId: getCorrelationId(request),
          method: request.method,
          url: request.url,
          headers: redactHeaders(request.headers),
        },
        "Incoming BFF request"
      );
    } catch {
      // silent fail: telemetry must not affect API responses
    }
  });

  fastify.addHook("onSend", async (request, reply, payload) => {
    try {
      reply.header(HEADERS.REQUEST_ID, request.id);
      reply.header(HEADERS.CORRELATION_ID, getCorrelationId(request));
    } catch {
      // silent fail: tracing headers are non-critical telemetry
    }
    return payload;
  });
};

export default fp(requestContextPlugin);
