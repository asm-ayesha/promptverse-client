"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  TriangleExclamation,
  FileText,
  CircleXmark,
  Bell,
  CircleCheck,
} from "@gravity-ui/icons";
import { apiGet, apiPatch } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import Pagination from "@/components/ui/Pagination";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";

const statusMeta = {
  open: { label: "Open", className: "bg-warning-soft text-warning-soft-foreground" },
  "resolved-removed": {
    label: "Removed",
    className: "bg-danger-soft text-danger-soft-foreground",
  },
  "creator-warned": {
    label: "Creator warned",
    className: "bg-accent-soft text-accent-soft-foreground",
  },
  dismissed: { label: "Dismissed", className: "bg-surface-secondary text-muted" },
};

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

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

  const safePage = Math.min(page, Math.max(1, Math.ceil(reports.length / PAGE_SIZE)));
  const pageItems = reports.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const openCount = reports.filter((r) => r.status === "open").length;
  const resolvedCount = reports.length - openCount;

  return (
    <div>
      <PageHeader title="Reports" subtitle="Review reported prompts." />
      {reports.length === 0 ? (
        <EmptyState title="No reports" description="No prompt reports to review." />
      ) : (
        <>
          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatPill label="Total reports" value={reports.length} tone="neutral" />
            <StatPill label="Open" value={openCount} tone="warning" />
            <StatPill label="Resolved" value={resolvedCount} tone="success" />
          </div>

          <div className="space-y-4">
            {pageItems.map((r) => {
              const status = statusMeta[r.status] || statusMeta.dismissed;
              return (
                <div
                  key={r._id}
                  className="group rounded-2xl border border-border bg-surface p-4 transition duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg hover:shadow-black/5 sm:p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <Link
                      href={`/prompts/${r.promptId}`}
                      className="group flex shrink-0 items-start gap-3 sm:w-60"
                    >
                      {r.promptThumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={r.promptThumbnail}
                          alt=""
                          className="h-14 w-14 shrink-0 rounded-xl object-cover ring-1 ring-border"
                        />
                      ) : (
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-soft-foreground">
                          <FileText width={20} height={20} />
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground group-hover:text-accent">
                          {r.promptTitle || "Unknown prompt"}
                        </p>
                        <p className="truncate text-xs text-muted">
                          {r.creatorName ? `by ${r.creatorName}` : r.promptCategory || "—"}
                        </p>
                      </div>
                    </Link>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-danger-soft px-2.5 py-1 text-xs font-semibold text-danger-soft-foreground">
                          <TriangleExclamation width={13} height={13} />
                          {r.reason}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </div>
                      {r.description ? (
                        <p className="mt-2 text-sm text-muted">{r.description}</p>
                      ) : null}
                      <div className="mt-3 flex">
                        <div className="ml-auto inline-flex max-w-full items-center gap-3 rounded-xl bg-surface-secondary/40 px-3 py-2">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                            {(r.reporterName || r.reporterEmail || "?").charAt(0).toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-foreground">
                              <span className="text-muted">Reported by </span>
                              {r.reporterName || "Unknown"}
                            </p>
                            <p className="truncate text-xs text-muted">
                              {r.reporterEmail}
                            </p>
                          </div>
                          <span className="shrink-0 border-l border-border pl-3 text-xs text-muted">
                            {formatDate(r.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {r.status === "open" ? (
                    <div className="mt-4 flex flex-wrap justify-center gap-2 border-t border-border pt-4">
                      <button
                        onClick={() => act(r, "remove")}
                        className="inline-flex items-center gap-1.5 rounded-full bg-danger px-4 py-2 text-xs font-semibold text-danger-foreground transition hover:bg-danger-hover"
                      >
                        <CircleXmark width={14} height={14} />
                        Remove Prompt
                      </button>
                      <button
                        onClick={() => act(r, "warn")}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground transition hover:bg-surface-hover"
                      >
                        <Bell width={14} height={14} />
                        Warn Creator
                      </button>
                      <button
                        onClick={() => act(r, "dismiss")}
                        className="inline-flex items-center gap-1.5 rounded-full border border-success/40 bg-success-soft px-4 py-2 text-xs font-semibold text-success-soft-foreground transition hover:bg-success hover:text-success-foreground"
                      >
                        <CircleCheck width={14} height={14} />
                        Dismiss
                      </button>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          {reports.length > PAGE_SIZE ? (
            <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-surface">
              <Pagination
                page={safePage}
                pageSize={PAGE_SIZE}
                total={reports.length}
                onChange={setPage}
              />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

function StatPill({ label, value, tone }) {
  const tones = {
    neutral: "text-foreground",
    warning: "text-warning-soft-foreground",
    success: "text-success-soft-foreground",
  };
  return (
    <div className="rounded-2xl border border-border bg-surface px-4 py-3">
      <p className="text-xs text-muted">{label}</p>
      <p className={`mt-0.5 text-2xl font-bold ${tones[tone] || tones.neutral}`}>
        {value}
      </p>
    </div>
  );
}
