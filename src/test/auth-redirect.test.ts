import { afterEach, describe, expect, it } from "vitest";
import {
  getSignupConfirmationRedirectUrl,
  normalizeAuthCallbackUrl,
  sanitizeAuthReturnTo,
} from "@/lib/authRedirect";

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

  it("sends event-popup confirmations directly back to the registration form", () => {
    window.history.replaceState({}, "", "/auth");

    expect(getSignupConfirmationRedirectUrl("/registro?class=july-22")).toBe(
      "http://localhost:3000/?authRedirect=%2Fregistro%3Fclass%3Djuly-22",
    );
  });

  it("keeps regular signup confirmations on the auth flow", () => {
    window.history.replaceState({}, "", "/auth");

    expect(getSignupConfirmationRedirectUrl("/dashboard")).toBe(
      "http://localhost:3000/?authRedirect=%2Fauth%3FreturnTo%3D%252Fdashboard",
    );
  });

  it("moves a confirmed event signup onto the form while preserving its PKCE code", () => {
    window.history.replaceState(
      {},
      "",
      "/?authRedirect=%2Fregistro%3Fclass%3Djuly-22&code=confirmation-code",
    );

    normalizeAuthCallbackUrl();

    expect(`${window.location.pathname}${window.location.search}`).toBe(
      "/registro?class=july-22&code=confirmation-code",
    );
  });

  it("rejects external and backslash-based return destinations", () => {
    expect(sanitizeAuthReturnTo("https://example.com")).toBe("/dashboard");
    expect(sanitizeAuthReturnTo("//example.com")).toBe("/dashboard");
    expect(sanitizeAuthReturnTo("/\\example.com")).toBe("/dashboard");
  });
});
