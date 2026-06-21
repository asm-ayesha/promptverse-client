export default function ChartCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">{title}</h3>
      <div className="h-72 w-full">{children}</div>
    </div>
  );
}
