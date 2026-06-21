"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Pencil,
  Code,
  Picture,
  ChartLine,
  GraduationCap,
  Briefcase,
} from "@gravity-ui/icons";
import { fadeInUp, staggerContainer, viewportOnce } from "@/lib/motion";
import SectionHeading from "@/components/ui/SectionHeading";

const categories = [
  { name: "Writing", icon: Pencil, color: "from-sky-400 to-blue-500" },
  { name: "Coding", icon: Code, color: "from-emerald-400 to-green-500" },
  { name: "Image Generation", icon: Picture, color: "from-fuchsia-400 to-purple-500" },
  { name: "Marketing", icon: ChartLine, color: "from-orange-400 to-pink-500" },
  { name: "Education", icon: GraduationCap, color: "from-teal-400 to-cyan-500" },
  { name: "Business", icon: Briefcase, color: "from-indigo-400 to-violet-500" },
];

export default function PromptCategories() {
  const router = useRouter();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:py-24 lg:px-8">
      <SectionHeading
        eyebrow="Explore"
        title="Popular Categories"
        subtitle="Jump straight into the prompts that matter to you."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6"
      >
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <motion.button
              key={cat.name}
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              onClick={() =>
                router.push(`/all-prompts?category=${encodeURIComponent(cat.name)}`)
              }
              className="flex h-full flex-col items-center rounded-2xl border border-border bg-surface p-6 text-center transition hover:border-accent"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${cat.color} text-white`}
              >
                <Icon width={22} height={22} />
              </div>
              <span className="mt-3 text-sm font-medium text-foreground">
                {cat.name}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </section>
  );
}
