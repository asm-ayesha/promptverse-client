"use client";

import { Moon, Sun } from "@gravity-ui/icons";

import { useTheme } from "@/app/providers";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className="cursor-pointer hover:opacity-80 active:scale-95 transition-all"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <span suppressHydrationWarning>
        {theme === "dark" ? <Sun /> : <Moon />}
      </span>
    </button>
  );
}
