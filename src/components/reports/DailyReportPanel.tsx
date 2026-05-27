"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { CalendarDays, Search } from "lucide-react";
import { getDailyReport } from "@/lib/api";
import { isISODate, todayISODate } from "@/lib/dates";
import type { DailyReport } from "@/types/api";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { ReportSummaryCards } from "@/components/reports/ReportSummaryCards";
import { ReportChart } from "@/components/reports/ReportChart";

export function DailyReportPanel() {
  const [date, setDate] = useState(todayISODate());
  const [report, setReport] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReport = useCallback(async (targetDate = date) => {
    if (targetDate && !isISODate(targetDate)) {
      setError("La fecha debe tener formato YYYY-MM-DD.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      setReport(await getDailyReport(targetDate));
    } catch (err) {
      setReport(null);
      setError(err instanceof Error ? err.message : "No se pudo cargar el reporte diario.");
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    void loadReport(todayISODate());
  }, [loadReport]);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void loadReport(date);
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="glass-panel flex flex-col gap-3 rounded-[1.75rem] p-4 sm:flex-row">
        <label className="flex-1">
          <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
            <CalendarDays className="h-4 w-4" />
            Fecha
          </span>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
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

      {loading ? <LoadingState message="Generando reporte diario." /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={() => void loadReport(date)} /> : null}
      {!loading && !error && !report?.summary && (report?.items?.length ?? 0) === 0 ? <EmptyState /> : null}
      {!loading && !error && report ? (
        <div className="space-y-4">
          <ReportSummaryCards summary={report.summary} />
          <ReportChart mode="daily" items={report.items ?? []} />
        </div>
      ) : null}
    </div>
  );
}
