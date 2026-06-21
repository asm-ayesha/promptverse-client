import { Folder } from "@gravity-ui/icons";

export default function EmptyState({
  title = "Nothing here yet",
  description = "There is no data to display.",
  icon: Icon = Folder,
  action = null,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent-soft-foreground">
        <Icon width={26} height={26} />
      </div>
      <h3 className="mt-4 text-lg font-medium text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
