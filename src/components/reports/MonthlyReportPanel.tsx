"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { getMonthlyReport } from "@/lib/api";
import type { MonthlyReport } from "@/types/api";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { ReportSummaryCards } from "@/components/reports/ReportSummaryCards";
import { ReportChart } from "@/components/reports/ReportChart";

export function MonthlyReportPanel() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReport = useCallback(async (targetYear = year, targetMonth = month) => {
    if (targetYear < 2000 || targetYear > 2100) {
      setError("El año debe estar entre 2000 y 2100.");
      setLoading(false);
      return;
    }
    if (targetMonth < 1 || targetMonth > 12) {
      setError("El mes debe estar entre 1 y 12.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      setReport(await getMonthlyReport(targetYear, targetMonth));
    } catch (err) {
      setReport(null);
      setError(err instanceof Error ? err.message : "No se pudo cargar el reporte mensual.");
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    const current = new Date();
    void loadReport(current.getFullYear(), current.getMonth() + 1);
  }, [loadReport]);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void loadReport(year, month);
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="glass-panel grid gap-3 --[1.75rem] p-4 sm:grid-cols-[1fr_1fr_auto]">
        <label>
          <span className="mb-2 block text-sm font-medium text-slate-300">Año</span>
          <input
            type="number"
            min={2000}
            max={2100}
            value={year}
            onChange={(event) => setYear(Number(event.target.value))}
            className="w-full --2xl border-white/10 bg-slate-950/70 text-white focus:border-teal-300 focus:ring-teal-300"
          />
        </label>
        <label>
          <span className="mb-2 block text-sm font-medium text-slate-300">Mes</span>
          <select
            value={month}
            onChange={(event) => setMonth(Number(event.target.value))}
            className="w-full --2xl border-white/10 bg-slate-950/70 text-white focus:border-teal-300 focus:ring-teal-300"
          >
            {Array.from({ length: 12 }, (_, index) => index + 1).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 --2xl bg-teal-300 px-5 py-3 font-bold text-slate-950 transition hover:bg-teal-200 sm:self-end"
        >
          <Search className="h-4 w-4" />
          Consultar
        </button>
      </form>

      {loading ? <LoadingState message="Consultando el reporte mensual." /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={() => void loadReport(year, month)} /> : null}
      {!loading && !error && !report?.summary && (report?.items?.length ?? 0) === 0 ? <EmptyState /> : null}
      {!loading && !error && report ? (
        <div className="space-y-4">
          <ReportSummaryCards summary={report.summary} />
          <ReportChart mode="aggregate" items={report.items ?? []} />
        </div>
      ) : null}
    </div>
  );
}
