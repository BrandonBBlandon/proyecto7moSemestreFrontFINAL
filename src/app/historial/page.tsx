"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { getLatestReportReadings } from "@/lib/api";
import { formatDateTime } from "@/lib/dates";
import { formatDeviceId, getSmokeValue } from "@/lib/formatters";
import { normalizeStatus, statusMeta } from "@/lib/status";
import type { Reading } from "@/types/api";

export default function HistorialPage() {
  const [items, setItems] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      setItems(await getLatestReportReadings(10));
    } catch (err) {
      setItems([]);
      setError(err instanceof Error ? err.message : "No se pudo cargar el historial.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  const action = (
    <button
      type="button"
      onClick={() => void loadItems()}
      disabled={refreshing}
      className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-teal-100 transition hover:bg-white/15 disabled:cursor-wait disabled:opacity-60"
      title="Actualizar historial"
    >
      <RefreshCcw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
    </button>
  );

  return (
    <AppShell title="Historial" subtitle="Eventos y lecturas recientes" action={action}>
      {loading ? <LoadingState message="Consultando últimos eventos." /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={() => void loadItems()} /> : null}
      {!loading && !error && items.length === 0 ? <EmptyState title="Sin historial reciente" /> : null}
      {!loading && !error && items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item, index) => {
            const status = normalizeStatus(item.status ?? item.riskLevel);
            const meta = statusMeta[status];

            return (
              <article
                key={`${item.id ?? index}-${item.createdAt ?? index}`}
                className={`rounded-[1.5rem] border p-4 shadow-soft ${meta.panel}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-2xl font-black text-white">{getSmokeValue(item) ?? "Sin valor"} ppm</p>
                    <p className="mt-1 truncate text-sm text-slate-300">
                      {formatDeviceId(item.deviceId)} · {formatDateTime(item.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={status} />
                </div>
              </article>
            );
          })}
        </div>
      ) : null}
    </AppShell>
  );
}
