import type { FastifyRequest } from "fastify";
import { VtexIdGateway } from "../integrations/vtex-id/vtex-id.gateway";

const CACHE_TTL_BUFFER_SECONDS = 60;

interface CachedAppToken {
  token: string;
  expiresAt: number;
}

let cachedAppToken: CachedAppToken | undefined;

export function clearVtexAppTokenCacheForTests(): void {
  cachedAppToken = undefined;
}

export async function getVtexAppToken(request?: FastifyRequest): Promise<string> {
  const nowSeconds = Math.floor(Date.now() / 1000);

  if (cachedAppToken && cachedAppToken.expiresAt > nowSeconds) {
    return cachedAppToken.token;
  }

  const vtexIdGateway = new VtexIdGateway();
  const { data } = await vtexIdGateway.appToken(request);
  const expiresAt = data.expires - CACHE_TTL_BUFFER_SECONDS;

  if (expiresAt > nowSeconds) {
    cachedAppToken = {
      token: data.token,
      expiresAt,
    };
  }

  return data.token;
}
