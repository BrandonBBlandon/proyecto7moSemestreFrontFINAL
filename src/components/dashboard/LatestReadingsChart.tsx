"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatTime } from "@/lib/dates";
import { getSmokeValue } from "@/lib/formatters";
import type { Reading } from "@/types/api";

type LatestReadingsChartProps = {
  readings: Reading[];
};

export function LatestReadingsChart({ readings }: LatestReadingsChartProps) {
  const data = readings
    .map((reading) => ({
      time: formatTime(reading.createdAt),
      value: getSmokeValue(reading) ?? 0,
      status: reading.status ?? reading.riskLevel ?? "normal",
    }))
    .reverse();

  if (data.length === 0) {
    return <EmptyState title="Sin lecturas para graficar" />;
  }

  return (
    <article className="glass-panel --[1.75rem] p-4">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white">Últimas lecturas</h2>
        <p className="text-sm text-slate-400">Evolución reciente del valor MQ-2</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: -18, right: 8, top: 12, bottom: 0 }}>
            <defs>
              <linearGradient id="smokeArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.48} />
                <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(148, 163, 184, 0.14)" vertical={false} />
            <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "#0f172a",
                border: "1px solid rgba(148, 163, 184, 0.2)",
                borderRadius: "16px",
                color: "#f8fafc",
              }}
              labelStyle={{ color: "#cbd5e1" }}
            />
            <Area type="monotone" dataKey="value" stroke="#2dd4bf" strokeWidth={3} fill="url(#smokeArea)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
