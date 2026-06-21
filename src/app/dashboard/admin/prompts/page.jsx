"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { CircleCheck, CircleXmark, Star, StarFill, TrashBin } from "@gravity-ui/icons";
import { apiGet, apiPatch, apiDelete } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import Modal from "@/components/ui/Modal";
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

  const load = () => {
    setLoading(true);
    apiGet("/api/admin/prompts")
      .then((data) => setPrompts(Array.isArray(data) ? data : []))
      .catch(() => setPrompts([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

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

  const remove = async (p) => {
    if (!confirm("Delete this prompt?")) return;
    try {
      await apiDelete(`/api/admin/prompts/${p._id}`);
      setPrompts((prev) => prev.filter((x) => x._id !== p._id));
      toast.success("Prompt deleted");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <PageHeader title="Prompts" subtitle="Moderate and feature prompts." />
      {prompts.length === 0 ? (
        <EmptyState title="No prompts" description="No prompts to moderate." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-muted">
                <tr>
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="px-5 py-3 font-medium">Creator</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {prompts.map((p) => (
                  <tr key={p._id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 font-medium text-foreground">
                      <Link href={`/prompts/${p._id}`} className="hover:text-accent">
                        {p.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-muted">{p.creatorName}</td>
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
                      <div className="flex items-center justify-end gap-1.5">
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
                          onClick={() => remove(p)}
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
            className="w-full rounded-xl border border-field-border bg-field px-4 py-2.5 text-sm text-field-foreground outline-none focus:border-focus"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-danger px-4 py-2.5 text-sm font-semibold text-danger-foreground transition hover:bg-danger-hover"
          >
            Reject with Feedback
          </button>
        </form>
      </Modal>
    </div>
  );
}

function IconBtn({ children, onClick, title, className = "" }) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`rounded-md p-1.5 text-muted transition hover:bg-surface-hover ${className}`}
    >
      {children}
    </button>
  );
}
