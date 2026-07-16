import { afterEach, describe, expect, it } from "vitest";
import { normalizeAuthCallbackUrl, sanitizeAuthReturnTo } from "@/lib/authRedirect";

describe("auth callback redirects", () => {
  afterEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("moves the callback onto auth while preserving the event and PKCE code", () => {
    const destination = "/auth?returnTo=%2Fregistro%3Fclass%3Djuly-22";
    window.history.replaceState(
      {},
      "",
      `/?authRedirect=${encodeURIComponent(destination)}&code=confirmation-code`,
    );

    normalizeAuthCallbackUrl();

    expect(`${window.location.pathname}${window.location.search}`).toBe(
      "/auth?returnTo=%2Fregistro%3Fclass%3Djuly-22&code=confirmation-code",
    );
  });

  it("rejects external and backslash-based return destinations", () => {
    expect(sanitizeAuthReturnTo("https://example.com")).toBe("/dashboard");
    expect(sanitizeAuthReturnTo("//example.com")).toBe("/dashboard");
    expect(sanitizeAuthReturnTo("/\\example.com")).toBe("/dashboard");
  });
});
