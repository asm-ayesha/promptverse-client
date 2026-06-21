"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { apiGet } from "@/lib/api";
import { fadeInUp } from "@/lib/motion";
import SectionHeading from "@/components/ui/SectionHeading";
import PromptCard from "@/components/PromptCard";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";

export default function FeaturedPrompts() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet("/api/prompts/featured?limit=6")
      .then((data) => setPrompts(Array.isArray(data) ? data : []))
      .catch(() => setPrompts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:py-24 lg:px-8">
      <SectionHeading
        eyebrow="Handpicked"
        title="Featured Prompts"
        subtitle="The most popular, high-performing prompts on PromptVerse right now."
      />

      {loading ? (
        <div className="mt-12">
          <SkeletonGrid count={6} />
        </div>
      ) : prompts.length === 0 ? (
        <p className="mt-12 text-center text-sm text-muted">
          No prompts available yet. Check back soon.
        </p>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt, i) => (
            <motion.div
              key={prompt._id}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: (i % 3) * 0.08 }}
            >
              <PromptCard prompt={prompt} />
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <Link
          href="/all-prompts"
          className="inline-flex items-center justify-center rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface-hover"
        >
          View All Prompts
        </Link>
      </div>
    </section>
  );
}
