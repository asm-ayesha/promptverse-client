"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Bookmark, CreditCard, Plus, ChartColumn } from "@gravity-ui/icons";
import { apiGet } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";

export default function DashboardOverview() {
  const { user, role, subscription } = useAuth();
  const [stats, setStats] = useState({ totalPrompts: 0, saved: 0 });

  useEffect(() => {
    Promise.all([
      apiGet("/api/users/me").catch(() => null),
      apiGet("/api/bookmarks").catch(() => []),
    ]).then(([me, saved]) => {
      setStats({
        totalPrompts: me?.totalPrompts || 0,
        saved: Array.isArray(saved) ? saved.length : 0,
      });
    });
  }, []);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] || "there"} 👋`}
        subtitle="Here's a quick look at your PromptVerse activity."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="My Prompts" value={stats.totalPrompts} icon={FileText} />
        <StatCard label="Saved Prompts" value={stats.saved} icon={Bookmark} />
        <StatCard
          label="Plan"
          value={subscription === "premium" ? "Premium" : "Free"}
          icon={CreditCard}
          accent={
            subscription === "premium"
              ? "bg-success-soft text-success-soft-foreground"
              : "bg-warning-soft text-warning-soft-foreground"
          }
        />
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <QuickLink href="/dashboard/add-prompt" icon={Plus} label="Add a Prompt" />
          <QuickLink href="/dashboard/my-prompts" icon={FileText} label="My Prompts" />
          {role === "creator" || role === "admin" ? (
            <QuickLink
              href={role === "admin" ? "/dashboard/admin/analytics" : "/dashboard/analytics"}
              icon={ChartColumn}
              label="View Analytics"
            />
          ) : null}
          {subscription !== "premium" ? (
            <QuickLink href="/payment" icon={CreditCard} label="Go Premium" />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function QuickLink({ href, icon: Icon, label }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-accent hover:text-accent"
    >
      <Icon width={16} height={16} /> {label}
    </Link>
  );
}
