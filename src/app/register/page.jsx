"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { signIn, signUp } from "@/lib/auth-client";
import GoogleIcon from "@/components/ui/GoogleIcon";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const { error } = await signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
      image: form.photoURL || undefined,
      photoURL: form.photoURL || undefined,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Registration failed");
      return;
    }
    toast.success("Account created! Welcome to PromptVerse.");
    router.push("/dashboard");
  };

  const handleGoogle = async () => {
    await signIn.social({ provider: "google", callbackURL: "/dashboard" });
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-grid px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-muted">
            Join PromptVerse and start sharing prompts
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <Field
            label="Name"
            type="text"
            value={form.name}
            onChange={update("name")}
            placeholder="Jane Doe"
            required
          />
          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={update("email")}
            placeholder="you@example.com"
            required
          />
          <Field
            label="Photo URL (optional)"
            type="url"
            value={form.photoURL}
            onChange={update("photoURL")}
            placeholder="https://..."
          />
          <Field
            label="Password"
            type="password"
            value={form.password}
            onChange={update("password")}
            placeholder="At least 6 characters"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-accent-hover disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-separator" />
          <span className="text-xs text-muted">OR</span>
          <div className="h-px flex-1 bg-separator" />
        </div>

        <button
          onClick={handleGoogle}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface-hover"
        >
          <GoogleIcon className="h-5 w-5" />
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-accent hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        {...props}
        className="w-full rounded-xl border border-field-border bg-field px-4 py-2.5 text-sm text-field-foreground outline-none transition focus:border-focus focus:ring-2 focus:ring-focus/30"
      />
    </div>
  );
}
