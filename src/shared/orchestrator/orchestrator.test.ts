import { describe, expect, it } from "vitest";
import { orchestrator } from "./orchestrator";
import { OrchestratorMode } from "./orchestrator.types";

describe("orchestrator", () => {
  it("executes series tasks and passes the previous result", async () => {
    const results = await orchestrator(
      [
        {
          name: "start",
          fn: async () => ({ data: { started: true }, cookies: "start-cookie=1" }),
        },
        {
          name: "validate",
          fn: async (previousResult) => ({
            data: { authStatus: "Success", receivedCookie: previousResult?.cookies },
            cookies: "auth-cookie=2",
          }),
          transformationOptions: {
            transformConfigKey: "classicSigninAPI",
          },
        },
      ],
      { mode: OrchestratorMode.series }
    );

    expect(results).toEqual([
      { data: { started: true }, cookies: "start-cookie=1" },
      { data: { authStatus: "Success" }, cookies: "auth-cookie=2" },
    ]);
  });
});
