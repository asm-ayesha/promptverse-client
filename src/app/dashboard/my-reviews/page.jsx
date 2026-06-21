"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiGet } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import RatingStars from "@/components/ui/RatingStars";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet("/api/my/reviews")
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <PageHeader title="My Reviews" subtitle="Reviews you've written." />
      {reviews.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          description="Review prompts you've used to help the community."
        />
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <div className="flex items-center justify-between">
                <RatingStars value={r.rating} size={16} />
                <span className="text-xs text-muted">
                  {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
                </span>
              </div>
              {r.comment ? (
                <p className="mt-3 text-sm text-foreground">{r.comment}</p>
              ) : null}
              <Link
                href={`/prompts/${r.promptId}`}
                className="mt-3 inline-block text-xs font-medium text-accent hover:underline"
              >
                View prompt →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
