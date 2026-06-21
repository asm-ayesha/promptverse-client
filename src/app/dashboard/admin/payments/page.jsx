"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet("/api/admin/payments")
      .then((data) => setPayments(Array.isArray(data) ? data : []))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  const total = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

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
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-muted">
                <tr>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Transaction</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 text-foreground">{p.email}</td>
                    <td className="px-5 py-3 font-mono text-xs text-muted">
                      {p.transactionId}
                    </td>
                    <td className="px-5 py-3 text-foreground">${p.amount}</td>
                    <td className="px-5 py-3 text-muted">
                      {p.date ? new Date(p.date).toLocaleDateString() : ""}
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
