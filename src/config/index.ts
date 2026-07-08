import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().int().positive().default(8080),
  LOG_LEVEL: z.string().default("info"),
  LOG_PRETTY: z.coerce.boolean().default(false),
  FRONTEND_ORIGIN: z.string().default("http://localhost:3000"),
  VTEX_ACCOUNT: z.string().default("cashmerehlc"),
  VTEX_BASE_URL: z.string().url().default("https://cashmerehlc.vtexcommercestable.com.br"),
  VTEX_TIMEOUT_MS: z.coerce.number().int().positive().default(60000),
  VTEX_API_APP_KEY: z.string().default(""),
  VTEX_API_APP_TOKEN: z.string().default(""),
  RSG_VTEX_CORE_BASE_URL: z.string().url().default("http://localhost:8081"),
  RSG_VTEX_CORE_TIMEOUT_MS: z.coerce.number().int().positive().default(60000),
});

const env = EnvSchema.parse(process.env);

export const config = {
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
    apiAppKey: env.VTEX_API_APP_KEY,
    apiAppToken: env.VTEX_API_APP_TOKEN,
  },
  rsgVtexCore: {
    baseUrl: env.RSG_VTEX_CORE_BASE_URL,
    timeoutMs: env.RSG_VTEX_CORE_TIMEOUT_MS,
  },
} as const;
