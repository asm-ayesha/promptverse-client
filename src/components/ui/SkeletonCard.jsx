export default function SkeletonCard() {
  return (
    <div className="h-full overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="h-40 w-full animate-pulse bg-surface-secondary" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-3/4 animate-pulse rounded bg-surface-secondary" />
        <div className="h-3 w-full animate-pulse rounded bg-surface-secondary" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-surface-secondary" />
        <div className="flex gap-2 pt-2">
          <div className="h-6 w-16 animate-pulse rounded-full bg-surface-secondary" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-surface-secondary" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
