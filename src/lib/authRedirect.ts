import { isEventRegistrationPath } from "@/lib/classEvent";

/**
 * Returns the production-correct origin to use in Supabase Auth email redirects.
 * Falls back to window.location.origin in the browser. Never returns localhost
 * unless the app is actually being run on localhost.
 */
export const getAuthRedirectOrigin = (): string => {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "https://foroagora2.lovable.app";
};

export const getAuthRedirectUrl = (path: string = "/auth"): string => {
  const origin = getAuthRedirectOrigin();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${origin}/?authRedirect=${encodeURIComponent(normalized)}`;
};

export const sanitizeAuthReturnTo = (value: string | null | undefined): string => {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/dashboard";
  return value;
};

/**
 * Event signups return directly to the registration form after confirmation.
 * Other signups still pass through AuthPage so onboarding can be completed.
 */
export const getSignupConfirmationRedirectUrl = (returnTo: string): string => {
  const safeReturnTo = sanitizeAuthReturnTo(returnTo);
  const destination = new URL(safeReturnTo, getAuthRedirectOrigin());
  const callbackPath = isEventRegistrationPath(destination.pathname, destination.search)
    ? `${destination.pathname}${destination.search}`
    : `/auth?returnTo=${encodeURIComponent(safeReturnTo)}`;

  return getAuthRedirectUrl(callbackPath);
};

/**
 * Moves the callback route embedded in `authRedirect` into the actual URL before
 * Supabase initializes. Callback parameters such as the PKCE `code` and hash
 * tokens are retained, so OAuth and email-confirmation links can finish safely.
 */
export const normalizeAuthCallbackUrl = (): void => {
  if (typeof window === "undefined") return;

  const currentUrl = new URL(window.location.href);
  const requestedPath = currentUrl.searchParams.get("authRedirect");
  if (!requestedPath) return;

  const destination = new URL(sanitizeAuthReturnTo(requestedPath), currentUrl.origin);
  currentUrl.searchParams.delete("authRedirect");
  currentUrl.searchParams.forEach((value, key) => destination.searchParams.set(key, value));
  destination.hash = currentUrl.hash;

  window.history.replaceState(
    window.history.state,
    "",
    `${destination.pathname}${destination.search}${destination.hash}`,
  );
};
