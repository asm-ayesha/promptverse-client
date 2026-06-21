"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CloudArrowUpIn } from "@gravity-ui/icons";
import { apiGet, apiPost, apiPatch } from "@/lib/api";

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

export default function PromptForm({ initial, onSuccess }) {
  const [meta, setMeta] = useState({ categories: [], aiTools: [], difficulties: [] });
  const [form, setForm] = useState(emptyForm);
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
    const reader = new FileReader();
    reader.onloadend = async () => {
      setUploading(true);
      try {
        const res = await apiPost("/api/uploads/thumbnail", { image: reader.result });
        setForm((prev) => ({ ...prev, thumbnailUrl: res.url }));
        toast.success("Thumbnail uploaded");
      } catch (err) {
        toast.error(err.message || "Upload failed (check IMGBB_API_KEY)");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

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
        toast.success("Prompt updated — pending review");
      } else {
        await apiPost("/api/prompts", payload);
        toast.success("Prompt submitted — pending review");
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
    "w-full rounded-xl border border-field-border bg-field px-4 py-2.5 text-sm text-field-foreground outline-none focus:border-focus";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-surface p-6">
      <Field label="Title">
        <input required value={form.title} onChange={update("title")} className={inputClass} placeholder="e.g. Ultimate Blog Post Writer" />
      </Field>

      <Field label="Description">
        <textarea required rows={2} value={form.description} onChange={update("description")} className={inputClass} placeholder="A short summary of what this prompt does" />
      </Field>

      <Field label="Prompt Content">
        <textarea required rows={6} value={form.content} onChange={update("content")} className={`${inputClass} font-mono`} placeholder="The full prompt text..." />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Category">
          <select value={form.category} onChange={update("category")} className={inputClass}>
            {meta.categories?.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="AI Tool">
          <select value={form.aiTool} onChange={update("aiTool")} className={inputClass}>
            {meta.aiTools?.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Difficulty">
          <select value={form.difficulty} onChange={update("difficulty")} className={inputClass}>
            {meta.difficulties?.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </Field>
        <Field label="Visibility">
          <select value={form.visibility} onChange={update("visibility")} className={inputClass}>
            <option value="public">Public (free for everyone)</option>
            <option value="private">Private (premium only)</option>
          </select>
        </Field>
      </div>

      <Field label="Tags (comma separated)">
        <input value={form.tags} onChange={update("tags")} className={inputClass} placeholder="blog, seo, content" />
      </Field>

      <Field label="Usage Instructions (optional)">
        <textarea rows={2} value={form.usageInstructions} onChange={update("usageInstructions")} className={inputClass} placeholder="How to customize and use this prompt" />
      </Field>

      <Field label="Thumbnail (optional)">
        <div className="flex items-center gap-4">
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-border px-4 py-2.5 text-sm text-muted transition hover:border-accent">
            <CloudArrowUpIn width={18} height={18} />
            {uploading ? "Uploading..." : "Upload image"}
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </label>
          {form.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.thumbnailUrl} alt="thumbnail" className="h-14 w-20 rounded-lg object-cover" />
          ) : null}
        </div>
      </Field>

      <button
        type="submit"
        disabled={saving || uploading}
        className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-accent-hover disabled:opacity-60"
      >
        {saving ? "Saving..." : initial?._id ? "Update Prompt" : "Submit Prompt"}
      </button>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}
