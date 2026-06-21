"use client";

import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";

export default function AdminLayout({ children }) {
  const { role, isPending } = useAuth();
  if (isPending) return <LoadingSpinner fullPage />;
  if (role !== "admin") {
    return (
      <EmptyState
        title="Admins only"
        description="You don't have permission to view this area."
      />
    );
  }
  return children;
}
