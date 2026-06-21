"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import PromptCard from "@/components/PromptCard";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";
import EmptyState from "@/components/ui/EmptyState";

export default function SavedPage() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet("/api/bookmarks")
      .then((data) => setPrompts(Array.isArray(data) ? data : []))
      .catch(() => setPrompts([]))
      .finally(() => setLoading(false));
  }, []);

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
            <PromptCard key={p._id} prompt={p} />
          ))}
        </div>
      )}
    </div>
  );
}
