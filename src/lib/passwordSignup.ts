import { supabase } from "@/integrations/supabase/client";
import { FunctionsHttpError } from "@supabase/supabase-js";

interface PasswordSignupInput {
  email: string;
  password: string;
  metadata: Record<string, unknown>;
}

export const signupWithoutEmailConfirmation = async ({
  email,
  password,
  metadata,
}: PasswordSignupInput): Promise<{ error: string | null }> => {
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
