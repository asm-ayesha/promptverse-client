"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Magnifier, ChevronLeft, ChevronRight } from "@gravity-ui/icons";
import { apiGet } from "@/lib/api";
import PromptCard from "@/components/PromptCard";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";
import EmptyState from "@/components/ui/EmptyState";

const PAGE_SIZE = 9;

function AllPromptsInner() {
  const params = useSearchParams();
  const [meta, setMeta] = useState({ categories: [], aiTools: [], difficulties: [] });

  const [search, setSearch] = useState(params.get("search") || "");
  const [filters, setFilters] = useState({
    category: params.get("category") || "",
    aiTool: "",
    difficulty: "",
    sort: "latest",
  });
  const [page, setPage] = useState(1);

  const [data, setData] = useState({ prompts: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet("/api/meta").then(setMeta).catch(() => {});
  }, []);

  const fetchPrompts = useCallback(() => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (search) qs.set("search", search);
    if (filters.category) qs.set("category", filters.category);
    if (filters.aiTool) qs.set("aiTool", filters.aiTool);
    if (filters.difficulty) qs.set("difficulty", filters.difficulty);
    if (filters.sort) qs.set("sort", filters.sort);
    qs.set("page", String(page));
    qs.set("limit", String(PAGE_SIZE));

    apiGet(`/api/prompts?${qs.toString()}`)
      .then((res) => setData(res))
      .catch(() => setData({ prompts: [], total: 0, totalPages: 1 }))
      .finally(() => setLoading(false));
  }, [search, filters, page]);

  // Debounce search; refetch on filter/page change.
  useEffect(() => {
    const t = setTimeout(fetchPrompts, 300);
    return () => clearTimeout(t);
  }, [fetchPrompts]);

  const updateFilter = (key, value) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          All Prompts
        </h1>
        <p className="mt-2 text-sm text-muted">
          Browse the full PromptVerse marketplace.
        </p>
      </div>

      {/* Search + sort bar */}
      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-surface px-4 py-2">
          <Magnifier width={18} height={18} className="text-muted" />
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search prompts..."
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
          />
        </div>
        <select
          value={filters.sort}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground outline-none"
        >
          <option value="latest">Latest</option>
          <option value="popular">Most Popular</option>
          <option value="copied">Most Copied</option>
        </select>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        {/* Filters */}
        <aside className="h-fit space-y-6 rounded-2xl border border-border bg-surface p-5">
          <FilterGroup
            label="Category"
            value={filters.category}
            options={meta.categories}
            onChange={(v) => updateFilter("category", v)}
          />
          <FilterGroup
            label="AI Tool"
            value={filters.aiTool}
            options={meta.aiTools}
            onChange={(v) => updateFilter("aiTool", v)}
          />
          <FilterGroup
            label="Difficulty"
            value={filters.difficulty}
            options={meta.difficulties}
            onChange={(v) => updateFilter("difficulty", v)}
          />
          <button
            onClick={() => {
              setSearch("");
              setPage(1);
              setFilters({ category: "", aiTool: "", difficulty: "", sort: "latest" });
            }}
            className="w-full rounded-full border border-border py-2 text-sm text-muted transition hover:text-accent"
          >
            Clear Filters
          </button>
        </aside>

        {/* Results */}
        <div>
          {loading ? (
            <SkeletonGrid count={6} />
          ) : data.prompts.length === 0 ? (
            <EmptyState
              title="No prompts found"
              description="Try adjusting your search or filters."
            />
          ) : (
            <>
              <p className="mb-4 text-sm text-muted">{data.total} prompts found</p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {data.prompts.map((p) => (
                  <PromptCard key={p._id} prompt={p} />
                ))}
              </div>

              {data.totalPages > 1 ? (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="flex items-center gap-1 rounded-full border border-border px-3 py-2 text-sm text-foreground transition hover:bg-surface-hover disabled:opacity-40"
                  >
                    <ChevronLeft width={16} height={16} /> Prev
                  </button>
                  <span className="px-4 text-sm text-muted">
                    Page {page} of {data.totalPages}
                  </span>
                  <button
                    disabled={page >= data.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="flex items-center gap-1 rounded-full border border-border px-3 py-2 text-sm text-foreground transition hover:bg-surface-hover disabled:opacity-40"
                  >
                    Next <ChevronRight width={16} height={16} />
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, value, options, onChange }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-foreground">{label}</h3>
      <div className="flex flex-wrap gap-2 lg:flex-col lg:flex-nowrap">
        <button
          onClick={() => onChange("")}
          className={`rounded-full px-3 py-1 text-left text-sm transition lg:rounded-lg ${
            value === ""
              ? "bg-accent text-accent-foreground"
              : "text-muted hover:bg-surface-hover"
          }`}
        >
          All
        </button>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`rounded-full px-3 py-1 text-left text-sm transition lg:rounded-lg ${
              value === opt
                ? "bg-accent text-accent-foreground"
                : "text-muted hover:bg-surface-hover"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AllPromptsPage() {
  return (
    <Suspense fallback={<div className="py-20" />}>
      <AllPromptsInner />
    </Suspense>
  );
}
