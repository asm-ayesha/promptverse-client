"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Persons, FileText, Star, Copy, CreditCard } from "@gravity-ui/icons";
import { apiGet } from "@/lib/api";
import PageHeader from "@/components/dashboard/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import ChartCard from "@/components/dashboard/ChartCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";

const PIE_COLORS = [
  "#6366f1",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#a855f7",
  "#ec4899",
  "#14b8a6",
];

const tooltipProps = {
  contentStyle: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    color: "var(--foreground)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    padding: "10px 14px",
  },
  labelStyle: { color: "var(--foreground)", fontWeight: 700, marginBottom: 4 },
  itemStyle: { color: "var(--foreground)", fontSize: 13 },
};

const axisTick = { fontSize: 11, fill: "#94a3b8" };

const formatDate = (value) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? value
    : d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const formatDateFull = (value) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? value
    : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet("/api/admin/analytics")
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullPage />;
  if (!data) return <EmptyState title="No data" description="Analytics unavailable." />;

  // Build a continuous, zero-filled daily series so the line spans every day
  // (from the earliest data point — or at least the last 14 days — up to today)
  // instead of showing only one or two isolated dots.
  const copyMap = {};
  (data.dailyCopies || []).forEach((d) => {
    copyMap[d.date] = d.count;
  });
  const revMap = {};
  (data.revenueByDay || []).forEach((r) => {
    revMap[r.date] = r.amount;
  });

  const ymd = (dt) => dt.toISOString().slice(0, 10);
  const today = new Date();
  const MAX_DAYS = 90;
  const minAllowed = new Date(today);
  minAllowed.setUTCDate(today.getUTCDate() - MAX_DAYS);
  let start = new Date(today);
  start.setUTCDate(today.getUTCDate() - 13);
  [...Object.keys(copyMap), ...Object.keys(revMap)].forEach((k) => {
    const dk = new Date(`${k}T00:00:00Z`);
    if (dk < start && dk >= minAllowed) start = dk;
  });

  const activity = [];
  for (let d = new Date(start); ymd(d) <= ymd(today); d.setUTCDate(d.getUTCDate() + 1)) {
    const key = ymd(d);
    activity.push({ date: key, copies: copyMap[key] || 0, revenue: revMap[key] || 0 });
  }

  return (
    <div>
      <PageHeader title="Platform Analytics" subtitle="An overview of PromptVerse." />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total Users" value={data.totalUsers} icon={Persons} />
        <StatCard label="Total Prompts" value={data.totalPrompts} icon={FileText} />
        <StatCard label="Total Reviews" value={data.totalReviews} icon={Star} />
        <StatCard label="Total Copies" value={data.totalCopies} icon={Copy} />
        <StatCard
          label="Total Income"
          value={`$${Number(data.totalRevenue || 0).toFixed(2)}`}
          icon={CreditCard}
          accent="bg-success-soft text-success-soft-foreground"
        />
      </div>

      <div className="mt-6">
        <ChartCard title="Daily copies & revenue (platform-wide)">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={activity}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="date" tick={axisTick} tickFormatter={formatDate} />
              <YAxis
                yAxisId="copies"
                tick={axisTick}
                allowDecimals={false}
              />
              <YAxis
                yAxisId="revenue"
                orientation="right"
                tick={axisTick}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                {...tooltipProps}
                labelFormatter={formatDateFull}
                formatter={(value, name) =>
                  name === "Revenue"
                    ? [`$${Number(value).toFixed(2)}`, name]
                    : [`${value}`, name]
                }
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" />
              <Line
                yAxisId="copies"
                type="monotone"
                dataKey="copies"
                name="Copies"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 3 }}
              />
              <Line
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 3 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard title="Prompts by category">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.promptsByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="category" tick={{ fontSize: 10, fill: "#94a3b8" }} />
              <YAxis tick={axisTick} allowDecimals={false} />
              <Tooltip {...tooltipProps} cursor={{ fill: "rgba(148,163,184,0.1)" }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" />
              <Bar dataKey="count" name="Prompts" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top prompts by copies">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.topPrompts || []} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis type="number" tick={axisTick} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} width={90} />
              <Tooltip {...tooltipProps} cursor={{ fill: "rgba(148,163,184,0.1)" }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" />
              <Bar dataKey="copies" name="Copies" fill="#06b6d4" radius={[0, 6, 6, 0]} maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Prompts by status">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.promptsByStatus}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={(entry) => `${entry.status} (${entry.count})`}
              >
                {data.promptsByStatus.map((entry, i) => (
                  <Cell key={entry.status} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip {...tooltipProps} />
              <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Users by role">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.usersByRole || []}
                dataKey="count"
                nameKey="role"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={3}
              >
                {(data.usersByRole || []).map((entry, i) => (
                  <Cell key={entry.role} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip {...tooltipProps} />
              <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Subscriptions">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.usersBySubscription || []}
                dataKey="count"
                nameKey="plan"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={(entry) => `${entry.plan} (${entry.count})`}
              >
                {(data.usersBySubscription || []).map((entry, i) => (
                  <Cell key={entry.plan} fill={entry.plan === "premium" ? "#10b981" : "#f59e0b"} />
                ))}
              </Pie>
              <Tooltip {...tooltipProps} />
              <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Prompts by AI tool">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.promptsByAiTool || []}
                dataKey="count"
                nameKey="tool"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={3}
              >
                {(data.promptsByAiTool || []).map((entry, i) => (
                  <Cell key={entry.tool} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip {...tooltipProps} />
              <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-6">
        <ChartCard title="Reviews by rating over time">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.reviewsByDay || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="date" tick={axisTick} tickFormatter={formatDate} />
              <YAxis tick={axisTick} allowDecimals={false} />
              <Tooltip {...tooltipProps} labelFormatter={formatDate} cursor={{ fill: "rgba(148,163,184,0.1)" }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" />
              <Bar stackId="r" dataKey="r1" name="1★" fill="#ef4444" maxBarSize={48} />
              <Bar stackId="r" dataKey="r2" name="2★" fill="#f97316" maxBarSize={48} />
              <Bar stackId="r" dataKey="r3" name="3★" fill="#f59e0b" maxBarSize={48} />
              <Bar stackId="r" dataKey="r4" name="4★" fill="#84cc16" maxBarSize={48} />
              <Bar stackId="r" dataKey="r5" name="5★" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
