export const metaJsonSchema = {
  type: "object",
  required: ["requestId", "timestamp"],
  properties: {
    requestId: { type: "string" },
    timestamp: { type: "string" },
  },
  additionalProperties: false,
} as const;

export const errorBodyJsonSchema = {
  type: "object",
  required: ["code", "message"],
  properties: {
    code: { type: "string" },
    message: { type: "string" },
    details: {},
  },
  additionalProperties: false,
} as const;

export function createSuccessJsonSchema(dataSchema: Record<string, unknown>) {
  return {
    type: "object",
    required: ["success", "data", "error", "meta"],
    properties: {
      success: { type: "boolean", const: true },
      data: dataSchema,
      error: { type: "null" },
      meta: metaJsonSchema,
    },
    additionalProperties: false,
  } as const;
}

export function createErrorJsonSchema(description: string, code: string, message: string) {
  return {
    description,
    type: "object",
    required: ["success", "data", "error", "meta"],
    properties: {
      success: { type: "boolean", const: false },
      data: { type: "null" },
      error: {
        ...errorBodyJsonSchema,
        properties: {
          ...errorBodyJsonSchema.properties,
          code: { type: "string", example: code },
          message: { type: "string", example: message },
        },
      },
      meta: metaJsonSchema,
    },
    additionalProperties: false,
  } as const;
}

export const badRequestJsonSchema = createErrorJsonSchema(
  "Missing or invalid request fields",
  "VALIDATION_ERROR",
  "Invalid request payload"
);

export const unauthorizedJsonSchema = createErrorJsonSchema(
  "Request lacks valid authentication",
  "UNAUTHORIZED",
  "Authentication required"
);

export const forbiddenJsonSchema = createErrorJsonSchema(
  "Request is not allowed to perform this action",
  "FORBIDDEN",
  "You do not have permission to perform this action"
);

export const notFoundJsonSchema = createErrorJsonSchema(
  "Requested route or resource was not found",
  "NOT_FOUND",
  "Route not found"
);

export const internalServerErrorJsonSchema = createErrorJsonSchema(
  "Unexpected server error",
  "INTERNAL_ERROR",
  "An unexpected error occurred"
);
