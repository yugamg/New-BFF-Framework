"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeCookies = mergeCookies;
const SAFE_COOKIE_PAIR = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+=[^\r\n;]*$/;
function toSafeCookiePairs(cookieGroup) {
    return cookieGroup
        .split(";")
        .map((cookie) => cookie.trim())
        .filter((cookie) => SAFE_COOKIE_PAIR.test(cookie));
}
function mergeCookies(...cookieGroups) {
    return cookieGroups
        .filter((cookieGroup) => Boolean(cookieGroup))
        .flatMap(toSafeCookiePairs);
}
//# sourceMappingURL=cookie.js.map