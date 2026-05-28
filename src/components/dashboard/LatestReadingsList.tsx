import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDateTime } from "@/lib/dates";
import { formatDeviceId, getSmokeValue } from "@/lib/formatters";
import type { Reading } from "@/types/api";

type LatestReadingsListProps = {
  readings: Reading[];
};

export function LatestReadingsList({ readings }: LatestReadingsListProps) {
  if (readings.length === 0) {
    return <EmptyState title="Sin lecturas recientes" />;
  }

  return (
    <article className="glass-panel --[1.75rem] p-4">
      <h2 className="text-lg font-bold text-white">Lecturas recientes</h2>
      <div className="mt-4 space-y-3">
        {readings.slice(0, 8).map((reading, index) => (
          <div
            key={`${reading.id ?? index}-${reading.createdAt ?? index}`}
            className="flex items-center justify-between gap-3 --2xl bg-white/[0.055] p-3"
          >
            <div className="min-w-0">
              <p className="font-semibold text-white">{getSmokeValue(reading) ?? "Sin valor"} ppm</p>
              <p className="truncate text-sm text-slate-400">
                {formatDeviceId(reading.deviceId)} · {formatDateTime(reading.createdAt)}
              </p>
            </div>
            <StatusBadge status={reading.status ?? reading.riskLevel} compact />
          </div>
        ))}
      </div>
    </article>
  );
}
