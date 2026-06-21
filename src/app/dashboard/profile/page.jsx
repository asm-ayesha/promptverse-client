"use client";

import Link from "next/link";
import { CreditCard } from "@gravity-ui/icons";
import { useAuth } from "@/hooks/useAuth";
import PageHeader from "@/components/dashboard/PageHeader";

export default function ProfilePage() {
  const { user, role, subscription } = useAuth();

  return (
    <div>
      <PageHeader title="Profile" subtitle="Your account details." />

      <div className="max-w-xl rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-center gap-4">
          {user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-2xl font-semibold text-accent-foreground">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </span>
          )}
          <div>
            <h2 className="text-xl font-semibold text-foreground">{user?.name}</h2>
            <p className="text-sm text-muted">{user?.email}</p>
          </div>
        </div>

        <dl className="mt-6 divide-y divide-border">
          <Row label="Role" value={<span className="capitalize">{role}</span>} />
          <Row
            label="Subscription"
            value={
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                  subscription === "premium"
                    ? "bg-success-soft text-success-soft-foreground"
                    : "bg-warning-soft text-warning-soft-foreground"
                }`}
              >
                {subscription}
              </span>
            }
          />
        </dl>

        {subscription !== "premium" ? (
          <Link
            href="/payment"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-accent-hover"
          >
            <CreditCard width={16} height={16} /> Upgrade to Premium
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-3">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
