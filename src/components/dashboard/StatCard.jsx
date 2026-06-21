export default function StatCard({ label, value, icon: Icon, accent = "bg-accent-soft text-accent-soft-foreground" }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5">
      {Icon ? (
        <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${accent}`}>
          <Icon width={22} height={22} />
        </span>
      ) : null}
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted">{label}</p>
      </div>
    </div>
  );
}
