export default function SectionHeading({ eyebrow, title, subtitle, center = true }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? (
        <span className="inline-block rounded-full border border-border bg-accent-soft px-3 py-1 text-xs font-medium text-accent-soft-foreground">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 text-sm text-muted md:text-base">{subtitle}</p>
      ) : null}
    </div>
  );
}
