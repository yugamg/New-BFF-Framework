import { authRoutes } from "@modules/auth/auth.routes";
import { healthRoutes } from "@modules/health/health.routes";
import { API_PREFIX } from "@shared/constants/http";
import type { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from "fastify";

interface DomainRouteRegistration {
  name: string;
  routes: FastifyPluginAsync;
  options?: FastifyPluginOptions;
}

const domainRoutes: DomainRouteRegistration[] = [
  {
    name: "health",
    routes: healthRoutes,
  },
  {
    name: "auth",
    routes: authRoutes,
    options: { prefix: API_PREFIX },
  },
];

export async function registerDomainRoutes(fastify: FastifyInstance): Promise<void> {
  for (const domainRoute of domainRoutes) {
    fastify.log.info({ domain: domainRoute.name }, "Registering BFF domain routes");
    await fastify.register(domainRoute.routes, domainRoute.options ?? {});
  }
}
