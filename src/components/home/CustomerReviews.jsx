"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { apiGet } from "@/lib/api";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";
import SectionHeading from "@/components/ui/SectionHeading";
import RatingStars from "@/components/ui/RatingStars";

const fallbackReviews = [
  {
    _id: "f1",
    name: "Sarah Chen",
    comment: "The marketing prompts saved me hours every week. Incredible quality.",
    rating: 5,
  },
  {
    _id: "f2",
    name: "Marcus Lee",
    comment: "Best place to find coding prompts. The review system keeps quality high.",
    rating: 5,
  },
  {
    _id: "f3",
    name: "Priya Nair",
    comment: "Premium was worth every cent — the private prompts are next level.",
    rating: 4,
  },
];

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet("/api/home/reviews")
      .then((data) => setReviews(Array.isArray(data) && data.length ? data : fallbackReviews))
      .catch(() => setReviews(fallbackReviews))
      .finally(() => setLoading(false));
  }, []);

  const list = loading ? [] : reviews.slice(0, 6);

  return (
    <section className="border-y border-border bg-surface/40">
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-24 lg:px-8">
        <SectionHeading
          eyebrow="Loved by users"
          title="What our community says"
          subtitle="Real feedback from creators and power users."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {list.map((r) => (
            <motion.div
              key={r._id}
              variants={fadeInUp}
              className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6"
            >
              <RatingStars value={r.rating || 5} size={16} />
              <p className="mt-4 flex-1 text-sm leading-7 text-foreground">
                “{r.comment}”
              </p>
              <div className="mt-5 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                  {(r.name || "U").charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{r.name}</p>
                  {r.email ? (
                    <p className="text-xs text-muted">{r.email}</p>
                  ) : (
                    <p className="text-xs text-muted">Verified user</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
