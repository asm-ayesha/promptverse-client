"use client";

import { TriangleExclamation } from "@gravity-ui/icons";

export default function Error({ error, reset }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-soft text-danger-soft-foreground">
        <TriangleExclamation width={30} height={30} />
      </span>
      <h1 className="mt-6 text-2xl font-semibold text-foreground md:text-3xl">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-muted">
        {error?.message || "An unexpected error occurred. Please try again."}
      </p>
      <button
        onClick={() => reset()}
        className="mt-8 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-accent-hover"
      >
        Try Again
      </button>
    </div>
  );
}
