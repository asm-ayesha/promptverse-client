import Link from "next/link";

// Only links with an href point to a real page. Items with href: null render
// as non-clickable text so we never redirect to a page that doesn't exist.
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
      { name: "Become a Creator", href: "/register" },
      { name: "Add Prompt", href: "/dashboard/add-prompt" },
      { name: "Guidelines", href: null },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "Demo Users", href: "/demo-users" },
      { name: "About", href: null },
      { name: "Contact", href: null },
    ],
  },
];

const XLogo = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookLogo = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramLogo = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.332.014 7.052.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const ThreadsLogo = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.781 3.631 2.695 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.358-.218-3.255-.801-1.06-.69-1.68-1.745-1.748-2.97-.066-1.196.408-2.295 1.336-3.094.886-.762 2.135-1.21 3.612-1.295a13.4 13.4 0 0 1 1.918.062c-.087-.526-.262-.943-.526-1.244-.36-.412-.917-.62-1.654-.625h-.02c-.59 0-1.39.163-1.901.93l-1.7-1.143c.686-1.024 1.8-1.588 3.601-1.588h.04c3.01.024 4.804 1.846 4.99 5.024.106.045.21.09.314.139 1.477.695 2.559 1.745 3.13 3.038.795 1.8.866 4.732-1.546 7.092-1.844 1.806-4.08 2.621-7.244 2.644Zm1.471-9.989c-.207 0-.418.006-.633.018-1.852.104-3.004.954-2.94 2.164.067 1.27 1.467 1.862 2.815 1.789 1.24-.067 2.852-.55 3.122-3.764a8.928 8.928 0 0 0-2.364-.207Z" />
  </svg>
);

const socials = [
  { name: "X", href: "https://x.com", Icon: XLogo },
  { name: "Facebook", href: "https://facebook.com", Icon: FacebookLogo },
  { name: "Instagram", href: "https://instagram.com", Icon: InstagramLogo },
  { name: "Threads", href: "https://threads.net", Icon: ThreadsLogo },
];

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
              {socials.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={name}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition hover:border-accent hover:bg-surface-hover hover:text-accent"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
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
                    {link.href ? (
                      <Link
                        href={link.href}
                        className="text-sm text-muted transition-colors hover:text-foreground"
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        title="Coming soon"
                        className="cursor-pointer text-left text-sm text-muted transition-colors hover:text-foreground"
                      >
                        {link.name}
                      </button>
                    )}
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
            <button
              type="button"
              title="Coming soon"
              className="cursor-pointer transition-colors hover:text-foreground"
            >
              Privacy
            </button>
            <button
              type="button"
              title="Coming soon"
              className="cursor-pointer transition-colors hover:text-foreground"
            >
              Terms
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
