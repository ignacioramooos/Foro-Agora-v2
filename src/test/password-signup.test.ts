import { beforeEach, describe, expect, it, vi } from "vitest";

const { invoke, signInWithPassword, signUp } = vi.hoisted(() => ({
  invoke: vi.fn(),
  signInWithPassword: vi.fn(),
  signUp: vi.fn(),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    functions: { invoke },
    auth: { signInWithPassword, signUp },
  },
}));

import { signupWithPassword, signupWithoutEmailConfirmation } from "@/lib/passwordSignup";

describe("signupWithoutEmailConfirmation", () => {
  beforeEach(() => {
    invoke.mockReset();
    signInWithPassword.mockReset();
    signUp.mockReset();
    vi.unstubAllEnvs();
  });

  it("preserves the event destination in the future confirmation email", async () => {
    vi.stubEnv("VITE_REQUIRE_EMAIL_CONFIRMATION", "true");
    signUp.mockResolvedValue({ data: { session: null }, error: null });

    const result = await signupWithPassword({
      email: " PERSON@Example.com ",
      password: "password123",
      metadata: { accepted_terms: true },
      emailRedirectTo: "https://foroagora.org/?authRedirect=%2Fauth%3FreturnTo%3D%252Fregistro%253Fclass%253Djuly-22",
    });

    expect(signUp).toHaveBeenCalledWith({
      email: "person@example.com",
      password: "password123",
      options: {
        data: { accepted_terms: true },
        emailRedirectTo: "https://foroagora.org/?authRedirect=%2Fauth%3FreturnTo%3D%252Fregistro%253Fclass%253Djuly-22",
      },
    });
    expect(invoke).not.toHaveBeenCalled();
    expect(result).toEqual({ error: null, confirmationRequired: true });
  });

  it("creates an already-confirmed account and signs it in", async () => {
    invoke.mockResolvedValue({ error: null });
    signInWithPassword.mockResolvedValue({ error: null });

    const result = await signupWithoutEmailConfirmation({
      email: "  PERSON@Example.com ",
      password: "password123",
      metadata: { display_name: "Person" },
    });

    expect(invoke).toHaveBeenCalledWith("signup-without-confirmation", {
      body: {
        email: "person@example.com",
        password: "password123",
        metadata: { display_name: "Person" },
      },
    });
    expect(signInWithPassword).toHaveBeenCalledWith({
      email: "person@example.com",
      password: "password123",
    });
    expect(result).toEqual({ error: null });
  });

  it("does not attempt login when account creation fails", async () => {
    invoke.mockResolvedValue({ error: new Error("network failure") });

    const result = await signupWithoutEmailConfirmation({
      email: "person@example.com",
      password: "password123",
      metadata: {},
    });

    expect(signInWithPassword).not.toHaveBeenCalled();
    expect(result.error).toBe("No se pudo crear la cuenta. Intentá de nuevo.");
  });
});
