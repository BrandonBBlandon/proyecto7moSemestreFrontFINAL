import { clsx } from "clsx";
import { getSmokeValue } from "@/lib/formatters";
import { normalizeStatus, statusMeta } from "@/lib/status";
import type { CurrentMonitoring } from "@/types/api";

type SensorGaugeProps = {
  monitoring: CurrentMonitoring | null;
};

export function SensorGauge({ monitoring }: SensorGaugeProps) {
  const value = monitoring?.sensorValue ?? monitoring?.smokeValue ?? getSmokeValue(monitoring?.current) ?? 0;
  const warning = monitoring?.thresholds?.warning;
  const alarm = monitoring?.thresholds?.alarm;
  const status = normalizeStatus(monitoring?.status ?? monitoring?.current?.status);
  const meta = statusMeta[status];
  const gaugeMax = alarm ?? Math.max(value, 1000);
  const percentage = Math.max(3, Math.min(100, Math.round((value / Math.max(gaugeMax, 1)) * 100)));

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative grid h-52 w-52 place-items-center rounded-full shadow-glow"
        style={{
          background: `conic-gradient(${meta.chart} ${percentage}%, rgba(148, 163, 184, 0.14) ${percentage}% 100%)`,
        }}
      >
        <div className="grid h-40 w-40 place-items-center rounded-full bg-slate-950/92 text-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">MQ-2</p>
            <p className={clsx("mt-1 text-5xl font-black", meta.tone)}>{value}</p>
            <p className="mt-1 text-sm text-slate-400">valor actual</p>
          </div>
        </div>
      </div>
      <div className="mt-4 grid w-full grid-cols-2 gap-3 text-center">
        <div className="rounded-2xl bg-white/[0.055] px-3 py-2">
          <p className="text-xs text-slate-400">Warning</p>
          <p className="font-semibold text-amber-100">{warning ?? "Sin dato"}</p>
        </div>
        <div className="rounded-2xl bg-white/[0.055] px-3 py-2">
          <p className="text-xs text-slate-400">Alarm</p>
          <p className="font-semibold text-red-100">{alarm ?? "Sin dato"}</p>
        </div>
      </div>
    </div>
  );
}
