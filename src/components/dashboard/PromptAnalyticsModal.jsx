"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Copy, Star, BarsAscendingAlignLeft } from "@gravity-ui/icons";
import Modal from "@/components/ui/Modal";

const ACCENT = "#6366f1";
const MUTED = "#94a3b8";
const CYAN = "#06b6d4";
const AMBER = "#f59e0b";

const tooltipStyle = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  color: "var(--foreground)",
  fontSize: 12,
};

const tooltipLabelStyle = { color: "var(--foreground)", fontWeight: 600, marginBottom: 2 };
const tooltipItemStyle = { color: "var(--foreground)" };

const OTHERS = "rgba(148,163,184,0.45)";

const legendStyle = { fontSize: 12, paddingTop: 8 };

const shortName = (t) => (t?.length > 14 ? `${t.slice(0, 14)}…` : t || "Untitled");

export default function PromptAnalyticsModal({ open, prompt, prompts = [], onClose }) {
  // Mount charts one frame after the modal opens so ResponsiveContainer can
  // measure real dimensions (avoids the "width(-1) height(-1)" warning).
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!open) {
      setReady(false);
      return;
    }
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [open]);

  if (!prompt) return null;

  const copies = prompt.copyCount || 0;
  const reviews = prompt.reviewCount || 0;
  const rating = Number(prompt.avgRating || 0);

  // Chart 1 — this prompt's copies ranked against your other prompts.
  const copiesRanking = [...prompts]
    .sort((a, b) => (b.copyCount || 0) - (a.copyCount || 0))
    .slice(0, 8)
    .map((p) => ({
      name: shortName(p.title),
      copies: p.copyCount || 0,
      current: p._id === prompt._id,
    }));

  // Chart 2 — engagement mix for this prompt.
  const engagement = [
    { name: "Copies", value: copies, fill: ACCENT },
    { name: "Reviews", value: reviews, fill: CYAN },
  ];
  const hasEngagement = copies + reviews > 0;

  // Chart 3 — average rating gauge (0–5).
  const ratingData = [{ name: "Avg rating (out of 5)", value: rating, fill: AMBER }];

  return (
    <Modal open={open} onClose={onClose} title="Prompt analytics" size="xl">
      <div className="max-h-[75vh] space-y-6 overflow-y-auto pr-1">
        <div>
          <p className="text-sm text-muted">Performance for</p>
          <h4 className="text-base font-semibold text-foreground">{prompt.title}</h4>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <MiniStat icon={Copy} label="Copies" value={copies} />
          <MiniStat icon={BarsAscendingAlignLeft} label="Reviews" value={reviews} />
          <MiniStat icon={Star} label="Rating" value={rating ? rating.toFixed(1) : "—"} />
        </div>

        <Card title="Copies vs your other prompts">
          {ready ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={copiesRanking}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: MUTED }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={50}
              />
              <YAxis tick={{ fontSize: 11, fill: MUTED }} allowDecimals={false} />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={tooltipLabelStyle}
                itemStyle={tooltipItemStyle}
                cursor={{ fill: "rgba(148,163,184,0.1)" }}
              />
              <Legend
                wrapperStyle={legendStyle}
                payload={[
                  { value: "This prompt", type: "square", color: ACCENT, id: "current" },
                  { value: "Other prompts", type: "square", color: OTHERS, id: "others" },
                ]}
              />
              <Bar dataKey="copies" name="Copies" radius={[6, 6, 0, 0]}>
                {copiesRanking.map((entry, i) => (
                  <Cell key={i} fill={entry.current ? ACCENT : OTHERS} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          ) : null}
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card title="Engagement mix">
            {!ready ? null : hasEngagement ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={engagement}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {engagement.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelStyle={tooltipLabelStyle}
                    itemStyle={tooltipItemStyle}
                  />
                  <Legend wrapperStyle={legendStyle} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart message="No copies or reviews yet" />
            )}
          </Card>

          <Card title="Average rating">
            {!ready ? null : rating > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  data={ratingData}
                  innerRadius="70%"
                  outerRadius="100%"
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis type="number" domain={[0, 5]} tick={false} />
                  <RadialBar
                    dataKey="value"
                    name="Avg rating (out of 5)"
                    cornerRadius={10}
                    background={{ fill: "rgba(148,163,184,0.15)" }}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelStyle={tooltipLabelStyle}
                    itemStyle={tooltipItemStyle}
                  />
                  <Legend wrapperStyle={legendStyle} iconType="circle" />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-foreground"
                    style={{ fontSize: 26, fontWeight: 700 }}
                  >
                    {rating.toFixed(1)}
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart message="No ratings yet" />
            )}
          </Card>
        </div>
      </div>
    </Modal>
  );
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted">
        <Icon width={14} height={14} /> {label}
      </div>
      <p className="mt-1 text-xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">{title}</h3>
      <div className="h-64 w-full">{children}</div>
    </div>
  );
}

function EmptyChart({ message }) {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted">
      {message}
    </div>
  );
}
