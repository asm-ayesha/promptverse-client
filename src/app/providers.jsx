"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const THEME_STORAGE_KEY = "promptverse-theme";
const THEMES = new Set(["light", "dark"]);

const ThemeContext = createContext({
  theme: "light",
  setTheme: () => {},
});

function resolveTheme(theme) {
  return THEMES.has(theme) ? theme : "light";
}

export function applyTheme(theme) {
  const resolved = resolveTheme(theme);
  const root = document.documentElement;

  root.classList.remove("light", "dark");
  root.classList.add(resolved);
  root.setAttribute("data-theme", resolved);
  root.style.colorScheme = resolved;

  return resolved;
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function Providers({ children }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    try {
      return resolveTheme(localStorage.getItem(THEME_STORAGE_KEY));
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = (nextTheme) => {
    const resolved = resolveTheme(nextTheme);
    setThemeState(resolved);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, resolved);
    } catch {
      // Ignore storage errors in private browsing.
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
