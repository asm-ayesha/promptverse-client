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
  Gem,
  Check,
  ArrowLeft,
} from "@gravity-ui/icons";
import { apiGet, apiPost } from "@/lib/api";
import { authHref } from "@/lib/navigation";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import RatingStars from "@/components/ui/RatingStars";
import Modal from "@/components/ui/Modal";
import SelectMenu from "@/components/ui/SelectMenu";

const reportReasons = [
  "Inappropriate content",
  "Spam or misleading",
  "Copyright violation",
  "Low quality",
  "Other",
];

function PromptDetailsPage() {
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

  // Send the user to checkout but remember where they came from, so we can
  // return them to this exact prompt (with content unlocked) after paying.
  const goToPayment = () =>
    router.push(`/payment?returnUrl=${encodeURIComponent(pathname)}`);

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
      if (res.bookmarked) toast.success(res.message);
      else toast.error(res.message);
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
  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
    : prompt.avgRating || 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <button
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-foreground"
      >
        <ArrowLeft width={16} height={16} /> Back
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
        {/* Main content */}
        <div className="min-w-0">
          <div className="overflow-hidden rounded-3xl border border-border bg-linear-to-br from-accent-soft/40 via-surface to-surface p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                {prompt.category}
              </span>
              <span className="rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted">
                {prompt.aiTool}
              </span>
              <span className="rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted">
                {prompt.difficulty}
              </span>
              {prompt.visibility === "private" ? (
                <span className="flex items-center gap-1 rounded-full bg-linear-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                  <Gem width={12} height={12} /> Premium
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {prompt.title}
            </h1>
            <p className="mt-3 text-base leading-7 text-muted">{prompt.description}</p>

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

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border/70 pt-5 text-sm">
              <span className="flex items-center gap-2">
                <RatingStars value={avgRating} size={16} />
                <span className="font-semibold text-foreground">
                  {avgRating.toFixed(1)}
                </span>
                <span className="text-muted">({reviews.length} reviews)</span>
              </span>
              <span className="flex items-center gap-1.5 text-muted">
                <Copy width={15} height={15} /> {copyCount} copies
              </span>
              {prompt.createdAt ? (
                <span className="flex items-center gap-1.5 text-muted">
                  <Clock width={15} height={15} />
                  {new Date(prompt.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              ) : null}
            </div>
          </div>

          {/* Prompt content / premium lock */}
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Prompt</h2>
              {canViewFull ? (
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-foreground transition hover:bg-surface-hover"
                >
                  <Copy width={14} height={14} /> Copy
                </button>
              ) : null}
            </div>
            {canViewFull ? (
              <div className="relative overflow-hidden rounded-2xl border border-border bg-surface">
                <div className="flex items-center gap-1.5 border-b border-border bg-surface-secondary/40 px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-2 text-xs text-muted">prompt.txt</span>
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap wrap-break-word p-5 font-mono text-sm leading-7 text-foreground">
                  {prompt.content}
                </pre>
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-linear-to-br from-amber-500/10 via-surface to-surface p-6 md:p-8">
                {/* Decorative blurred "hidden content" bars */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 space-y-3 p-6 opacity-50 blur-[5px]"
                >
                  {["w-11/12", "w-full", "w-9/12", "w-10/12", "w-1/2", "w-8/12"].map(
                    (w, i) => (
                      <div
                        key={i}
                        className={`h-3.5 rounded-full bg-foreground/15 ${w}`}
                      />
                    )
                  )}
                </div>

                {/* Warm glow */}
                <div className="pointer-events-none absolute -top-12 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full bg-amber-500/20 blur-3xl" />

                <div className="relative flex flex-col items-center justify-center gap-4 py-4 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30">
                    <Lock width={24} height={24} />
                  </span>

                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      Premium Prompt
                    </h3>
                    <p className="mx-auto mt-1.5 max-w-md text-sm leading-6 text-muted">
                      Unlock to reveal the full prompt — detailed instructions,
                      variables and examples tuned for the best results.
                    </p>
                  </div>

                  <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs font-medium text-muted">
                    {["Full prompt content", "Usage instructions", "One-time $5 unlock"].map(
                      (item) => (
                        <li key={item} className="flex items-center gap-1.5">
                          <Check width={14} height={14} className="text-amber-500" />
                          {item}
                        </li>
                      )
                    )}
                  </ul>

                  <button
                    onClick={goToPayment}
                    className="mt-1 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-amber-500 to-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition hover:opacity-90"
                  >
                    <Gem width={16} height={16} /> Unlock Premium
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
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Reviews ({reviews.length})
              </h2>
              {reviews.length ? (
                <span className="flex items-center gap-2 text-sm">
                  <RatingStars value={avgRating} size={14} />
                  <span className="font-semibold text-foreground">
                    {avgRating.toFixed(1)}
                  </span>
                </span>
              ) : null}
            </div>

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
                  className="mt-3 w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted hover:border-muted/60 focus:border-focus focus:ring-2 focus:ring-focus/30"
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
                    className="rounded-2xl border border-border bg-surface p-5 transition hover:border-muted/40 hover:shadow-sm"
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
                      <div className="flex flex-col items-end gap-1">
                        <RatingStars value={r.rating} size={14} />
                        {r.createdAt ? (
                          <span className="text-xs text-muted">
                            {new Date(r.createdAt).toLocaleString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        ) : null}
                      </div>
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
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-border"
                />
              ) : (
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent-soft-foreground">
                  <Person width={22} height={22} />
                </span>
              )}
              <div className="min-w-0">
                <p className="text-xs text-muted">Prompt creator</p>
                <p className="truncate text-base font-semibold text-foreground">
                  {prompt.creatorName || "Unknown"}
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-surface-secondary/50 p-3">
                <p className="text-xs text-muted">Copies</p>
                <p className="mt-0.5 text-lg font-bold text-foreground">{copyCount}</p>
              </div>
              <div className="rounded-xl bg-surface-secondary/50 p-3">
                <p className="text-xs text-muted">Reviews</p>
                <p className="mt-0.5 text-lg font-bold text-foreground">
                  {reviews.length}
                </p>
              </div>
              <div className="rounded-xl bg-surface-secondary/50 p-3">
                <p className="text-xs text-muted">Rating</p>
                <p className="mt-0.5 text-lg font-bold text-foreground">
                  {avgRating.toFixed(1)}
                </p>
              </div>
              <div className="rounded-xl bg-surface-secondary/50 p-3">
                <p className="text-xs text-muted">Published</p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">
                  {prompt.createdAt
                    ? new Date(prompt.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-border bg-surface p-5">
            {canViewFull ? (
              <button
                onClick={handleCopy}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-accent-hover"
              >
                <Copy width={16} height={16} />
                Copy Prompt
              </button>
            ) : (
              <button
                onClick={goToPayment}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-500/25 transition hover:opacity-90"
              >
                <Gem width={16} height={16} />
                Unlock Premium
              </button>
            )}
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
            <SelectMenu
              value={reportForm.reason}
              options={reportReasons}
              onChange={(reason) =>
                setReportForm((prev) => ({ ...prev, reason }))
              }
            />
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
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted hover:border-muted/60 focus:border-focus focus:ring-2 focus:ring-focus/30"
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

export default function PromptDetailsRoute() {
  return (
    <ProtectedRoute>
      <PromptDetailsPage />
    </ProtectedRoute>
  );
}
