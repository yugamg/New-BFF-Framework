const SAFE_COOKIE_PAIR = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+=[^\r\n;]*$/;

function toSafeCookiePairs(cookieGroup: string): string[] {
  return cookieGroup
    .split(";")
    .map((cookie) => cookie.trim())
    .filter((cookie) => SAFE_COOKIE_PAIR.test(cookie));
}

export function mergeCookies(...cookieGroups: Array<string | undefined>): string[] {
  return cookieGroups
    .filter((cookieGroup): cookieGroup is string => Boolean(cookieGroup))
    .flatMap(toSafeCookiePairs);
}
