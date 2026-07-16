import { beforeEach, describe, expect, it, vi } from "vitest";

const { invoke, signInWithPassword } = vi.hoisted(() => ({
  invoke: vi.fn(),
  signInWithPassword: vi.fn(),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    functions: { invoke },
    auth: { signInWithPassword },
  },
}));

import { signupWithoutEmailConfirmation } from "@/lib/passwordSignup";

describe("signupWithoutEmailConfirmation", () => {
  beforeEach(() => {
    invoke.mockReset();
    signInWithPassword.mockReset();
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
