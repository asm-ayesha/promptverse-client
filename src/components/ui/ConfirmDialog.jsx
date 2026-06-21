"use client";

import { TrashBin } from "@gravity-ui/icons";
import Modal from "./Modal";

// Modern replacement for window.confirm().
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  danger = true,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex gap-4">
        {danger ? (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-danger-soft text-danger-soft-foreground">
            <TrashBin width={20} height={20} />
          </span>
        ) : null}
        <p className="text-sm leading-6 text-muted">{message}</p>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-hover disabled:opacity-60"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition disabled:opacity-60 ${
            danger
              ? "bg-danger text-danger-foreground hover:bg-danger-hover"
              : "bg-accent text-accent-foreground hover:bg-accent-hover"
          }`}
        >
          {loading ? "Working..." : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
