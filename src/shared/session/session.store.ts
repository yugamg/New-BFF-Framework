import { randomUUID } from "node:crypto";
import { config } from "@config/index";
import type { FastifyReply } from "fastify";

const SESSION_COOKIE_NAME = "rsg_session";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

interface SessionRecord {
  vtexCookies: string;
  expiresAt: number;
}

const sessions = new Map<string, SessionRecord>();

function pruneExpiredSessions(): void {
  const now = Date.now();

  for (const [sessionId, session] of sessions.entries()) {
    if (session.expiresAt <= now) {
      sessions.delete(sessionId);
    }
  }
}

function serializeSessionCookie(sessionId: string): string {
  const attributes = [
    `${SESSION_COOKIE_NAME}=${sessionId}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${SESSION_TTL_MS / 1000}`,
  ];

  if (config.isProduction) {
    attributes.push("Secure");
  }

  return attributes.join("; ");
}

export function createSession(vtexCookies: string): string {
  pruneExpiredSessions();

  const sessionId = randomUUID();
  sessions.set(sessionId, {
    vtexCookies,
    expiresAt: Date.now() + SESSION_TTL_MS,
  });

  return sessionId;
}

export function getSessionVtexCookies(sessionId: string): string | undefined {
  pruneExpiredSessions();
  return sessions.get(sessionId)?.vtexCookies;
}

export function setSessionCookie(reply: FastifyReply, sessionId: string): void {
  reply.header("set-cookie", serializeSessionCookie(sessionId));
}

export function clearSessionsForTests(): void {
  sessions.clear();
}
