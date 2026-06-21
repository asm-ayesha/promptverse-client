"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Magnifier, ArrowRight, Sparkles, Rocket } from "@gravity-ui/icons";
import { fadeInUp, staggerContainer } from "@/lib/motion";

// Pool of tags — a random subset is shown on each visit.
const TAG_POOL = [
  "ChatGPT",
  "Midjourney",
  "Marketing",
  "Coding",
  "SEO Writing",
  "Productivity",
  "Automation",
  "Claude",
  "Gemini",
  "Image Generation",
  "Business",
  "Education",
  "Copywriting",
  "Data Analysis",
];

const STABLE_TAGS = TAG_POOL.slice(0, 6);

function pickRandomTags(count = 6) {
  const shuffled = [...TAG_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Cache the randomized tags once on the client so getSnapshot stays stable
// (useSyncExternalStore re-invokes it on every render).
let clientTags = null;
function subscribeTags() {
  return () => {};
}
function getClientTags() {
  if (!clientTags) clientTags = pickRandomTags(6);
  return clientTags;
}
function getServerTags() {
  return STABLE_TAGS;
}

export default function HomeBanner() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  // Stable subset during SSR/hydration, then a random subset on the client —
  // no setState-in-effect, so the React Compiler is happy.
  const tags = useSyncExternalStore(subscribeTags, getClientTags, getServerTags);

  const search = (e) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/all-prompts?search=${encodeURIComponent(q)}` : "/all-prompts");
  };

  return (
    <section className="relative overflow-hidden bg-grid">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-accent-soft/40 via-background to-background" />

      {/* Floating glow accents */}
      <motion.div
        aria-hidden
        animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-20 top-10 -z-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"
      />
      <motion.div
        aria-hidden
        animate={{ y: [0, 24, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-20 top-24 -z-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl"
      />

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
          <Sparkles width={14} height={14} className="text-accent" />
          AI prompts for productivity, automation & creativity
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

        {/* Search Bar */}
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
            className="flex items-center gap-1.5 rounded-full bg-surface-secondary px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface-hover"
          >
            <Magnifier width={16} height={16} />
            <span className="hidden sm:inline">Search</span>
          </button>
        </motion.form>

        {/* Trending Tags (random) */}
        <motion.div
          variants={fadeInUp}
          className="mt-6 flex flex-wrap items-center justify-center gap-2"
        >
          <span className="text-xs text-muted">Trending:</span>
          {tags.map((tag) => (
            <motion.button
              key={tag}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                router.push(`/all-prompts?search=${encodeURIComponent(tag)}`)
              }
              className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted transition hover:border-accent hover:text-accent"
            >
              {tag}
            </motion.button>
          ))}
        </motion.div>

        {/* Call-To-Action Buttons */}
        <motion.div
          variants={fadeInUp}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => router.push("/all-prompts")}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition hover:bg-accent-hover sm:w-auto"
          >
            Explore Prompts
            <ArrowRight width={18} height={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => router.push("/register")}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-surface px-7 py-3 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent sm:w-auto"
          >
            <Rocket width={18} height={18} />
            Become a Creator
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
