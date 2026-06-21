"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { CircleCheck, CreditCard, Lock, Star } from "@gravity-ui/icons";
import { apiPost } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const benefits = [
  "Unlock every premium (private) prompt",
  "Copy and review premium prompts",
  "Add unlimited prompts of your own",
  "Support the creator community",
];

function PaymentInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { subscription } = useAuth();
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const confirmed = useRef(false);

  // Handle the redirect back from Stripe checkout.
  useEffect(() => {
    const success = params.get("success");
    const sessionId = params.get("session_id");
    const canceled = params.get("canceled");

    if (canceled) {
      toast.info("Payment canceled");
      return;
    }
    if (success && !confirmed.current) {
      confirmed.current = true;
      setConfirming(true);
      apiPost("/api/payments/confirm", { sessionId })
        .then(() => {
          toast.success("Premium unlocked! 🎉");
          // Full reload so the session picks up the new subscription.
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 1200);
        })
        .catch((err) => {
          toast.error(err.message || "Could not confirm payment");
          setConfirming(false);
        });
    }
  }, [params]);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await apiPost("/api/payments/create-checkout-session");
      if (res.url) {
        window.location.href = res.url;
      } else {
        toast.error("Could not start checkout");
        setLoading(false);
      }
    } catch (err) {
      toast.error(err.message || "Payment is not available right now");
      setLoading(false);
    }
  };

  if (confirming) {
    return <LoadingSpinner fullPage label="Activating your premium access..." />;
  }

  if (subscription === "premium") {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-soft text-success-soft-foreground">
          <CircleCheck width={32} height={32} />
        </span>
        <h1 className="mt-6 text-2xl font-bold text-foreground">
          You're already Premium
        </h1>
        <p className="mt-2 text-muted">
          Enjoy unlimited access to all premium prompts.
        </p>
        <button
          onClick={() => router.push("/all-prompts")}
          className="mt-6 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-accent-hover"
        >
          Browse Prompts
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 lg:py-24">
      <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
        <div className="bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400 px-8 py-10 text-center text-white">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
            <Star width={14} height={14} /> Premium
          </span>
          <div className="mt-4 flex items-end justify-center gap-1">
            <span className="text-5xl font-bold">$5</span>
            <span className="mb-1.5 text-sm opacity-90">one-time</span>
          </div>
          <p className="mt-2 text-sm opacity-90">Lifetime premium access</p>
        </div>

        <div className="p-8">
          <ul className="space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm text-foreground">
                <CircleCheck
                  width={18}
                  height={18}
                  className="mt-0.5 shrink-0 text-success"
                />
                {b}
              </li>
            ))}
          </ul>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition hover:bg-accent-hover disabled:opacity-60"
          >
            <CreditCard width={18} height={18} />
            {loading ? "Redirecting to checkout..." : "Upgrade Now"}
          </button>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted">
            <Lock width={12} height={12} /> Secure checkout powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<LoadingSpinner fullPage />}>
        <PaymentInner />
      </Suspense>
    </ProtectedRoute>
  );
}
