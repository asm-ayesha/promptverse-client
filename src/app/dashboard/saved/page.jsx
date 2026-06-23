"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { apiGet, apiPost } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import PromptCard from "@/components/PromptCard";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function SavedPage() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    apiGet("/api/bookmarks")
      .then((data) => setPrompts(Array.isArray(data) ? data : []))
      .catch(() => setPrompts([]))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async () => {
    if (!removeTarget) return;
    setRemoving(true);
    try {
      // The bookmark endpoint toggles; since these are all saved, this removes.
      await apiPost(`/api/bookmarks/${removeTarget._id}`);
      setPrompts((prev) => prev.filter((p) => p._id !== removeTarget._id));
      toast.error("Removed from saved");
      setRemoveTarget(null);
    } catch (err) {
      toast.error(err.message || "Could not remove");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Saved Prompts" subtitle="Prompts you've bookmarked." />
      {loading ? (
        <SkeletonGrid count={3} />
      ) : prompts.length === 0 ? (
        <EmptyState
          title="No saved prompts"
          description="Bookmark prompts to find them here later."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {prompts.map((p) => (
            <PromptCard key={p._id} prompt={p} onRemove={setRemoveTarget} />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={handleRemove}
        loading={removing}
        title="Remove saved prompt"
        message={`Remove "${removeTarget?.title}" from your saved prompts?`}
        confirmLabel="Remove"
      />
    </div>
  );
}
