"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import { ToastContainer } from "react-toastify";

export const THEME_STORAGE_KEY = "promptverse-theme";
const THEMES = new Set(["light", "dark"]);

const ThemeContext = createContext({
  theme: "light",
  setTheme: () => {},
});

const themeListeners = new Set();

function emitThemeChange() {
  themeListeners.forEach((listener) => listener());
}

function subscribeTheme(listener) {
  themeListeners.add(listener);

  const onStorage = (event) => {
    if (event.key === THEME_STORAGE_KEY) {
      listener();
    }
  };

  window.addEventListener("storage", onStorage);

  return () => {
    themeListeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getThemeSnapshot() {
  try {
    return resolveTheme(localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return "light";
  }
}

function getServerThemeSnapshot() {
  return "light";
}

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
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = (nextTheme) => {
    const resolved = resolveTheme(nextTheme);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, resolved);
    } catch {
      // Ignore storage errors in private browsing.
    }

    applyTheme(resolved);
    emitThemeChange();
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
      <ToastContainer
        position="bottom-right"
        autoClose={2500}
        theme={theme}
        newestOnTop
      />
    </ThemeContext.Provider>
  );
}
