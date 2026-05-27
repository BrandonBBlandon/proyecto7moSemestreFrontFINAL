"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { getRangeReport } from "@/lib/api";
import { daysAgoISODate, isISODate, todayISODate } from "@/lib/dates";
import type { RangeReport } from "@/types/api";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { ReportSummaryCards } from "@/components/reports/ReportSummaryCards";
import { ReportChart } from "@/components/reports/ReportChart";

function buildSummaryFromItems(report: RangeReport) {
  if (report.summary) return report.summary;
  const items = report.items ?? [];
  if (items.length === 0) return null;

  return items.reduce(
    (acc, item) => ({
      totalReadings: (acc.totalReadings ?? 0) + (item.totalReadings ?? 0),
      totalIncidents: (acc.totalIncidents ?? 0) + (item.totalIncidents ?? 0),
      alarmReadings: (acc.alarmReadings ?? 0) + (item.alarmReadings ?? 0),
      warningReadings: (acc.warningReadings ?? 0) + (item.warningReadings ?? 0),
      normalReadings: (acc.normalReadings ?? 0) + (item.normalReadings ?? 0),
      totalAlarmSeconds: (acc.totalAlarmSeconds ?? 0) + (item.totalAlarmSeconds ?? 0),
      maxSmokeValue: Math.max(acc.maxSmokeValue ?? 0, item.maxSmokeValue ?? 0),
      avgSmokeValue: Math.round(
        items.reduce((sum, current) => sum + (current.avgSmokeValue ?? 0), 0) / Math.max(items.length, 1),
      ),
      riskLevel: items.some((current) => current.riskLevel === "alarm")
        ? "alarm"
        : items.some((current) => current.riskLevel === "warning")
          ? "warning"
          : "normal",
    }),
    {},
  );
}

export function RangeReportPanel() {
  const [from, setFrom] = useState(daysAgoISODate(7));
  const [to, setTo] = useState(todayISODate());
  const [report, setReport] = useState<RangeReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReport = useCallback(async (start = from, end = to) => {
    if (!isISODate(start) || !isISODate(end)) {
      setError("Las fechas deben tener formato YYYY-MM-DD.");
      setLoading(false);
      return;
    }
    if (start > end) {
      setError("La fecha inicial no puede ser mayor que la fecha final.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      setReport(await getRangeReport(start, end));
    } catch (err) {
      setReport(null);
      setError(err instanceof Error ? err.message : "No se pudo cargar el reporte por rango.");
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    void loadReport(daysAgoISODate(7), todayISODate());
  }, [loadReport]);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void loadReport(from, to);
  }

  const summary = report ? buildSummaryFromItems(report) : null;

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="glass-panel grid gap-3 rounded-[1.75rem] p-4 sm:grid-cols-[1fr_1fr_auto]">
        <label>
          <span className="mb-2 block text-sm font-medium text-slate-300">Desde</span>
          <input
            type="date"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            className="w-full rounded-2xl border-white/10 bg-slate-950/70 text-white focus:border-teal-300 focus:ring-teal-300"
          />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium text-slate-300">Hasta</span>
          <input
            type="date"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            className="w-full rounded-2xl border-white/10 bg-slate-950/70 text-white focus:border-teal-300 focus:ring-teal-300"
          />
        </label>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-300 px-5 py-3 font-bold text-slate-950 transition hover:bg-teal-200 sm:self-end"
        >
          <Search className="h-4 w-4" />
          Consultar
        </button>
      </form>

      {loading ? <LoadingState message="Consultando el rango seleccionado." /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={() => void loadReport(from, to)} /> : null}
      {!loading && !error && (report?.items?.length ?? 0) === 0 ? <EmptyState /> : null}
      {!loading && !error && report ? (
        <div className="space-y-4">
          <ReportSummaryCards summary={summary} />
          <ReportChart mode="aggregate" items={report.items ?? []} />
        </div>
      ) : null}
    </div>
  );
}
