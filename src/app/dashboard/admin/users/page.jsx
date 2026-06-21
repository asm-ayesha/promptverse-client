"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { TrashBin, ChevronDown, Check } from "@gravity-ui/icons";
import { apiGet, apiPatch, apiDelete } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Pagination from "@/components/ui/Pagination";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";

const roles = ["user", "creator", "admin"];

const roleStyles = {
  admin: "bg-accent-soft text-accent-soft-foreground ring-accent/30",
  creator: "bg-success-soft text-success-soft-foreground ring-success/30",
  user: "bg-surface-secondary text-muted ring-border",
};

function RoleSelect({ value, onChange }) {
  const role = value || "user";
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const triggerRef = useRef(null);

  const place = () => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setCoords({ top: r.bottom + 6, left: r.left, width: Math.max(r.width, 150) });
  };

  useLayoutEffect(() => {
    if (open) place();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const select = (r) => {
    onChange({ target: { value: r } });
    setOpen(false);
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`inline-flex items-center gap-1.5 rounded-full py-1.5 pl-3 pr-2.5 text-xs font-semibold capitalize outline-none ring-1 transition focus:ring-2 focus:ring-focus/40 ${
          roleStyles[role] || roleStyles.user
        }`}
      >
        {role}
        <ChevronDown
          width={14}
          height={14}
          className={`opacity-70 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && coords
        ? createPortal(
            <>
              <div className="fixed inset-0 z-200" onClick={() => setOpen(false)} />
              <ul
                role="listbox"
                style={{ top: coords.top, left: coords.left, width: coords.width }}
                className="fixed z-201 overflow-hidden rounded-xl border border-border bg-surface p-1 shadow-xl shadow-black/10"
              >
                {roles.map((r) => {
                  const selected = r === role;
                  return (
                    <li key={r}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onClick={() => select(r)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm capitalize transition ${
                          selected
                            ? "bg-accent-soft font-medium text-accent-soft-foreground"
                            : "text-foreground hover:bg-surface-hover"
                        }`}
                      >
                        {r}
                        {selected ? <Check width={15} height={15} className="text-accent" /> : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>,
            document.body
          )
        : null}
    </>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

  useEffect(() => {
    apiGet("/api/admin/users")
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const changeRole = async (user, role) => {
    try {
      await apiPatch(`/api/admin/users/${user._id}/role`, { role });
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, role } : u))
      );
      toast.success(`${user.name} is now ${role}`);
    } catch (err) {
      toast.error(err.message || "Could not update role");
    }
  };

  const removeUser = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiDelete(`/api/admin/users/${deleteTarget._id}`);
      setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id));
      toast.error("User deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || "Could not delete user");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  const safePage = Math.min(page, Math.max(1, Math.ceil(users.length / PAGE_SIZE)));
  const pageItems = users.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div>
      <PageHeader title="Users" subtitle="Manage roles and accounts." />
      {users.length === 0 ? (
        <EmptyState title="No users" description="No users to display." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-border bg-surface-secondary/40 text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">User</th>
                  <th className="px-5 py-3.5 font-semibold">Subscription</th>
                  <th className="px-5 py-3.5 font-semibold">Joined</th>
                  <th className="px-5 py-3.5 font-semibold">Role</th>
                  <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((u) => (
                  <tr
                    key={u._id}
                    className="border-b border-border transition last:border-0 hover:bg-surface-hover/50"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {u.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={u.image}
                            alt={u.name}
                            className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-border"
                          />
                        ) : (
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                            {(u.name || "U").charAt(0).toUpperCase()}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{u.name}</p>
                          <p className="truncate text-xs text-muted">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                          (u.subscription || "free") === "premium"
                            ? "bg-success-soft text-success-soft-foreground"
                            : "bg-surface-secondary text-muted"
                        }`}
                      >
                        {u.subscription || "free"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <RoleSelect
                        value={u.role}
                        onChange={(e) => changeRole(u, e.target.value)}
                      />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => setDeleteTarget(u)}
                        aria-label="Delete user"
                        title="Delete user"
                        className="rounded-lg p-2 text-muted transition hover:bg-danger-soft hover:text-danger"
                      >
                        <TrashBin width={16} height={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={safePage}
            pageSize={PAGE_SIZE}
            total={users.length}
            onChange={setPage}
          />
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={removeUser}
        loading={deleting}
        title="Delete user"
        message={`Delete ${deleteTarget?.name}? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
