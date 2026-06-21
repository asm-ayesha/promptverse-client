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
    { href: "/dashboard/admin/users", label: "Users", icon: Persons },
    { href: "/dashboard/admin/prompts", label: "Prompts", icon: ShieldCheck },
    { href: "/dashboard/admin/payments", label: "Payments", icon: Receipt },
    { href: "/dashboard/admin/reports", label: "Reports", icon: Flag },
  ],
  profile: [{ href: "/dashboard/profile", label: "Profile", icon: Person }],
};

export default function DashboardSidebar() {
  const { user, role } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    ...itemsByRole.common,
    ...(itemsByRole[role] || itemsByRole.user),
    ...itemsByRole.profile,
  ];

  const NavList = () => (
    <nav className="space-y-1">
      {links.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              active
                ? "bg-accent text-accent-foreground"
                : "text-muted hover:bg-surface-hover hover:text-foreground"
            }`}
          >
            <Icon width={18} height={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const Profile = () => (
    <div className="mb-6 flex items-center gap-3 rounded-xl border border-border bg-background p-3">
      {user?.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.image}
          alt={user.name}
          className="h-10 w-10 rounded-full object-cover"
        />
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
          {(user?.name || "U").charAt(0).toUpperCase()}
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{user?.name}</p>
        <span className="text-xs capitalize text-accent">{role}</span>
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
      <aside className="hidden h-fit w-64 shrink-0 rounded-2xl border border-border bg-surface p-4 lg:block">
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
