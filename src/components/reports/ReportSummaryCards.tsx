import { AlertTriangle, BellRing, Gauge, ShieldCheck, Timer, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/ui/MetricCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatNumber, formatSeconds } from "@/lib/formatters";
import type { ReportSummary } from "@/types/api";

type ReportSummaryCardsProps = {
  summary?: ReportSummary | null;
};

export function ReportSummaryCards({ summary }: ReportSummaryCardsProps) {
  if (!summary) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between --[1.35rem] border border-white/10 bg-white/[0.055] p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Nivel de riesgo</p>
          <p className="mt-1 text-lg font-bold text-white">Resumen del periodo</p>
        </div>
        <StatusBadge status={summary.riskLevel} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Lecturas" value={formatNumber(summary.totalReadings)} icon={Gauge} />
        <MetricCard label="Incidentes" value={formatNumber(summary.totalIncidents)} icon={AlertTriangle} />
        <MetricCard label="Alarmas" value={formatNumber(summary.alarmReadings)} icon={BellRing} />
        <MetricCard label="Warnings" value={formatNumber(summary.warningReadings)} icon={TrendingUp} />
        <MetricCard label="Normales" value={formatNumber(summary.normalReadings)} icon={ShieldCheck} />
        <MetricCard label="Tiempo alarma" value={formatSeconds(summary.totalAlarmSeconds)} icon={Timer} />
        <MetricCard label="Máximo" value={formatNumber(summary.maxSmokeValue)} helper="Valor MQ-2 más alto" />
        <MetricCard label="Promedio" value={formatNumber(summary.avgSmokeValue, 1)} helper="Promedio del periodo" />
      </div>
    </div>
  );
}
