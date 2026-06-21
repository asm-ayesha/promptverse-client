"use client";

import { motion } from "framer-motion";
import { Magnifier, Copy, Rocket } from "@gravity-ui/icons";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";
import SectionHeading from "@/components/ui/SectionHeading";

const steps = [
  {
    icon: Magnifier,
    title: "Discover",
    description: "Search and filter thousands of prompts by tool, category and difficulty.",
  },
  {
    icon: Copy,
    title: "Copy",
    description: "Grab the full prompt with one click and tweak it to fit your use case.",
  },
  {
    icon: Rocket,
    title: "Create",
    description: "Run it in your favorite AI tool and get better results, faster.",
  },
];

export default function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:py-24 lg:px-8">
      <SectionHeading
        eyebrow="Simple"
        title="How it works"
        subtitle="Get from idea to output in three easy steps."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3"
      >
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.title}
              variants={fadeInUp}
              className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface p-8"
            >
              <span className="brand-gradient pointer-events-none absolute right-5 top-3 text-6xl font-extrabold leading-none tracking-tight opacity-90 select-none">
                0{i + 1}
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Icon width={24} height={24} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{step.description}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
