"use client";

import Link from "next/link";
import { toast } from "react-toastify";
import { Copy, ShieldCheck, MagicWand, Person } from "@gravity-ui/icons";
import SectionHeading from "@/components/ui/SectionHeading";

const demoUsers = [
  {
    role: "Admin User",
    badge: "admin",
    email: "admin@aiverse.com",
    password: "123456",
    description:
      "System analytics, user management, prompt moderation and payments.",
    icon: ShieldCheck,
    accent: "from-purple-500 to-indigo-500",
    badgeClass: "bg-purple-500/15 text-purple-500",
  },
  {
    role: "Creator User",
    badge: "creator",
    email: "creator@aiverse.com",
    password: "123456",
    description: "Creator analytics, add/edit prompts and track views.",
    icon: MagicWand,
    accent: "from-cyan-500 to-blue-500",
    badgeClass: "bg-cyan-500/15 text-cyan-500",
  },
  {
    role: "Standard User",
    badge: "user",
    email: "user@aiverse.com",
    password: "123456",
    description: "Search prompts, copy, save, write reviews and go premium.",
    icon: Person,
    accent: "from-emerald-500 to-green-500",
    badgeClass: "bg-emerald-500/15 text-emerald-500",
  },
];

export default function DemoUsersPage() {
  const copy = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <SectionHeading
        eyebrow="For Reviewers"
        title="Demo Accounts"
        subtitle="Pick a role and jump straight in — credentials are pre-filled on the login page."
      />

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {demoUsers.map((u) => {
          const Icon = u.icon;
          return (
            <div
              key={u.email}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
            >
              <div className={`h-1.5 w-full bg-gradient-to-r ${u.accent}`} />
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${u.accent} text-white`}
                  >
                    <Icon width={24} height={24} />
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${u.badgeClass}`}
                  >
                    {u.badge}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {u.role}
                </h3>
                <p className="mt-1 flex-1 text-sm text-muted">{u.description}</p>

                <div className="mt-5 space-y-2">
                  <CredRow
                    label="Email"
                    value={u.email}
                    onCopy={() => copy(u.email, "Email")}
                  />
                  <CredRow
                    label="Password"
                    value={u.password}
                    onCopy={() => copy(u.password, "Password")}
                  />
                </div>

                <Link
                  href={`/login?email=${encodeURIComponent(
                    u.email
                  )}&password=${encodeURIComponent(u.password)}`}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-accent-hover"
                >
                  Go to Login
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CredRow({ label, value, onCopy }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2">
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wide text-muted">{label}</p>
        <p className="truncate text-sm text-foreground">{value}</p>
      </div>
      <button
        type="button"
        onClick={onCopy}
        aria-label={`Copy ${label}`}
        className="ml-2 rounded-md p-1.5 text-muted transition hover:bg-surface-hover hover:text-foreground"
      >
        <Copy width={16} height={16} />
      </button>
    </div>
  );
}
