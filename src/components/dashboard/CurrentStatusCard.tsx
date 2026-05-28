import { Activity, Clock3, Cpu } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SensorGauge } from "@/components/dashboard/SensorGauge";
import { formatDateTime, isRecent } from "@/lib/dates";
import { formatDeviceId, getSmokeValue } from "@/lib/formatters";
import { normalizeStatus, statusMeta } from "@/lib/status";
import type { CurrentMonitoring } from "@/types/api";

type CurrentStatusCardProps = {
  monitoring: CurrentMonitoring | null;
};

export function CurrentStatusCard({ monitoring }: CurrentStatusCardProps) {
  const reading = monitoring?.current ?? monitoring?.latestReading ?? null;
  const status = normalizeStatus(monitoring?.status ?? reading?.status ?? reading?.riskLevel);
  const meta = statusMeta[status];
  const createdAt = monitoring?.createdAt ?? reading?.createdAt;
  const value = monitoring?.sensorValue ?? monitoring?.smokeValue ?? getSmokeValue(reading);
  const deviceId = monitoring?.deviceId ?? reading?.deviceId;

  return (
    <article className={`--[2rem] border p-5 shadow-soft ${meta.panel}`}>
      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[1fr_17rem] lg:items-center">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <StatusBadge status={status} />
              <h2 className="mt-4 text-3xl font-black text-white">{meta.label}</h2>
              <p className="mt-1 text-base text-slate-300">{meta.message}</p>
            </div>
  
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="--2xl bg-black/16 p-4">
  
              <p className="mt-2 text-xs text-slate-400">Dispositivo</p>
              <p className="font-semibold text-white">{formatDeviceId(deviceId)}</p>
            </div>
            <div className="--2xl bg-black/16 p-4">

              <p className="mt-2 text-xs text-slate-400">Última lectura</p>
              <p className="text-sm font-semibold text-white">{formatDateTime(createdAt)}</p>
            </div>
            <div className="--2xl bg-black/16 p-4">
              <p className="mt-2 text-xs text-slate-400">Conexión</p>
              <p className="font-semibold text-white">{isRecent(createdAt) ? "Lectura reciente" : "Lectura antigua"}</p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-300">
            Valor actual del sensor: <strong className="text-white">{value ?? "Sin dato"}</strong>. Los umbrales se toman
            del backend cuando están disponibles.
          </p>
        </div>
        <SensorGauge monitoring={monitoring} />
      </div>
    </article>
  );
}
