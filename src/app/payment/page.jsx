"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ArrowLeft, CircleCheck, Lock, Star } from "@gravity-ui/icons";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { apiPost } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

const benefits = [
  "Unlock every premium (private) prompt",
  "Copy and review premium prompts",
  "Add unlimited prompts of your own",
  "Support the creator community",
];

// The inline card form rendered inside <Elements>. Confirms the payment
// without leaving the page (redirect: "if_required").
function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: `${window.location.origin}/payment`,
      },
    });

    if (error) {
      toast.error(error.message || "Payment failed");
      setSubmitting(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      try {
        await apiPost("/api/payments/confirm", {
          paymentIntentId: paymentIntent.id,
        });
        toast.success("Premium unlocked! 🎉");
        // Full reload so the session picks up the new subscription.
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      } catch (err) {
        toast.error(err.message || "Could not confirm payment");
        setSubmitting(false);
      }
    } else {
      toast.info("Payment is processing. We'll update your access shortly.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <PaymentElement onReady={() => setReady(true)} />
      <button
        type="submit"
        disabled={!stripe || !ready || submitting}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition hover:bg-accent-hover disabled:opacity-60"
      >
        <Lock width={16} height={16} />
        {submitting ? "Processing..." : "Pay $5 & Unlock"}
      </button>
    </form>
  );
}

function PaymentInner() {
  const router = useRouter();
  const { subscription } = useAuth();
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  // Guard so the PaymentIntent is created only once. Without this, React
  // StrictMode / fast-refresh fires the effect twice, creating two intents
  // and triggering Stripe's "options.clientSecret is not a mutable property"
  // warning (the Element locks onto the first secret and ignores the swap).
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (subscription === "premium" || fetchedRef.current) return;
    fetchedRef.current = true;
    apiPost("/api/payments/create-payment-intent")
      .then((res) => {
        if (res.clientSecret) setClientSecret(res.clientSecret);
        else setError("Could not start payment");
      })
      .catch((err) => {
        fetchedRef.current = false;
        setError(err.message || "Payment is not available right now");
      });
  }, [subscription]);

  const options = useMemo(() => {
    if (!clientSecret) return null;
    const isDark =
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark");
    return {
      clientSecret,
      appearance: {
        theme: isDark ? "night" : "stripe",
        variables: {
          colorPrimary: "#4f46e5",
          borderRadius: "10px",
        },
      },
    };
  }, [clientSecret]);

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
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-surface-hover"
          >
            <ArrowLeft width={16} height={16} /> Go Back
          </button>
          <button
            onClick={() => router.push("/all-prompts")}
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-accent-hover"
          >
            Browse Prompts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 lg:py-16">
      <button
        onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-foreground"
      >
        <ArrowLeft width={16} height={16} /> Back
      </button>
      <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
        <div className="bg-linear-to-br from-indigo-500 via-blue-500 to-cyan-400 px-8 py-10 text-center text-white">
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

          {error ? (
            <p className="mt-6 rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger-soft-foreground">
              {error}
            </p>
          ) : !stripePromise ? (
            <p className="mt-6 rounded-xl border border-border bg-surface-secondary px-4 py-3 text-sm text-muted">
              Payments are not configured.
            </p>
          ) : !options ? (
            <div className="mt-8 flex justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm />
            </Elements>
          )}

          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted">
            <Lock width={12} height={12} /> Secure payment powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <ProtectedRoute>
      <PaymentInner />
    </ProtectedRoute>
  );
}
