"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CloudArrowUpIn, Gem, LockOpen, Xmark } from "@gravity-ui/icons";
import { apiGet, apiPost, apiPatch } from "@/lib/api";
import SelectMenu from "@/components/ui/SelectMenu";

const emptyForm = {
  title: "",
  description: "",
  content: "",
  category: "",
  aiTool: "",
  difficulty: "Beginner",
  tags: "",
  visibility: "public",
  usageInstructions: "",
  thumbnailUrl: "",
};

export default function PromptForm({ initial, onSuccess, embedded = false }) {
  const [meta, setMeta] = useState({ categories: [], aiTools: [], difficulties: [] });
  const [form, setForm] = useState(emptyForm);
  const [localPreview, setLocalPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiGet("/api/meta")
      .then((m) => {
        setMeta(m);
        setForm((prev) => ({
          ...prev,
          category: prev.category || m.categories?.[0] || "",
          aiTool: prev.aiTool || m.aiTools?.[0] || "",
        }));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || "",
        description: initial.description || "",
        content: initial.content || "",
        category: initial.category || "",
        aiTool: initial.aiTool || "",
        difficulty: initial.difficulty || "Beginner",
        tags: Array.isArray(initial.tags) ? initial.tags.join(", ") : "",
        visibility: initial.visibility || "public",
        usageInstructions: initial.usageInstructions || "",
        thumbnailUrl: initial.thumbnailUrl || "",
      });
    }
  }, [initial]);

  const update = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show an instant local preview while the upload happens in the background.
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
        setForm((prev) => ({ ...prev, thumbnailUrl: res.url }));
        toast.success("Thumbnail uploaded");
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

  const clearThumbnail = () => {
    setLocalPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return "";
    });
    setForm((prev) => ({ ...prev, thumbnailUrl: "" }));
  };

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    try {
      if (initial?._id) {
        await apiPatch(`/api/prompts/${initial._id}`, payload);
        toast.success("Prompt updated - pending review");
      } else {
        await apiPost("/api/prompts", payload);
        toast.success("Prompt submitted - pending review");
        setForm(emptyForm);
      }
      onSuccess?.();
    } catch (err) {
      toast.error(err.message || "Could not save prompt");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted hover:border-muted/60 focus:border-focus focus:ring-2 focus:ring-focus/30 focus:bg-surface";

  const tagChips = form.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const isEdit = Boolean(initial?._id);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Section
        embedded={embedded}
        step="01"
        title="Prompt details"
        subtitle="Give your prompt a clear title and explain what it does."
      >
        <Field label="Title">
          <input
            required
            value={form.title}
            onChange={update("title")}
            className={inputClass}
            placeholder="e.g. Ultimate Blog Post Writer"
          />
        </Field>

        <Field label="Description">
          <textarea
            required
            rows={2}
            value={form.description}
            onChange={update("description")}
            className={inputClass}
            placeholder="A short summary of what this prompt does"
          />
        </Field>

        <Field
          label="Prompt Content"
          hint={`${form.content.length} characters`}
        >
          <textarea
            required
            rows={7}
            value={form.content}
            onChange={update("content")}
            className={`${inputClass} font-mono leading-6`}
            placeholder="The full prompt text. Use [PLACEHOLDERS] for variables..."
          />
        </Field>
      </Section>

      <Section
        embedded={embedded}
        step="02"
        title="Classification"
        subtitle="Help people find your prompt and set who can access it."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Category">
            <SelectMenu
              value={form.category}
              options={meta.categories || []}
              onChange={(v) => setForm((prev) => ({ ...prev, category: v }))}
              placeholder="Select a category"
            />
          </Field>
          <Field label="AI Tool">
            <SelectMenu
              value={form.aiTool}
              options={meta.aiTools || []}
              onChange={(v) => setForm((prev) => ({ ...prev, aiTool: v }))}
              placeholder="Select an AI tool"
            />
          </Field>
        </div>

        <Field label="Difficulty">
          <div className="flex flex-wrap gap-2">
            {(meta.difficulties?.length
              ? meta.difficulties
              : ["Beginner", "Intermediate", "Pro"]
            ).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, difficulty: d }))}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  form.difficulty === d
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "border border-border text-muted hover:border-accent hover:text-accent"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Visibility">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <VisibilityOption
              active={form.visibility === "public"}
              onClick={() => setForm((prev) => ({ ...prev, visibility: "public" }))}
              icon={LockOpen}
              title="Public"
              desc="Free for everyone"
              accent="emerald"
            />
            <VisibilityOption
              active={form.visibility === "private"}
              onClick={() => setForm((prev) => ({ ...prev, visibility: "private" }))}
              icon={Gem}
              title="Premium"
              desc="Premium subscribers only"
              accent="amber"
            />
          </div>
        </Field>
      </Section>

      <Section
        embedded={embedded}
        step="03"
        title="Extras & media"
        subtitle="Add tags, usage tips and a thumbnail to make it stand out."
      >
        <Field label="Tags" hint="Comma separated">
          <input
            value={form.tags}
            onChange={update("tags")}
            className={inputClass}
            placeholder="blog, seo, content"
          />
          {tagChips.length ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tagChips.map((t, i) => (
                <span
                  key={`${t}-${i}`}
                  className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent-soft-foreground"
                >
                  #{t}
                </span>
              ))}
            </div>
          ) : null}
        </Field>

        <Field label="Usage Instructions" hint="Optional">
          <textarea
            rows={2}
            value={form.usageInstructions}
            onChange={update("usageInstructions")}
            className={inputClass}
            placeholder="How to customize and use this prompt"
          />
        </Field>

        <Field label="Thumbnail" hint="Optional">
          {form.thumbnailUrl || localPreview ? (
            <div className="group relative inline-block overflow-hidden rounded-xl border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.thumbnailUrl || localPreview}
                alt="thumbnail"
                className="h-32 w-48 object-cover"
              />
              {uploading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/55 text-white">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  <span className="text-xs font-medium">Uploading...</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={clearThumbnail}
                  aria-label="Remove thumbnail"
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                >
                  <Xmark width={16} height={16} />
                </button>
              )}
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-background px-6 py-8 text-center text-sm text-muted transition hover:border-accent hover:text-accent">
              <CloudArrowUpIn width={26} height={26} />
              <span className="font-medium">
                {uploading ? "Uploading..." : "Click to upload an image"}
              </span>
              <span className="text-xs text-muted">PNG, JPG up to 10MB</span>
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </label>
          )}
        </Field>
      </Section>

      <div
        className={`flex items-center justify-end gap-3 ${
          embedded
            ? "border-t border-border pt-5"
            : "rounded-2xl border border-border bg-surface px-6 py-4"
        }`}
      >
        <p className="mr-auto text-xs text-muted">
          Your prompt will be reviewed before going live.
        </p>
        <button
          type="submit"
          disabled={saving || uploading}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-2.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition hover:bg-accent-hover disabled:opacity-60"
        >
          {saving ? "Saving..." : isEdit ? "Update Prompt" : "Submit Prompt"}
        </button>
      </div>
    </form>
  );
}

