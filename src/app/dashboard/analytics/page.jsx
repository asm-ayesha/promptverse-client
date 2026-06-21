"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FileText, Copy, Bookmark } from "@gravity-ui/icons";
import { apiGet } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import ChartCard from "@/components/dashboard/ChartCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";

const ACCENT = "#6366f1";
const CYAN = "#06b6d4";

export default function CreatorAnalyticsPage() {
  const { role } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role === "user") {
      setLoading(false);
      return;
    }
    apiGet("/api/creator/analytics")
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [role]);

  if (loading) return <LoadingSpinner fullPage />;
  if (role === "user") {
    return (
      <EmptyState
        title="Creators only"
        description="Analytics are available once you become a creator."
      />
    );
  }
  if (!data) {
    return (
      <EmptyState
        title="No analytics yet"
        description="Add some prompts to start seeing analytics."
      />
    );
  }

  return (
    <div>
      <PageHeader title="Creator Analytics" subtitle="Track how your prompts perform." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Prompts" value={data.totalPrompts} icon={FileText} />
        <StatCard label="Total Copies" value={data.totalCopies} icon={Copy} />
        <StatCard label="Total Bookmarks" value={data.totalBookmarks} icon={Bookmark} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard title="Copies per prompt">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.copiesByPrompt}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  color: "var(--foreground)",
                }}
              />
              <Bar dataKey="copies" fill={ACCENT} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Prompt growth over time">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.growth}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  color: "var(--foreground)",
                }}
              />
              <Line type="monotone" dataKey="count" stroke={CYAN} strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
