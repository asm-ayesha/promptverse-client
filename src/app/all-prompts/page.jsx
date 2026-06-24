"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Magnifier,
  ChevronLeft,
  ChevronRight,
  Xmark,
  SlidersVertical,
} from "@gravity-ui/icons";
import { apiGet } from "@/lib/api";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import PromptCard from "@/components/PromptCard";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";
import EmptyState from "@/components/ui/EmptyState";

const PAGE_SIZE = 9;

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Most Popular" },
  { value: "copied", label: "Most Copied" },
];

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

  const resetAll = () => {
    setSearch("");
    setPage(1);
    setFilters({ category: "", aiTool: "", difficulty: "", sort: "latest" });
  };

  // Active filters (excluding sort) for removable chips.
  const activeChips = [
    filters.category && { key: "category", value: filters.category },
    filters.aiTool && { key: "aiTool", value: filters.aiTool },
    filters.difficulty && { key: "difficulty", value: filters.difficulty },
  ].filter(Boolean);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border bg-grid">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 lg:px-8">
          <span className="inline-block rounded-full border border-border bg-surface/70 px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted backdrop-blur">
            Marketplace
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">
            Explore <span className="brand-gradient">Prompts</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-muted md:text-base">
            Discover expert-crafted prompts across writing, code, design and more.
            Search, filter, and copy in one click.
          </p>

          <div className="mt-7 flex max-w-2xl items-center gap-2 rounded-2xl border border-border bg-surface/80 px-4 py-3 shadow-sm backdrop-blur focus-within:border-focus focus-within:ring-2 focus-within:ring-focus/30">
            <Magnifier width={20} height={20} className="shrink-0 text-muted" />
            <input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Search prompts, tools, tags..."
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
            />
            {search ? (
              <button
                onClick={() => {
                  setPage(1);
                  setSearch("");
                }}
                aria-label="Clear search"
                className="rounded-full p-1 text-muted transition hover:bg-surface-hover hover:text-foreground"
              >
                <Xmark width={16} height={16} />
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit lg:sticky lg:top-20">
            <div className="space-y-6 rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <SlidersVertical width={16} height={16} className="text-accent" />
                  Filters
                </h2>
                {activeChips.length > 0 ? (
                  <button
                    onClick={resetAll}
                    className="text-xs font-medium text-accent hover:underline"
                  >
                    Reset
                  </button>
                ) : null}
              </div>

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
            </div>
          </aside>

          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted">
                {loading ? (
                  "Loading prompts..."
                ) : (
                  <>
                    <span className="font-semibold text-foreground">
                      {data.total}
                    </span>{" "}
                    {data.total === 1 ? "prompt" : "prompts"} found
                  </>
                )}
              </p>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">Sort by</span>
                <div className="inline-flex rounded-full border border-border bg-surface p-1">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateFilter("sort", opt.value)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                        filters.sort === opt.value
                          ? "bg-accent text-accent-foreground"
                          : "text-muted hover:text-foreground"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {activeChips.length > 0 ? (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {activeChips.map((chip) => (
                  <button
                    key={chip.key}
                    onClick={() => updateFilter(chip.key, "")}
                    className="group flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent-soft-foreground transition hover:bg-accent hover:text-accent-foreground"
                  >
                    {chip.value}
                    <Xmark width={12} height={12} />
                  </button>
                ))}
              </div>
            ) : null}

            <div className="mt-6">
              {loading && data.prompts.length === 0 ? (
                <SkeletonGrid count={6} />
              ) : !loading && data.prompts.length === 0 ? (
                <EmptyState
                  title="No prompts found"
                  description="Try adjusting your search or filters."
                />
              ) : (
                <>
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className={`grid grid-cols-1 gap-6 transition-opacity duration-200 sm:grid-cols-2 xl:grid-cols-3 ${
                      loading ? "pointer-events-none opacity-50" : "opacity-100"
                    }`}
                  >
                    {data.prompts.map((p) => (
                      <motion.div key={p._id} variants={fadeInUp}>
                        <PromptCard prompt={p} />
                      </motion.div>
                    ))}
                  </motion.div>

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
      </div>
    </div>
  );
}

function FilterGroup({ label, value, options, onChange }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
        {label}
      </h3>
      <div className="flex flex-wrap gap-2 lg:flex-col lg:flex-nowrap">
        <button
          onClick={() => onChange("")}
          className={`rounded-full px-3 py-1.5 text-left text-sm transition lg:rounded-lg ${
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
            className={`rounded-full px-3 py-1.5 text-left text-sm transition lg:rounded-lg ${
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
