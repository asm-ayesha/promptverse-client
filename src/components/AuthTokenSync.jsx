"use client";

import { useEffect } from "react";
import { useSession, BEARER_TOKEN_KEY } from "@/lib/auth-client";

// Keeps the localStorage bearer token (used for the Express API) in sync with
// the better-auth session. This is required for login flows that don't run the
// auth-client onSuccess hook — notably Google OAuth, which sets the session
// cookie via a server redirect rather than a client fetch.
export default function AuthTokenSync() {
  const { data, isPending } = useSession();
  const userId = data?.user?.id || null;

  useEffect(() => {
    if (isPending) return;

    // Logged out: drop any stale token so we don't send an invalid one.
    if (!userId) {
      try {
        localStorage.removeItem(BEARER_TOKEN_KEY);
      } catch (_) {
        /* ignore */
      }
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth-token", { credentials: "include" });
        if (!res.ok) return;
        const { token } = await res.json();
        if (!cancelled && token) {
          localStorage.setItem(BEARER_TOKEN_KEY, token);
        }
      } catch (_) {
        /* ignore */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, isPending]);

  return null;
}
