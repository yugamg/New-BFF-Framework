"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const http_1 = require("../../shared/constants/http");
const auth_controller_1 = require("./auth.controller");
const auth_schema_1 = require("./auth.schema");
async function authRoutes(fastify) {
    fastify.route({
        method: http_1.HTTP_METHODS.POST,
        url: "/auth/classic-signin",
        schema: {
            description: "Authenticate a shopper with email and password via VTEX ID",
            tags: ["auth"],
            body: auth_schema_1.classicSigninRequestJsonSchema,
            response: {
                200: auth_schema_1.classicSigninSuccessJsonSchema,
                400: auth_schema_1.badRequestJsonSchema,
                401: auth_schema_1.classicSignin401JsonSchema,
                403: auth_schema_1.forbiddenJsonSchema,
                404: auth_schema_1.notFoundJsonSchema,
                500: auth_schema_1.internalServerErrorJsonSchema,
            },
        },
        attachValidation: true,
        handler: auth_controller_1.classicSigninHandler,
    });
}
//# sourceMappingURL=auth.routes.js.map