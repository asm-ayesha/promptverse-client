"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TrashBin } from "@gravity-ui/icons";
import { apiGet, apiPatch, apiDelete } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";

const roles = ["user", "creator", "admin"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const removeUser = async (user) => {
    if (!confirm(`Delete ${user.name}?`)) return;
    try {
      await apiDelete(`/api/admin/users/${user._id}`);
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
      toast.success("User deleted");
    } catch (err) {
      toast.error(err.message || "Could not delete user");
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <PageHeader title="Users" subtitle="Manage roles and accounts." />
      {users.length === 0 ? (
        <EmptyState title="No users" description="No users to display." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-muted">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Subscription</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 font-medium text-foreground">{u.name}</td>
                    <td className="px-5 py-3 text-muted">{u.email}</td>
                    <td className="px-5 py-3 capitalize text-muted">
                      {u.subscription || "free"}
                    </td>
                    <td className="px-5 py-3">
                      <select
                        value={u.role || "user"}
                        onChange={(e) => changeRole(u, e.target.value)}
                        className="rounded-lg border border-field-border bg-field px-2 py-1 text-sm text-field-foreground outline-none"
                      >
                        {roles.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => removeUser(u)}
                        aria-label="Delete user"
                        className="rounded-md p-1.5 text-muted transition hover:bg-surface-hover hover:text-danger"
                      >
                        <TrashBin width={16} height={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
