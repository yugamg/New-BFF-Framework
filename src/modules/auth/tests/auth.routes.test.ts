import { afterEach, describe, expect, it, vi } from "vitest";
import { buildServer } from "../../../../server";
import { clearSessionsForTests } from "../../../shared/session/session.store";

describe("auth routes", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    clearSessionsForTests();
  });

  it("classic sign-in orchestrates VTEX ID calls and returns transformed response", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ authenticationToken: "token" }), {
          status: 200,
          headers: {
            "set-cookie": "VtexIdclientAutCookie_start=start-token; Path=/; HttpOnly",
          },
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ authStatus: "Success", ignored: true }), {
          status: 200,
          headers: {
            "set-cookie": "VtexIdclientAutCookie=auth-token; Path=/; HttpOnly",
          },
        })
      );

    const server = await buildServer();
    const response = await server.inject({
      method: "POST",
      url: "/api/v1/auth/classic-signin",
      payload: {
        username: "shopper@example.com",
        password: "secret",
      },
    });

    await server.close();

    expect(response.statusCode).toBe(200);
    expect(response.json().data).toEqual({ authStatus: "Success" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1]?.[1]?.headers).toMatchObject({
      cookie: "VtexIdclientAutCookie_start=start-token",
    });
    const setCookie = response.headers["set-cookie"];
    expect(setCookie).toEqual(expect.stringContaining("rsg_session="));
    expect(setCookie).toEqual(expect.stringContaining("HttpOnly"));
    expect(setCookie).not.toEqual(expect.stringContaining("VtexIdclientAutCookie"));
  });

  it("returns the documented BFF error envelope for invalid payloads", async () => {
    const server = await buildServer();
    const response = await server.inject({
      method: "POST",
      url: "/api/v1/auth/classic-signin",
      payload: {
        username: "shopper@example.com",
      },
    });

    await server.close();

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      success: false,
      data: null,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request payload",
      },
      meta: {
        requestId: expect.any(String),
        timestamp: expect.any(String),
      },
    });
  });
});
