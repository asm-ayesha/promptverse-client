"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Copy, CrownDiamond, FileText, Person } from "@gravity-ui/icons";
import { apiGet } from "@/lib/api";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";
import SectionHeading from "@/components/ui/SectionHeading";

const rankStyles = {
  0: {
    ring: "from-amber-400 via-yellow-500 to-amber-600",
    badge: "bg-linear-to-r from-amber-400 to-yellow-500 text-amber-950",
    label: "#1",
  },
  1: {
    ring: "from-slate-300 via-slate-400 to-slate-500",
    badge: "bg-linear-to-r from-slate-300 to-slate-400 text-slate-800",
    label: "#2",
  },
  2: {
    ring: "from-orange-400 via-amber-600 to-orange-700",
    badge: "bg-linear-to-r from-orange-400 to-amber-600 text-orange-950",
    label: "#3",
  },
};

function CreatorCard({ creator, index, loading }) {
  const [imgError, setImgError] = useState(false);
  const rank = rankStyles[index];

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col items-center rounded-2xl border border-border bg-surface p-5 text-center shadow-sm transition-shadow hover:shadow-lg"
    >
      {rank && !loading && (
        <span
          className={`absolute -top-2 left-1/2 -translate-x-1/2 rounded-full px-2.5 py-0.5 text-[11px] font-bold shadow-md ${rank.badge}`}
        >
          {index === 0 ? (
            <span className="flex items-center gap-1">
              <CrownDiamond width={12} height={12} /> {rank.label}
            </span>
          ) : (
            rank.label
          )}
        </span>
      )}

      <div
        className={`mt-1 rounded-full bg-linear-to-tr p-[2px] ${
          rank ? rank.ring : "from-accent to-accent-hover"
        } transition-transform duration-300 group-hover:scale-105`}
      >
        <div className="rounded-full bg-surface p-[2px]">
          {creator?.image && !imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={creator.image}
              alt={creator.name}
              onError={() => setImgError(true)}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-xl font-semibold text-accent-soft-foreground">
              {creator?.name ? (
                creator.name.charAt(0).toUpperCase()
              ) : (
                <Person width={24} height={24} />
              )}
            </span>
          )}
        </div>
      </div>

      <p className="mt-3 line-clamp-1 text-sm font-semibold text-foreground">
        {creator?.name || (loading ? "—" : "Creator")}
      </p>

      <div className="mt-3 flex items-center gap-3 text-xs text-muted">
        <span className="flex items-center gap-1 rounded-full bg-surface-hover px-2 py-1">
          <FileText width={12} height={12} />
          {creator?.totalPrompts || 0}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-surface-hover px-2 py-1">
          <Copy width={12} height={12} />
          {creator?.totalCopies || 0}
        </span>
      </div>
    </motion.div>
  );
}

export default function TopCreators() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet("/api/home/top-creators?limit=5")
      .then((data) =>
        setCreators(Array.isArray(data) ? data.slice(0, 5) : [])
      )
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

      {loading ? (
        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex animate-pulse flex-col items-center rounded-2xl border border-border bg-surface p-5"
            >
              <span className="h-16 w-16 rounded-full bg-surface-hover" />
              <span className="mt-3 h-3 w-20 rounded bg-surface-hover" />
              <span className="mt-3 h-3 w-24 rounded bg-surface-hover" />
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5"
        >
          {creators.map((c, i) => (
            <CreatorCard key={c._id || i} creator={c} index={i} loading={false} />
          ))}
        </motion.div>
      )}
    </section>
  );
}
