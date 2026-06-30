import { HTTP_STATUS } from "@shared/constants/http";
import { AppError } from "@shared/errors/app.error";
import { errorResponse } from "@shared/response/response.helper";
import { getRequestId } from "@shared/utils/request";
import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";

export function handleFastifyError(
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply
): void {
  const requestId = getRequestId(request);

  if (AppError.isAppError(error)) {
    reply
      .status(error.statusCode)
      .send(errorResponse(error.code, error.message, requestId, error.details));
    return;
  }

  if ("validation" in error && error.validation) {
    reply
      .status(HTTP_STATUS.BAD_REQUEST)
      .send(errorResponse("VALIDATION_ERROR", error.message, requestId, error.validation));
    return;
  }

  request.log.error({ err: error }, "Unhandled request error");
  reply
    .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    .send(errorResponse("INTERNAL_ERROR", "An unexpected error occurred", requestId));
}
