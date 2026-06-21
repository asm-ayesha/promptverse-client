"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { apiGet, apiPatch } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";

const statusStyles = {
  open: "bg-warning-soft text-warning-soft-foreground",
  "resolved-removed": "bg-danger-soft text-danger-soft-foreground",
  "creator-warned": "bg-accent-soft text-accent-soft-foreground",
  dismissed: "bg-surface-secondary text-muted",
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet("/api/admin/reports")
      .then((data) => setReports(Array.isArray(data) ? data : []))
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, []);

  const act = async (report, action) => {
    try {
      await apiPatch(`/api/admin/reports/${report._id}`, { action });
      const statusMap = {
        remove: "resolved-removed",
        warn: "creator-warned",
        dismiss: "dismissed",
      };
      setReports((prev) =>
        prev.map((r) =>
          r._id === report._id ? { ...r, status: statusMap[action] } : r
        )
      );
      toast.success("Report updated");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <PageHeader title="Reports" subtitle="Review reported prompts." />
      {reports.length === 0 ? (
        <EmptyState title="No reports" description="No prompt reports to review." />
      ) : (
        <div className="space-y-4">
          {reports.map((r) => (
            <div
              key={r._id}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{r.reason}</p>
                  {r.description ? (
                    <p className="mt-1 text-sm text-muted">{r.description}</p>
                  ) : null}
                  <p className="mt-2 text-xs text-muted">
                    Reported by {r.reporterName || r.reporterEmail} ·{" "}
                    <Link
                      href={`/prompts/${r.promptId}`}
                      className="text-accent hover:underline"
                    >
                      View prompt
                    </Link>
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    statusStyles[r.status] || "bg-surface-secondary text-muted"
                  }`}
                >
                  {r.status}
                </span>
              </div>

              {r.status === "open" ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => act(r, "remove")}
                    className="rounded-full bg-danger px-4 py-2 text-xs font-semibold text-danger-foreground transition hover:bg-danger-hover"
                  >
                    Remove Prompt
                  </button>
                  <button
                    onClick={() => act(r, "warn")}
                    className="rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground transition hover:bg-surface-hover"
                  >
                    Warn Creator
                  </button>
                  <button
                    onClick={() => act(r, "dismiss")}
                    className="rounded-full border border-border px-4 py-2 text-xs font-medium text-muted transition hover:bg-surface-hover"
                  >
                    Dismiss
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
