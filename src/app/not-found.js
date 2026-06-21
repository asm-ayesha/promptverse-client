import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="brand-gradient text-7xl font-bold md:text-9xl">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-foreground md:text-3xl">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-accent-hover"
      >
        Back to Home
      </Link>
    </div>
  );
}
