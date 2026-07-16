import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const allowedMetadataKeys = new Set([
  "display_name",
  "full_name",
  "age",
  "department",
  "institution",
  "how_found_us",
  "interests",
  "accepted_terms",
]);

const sanitizeMetadata = (value: unknown) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value).filter(([key]) => allowedMetadataKeys.has(key)),
  );
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  try {
    const { email, password, metadata } = await req.json();
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      return jsonResponse({ error: "Ingresá un email válido." }, 400);
    }
    if (typeof password !== "string" || password.length < 8) {
      return jsonResponse({ error: "La contraseña debe tener al menos 8 caracteres." }, 400);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing Supabase server credentials");
      return jsonResponse({ error: "No se pudo crear la cuenta." }, 500);
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { error } = await admin.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
      user_metadata: sanitizeMetadata(metadata),
    });

    if (error) {
      console.error("Password signup failed:", error.message);
      const duplicate = /already (been )?registered|already exists/i.test(error.message);
      return jsonResponse(
        { error: duplicate ? "Ya existe una cuenta con ese email." : "No se pudo crear la cuenta." },
        duplicate ? 409 : 400,
      );
    }

    return jsonResponse({ created: true }, 201);
  } catch (error) {
    console.error("Password signup failed:", error);
    return jsonResponse({ error: "No se pudo crear la cuenta." }, 500);
  }
});
