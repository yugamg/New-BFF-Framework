export const HTTP_STATUS = {
  OK: 200,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
} as const;

export const HEADERS = {
  REQUEST_ID: "x-request-id",
  CORRELATION_ID: "x-correlation-id",
  CONTENT_TYPE: "content-type",
  COOKIE: "cookie",
  SET_COOKIE: "set-cookie",
} as const;

export const API_PREFIX = "/api/v1";
