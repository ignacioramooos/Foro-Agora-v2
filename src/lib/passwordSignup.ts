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
 * Creates the account through Supabase Auth. Email confirmation is configured
 * in Supabase, so the returned session tells the UI whether the user must
 * confirm their email before continuing.
 */
export const signupWithPassword = async ({
  email,
  password,
  metadata,
  emailRedirectTo,
}: PasswordSignupInput): Promise<PasswordSignupResult> => {
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

export const resendSignupConfirmation = async (email: string, emailRedirectTo?: string) => {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: email.trim().toLowerCase(),
    ...(emailRedirectTo ? { options: { emailRedirectTo } } : {}),
  });

  return { error: error?.message || null };
};
