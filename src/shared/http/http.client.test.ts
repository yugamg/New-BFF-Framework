import { afterEach, describe, expect, it, vi } from "vitest";
import { HttpClient } from "./http.client";

describe("HttpClient", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("builds URLs with only defined query parameters", () => {
    const client = new HttpClient("https://example.com", 1000);

    expect(client.buildUrl("/path", { a: "1", b: undefined })).toBe("https://example.com/path?a=1");
  });

  it("maps downstream status codes to typed AppError instances", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ reason: "missing" }), { status: 404 })
    );

    const client = new HttpClient("https://example.com", 1000);

    await expect(client.request("/missing")).rejects.toMatchObject({
      statusCode: 404,
      code: "EXTERNAL_SERVICE_NOT_FOUND",
      message: "Downstream resource not found",
    });
  });

  it("uses error registry mappings when external service context is provided", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "WrongCredentials" }), { status: 400 })
    );

    const client = new HttpClient("https://example.com", 1000);

    await expect(
      client.request("/products/1", {
        logContext: {
          externalService: "vtexId",
        },
      })
    ).rejects.toMatchObject({
      statusCode: 401,
      code: "AUTH_INVALID_CREDENTIALS",
      message: "Invalid email or password",
    });
  });
});
