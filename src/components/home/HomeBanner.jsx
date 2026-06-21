"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Magnifier, ArrowRight } from "@gravity-ui/icons";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const trendingTags = [
  "ChatGPT",
  "Midjourney",
  "Marketing",
  "Coding",
  "SEO Writing",
  "Productivity",
];

export default function HomeBanner() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const search = (e) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/all-prompts?search=${encodeURIComponent(q)}` : "/all-prompts");
  };

  return (
    <section className="relative overflow-hidden bg-grid">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-accent-soft/40 via-background to-background" />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-4xl px-4 py-24 text-center md:py-32 lg:px-8"
      >
        <motion.span
          variants={fadeInUp}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-muted"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          The marketplace for expert AI prompts
        </motion.span>

        <motion.h1
          variants={fadeInUp}
          className="mt-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl"
        >
          Discover prompts that{" "}
          <span className="brand-gradient">actually work</span>
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="mx-auto mt-5 max-w-2xl text-base text-muted md:text-lg"
        >
          Browse thousands of high-quality prompts for ChatGPT, Midjourney,
          Claude and more. Copy, customize and create faster.
        </motion.p>

        <motion.form
          variants={fadeInUp}
          onSubmit={search}
          className="mx-auto mt-10 flex max-w-xl items-center gap-2 rounded-full border border-border bg-surface p-2 shadow-sm"
        >
          <Magnifier width={20} height={20} className="ml-3 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search prompts, tools, categories..."
            className="flex-1 bg-transparent px-2 py-2 text-sm text-foreground outline-none placeholder:text-muted"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-accent-hover"
          >
            Search <ArrowRight width={16} height={16} />
          </button>
        </motion.form>

        <motion.div
          variants={fadeInUp}
          className="mt-6 flex flex-wrap items-center justify-center gap-2"
        >
          <span className="text-xs text-muted">Trending:</span>
          {trendingTags.map((tag) => (
            <button
              key={tag}
              onClick={() =>
                router.push(`/all-prompts?search=${encodeURIComponent(tag)}`)
              }
              className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted transition hover:border-accent hover:text-accent"
            >
              {tag}
            </button>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
