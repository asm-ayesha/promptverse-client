"use client";

import { useSyncExternalStore } from "react";
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

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className="cursor-pointer hover:opacity-80 active:scale-95 transition-all"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <span>
        {!isClient ? (
          <Moon />
        ) : theme === "dark" ? (
          <Sun />
        ) : (
          <Moon />
        )}
      </span>
    </button>
  );
}
