export default function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  accent = "bg-accent-soft text-accent-soft-foreground",
}) {
  return (
    <div className="group rounded-2xl border border-border bg-surface p-5 transition hover:border-accent/40 hover:shadow-sm">
      <div className="flex items-center justify-between">
        {Icon ? (
          <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}>
            <Icon width={20} height={20} />
          </span>
        ) : null}
        {hint ? (
          <span className="text-xs font-medium text-muted">{hint}</span>
        ) : null}
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-foreground">{value}</p>
      <p className="mt-0.5 text-sm text-muted">{label}</p>
    </div>
  );
}
