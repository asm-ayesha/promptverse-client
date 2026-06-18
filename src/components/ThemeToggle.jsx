"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      suppressHydrationWarning
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <span suppressHydrationWarning>
        {theme === "dark" ? "☀️ " : "🌙"}
      </span>
    </button>
  );
}