import Link from "next/link";

const sections = [
  {
    title: "Product",
    links: [
      { name: "All Prompts", href: "/all-prompts" },
      { name: "Premium", href: "/payment" },
      { name: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Creators",
    links: [
      { name: "Become a Creator", href: "/dashboard" },
      { name: "Add Prompt", href: "/dashboard/add-prompt" },
      { name: "Guidelines", href: "/all-prompts" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "Demo Users", href: "/demo-users" },
      { name: "About", href: "/" },
      { name: "Contact", href: "/" },
    ],
  },
];

const XLogo = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tl from-sky-400 via-blue-500 to-indigo-600">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
                  <path d="M12 2L13.9 8.1L20 10L13.9 11.9L12 18L10.1 11.9L4 10L10.1 8.1L12 2Z" />
                </svg>
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-cyan-300" />
              </div>
              <span className="brand-gradient text-lg font-bold tracking-tight">
                PromptVerse
              </span>
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-7 text-muted">
              The marketplace for expert AI prompts. Discover, share and sell
              prompts that get results.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition hover:bg-surface-hover"
              >
                <XLogo className="h-4 w-4" />
              </a>
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest text-muted">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="my-12 border-t border-separator" />

        <div className="flex flex-col gap-4 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>© 2026 PromptVerse AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/" className="transition-colors hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
