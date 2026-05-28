"use client";

import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate, formatTime } from "@/lib/dates";
import { getSmokeValue } from "@/lib/formatters";
import type { AggregatedReportItem, Reading } from "@/types/api";

type ReportChartProps =
  | {
      mode: "daily";
      items: Reading[];
    }
  | {
      mode: "aggregate";
      items: AggregatedReportItem[];
    };

export function ReportChart(props: ReportChartProps) {
  const data =
    props.mode === "daily"
      ? props.items.map((item) => ({
          label: formatTime(item.createdAt),
          smoke: getSmokeValue(item) ?? 0,
          incidents: item.status === "alarm" || item.status === "warning" ? 1 : 0,
        }))
      : props.items.map((item) => ({
          label: item.date ? formatDate(item.date) : "Sin fecha",
          smoke: item.avgSmokeValue ?? 0,
          incidents: item.totalIncidents ?? 0,
          alarms: item.alarmReadings ?? 0,
        }));

  if (data.length === 0) {
    return <EmptyState title="Sin datos para la gráfica" />;
  }

  return (
    <article className="glass-panel --[1.75rem] p-4">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white">Gráfica del reporte</h3>
        <p className="text-sm text-slate-400">
          {props.mode === "daily" ? "Valores por lectura durante el día" : "Promedios e incidentes por día"}
        </p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ left: -18, right: 10, top: 12, bottom: 0 }}>
            <defs>
              <linearGradient id="reportArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.38} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(148, 163, 184, 0.14)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={false} />
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
            {props.mode === "aggregate" ? <Bar dataKey="incidents" fill="#f59e0b" radius={[8, 8, 0, 0]} /> : null}
            {props.mode === "daily" ? (
              <Area type="monotone" dataKey="smoke" stroke="#2dd4bf" strokeWidth={3} fill="url(#reportArea)" />
            ) : (
              <Line type="monotone" dataKey="smoke" stroke="#2dd4bf" strokeWidth={3} dot={false} />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
