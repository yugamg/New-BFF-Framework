import { describe, expect, it } from "vitest";
import { mergeCookies } from "./cookie";

describe("cookie utilities", () => {
  it("keeps only safe cookie pairs when forwarding upstream cookies", () => {
    const result = mergeCookies("safe=value; bad\r\nSet-Cookie: injected=true; another=ok");

    expect(result).toEqual(["safe=value", "another=ok"]);
  });
});
