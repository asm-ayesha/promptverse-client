"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import Pagination from "@/components/ui/Pagination";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  useEffect(() => {
    apiGet("/api/admin/payments")
      .then((data) => setPayments(Array.isArray(data) ? data : []))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  const total = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const safePage = Math.min(page, Math.max(1, Math.ceil(payments.length / PAGE_SIZE)));
  const pageItems = payments.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div>
      <PageHeader
        title="Payments"
        subtitle={`Total revenue: $${total.toFixed(2)}`}
      />
      {payments.length === 0 ? (
        <EmptyState title="No payments" description="No payments recorded yet." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-border bg-surface-secondary/40 text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Customer</th>
                  <th className="px-5 py-3.5 font-semibold">Transaction</th>
                  <th className="px-5 py-3.5 font-semibold">Amount</th>
                  <th className="px-5 py-3.5 text-right font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b border-border transition last:border-0 hover:bg-surface-hover/50"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {p.purchaserImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.purchaserImage}
                            alt={p.purchaserName || p.email}
                            className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-border"
                          />
                        ) : (
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                            {(p.purchaserName || p.email || "?").charAt(0).toUpperCase()}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">
                            {p.purchaserName || "—"}
                          </p>
                          <p className="truncate text-xs text-muted">{p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-muted">
                      {p.transactionId}
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success-soft-foreground">
                        ${Number(p.amount || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-muted">
                      {p.date
                        ? new Date(p.date).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={safePage}
            pageSize={PAGE_SIZE}
            total={payments.length}
            onChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
