"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { authHref } from "@/lib/navigation";
import LoadingSpinner from "./ui/LoadingSpinner";

// Guards a route. `allow` is an optional array of permitted roles.
export default function ProtectedRoute({ children, allow }) {
  const { user, isPending, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const roleAllowed = !allow || allow.includes(role);

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      router.replace(authHref(pathname));
    } else if (!roleAllowed) {
      router.replace("/dashboard");
    }
  }, [isPending, user, roleAllowed, router, pathname]);

  // Wait until the session resolves — keeps reload safe (no premature redirect).
  if (isPending) return <LoadingSpinner fullPage label="Checking access..." />;
  if (!user || !roleAllowed) return null;

  return children;
}
