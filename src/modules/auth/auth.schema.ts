import {
  badRequestJsonSchema,
  createErrorJsonSchema,
  createSuccessJsonSchema,
  forbiddenJsonSchema,
  internalServerErrorJsonSchema,
  notFoundJsonSchema,
  unauthorizedJsonSchema,
} from "@shared/schema/schema.helper";
import { z } from "zod";

export const ClassicSigninRequestSchema = z
  .object({
    username: z.string({ required_error: "username is required" }).trim().min(1),
    password: z.string({ required_error: "password is required" }).min(1),
  })
  .strict();

export const classicSigninRequestJsonSchema = {
  type: "object",
  required: ["username", "password"],
  properties: {
    username: { type: "string" },
    password: { type: "string" },
  },
  additionalProperties: false,
} as const;

export const classicSigninResponseJsonSchema = {
  type: "object",
  required: ["authStatus"],
  properties: {
    authStatus: { type: "string" },
  },
  additionalProperties: false,
} as const;

export const classicSigninSuccessJsonSchema = createSuccessJsonSchema(
  classicSigninResponseJsonSchema
);

export const classicSignin401JsonSchema = createErrorJsonSchema(
  "Invalid shopper credentials or authentication failure",
  "AUTH_INVALID_CREDENTIALS",
  "Invalid email or password"
);

export {
  badRequestJsonSchema,
  forbiddenJsonSchema,
  internalServerErrorJsonSchema,
  notFoundJsonSchema,
  unauthorizedJsonSchema,
};
