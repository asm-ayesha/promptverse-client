"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bars, Xmark, ArrowRightFromSquare } from "@gravity-ui/icons";

import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth-client";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "All Prompts", href: "/all-prompts" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    setIsOpen(false);
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tl from-sky-400 via-blue-500 to-indigo-600 shadow-lg">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
              <path d="M12 2L13.9 8.1L20 10L13.9 11.9L12 18L10.1 11.9L4 10L10.1 8.1L12 2Z" />
            </svg>
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-cyan-300" />
          </div>
          <span className="brand-gradient text-lg font-bold tracking-tight">
            PromptVerse
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="text-sm font-medium text-muted transition-colors hover:text-accent"
              >
                {item.name}
              </Link>
            </li>
          ))}
          {isAuthenticated ? (
            <li>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted transition-colors hover:text-accent"
              >
                Dashboard
              </Link>
            </li>
          ) : null}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle />
          <div className="h-5 w-px bg-separator" />

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Avatar user={user} />
                <span className="max-w-[120px] truncate text-sm font-medium text-foreground">
                  {user?.name}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-muted transition hover:text-accent"
              >
                <ArrowRightFromSquare width={16} height={16} />
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-muted hover:text-accent"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:bg-accent-hover"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            className="rounded-lg p-2 hover:bg-surface-hover"
          >
            {isOpen ? <Xmark width={22} height={22} /> : <Bars width={22} height={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-border md:hidden">
          <div className="flex flex-col px-4 py-4">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="py-3 text-foreground hover:text-accent"
              >
                {item.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="py-3 text-foreground hover:text-accent"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="mt-2 rounded-full border border-border py-2 text-sm text-foreground"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="py-3 text-foreground hover:text-accent"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="mt-2 rounded-full bg-accent py-2 text-center text-sm font-semibold text-accent-foreground"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

function Avatar({ user }) {
  const src = user?.image || user?.photoURL;
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={user?.name || "User"}
        className="h-8 w-8 rounded-full object-cover ring-2 ring-border"
      />
    );
  }
  const initial = (user?.name || "U").charAt(0).toUpperCase();
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
      {initial}
    </span>
  );
}

export default Navbar;
