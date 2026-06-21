"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "@gravity-ui/icons";

// Custom, fully-styled dropdown (the native <select> option list can't be themed).
export default function SelectMenu({
  value,
  options = [],
  onChange,
  placeholder = "Select...",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition hover:border-muted/60 focus:ring-2 focus:ring-focus/30 ${
          open ? "border-focus ring-2 ring-focus/30" : "border-border"
        }`}
      >
        <span className={value ? "text-foreground" : "text-muted"}>
          {value || placeholder}
        </span>
        <ChevronDown
          width={16}
          height={16}
          className={`shrink-0 text-muted transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          className="absolute z-30 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-border bg-surface p-1 shadow-xl shadow-black/5"
        >
          {options.map((opt) => {
            const selected = opt === value;
            return (
              <li key={opt}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                    selected
                      ? "bg-accent-soft font-medium text-accent-soft-foreground"
                      : "text-foreground hover:bg-surface-hover"
                  }`}
                >
                  {opt}
                  {selected ? (
                    <Check width={16} height={16} className="text-accent" />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
