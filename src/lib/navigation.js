// Helpers for post-login redirects (callbackUrl).

const DEFAULT_AFTER_LOGIN = "/dashboard";

// Returns a safe internal path to redirect to after auth, or the fallback.
// Rejects external URLs and protocol-relative (//) paths to avoid open redirects.
export function safeCallbackUrl(url, fallback = DEFAULT_AFTER_LOGIN) {
  if (!url || typeof url !== "string") return fallback;
  if (url.startsWith("/") && !url.startsWith("//")) return url;
  return fallback;
}

// Builds a /login (or /register) href that returns to `path` after auth.
export function authHref(path, base = "/login") {
  if (!path || path === "/login" || path === "/register") return base;
  return `${base}?callbackUrl=${encodeURIComponent(path)}`;
}
