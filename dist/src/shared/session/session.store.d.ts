import type { FastifyReply } from "fastify";
export declare function createSession(vtexCookies: string): string;
export declare function getSessionVtexCookies(sessionId: string): string | undefined;
export declare function setSessionCookie(reply: FastifyReply, sessionId: string): void;
export declare function clearSessionsForTests(): void;
//# sourceMappingURL=session.store.d.ts.map