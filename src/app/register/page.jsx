"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { Eye, EyeSlash } from "@gravity-ui/icons";
import { signIn, signUp } from "@/lib/auth-client";
import { authHref, safeCallbackUrl } from "@/lib/navigation";
import GoogleIcon from "@/components/ui/GoogleIcon";

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [form, setForm] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const callbackUrl = safeCallbackUrl(params.get("callbackUrl"));

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
    router.push(callbackUrl);
  };

  const handleGoogle = async () => {
    await signIn.social({ provider: "google", callbackURL: callbackUrl });
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
          <Link
            href={authHref(params.get("callbackUrl"), "/login")}
            className="font-medium text-accent hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}

function Field({ label, type, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          {...props}
          type={inputType}
          className={`w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted hover:border-muted/60 focus:border-focus focus:ring-2 focus:ring-focus/30 ${
            isPassword ? "pr-11" : ""
          }`}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-muted transition hover:text-foreground"
          >
            {showPassword ? (
              <EyeSlash width={18} height={18} />
            ) : (
              <Eye width={18} height={18} />
            )}
          </button>
        ) : null}
      </div>
    </div>
  );
}
