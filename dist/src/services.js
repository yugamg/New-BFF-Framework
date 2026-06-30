"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrapServices = bootstrapServices;
const schema_helper_1 = require("./shared/schema/schema.helper");
async function bootstrapServices(fastify) {
    fastify.addSchema({ $id: "common400ResponseSchema", ...schema_helper_1.badRequestJsonSchema });
    fastify.addSchema({ $id: "common500ResponseSchema", ...schema_helper_1.internalServerErrorJsonSchema });
}
//# sourceMappingURL=services.js.map