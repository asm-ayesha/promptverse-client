"use client";

import { useEffect, useState } from "react";
import { Copy, FileText, Person } from "@gravity-ui/icons";
import { apiGet } from "@/lib/api";
import SectionHeading from "@/components/ui/SectionHeading";

export default function TopCreators() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet("/api/home/top-creators")
      .then((data) => setCreators(Array.isArray(data) ? data : []))
      .catch(() => setCreators([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && creators.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:py-24 lg:px-8">
      <SectionHeading
        eyebrow="Community"
        title="Top Creators"
        subtitle="The most prolific prompt engineers on the platform."
      />

      <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
        {(loading ? Array.from({ length: 6 }) : creators).map((c, i) => (
          <div
            key={c?._id || i}
            className="flex flex-col items-center rounded-2xl border border-border bg-surface p-5 text-center"
          >
            {c?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.image}
                alt={c.name}
                className="h-14 w-14 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent-soft-foreground">
                {c?.name ? c.name.charAt(0).toUpperCase() : <Person width={22} height={22} />}
              </span>
            )}
            <p className="mt-3 line-clamp-1 text-sm font-medium text-foreground">
              {c?.name || (loading ? "—" : "Creator")}
            </p>
            <div className="mt-2 flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1">
                <FileText width={12} height={12} />
                {c?.totalPrompts || 0}
              </span>
              <span className="flex items-center gap-1">
                <Copy width={12} height={12} />
                {c?.totalCopies || 0}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
