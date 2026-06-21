"use client";

import { useSession } from "@/lib/auth-client";

// Thin wrapper over better-auth useSession exposing role/subscription.
export function useAuth() {
  const { data, isPending, error } = useSession();
  const user = data?.user || null;
  return {
    user,
    isPending,
    error,
    isAuthenticated: !!user,
    role: user?.role || "user",
    subscription: user?.subscription || "free",
  };
}
