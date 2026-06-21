"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Plus,
  FileText,
  Bookmark,
  Star,
  Person,
  ChartColumn,
  Persons,
  ShieldCheck,
  Receipt,
  Flag,
  CreditCard,
  Bars,
  Xmark,
} from "@gravity-ui/icons";
import { useAuth } from "@/hooks/useAuth";

const itemsByRole = {
  common: [{ href: "/dashboard", label: "Overview", icon: House }],
  user: [
    { href: "/dashboard/add-prompt", label: "Add Prompt", icon: Plus },
    { href: "/dashboard/my-prompts", label: "My Prompts", icon: FileText },
    { href: "/dashboard/saved", label: "Saved", icon: Bookmark },
    { href: "/dashboard/my-reviews", label: "My Reviews", icon: Star },
    { href: "/payment", label: "Upgrade to Premium", icon: CreditCard },
  ],
  creator: [
    { href: "/dashboard/analytics", label: "Analytics", icon: ChartColumn },
    { href: "/dashboard/add-prompt", label: "Add Prompt", icon: Plus },
    { href: "/dashboard/my-prompts", label: "My Prompts", icon: FileText },
  ],
  admin: [
    { href: "/dashboard/admin/analytics", label: "Analytics", icon: ChartColumn },
    { href: "/dashboard/admin/users", label: "All Users", icon: Persons },
    { href: "/dashboard/admin/prompts", label: "All Prompts", icon: ShieldCheck },
    { href: "/dashboard/admin/payments", label: "All Payments", icon: Receipt },
    { href: "/dashboard/admin/reports", label: "Reported Prompts", icon: Flag },
  ],
  profile: [{ href: "/dashboard/profile", label: "Profile", icon: Person }],
};

export default function DashboardSidebar() {
  const { user, role } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Admins use Analytics as their main page (no separate Overview).
  const workspaceItems =
    role === "admin"
      ? itemsByRole.admin
      : [...itemsByRole.common, ...(itemsByRole[role] || itemsByRole.user)];

  const sections = [
    { title: "Workspace", items: workspaceItems },
    { title: "Account", items: itemsByRole.profile },
  ];

  const NavList = () => (
    <nav className="space-y-5">
      {sections.map((section) => (
        <div key={section.title}>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted/70">
            {section.title}
          </p>
          <div className="space-y-1">
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-accent text-accent-foreground shadow-sm shadow-accent/20"
                      : "text-muted hover:bg-surface-hover hover:text-foreground"
                  }`}
                >
                  <Icon
                    width={18}
                    height={18}
                    className={active ? "" : "text-muted group-hover:text-foreground"}
                  />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  const Profile = () => (
    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-border bg-linear-to-br from-surface to-background p-3">
      {user?.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.image}
          alt={user.name}
          className="h-11 w-11 rounded-full object-cover ring-2 ring-accent/30"
        />
      ) : (
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground ring-2 ring-accent/30">
          {(user?.name || "U").charAt(0).toUpperCase()}
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">{user?.name}</p>
        <span className="inline-block rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium capitalize text-accent-soft-foreground">
          {role}
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="mb-4 flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm text-foreground lg:hidden"
      >
        <Bars width={18} height={18} /> Menu
      </button>

      {/* Desktop sidebar */}
      <aside className="sticky top-24 hidden h-fit w-64 shrink-0 self-start rounded-2xl border border-border bg-surface p-4 lg:block">
        <Profile />
        <NavList />
      </aside>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-100 lg:hidden">
          <div
            className="absolute inset-0 bg-backdrop/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 overflow-y-auto border-r border-border bg-surface p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Menu</span>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <Xmark width={20} height={20} />
              </button>
            </div>
            <Profile />
            <NavList />
          </div>
        </div>
      ) : null}
    </>
  );
}
