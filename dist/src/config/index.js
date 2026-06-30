"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const zod_1 = require("zod");
const EnvSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.string().default("development"),
    PORT: zod_1.z.coerce.number().int().positive().default(8080),
    LOG_LEVEL: zod_1.z.string().default("info"),
    LOG_PRETTY: zod_1.z.coerce.boolean().default(false),
    FRONTEND_ORIGIN: zod_1.z.string().default("http://localhost:3000"),
    VTEX_ACCOUNT: zod_1.z.string().default("cashmerehlc"),
    VTEX_BASE_URL: zod_1.z.string().url().default("https://cashmerehlc.vtexcommercestable.com.br"),
    VTEX_TIMEOUT_MS: zod_1.z.coerce.number().int().positive().default(60000),
});
const env = EnvSchema.parse(process.env);
exports.config = {
    env: env.NODE_ENV,
    isProduction: env.NODE_ENV === "production",
    port: env.PORT,
    logLevel: env.LOG_LEVEL,
    logPretty: env.LOG_PRETTY,
    frontendOrigin: env.FRONTEND_ORIGIN,
    vtex: {
        account: env.VTEX_ACCOUNT,
        baseUrl: env.VTEX_BASE_URL,
        timeoutMs: env.VTEX_TIMEOUT_MS,
    },
};
//# sourceMappingURL=index.js.map