function Section({ step, title, subtitle, children, embedded }) {
  return (
    <section
      className={
        embedded
          ? "border-t border-border pt-6 first:border-t-0 first:pt-0"
          : "rounded-2xl border border-border bg-surface p-6 md:p-8"
      }
    >
      <div className="flex items-start gap-3">
        <span className="brand-gradient text-2xl font-extrabold leading-none">
          {step}
        </span>
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {subtitle ? (
            <p className="mt-0.5 text-sm text-muted">{subtitle}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

function VisibilityOption({ active, onClick, icon: Icon, title, desc, accent }) {
  const accentRing =
    accent === "amber"
      ? "border-amber-500 ring-amber-500/30"
      : "border-emerald-500 ring-emerald-500/30";
  const iconColor = accent === "amber" ? "text-amber-500" : "text-emerald-500";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
        active
          ? `${accentRing} bg-background ring-2`
          : "border-border hover:border-muted/60"
      }`}
    >
      <span className={`flex h-9 w-9 items-center justify-center rounded-lg bg-surface-hover ${iconColor}`}>
        <Icon width={18} height={18} />
      </span>
      <span>
        <span className="block text-sm font-semibold text-foreground">{title}</span>
        <span className="block text-xs text-muted">{desc}</span>
      </span>
    </button>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="block text-sm font-medium text-foreground">{label}</label>
        {hint ? <span className="text-xs text-muted">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}
