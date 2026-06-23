"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { Pencil, TrashBin, Plus, ChartColumn, Eye, Star } from "@gravity-ui/icons";
import { apiGet, apiDelete } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import PromptForm from "@/components/dashboard/PromptForm";
import PromptAnalyticsModal from "@/components/dashboard/PromptAnalyticsModal";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";

const statusStyles = {
  approved: "bg-success-soft text-success-soft-foreground",
  pending: "bg-warning-soft text-warning-soft-foreground",
  rejected: "bg-danger-soft text-danger-soft-foreground",
};

export default function MyPromptsPage() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    apiGet("/api/my/prompts")
      .then((data) => setPrompts(Array.isArray(data) ? data : []))
      .catch(() => setPrompts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiDelete(`/api/prompts/${deleteTarget._id}`);
      toast.error("Prompt deleted");
      setPrompts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || "Could not delete");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <PageHeader
        title="My Prompts"
        subtitle="Manage the prompts you've created."
        action={
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-accent-hover"
          >
            <Plus width={16} height={16} /> Add Prompt
          </button>
        }
      />

      {prompts.length === 0 ? (
        <EmptyState
          title="No prompts yet"
          description="Create your first prompt to get started."
          action={
            <button
              onClick={() => setCreating(true)}
              className="flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-accent-hover"
            >
              <Plus width={16} height={16} /> Add Prompt
            </button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="border-b border-border text-muted">
                <tr>
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Visibility</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Copies &amp; Rating</th>
                  <th className="px-5 py-3 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {prompts.map((p) => (
                  <tr key={p._id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 font-medium text-foreground">
                      <Link href={`/prompts/${p._id}`} className="hover:text-accent">
                        {p.title}
                      </Link>
                      {p.status === "rejected" && p.rejectionFeedback ? (
                        <p className="mt-1 text-xs text-danger">
                          Feedback: {p.rejectionFeedback}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-5 py-3 text-muted">{p.category}</td>
                    <td className="px-5 py-3 capitalize text-muted">{p.visibility}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                          statusStyles[p.status] || "bg-surface-secondary text-muted"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 whitespace-nowrap text-muted">
                        <span>
                          <span className="font-medium text-foreground">
                            {p.copyCount || 0}
                          </span>{" "}
                          copies
                        </span>
                        <span className="text-border">|</span>
                        {p.reviewCount > 0 ? (
                          <span className="inline-flex items-center gap-1">
                            <Star width={14} height={14} className="text-amber-400" />
                            <span className="font-medium text-foreground">
                              {(p.avgRating || 0).toFixed(1)}
                            </span>
                            <span className="text-xs">({p.reviewCount})</span>
                          </span>
                        ) : (
                          <span className="text-xs">No reviews</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/prompts/${p._id}`}
                          aria-label="View"
                          title="View"
                          className="rounded-md p-1.5 text-muted transition hover:bg-surface-hover hover:text-accent"
                        >
                          <Eye width={16} height={16} />
                        </Link>
                        <button
                          onClick={() => setEditing(p)}
                          aria-label="Edit"
                          title="Edit"
                          className="rounded-md p-1.5 text-muted transition hover:bg-surface-hover hover:text-accent"
                        >
                          <Pencil width={16} height={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          aria-label="Delete"
                          title="Delete"
                          className="rounded-md p-1.5 text-muted transition hover:bg-surface-hover hover:text-danger"
                        >
                          <TrashBin width={16} height={16} />
                        </button>
                        <button
                          onClick={() => setAnalytics(p)}
                          aria-label="Analytics"
                          title="Analytics"
                          className="rounded-md p-1.5 text-muted transition hover:bg-surface-hover hover:text-accent"
                        >
                          <ChartColumn width={16} height={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={creating} onClose={() => setCreating(false)} title="Add Prompt" size="xl">
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          <PromptForm
            embedded
            onSuccess={() => {
              setCreating(false);
              load();
            }}
          />
        </div>
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit Prompt" size="xl">
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          <PromptForm
            embedded
            initial={editing}
            onSuccess={() => {
              setEditing(null);
              load();
            }}
          />
        </div>
      </Modal>

      <PromptAnalyticsModal
        open={!!analytics}
        prompt={analytics}
        prompts={prompts}
        onClose={() => setAnalytics(null)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete prompt"
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
