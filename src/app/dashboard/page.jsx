"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Bookmark,
  CreditCard,
  Plus,
  ChartColumn,
  Star,
  ArrowRight,
} from "@gravity-ui/icons";
import { apiGet } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import StatCard from "@/components/dashboard/StatCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function DashboardOverview() {
  const router = useRouter();
  const { user, role, subscription } = useAuth();
  const [stats, setStats] = useState({ totalPrompts: 0, saved: 0 });

  // Admins land on the analytics page instead of an overview.
  useEffect(() => {
    if (role === "admin") router.replace("/dashboard/admin/analytics");
  }, [role, router]);

  useEffect(() => {
    if (role === "admin") return;
    Promise.all([
      apiGet("/api/users/me").catch(() => null),
      apiGet("/api/bookmarks").catch(() => []),
    ]).then(([me, saved]) => {
      setStats({
        totalPrompts: me?.totalPrompts || 0,
        saved: Array.isArray(saved) ? saved.length : 0,
      });
    });
  }, [role]);

  if (role === "admin") return <LoadingSpinner fullPage />;

  const isPremium = subscription === "premium";

  const actions = [
    {
      href: "/dashboard/add-prompt",
      icon: Plus,
      title: "Add a Prompt",
      desc: "Share a new prompt with the community.",
    },
    {
      href: "/dashboard/my-prompts",
      icon: FileText,
      title: "My Prompts",
      desc: "Manage and track your prompts.",
    },
    {
      href: "/dashboard/saved",
      icon: Bookmark,
      title: "Saved Prompts",
      desc: "Revisit prompts you bookmarked.",
    },
    ...(role === "creator" || role === "admin"
      ? [
          {
            href: role === "admin" ? "/dashboard/admin/analytics" : "/dashboard/analytics",
            icon: ChartColumn,
            title: "View Analytics",
            desc: "See how your prompts perform.",
          },
        ]
      : []),
    ...(!isPremium
      ? [
          {
            href: "/payment",
            icon: CreditCard,
            title: "Go Premium",
            desc: "Unlock every premium prompt.",
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-linear-to-br from-indigo-500 via-blue-500 to-cyan-400 px-6 py-7 text-white md:px-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
            <Star width={13} height={13} /> {isPremium ? "Premium member" : "Free plan"}
          </span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
            Welcome back, {user?.name?.split(" ")[0] || "there"} 👋
          </h1>
          <p className="mt-1 text-sm text-white/90">
            Here&apos;s a quick look at your PromptVerse activity.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="My Prompts" value={stats.totalPrompts} icon={FileText} />
        <StatCard label="Saved Prompts" value={stats.saved} icon={Bookmark} />
        <StatCard
          label="Current Plan"
          value={isPremium ? "Premium" : "Free"}
          icon={CreditCard}
          hint={isPremium ? "Active" : "Upgrade available"}
          accent={
            isPremium
              ? "bg-success-soft text-success-soft-foreground"
              : "bg-warning-soft text-warning-soft-foreground"
          }
        />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Quick actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((a) => (
            <QuickCard key={a.href} {...a} />
          ))}
        </div>
      </div>
    </div>
  );
}

function QuickCard({ href, icon: Icon, title, desc }) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 transition hover:border-accent/40 hover:shadow-sm"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-soft-foreground transition group-hover:bg-accent group-hover:text-accent-foreground">
        <Icon width={20} height={20} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold text-foreground">{title}</p>
          <ArrowRight
            width={16}
            height={16}
            className="shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-accent"
          />
        </div>
        <p className="mt-0.5 text-sm text-muted">{desc}</p>
      </div>
    </Link>
  );
}
