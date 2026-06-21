"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Gem, LockOpen, Person } from "@gravity-ui/icons";
import RatingStars from "./ui/RatingStars";

const categoryColors = {
  Writing: "from-sky-400 to-blue-500",
  Coding: "from-emerald-400 to-green-500",
  Marketing: "from-orange-400 to-pink-500",
  "Image Generation": "from-fuchsia-400 to-purple-500",
  Productivity: "from-amber-400 to-orange-500",
  Education: "from-teal-400 to-cyan-500",
  Business: "from-indigo-400 to-violet-500",
  Design: "from-rose-400 to-red-500",
};

export default function PromptCard({ prompt }) {
  const gradient = categoryColors[prompt.category] || "from-indigo-400 to-cyan-400";
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-40 w-full overflow-hidden">
        {prompt.thumbnailUrl && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={prompt.thumbnailUrl}
            alt={prompt.title}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-linear-to-br ${gradient}`}
          >
            <span className="px-4 text-center text-lg font-semibold text-white drop-shadow">
              {prompt.aiTool}
            </span>
          </div>
        )}
        {prompt.visibility === "private" ? (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-linear-to-r from-amber-500 to-orange-500 px-2.5 py-1 text-xs font-semibold text-white shadow-md">
            <Gem width={12} height={12} /> Premium
          </span>
        ) : (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-1 text-xs font-semibold text-white shadow-md backdrop-blur">
            <LockOpen width={12} height={12} /> Free
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent-soft-foreground">
            {prompt.category}
          </span>
          <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
            {prompt.aiTool}
          </span>
        </div>

        <h3 className="line-clamp-1 text-lg font-semibold text-foreground">
          {prompt.title}
        </h3>
        <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted">
          {prompt.description}
        </p>

        <div className="mt-3 flex items-center justify-between text-xs text-muted">
          <span className="flex items-center gap-1">
            <Person width={14} height={14} />
            {prompt.creatorName || "Unknown"}
          </span>
          <span className="flex items-center gap-1">
            <Copy width={14} height={14} />
            {prompt.copyCount || 0}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          {prompt.reviewCount > 0 ? (
            <div className="flex items-center gap-1">
              <RatingStars value={prompt.avgRating || 0} size={14} />
              <span className="text-xs text-muted">({prompt.reviewCount})</span>
            </div>
          ) : (
            <span className="text-xs text-muted">No reviews yet</span>
          )}
        </div>

        <Link
          href={`/prompts/${prompt._id}`}
          className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
