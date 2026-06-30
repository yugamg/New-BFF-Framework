import { HTTP_STATUS } from "@shared/constants/http";
import { successResponse } from "@shared/response/response.helper";
import { getRequestId } from "@shared/utils/request";
import type { FastifyInstance } from "fastify";

export async function healthRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get("/health", async (request, reply) => {
    return reply.status(HTTP_STATUS.OK).send(
      successResponse(
        {
          status: "ok",
          uptime: process.uptime(),
          timestamp: new Date().toISOString(),
          service: "rsg-bff-new",
        },
        getRequestId(request)
      )
    );
  });
}
