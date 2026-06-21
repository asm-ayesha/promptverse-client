"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  Calendar,
  Camera,
  CircleCheck,
  CreditCard,
  Envelope,
  FileText,
  Pencil,
  ShieldCheck,
  Star,
  Xmark,
} from "@gravity-ui/icons";
import { apiGet, apiPost } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/hooks/useAuth";
import PageHeader from "@/components/dashboard/PageHeader";

export default function ProfilePage() {
  const { user, role, subscription, refetch } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [localPreview, setLocalPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [totalPrompts, setTotalPrompts] = useState(null);

  useEffect(() => {
    setName(user?.name || "");
    setImage(user?.image || "");
  }, [user]);

  useEffect(() => {
    apiGet("/api/users/me")
      .then((me) => setTotalPrompts(me?.totalPrompts ?? 0))
      .catch(() => setTotalPrompts(null));
  }, []);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const startEdit = () => {
    setName(user?.name || "");
    setImage(user?.image || "");
    setLocalPreview("");
    setEditing(true);
  };

  const cancel = () => {
    setEditing(false);
    setLocalPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return "";
    });
    setName(user?.name || "");
    setImage(user?.image || "");
  };

  const handleAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return objectUrl;
    });
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await apiPost("/api/uploads/thumbnail", { image: reader.result });
        setImage(res.url);
      } catch (err) {
        toast.error(err.message || "Upload failed (check IMGBB_API_KEY)");
        setLocalPreview((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return "";
        });
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const save = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setSaving(true);
    try {
      const { error } = await authClient.updateUser({ name: name.trim(), image });
      if (error) {
        toast.error(error.message || "Could not update profile");
        return;
      }
      await refetch?.();
      toast.success("Profile updated");
      setEditing(false);
      setLocalPreview("");
    } catch (err) {
      toast.error(err?.message || "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  const avatarSrc = localPreview || image;
  const initial = (user?.name || "U").charAt(0).toUpperCase();
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div>
      <PageHeader title="Profile" subtitle="Manage your account details." />

      <div className="max-w-2xl overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="h-28 bg-linear-to-br from-indigo-500 via-blue-500 to-cyan-400" />

        <div className="px-6 pb-6">
          <div className="-mt-12 flex items-end justify-between">
            <div className="relative">
              {avatarSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarSrc}
                  alt={user?.name || "avatar"}
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-surface"
                />
              ) : (
                <span className="flex h-24 w-24 items-center justify-center rounded-full bg-accent text-3xl font-semibold text-accent-foreground ring-4 ring-surface">
                  {initial}
                </span>
              )}

              {editing ? (
                <label
                  className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-accent text-accent-foreground shadow-md transition hover:bg-accent-hover"
                  title="Change photo"
                >
                  {uploading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  ) : (
                    <Camera width={16} height={16} />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatar}
                    className="hidden"
                  />
                </label>
              ) : null}
            </div>

            {!editing ? (
              <button
                onClick={startEdit}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-surface-hover"
              >
                <Pencil width={15} height={15} /> Edit Profile
              </button>
            ) : null}
          </div>

          {editing ? (
            <form onSubmit={save} className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Display name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted hover:border-muted/60 focus:border-focus focus:ring-2 focus:ring-focus/30"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  value={user?.email || ""}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-border bg-surface-secondary px-4 py-2.5 text-sm text-muted outline-none"
                />
                <p className="mt-1 text-xs text-muted">Email can’t be changed.</p>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-accent-hover disabled:opacity-60"
                >
                  <CircleCheck width={16} height={16} />
                  {saving ? "Saving..." : "Save changes"}
                </button>
                <button
                  type="button"
                  onClick={cancel}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-surface-hover disabled:opacity-60"
                >
                  <Xmark width={16} height={16} /> Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="mt-4">
                <h2 className="text-xl font-semibold text-foreground">{user?.name}</h2>
                <p className="text-sm text-muted">{user?.email}</p>
              </div>

              <dl className="mt-6 divide-y divide-border">
                <Row
                  icon={ShieldCheck}
                  label="Role"
                  value={<span className="capitalize">{role}</span>}
                />
                <Row
                  icon={Star}
                  label="Subscription"
                  value={
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                        subscription === "premium"
                          ? "bg-success-soft text-success-soft-foreground"
                          : "bg-warning-soft text-warning-soft-foreground"
                      }`}
                    >
                      {subscription}
                    </span>
                  }
                />
                <Row icon={Envelope} label="Email" value={user?.email} />
                <Row
                  icon={FileText}
                  label="Total prompts"
                  value={totalPrompts === null ? "—" : totalPrompts}
                />
                {memberSince ? (
                  <Row icon={Calendar} label="Member since" value={memberSince} />
                ) : null}
              </dl>

              {subscription !== "premium" ? (
                <Link
                  href="/payment"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-accent-hover"
                >
                  <CreditCard width={16} height={16} /> Upgrade to Premium
                </Link>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between py-3">
      <dt className="flex items-center gap-2 text-sm text-muted">
        {Icon ? <Icon width={16} height={16} /> : null}
        {label}
      </dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
