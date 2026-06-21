"use client";

import { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "@gravity-ui/icons";

import { useTheme } from "@/app/providers";

function subscribeClientReady() {
  return () => {};
}
function getClientReadySnapshot() {
  return true;
}
function getServerReadySnapshot() {
  return false;
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isClient = useSyncExternalStore(
    subscribeClientReady,
    getClientReadySnapshot,
    getServerReadySnapshot,
  );

  const showSun = isClient && theme === "dark";

  return (
    <motion.button
      type="button"
      aria-label="Toggle theme"
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-surface-hover"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={showSun ? "sun" : "moon"}
          initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="flex items-center justify-center"
        >
          {showSun ? <Sun width={20} height={20} /> : <Moon width={20} height={20} />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
