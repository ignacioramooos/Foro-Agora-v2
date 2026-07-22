import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "fa_ref";
const CODE_RE = /^[a-zA-Z0-9_-]{4,32}$/;

/** Capture ?ref=... from the current URL and persist it in localStorage. */
export const captureRefFromUrl = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("ref");
    if (!raw) return;
    const code = raw.trim();
    if (!CODE_RE.test(code)) return;
    window.localStorage.setItem(STORAGE_KEY, code);
  } catch {
    // ignore
  }
};

export const getStoredRef = (): string | null => {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

export const clearStoredRef = () => {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
};

/**
 * If the user has a pending referral code stored, attempt to claim it.
 * Safe to call any time after the user has a valid session. Idempotent.
 */
export const claimReferralIfPending = async (): Promise<void> => {
  const code = getStoredRef();
  if (!code) return;
  try {
    const { data, error } = await supabase.rpc("claim_referral", { _code: code });
    if (error) {
      console.warn("claim_referral failed:", error.message);
      return;
    }
    if (data !== null) clearStoredRef();
  } catch (err) {
    console.warn("claim_referral threw:", err);
  }
};

/** Build a shareable referral URL for the given code. */
export const buildReferralUrl = (code: string): string => {
  const base =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "https://foroagora.org";
  return `${base}/?ref=${encodeURIComponent(code)}`;
};

/** Generate a short, URL-safe code (client-side; uniqueness enforced by DB). */
export const generateReferralCode = (length = 8): string => {
  const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  const rand = new Uint32Array(length);
  crypto.getRandomValues(rand);
  for (let i = 0; i < length; i++) {
    out += alphabet[rand[i] % alphabet.length];
  }
  return out;
};
