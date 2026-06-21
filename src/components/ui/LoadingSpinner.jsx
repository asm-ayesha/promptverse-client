export default function LoadingSpinner({ fullPage = false, label = "Loading..." }) {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-separator border-t-accent" />
      {label ? <p className="text-sm text-muted">{label}</p> : null}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        {spinner}
      </div>
    );
  }
  return <div className="flex w-full items-center justify-center py-10">{spinner}</div>;
}
