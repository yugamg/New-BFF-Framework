"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unauthorizedJsonSchema = exports.notFoundJsonSchema = exports.internalServerErrorJsonSchema = exports.forbiddenJsonSchema = exports.badRequestJsonSchema = exports.classicSignin401JsonSchema = exports.classicSigninSuccessJsonSchema = exports.classicSigninResponseJsonSchema = exports.classicSigninRequestJsonSchema = exports.ClassicSigninRequestSchema = void 0;
const schema_helper_1 = require("../../shared/schema/schema.helper");
Object.defineProperty(exports, "badRequestJsonSchema", { enumerable: true, get: function () { return schema_helper_1.badRequestJsonSchema; } });
Object.defineProperty(exports, "forbiddenJsonSchema", { enumerable: true, get: function () { return schema_helper_1.forbiddenJsonSchema; } });
Object.defineProperty(exports, "internalServerErrorJsonSchema", { enumerable: true, get: function () { return schema_helper_1.internalServerErrorJsonSchema; } });
Object.defineProperty(exports, "notFoundJsonSchema", { enumerable: true, get: function () { return schema_helper_1.notFoundJsonSchema; } });
Object.defineProperty(exports, "unauthorizedJsonSchema", { enumerable: true, get: function () { return schema_helper_1.unauthorizedJsonSchema; } });
const zod_1 = require("zod");
exports.ClassicSigninRequestSchema = zod_1.z
    .object({
    username: zod_1.z.string({ required_error: "username is required" }).trim().min(1),
    password: zod_1.z.string({ required_error: "password is required" }).min(1),
})
    .strict();
exports.classicSigninRequestJsonSchema = {
    type: "object",
    required: ["username", "password"],
    properties: {
        username: { type: "string" },
        password: { type: "string" },
    },
    additionalProperties: false,
};
exports.classicSigninResponseJsonSchema = {
    type: "object",
    required: ["authStatus"],
    properties: {
        authStatus: { type: "string" },
    },
    additionalProperties: false,
};
exports.classicSigninSuccessJsonSchema = (0, schema_helper_1.createSuccessJsonSchema)(exports.classicSigninResponseJsonSchema);
exports.classicSignin401JsonSchema = (0, schema_helper_1.createErrorJsonSchema)("Invalid shopper credentials or authentication failure", "AUTH_INVALID_CREDENTIALS", "Invalid email or password");
//# sourceMappingURL=auth.schema.js.map