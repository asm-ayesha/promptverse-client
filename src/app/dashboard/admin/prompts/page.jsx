"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { CircleCheck, CircleXmark, Star, StarFill, TrashBin, FileText } from "@gravity-ui/icons";
import { apiGet, apiPatch, apiDelete } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import Modal from "@/components/ui/Modal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Pagination from "@/components/ui/Pagination";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";

const statusStyles = {
  approved: "bg-success-soft text-success-soft-foreground",
  pending: "bg-warning-soft text-warning-soft-foreground",
  rejected: "bg-danger-soft text-danger-soft-foreground",
};

export default function AdminPromptsPage() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejecting, setRejecting] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    apiGet("/api/admin/prompts")
      .then((data) => setPrompts(Array.isArray(data) ? data : []))
      .catch(() => setPrompts([]))
      .finally(() => setLoading(false));
  }, []);

  const setLocal = (id, patch) =>
    setPrompts((prev) => prev.map((p) => (p._id === id ? { ...p, ...patch } : p)));

  const approve = async (p) => {
    try {
      await apiPatch(`/api/admin/prompts/${p._id}/approve`);
      setLocal(p._id, { status: "approved", rejectionFeedback: "" });
      toast.success("Prompt approved");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const toggleFeature = async (p) => {
    try {
      await apiPatch(`/api/admin/prompts/${p._id}/feature`);
      setLocal(p._id, { featured: !p.featured });
      toast.success(p.featured ? "Removed from featured" : "Marked as featured");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const submitReject = async (e) => {
    e.preventDefault();
    try {
      await apiPatch(`/api/admin/prompts/${rejecting._id}/reject`, { feedback });
      setLocal(rejecting._id, { status: "rejected", rejectionFeedback: feedback });
      toast.success("Prompt rejected");
      setRejecting(null);
      setFeedback("");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiDelete(`/api/admin/prompts/${deleteTarget._id}`);
      setPrompts((prev) => prev.filter((x) => x._id !== deleteTarget._id));
      toast.success("Prompt deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  const safePage = Math.min(page, Math.max(1, Math.ceil(prompts.length / PAGE_SIZE)));
  const pageItems = prompts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div>
      <PageHeader title="Prompts" subtitle="Moderate and feature prompts." />
      {prompts.length === 0 ? (
        <EmptyState title="No prompts" description="No prompts to moderate." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed text-left text-sm">
              <thead className="border-b border-border bg-surface-secondary/40 text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="w-[26%] px-5 py-3.5 font-semibold">Prompt</th>
                  <th className="w-[16%] px-5 py-3.5 font-semibold">Creator</th>
                  <th className="w-[13%] px-5 py-3.5 font-semibold">AI Tool</th>
                  <th className="w-[12%] px-5 py-3.5 font-semibold">Visibility</th>
                  <th className="w-[12%] px-5 py-3.5 font-semibold">Status</th>
                  <th className="w-[21%] px-5 py-3.5 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b border-border transition last:border-0 hover:bg-surface-hover/50"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {p.thumbnailUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.thumbnailUrl}
                            alt=""
                            className="h-10 w-10 shrink-0 rounded-lg object-cover ring-1 ring-border"
                          />
                        ) : (
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent-soft-foreground">
                            <FileText width={18} height={18} />
                          </span>
                        )}
                        <div className="min-w-0">
                          <Link
                            href={`/prompts/${p._id}`}
                            className="block truncate font-medium text-foreground hover:text-accent"
                          >
                            {p.title}
                          </Link>
                          <p className="truncate text-xs text-muted">{p.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        {p.creatorImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.creatorImage}
                            alt={p.creatorName}
                            className="h-7 w-7 shrink-0 rounded-full object-cover ring-1 ring-border"
                          />
                        ) : (
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-accent-foreground">
                            {(p.creatorName || "U").charAt(0).toUpperCase()}
                          </span>
                        )}
                        <span className="truncate text-muted">{p.creatorName}</span>
                      </div>
                    </td>
                    <td className="truncate px-5 py-3 text-muted">{p.aiTool || "—"}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                          p.visibility === "private"
                            ? "bg-warning-soft text-warning-soft-foreground"
                            : "bg-success-soft text-success-soft-foreground"
                        }`}
                      >
                        {p.visibility === "private" ? "Premium" : "Public"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                          statusStyles[p.status] || "bg-surface-secondary text-muted"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-nowrap items-center justify-end gap-1">
                        <IconBtn
                          title="Approve"
                          onClick={() => approve(p)}
                          className="hover:text-success"
                        >
                          <CircleCheck width={16} height={16} />
                        </IconBtn>
                        <IconBtn
                          title="Reject"
                          onClick={() => setRejecting(p)}
                          className="hover:text-danger"
                        >
                          <CircleXmark width={16} height={16} />
                        </IconBtn>
                        <IconBtn
                          title="Feature"
                          onClick={() => toggleFeature(p)}
                          className="hover:text-warning"
                        >
                          {p.featured ? (
                            <StarFill width={16} height={16} className="text-warning" />
                          ) : (
                            <Star width={16} height={16} />
                          )}
                        </IconBtn>
                        <IconBtn
                          title="Delete"
                          onClick={() => setDeleteTarget(p)}
                          className="hover:text-danger"
                        >
                          <TrashBin width={16} height={16} />
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={safePage}
            pageSize={PAGE_SIZE}
            total={prompts.length}
            onChange={setPage}
          />
        </div>
      )}

      <Modal
        open={!!rejecting}
        onClose={() => setRejecting(null)}
        title="Reject Prompt"
      >
        <form onSubmit={submitReject} className="space-y-4">
          <p className="text-sm text-muted">
            Provide feedback for the creator on why this prompt was rejected.
          </p>
          <textarea
            required
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Reason for rejection..."
            className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted hover:border-muted/60 focus:border-focus focus:ring-2 focus:ring-focus/30"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-danger px-4 py-2.5 text-sm font-semibold text-danger-foreground transition hover:bg-danger-hover"
          >
            Reject with Feedback
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={remove}
        loading={deleting}
        title="Delete prompt"
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}

function IconBtn({ children, onClick, title, className = "" }) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`rounded-lg p-2 text-muted transition hover:bg-surface-hover ${className}`}
    >
      {children}
    </button>
  );
}
