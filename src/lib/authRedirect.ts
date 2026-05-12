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
