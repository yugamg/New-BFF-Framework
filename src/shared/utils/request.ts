import { HEADERS } from "@shared/constants/http";
import { AppError } from "@shared/errors/app.error";
import type { FastifyRequest } from "fastify";
import type { z } from "zod";

export function getRequestId(request: FastifyRequest): string {
  return request.id;
}

export function getCorrelationId(request: FastifyRequest): string {
  return (request.headers[HEADERS.CORRELATION_ID] as string | undefined) ?? request.id;
}

export function validateRequest<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  value: unknown
): z.infer<TSchema> {
  const result = schema.safeParse(value);

  if (!result.success) {
    throw AppError.badRequest(
      "VALIDATION_ERROR",
      "Invalid request payload",
      result.error.flatten()
    );
  }

  return result.data;
}
