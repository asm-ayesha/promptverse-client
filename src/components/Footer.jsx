import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-background text-foreground border-t border-divider">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Top Section */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tl from-sky-400 via-blue-500 to-indigo-600">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-white"
                  fill="currentColor"
                >
                  <path d="M12 2L13.9 8.1L20 10L13.9 11.9L12 18L10.1 11.9L4 10L10.1 8.1L12 2Z" />
                </svg>

                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-cyan-300" />
              </div>

              <span className="bg-linaer-to-r from-indigo-600 via-blue-500 to-cyan-400 bg-clip-text text-lg font-bold tracking-tight ">
                PromptVerse
              </span>
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-7 text-default-500">
              The world`s largest marketplace for expert AI prompts.
              Built for power users.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest text-default-400">
              Product
            </h3>

            <ul className="space-y-4">
              <li>
                <Link
                  href="/marketplace"
                  className="text-default-600 transition-colors hover:text-foreground"
                >
                  Marketplace
                </Link>
              </li>

              <li>
                <Link
                  href="/pricing"
                  className="text-default-600 transition-colors hover:text-foreground"
                >
                  Pricing
                </Link>
              </li>

              <li>
                <Link
                  href="/api"
                  className="text-default-600 transition-colors hover:text-foreground"
                >
                  API
                </Link>
              </li>

              <li>
                <Link
                  href="/changelog"
                  className="text-default-600 transition-colors hover:text-foreground"
                >
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          {/* Creators */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest text-default-400">
              Creators
            </h3>

            <ul className="space-y-4">
              <li>
                <Link
                  href="/sell-prompts"
                  className="text-default-600 transition-colors hover:text-foreground"
                >
                  Sell Prompts
                </Link>
              </li>

              <li>
                <Link
                  href="/analytics"
                  className="text-default-600 transition-colors hover:text-foreground"
                >
                  Analytics
                </Link>
              </li>

              <li>
                <Link
                  href="/payouts"
                  className="text-default-600 transition-colors hover:text-foreground"
                >
                  Payouts
                </Link>
              </li>

              <li>
                <Link
                  href="/guidelines"
                  className="text-default-600 transition-colors hover:text-foreground"
                >
                  Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest text-default-400">
              Company
            </h3>

            <ul className="space-y-4">
              <li>
                <Link
                  href="/about"
                  className="text-default-600 transition-colors hover:text-foreground"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  href="/blog"
                  className="text-default-600 transition-colors hover:text-foreground"
                >
                  Blog
                </Link>
              </li>

              <li>
                <Link
                  href="/careers"
                  className="text-default-600 transition-colors hover:text-foreground"
                >
                  Careers
                </Link>
              </li>

              <li>
                <Link
                  href="/press"
                  className="text-default-600 transition-colors hover:text-foreground"
                >
                  Press
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 border-t border-divider" />

        {/* Bottom Section */}
        <div className="flex flex-col gap-4 text-sm text-default-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 PromptVerse AI. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="transition-colors hover:text-foreground"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="transition-colors hover:text-foreground"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;