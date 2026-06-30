"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.internalServerErrorJsonSchema = exports.notFoundJsonSchema = exports.forbiddenJsonSchema = exports.unauthorizedJsonSchema = exports.badRequestJsonSchema = exports.errorBodyJsonSchema = exports.metaJsonSchema = void 0;
exports.createSuccessJsonSchema = createSuccessJsonSchema;
exports.createErrorJsonSchema = createErrorJsonSchema;
exports.metaJsonSchema = {
    type: "object",
    required: ["requestId", "timestamp"],
    properties: {
        requestId: { type: "string" },
        timestamp: { type: "string" },
    },
    additionalProperties: false,
};
exports.errorBodyJsonSchema = {
    type: "object",
    required: ["code", "message"],
    properties: {
        code: { type: "string" },
        message: { type: "string" },
        details: {},
    },
    additionalProperties: false,
};
function createSuccessJsonSchema(dataSchema) {
    return {
        type: "object",
        required: ["success", "data", "error", "meta"],
        properties: {
            success: { type: "boolean", const: true },
            data: dataSchema,
            error: { type: "null" },
            meta: exports.metaJsonSchema,
        },
        additionalProperties: false,
    };
}
function createErrorJsonSchema(description, code, message) {
    return {
        description,
        type: "object",
        required: ["success", "data", "error", "meta"],
        properties: {
            success: { type: "boolean", const: false },
            data: { type: "null" },
            error: {
                ...exports.errorBodyJsonSchema,
                properties: {
                    ...exports.errorBodyJsonSchema.properties,
                    code: { type: "string", example: code },
                    message: { type: "string", example: message },
                },
            },
            meta: exports.metaJsonSchema,
        },
        additionalProperties: false,
    };
}
exports.badRequestJsonSchema = createErrorJsonSchema("Missing or invalid request fields", "VALIDATION_ERROR", "Invalid request payload");
exports.unauthorizedJsonSchema = createErrorJsonSchema("Request lacks valid authentication", "UNAUTHORIZED", "Authentication required");
exports.forbiddenJsonSchema = createErrorJsonSchema("Request is not allowed to perform this action", "FORBIDDEN", "You do not have permission to perform this action");
exports.notFoundJsonSchema = createErrorJsonSchema("Requested route or resource was not found", "NOT_FOUND", "Route not found");
exports.internalServerErrorJsonSchema = createErrorJsonSchema("Unexpected server error", "INTERNAL_ERROR", "An unexpected error occurred");
//# sourceMappingURL=schema.helper.js.map