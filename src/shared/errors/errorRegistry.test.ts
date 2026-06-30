import { describe, expect, it } from "vitest";
import { mapToAppError } from "./errorRegistry";

describe("errorRegistry", () => {
  it("normalizes known downstream errors into AppError", () => {
    expect(mapToAppError("vtexId", { code: "WrongCredentials" })).toMatchObject({
      statusCode: 401,
      code: "AUTH_INVALID_CREDENTIALS",
      message: "Invalid email or password",
    });
  });

  it("supports common downstream error fields", () => {
    expect(mapToAppError("vtexId", { error: "BlockedUser" })).toMatchObject({
      statusCode: 403,
      code: "AUTH_ACCOUNT_LOCKED",
    });
  });

  it("returns undefined when no mapping exists", () => {
    expect(mapToAppError("vtexId", { code: "UNKNOWN" })).toBeUndefined();
  });
});
