import { transformUtility } from "@shared/transformer/transform";
import { describe, expect, it } from "vitest";

describe("classic sign-in transformation config", () => {
  it("maps VTEX authStatus to the frontend response shape", () => {
    const result = transformUtility({
      data: { authStatus: "Success", ignored: true },
      transformConfigKey: "classicSigninAPI",
    });

    expect(result).toEqual({ authStatus: "Success" });
  });

  it("applies configs to arrays without controller mapping logic", () => {
    const result = transformUtility({
      data: [{ authStatus: "Success" }, { authStatus: "Failed", ignored: true }],
      transformConfigKey: "classicSigninAPI",
    });

    expect(result).toEqual([{ authStatus: "Success" }, { authStatus: "Failed" }]);
  });
});
