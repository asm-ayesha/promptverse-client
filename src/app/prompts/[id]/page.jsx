"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  Copy,
  Bookmark,
  BookmarkFill,
  Flag,
  Lock,
  Person,
  Clock,
} from "@gravity-ui/icons";
import { apiGet, apiPost } from "@/lib/api";
import { authHref } from "@/lib/navigation";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import RatingStars from "@/components/ui/RatingStars";
import Modal from "@/components/ui/Modal";

const reportReasons = [
  "Inappropriate content",
  "Spam or misleading",
  "Copyright violation",
  "Low quality",
  "Other",
];

export default function PromptDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const [prompt, setPrompt] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [copyCount, setCopyCount] = useState(0);

  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  const [reportOpen, setReportOpen] = useState(false);
  const [reportForm, setReportForm] = useState({ reason: reportReasons[0], description: "" });

  const loadReviews = useCallback(() => {
    apiGet(`/api/reviews/prompt/${id}`)
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]));
  }, [id]);

  useEffect(() => {
    setLoading(true);
    apiGet(`/api/prompts/${id}`)
      .then((data) => {
        setPrompt(data);
        setBookmarked(!!data.isBookmarked);
        setCopyCount(data.copyCount || 0);
      })
      .catch(() => setPrompt(null))
      .finally(() => setLoading(false));
    loadReviews();
  }, [id, loadReviews]);

  const requireLogin = () => {
    toast.info("Please log in to continue");
    router.push(authHref(pathname));
  };

  const handleCopy = async () => {
    if (!isAuthenticated) return requireLogin();
    try {
      const res = await apiPost(`/api/prompts/${id}/copy`);
      await navigator.clipboard.writeText(res.content || prompt.content || "");
      setCopyCount((c) => c + 1);
      toast.success("Prompt copied to clipboard");
    } catch (err) {
      toast.error(err.message || "Could not copy");
    }
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) return requireLogin();
    try {
      const res = await apiPost(`/api/bookmarks/${id}`);
      setBookmarked(res.bookmarked);
      toast.success(res.message);
    } catch (err) {
      toast.error(err.message || "Could not bookmark");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return requireLogin();
    if (!reviewForm.rating) return toast.error("Please select a rating");
    setSubmittingReview(true);
    try {
      await apiPost("/api/reviews", { promptId: id, ...reviewForm });
      toast.success("Review added");
      setReviewForm({ rating: 0, comment: "" });
      loadReviews();
    } catch (err) {
      toast.error(err.message || "Could not add review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const submitReport = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return requireLogin();
    try {
      await apiPost("/api/reports", { promptId: id, ...reportForm });
      toast.success("Report submitted. Thank you.");
      setReportOpen(false);
      setReportForm({ reason: reportReasons[0], description: "" });
    } catch (err) {
      toast.error(err.message || "Could not submit report");
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!prompt) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Prompt not found</h1>
        <p className="mt-2 text-muted">It may have been removed or is unavailable.</p>
      </div>
    );
  }

  const canViewFull = prompt.canViewFull !== false;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        {/* Main content */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent-soft-foreground">
              {prompt.category}
            </span>
            <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">
              {prompt.aiTool}
            </span>
            <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">
              {prompt.difficulty}
            </span>
            {prompt.visibility === "private" ? (
              <span className="flex items-center gap-1 rounded-full bg-warning-soft px-3 py-1 text-xs font-medium text-warning-soft-foreground">
                <Lock width={12} height={12} /> Premium
              </span>
            ) : null}
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {prompt.title}
          </h1>
          <p className="mt-3 text-base text-muted">{prompt.description}</p>

          {prompt.tags?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {prompt.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-surface-secondary px-2.5 py-0.5 text-xs text-muted"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}

          {/* Prompt content / premium lock */}
          <div className="mt-8">
            <h2 className="mb-3 text-lg font-semibold text-foreground">Prompt</h2>
            {canViewFull ? (
              <div className="relative rounded-2xl border border-border bg-surface p-5">
                <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-7 text-foreground">
                  {prompt.content}
                </pre>
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-5">
                <p className="select-none whitespace-pre-wrap break-words font-mono text-sm leading-7 text-foreground blur-md">
                  {`This is a premium prompt. Unlock it to reveal the full content.\nIt includes detailed instructions, variables and examples that get the best results from your AI tool of choice.`}
                </p>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface/40 backdrop-blur-sm">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Lock width={22} height={22} />
                  </span>
                  <p className="text-sm font-medium text-foreground">
                    This is a premium prompt
                  </p>
                  <button
                    onClick={() => router.push("/payment")}
                    className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-accent-hover"
                  >
                    Subscribe to Premium
                  </button>
                </div>
              </div>
            )}
          </div>

          {prompt.usageInstructions && canViewFull ? (
            <div className="mt-6">
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                How to use
              </h2>
              <p className="text-sm leading-7 text-muted">
                {prompt.usageInstructions}
              </p>
            </div>
          ) : null}

          {/* Reviews */}
          <div className="mt-10">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Reviews ({reviews.length})
            </h2>

            {canViewFull ? (
              <form
                onSubmit={submitReview}
                className="mb-6 rounded-2xl border border-border bg-surface p-5"
              >
                <p className="mb-2 text-sm font-medium text-foreground">
                  Leave a review
                </p>
                <RatingStars
                  value={reviewForm.rating}
                  interactive
                  size={22}
                  onChange={(rating) =>
                    setReviewForm((prev) => ({ ...prev, rating }))
                  }
                />
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm((prev) => ({ ...prev, comment: e.target.value }))
                  }
                  placeholder="Share your experience..."
                  rows={3}
                  className="mt-3 w-full rounded-xl border border-field-border bg-field px-4 py-2.5 text-sm text-field-foreground outline-none focus:border-focus"
                />
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="mt-3 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground transition hover:bg-accent-hover disabled:opacity-60"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            ) : null}

            {reviews.length === 0 ? (
              <p className="text-sm text-muted">No reviews yet. Be the first!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div
                    key={r._id}
                    className="rounded-2xl border border-border bg-surface p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                          {(r.name || "U").charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {r.name}
                          </p>
                          <p className="text-xs text-muted">{r.email}</p>
                        </div>
                      </div>
                      <RatingStars value={r.rating} size={14} />
                    </div>
                    {r.comment ? (
                      <p className="mt-3 text-sm leading-6 text-foreground">
                        {r.comment}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="h-fit space-y-4 lg:sticky lg:top-20">
          <div className="rounded-2xl border border-border bg-surface p-5">
            <div className="flex items-center gap-3">
              {prompt.creatorImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={prompt.creatorImage}
                  alt={prompt.creatorName}
                  className="h-11 w-11 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent-soft-foreground">
                  <Person width={20} height={20} />
                </span>
              )}
              <div>
                <p className="text-xs text-muted">Created by</p>
                <p className="text-sm font-medium text-foreground">
                  {prompt.creatorName || "Unknown"}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-muted">
              <span className="flex items-center gap-1">
                <Copy width={16} height={16} /> {copyCount} copies
              </span>
              {prompt.createdAt ? (
                <span className="flex items-center gap-1">
                  <Clock width={16} height={16} />
                  {new Date(prompt.createdAt).toLocaleDateString()}
                </span>
              ) : null}
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-border bg-surface p-5">
            <button
              onClick={handleCopy}
              disabled={!canViewFull}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-accent-hover disabled:opacity-50"
            >
              <Copy width={16} height={16} />
              {canViewFull ? "Copy Prompt" : "Locked"}
            </button>
            <button
              onClick={handleBookmark}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface-hover"
            >
              {bookmarked ? (
                <BookmarkFill width={16} height={16} className="text-accent" />
              ) : (
                <Bookmark width={16} height={16} />
              )}
              {bookmarked ? "Saved" : "Save"}
            </button>
            <button
              onClick={() => (isAuthenticated ? setReportOpen(true) : requireLogin())}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-muted transition hover:text-danger"
            >
              <Flag width={16} height={16} /> Report
            </button>
          </div>
        </aside>
      </div>

      <Modal open={reportOpen} onClose={() => setReportOpen(false)} title="Report Prompt">
        <form onSubmit={submitReport} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Reason
            </label>
            <select
              value={reportForm.reason}
              onChange={(e) =>
                setReportForm((prev) => ({ ...prev, reason: e.target.value }))
              }
              className="w-full rounded-xl border border-field-border bg-field px-4 py-2.5 text-sm text-field-foreground outline-none"
            >
              {reportReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Description (optional)
            </label>
            <textarea
              value={reportForm.description}
              onChange={(e) =>
                setReportForm((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={3}
              className="w-full rounded-xl border border-field-border bg-field px-4 py-2.5 text-sm text-field-foreground outline-none focus:border-focus"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-danger px-4 py-2.5 text-sm font-semibold text-danger-foreground transition hover:bg-danger-hover"
          >
            Submit Report
          </button>
        </form>
      </Modal>
    </div>
  );
}
