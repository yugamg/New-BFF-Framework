"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSession = createSession;
exports.getSessionVtexCookies = getSessionVtexCookies;
exports.setSessionCookie = setSessionCookie;
exports.clearSessionsForTests = clearSessionsForTests;
const node_crypto_1 = require("node:crypto");
const index_1 = require("../../config/index");
const SESSION_COOKIE_NAME = "rsg_session";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
const sessions = new Map();
function pruneExpiredSessions() {
    const now = Date.now();
    for (const [sessionId, session] of sessions.entries()) {
        if (session.expiresAt <= now) {
            sessions.delete(sessionId);
        }
    }
}
function serializeSessionCookie(sessionId) {
    const attributes = [
        `${SESSION_COOKIE_NAME}=${sessionId}`,
        "Path=/",
        "HttpOnly",
        "SameSite=Strict",
        `Max-Age=${SESSION_TTL_MS / 1000}`,
    ];
    if (index_1.config.isProduction) {
        attributes.push("Secure");
    }
    return attributes.join("; ");
}
function createSession(vtexCookies) {
    pruneExpiredSessions();
    const sessionId = (0, node_crypto_1.randomUUID)();
    sessions.set(sessionId, {
        vtexCookies,
        expiresAt: Date.now() + SESSION_TTL_MS,
    });
    return sessionId;
}
function getSessionVtexCookies(sessionId) {
    pruneExpiredSessions();
    return sessions.get(sessionId)?.vtexCookies;
}
function setSessionCookie(reply, sessionId) {
    reply.header("set-cookie", serializeSessionCookie(sessionId));
}
function clearSessionsForTests() {
    sessions.clear();
}
//# sourceMappingURL=session.store.js.map