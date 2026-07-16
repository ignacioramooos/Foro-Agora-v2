import { supabase } from "@/integrations/supabase/client";
import { FunctionsHttpError } from "@supabase/supabase-js";

interface PasswordSignupInput {
  email: string;
  password: string;
  metadata: Record<string, unknown>;
  emailRedirectTo?: string;
}

export interface PasswordSignupResult {
  error: string | null;
  confirmationRequired?: boolean;
}

export const signupWithoutEmailConfirmation = async ({
  email,
  password,
  metadata,
}: PasswordSignupInput): Promise<PasswordSignupResult> => {
  const normalizedEmail = email.trim().toLowerCase();
  const { error: createError } = await supabase.functions.invoke("signup-without-confirmation", {
    body: { email: normalizedEmail, password, metadata },
  });

  if (createError) {
    if (createError instanceof FunctionsHttpError) {
      try {
        const body = await createError.context.json();
        if (typeof body?.error === "string") return { error: body.error as string };
      } catch {
        // The function returned a non-JSON error, so use the safe fallback below.
      }
    }
    return { error: "No se pudo crear la cuenta. Intentá de nuevo." };
  }

  const { error: loginError } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  return { error: loginError?.message || null };
};

/**
 * Uses the current no-confirmation signup until email verification is switched
 * back on. Setting VITE_REQUIRE_EMAIL_CONFIRMATION=true activates Supabase's
 * normal confirmation email and keeps the requested post-auth destination in
 * that email's callback URL.
 */
export const signupWithPassword = async ({
  email,
  password,
  metadata,
  emailRedirectTo,
}: PasswordSignupInput): Promise<PasswordSignupResult> => {
  if (import.meta.env.VITE_REQUIRE_EMAIL_CONFIRMATION !== "true") {
    return signupWithoutEmailConfirmation({ email, password, metadata });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: metadata,
      ...(emailRedirectTo ? { emailRedirectTo } : {}),
    },
  });

  if (error) return { error: error.message };
  return { error: null, confirmationRequired: !data.session };
};
