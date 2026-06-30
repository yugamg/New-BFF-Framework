import { HTTP_METHODS } from "@shared/constants/http";
import type { FastifyInstance } from "fastify";
import { classicSigninHandler } from "./auth.controller";
import {
  badRequestJsonSchema,
  classicSignin401JsonSchema,
  classicSigninRequestJsonSchema,
  classicSigninSuccessJsonSchema,
  forbiddenJsonSchema,
  internalServerErrorJsonSchema,
  notFoundJsonSchema,
} from "./auth.schema";

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.route({
    method: HTTP_METHODS.POST,
    url: "/auth/classic-signin",
    schema: {
      description: "Authenticate a shopper with email and password via VTEX ID",
      tags: ["auth"],
      body: classicSigninRequestJsonSchema,
      response: {
        200: classicSigninSuccessJsonSchema,
        400: badRequestJsonSchema,
        401: classicSignin401JsonSchema,
        403: forbiddenJsonSchema,
        404: notFoundJsonSchema,
        500: internalServerErrorJsonSchema,
      },
    },
    attachValidation: true,
    handler: classicSigninHandler,
  });
}
