"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { CurrentStatusCard } from "@/components/dashboard/CurrentStatusCard";
import { LatestReadingsChart } from "@/components/dashboard/LatestReadingsChart";
import { LatestReadingsList } from "@/components/dashboard/LatestReadingsList";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { getCurrentMonitoring, getLatestReadings } from "@/lib/api";
import { formatDateTime, isRecent } from "@/lib/dates";
import type { CurrentMonitoring, Reading } from "@/types/api";

export default function DashboardPage() {
  const [monitoring, setMonitoring] = useState<CurrentMonitoring | null>(null);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentError, setCurrentError] = useState<string | null>(null);
  const [readingsError, setReadingsError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setRefreshing(true);
    setCurrentError(null);
    setReadingsError(null);

    const [currentResult, readingsResult] = await Promise.allSettled([getCurrentMonitoring(), getLatestReadings(20)]);

    if (currentResult.status === "fulfilled") {
      setMonitoring(currentResult.value);
    } else {
      setMonitoring(null);
      setCurrentError(currentResult.reason instanceof Error ? currentResult.reason.message : "No se pudo cargar el estado.");
    }

    if (readingsResult.status === "fulfilled") {
      setReadings(readingsResult.value);
    } else {
      setReadings([]);
      setReadingsError(
        readingsResult.reason instanceof Error ? readingsResult.reason.message : "No se pudieron cargar las lecturas.",
      );
    }

    setLastRefresh(new Date().toISOString());
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    void loadData();
    const interval = window.setInterval(() => {
      void loadData();
    }, 10000);

    return () => window.clearInterval(interval);
  }, [loadData]);

  const connection = useMemo(() => {
    if (currentError || readingsError) return "error";
    const createdAt = monitoring?.createdAt ?? monitoring?.current?.createdAt ?? monitoring?.latestReading?.createdAt;
    return monitoring && isRecent(createdAt) ? "connected" : "disconnected";
  }, [currentError, monitoring, readingsError]);

  const refreshButton = (
    <button
      type="button"
      onClick={() => void loadData()}
      disabled={refreshing}
      className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-teal-100 transition hover:bg-white/15 disabled:cursor-wait disabled:opacity-60"
      title="Actualizar"
    >
      <RefreshCcw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
    </button>
  );

  return (
    <AppShell
      title="Dashboard"
      subtitle={lastRefresh ? `Última sync: ${formatDateTime(lastRefresh)}` : "Monitoreo en vivo"}
      connection={connection}
      action={refreshButton}
    >
      <div className="space-y-4">
        {loading ? <LoadingState message="Consultando estado actual y últimas lecturas." /> : null}

        {!loading && currentError && readingsError ? (
          <ErrorState message={`${currentError} ${readingsError}`} onRetry={() => void loadData()} />
        ) : null}

        {!loading && currentError && !readingsError ? (
          <ErrorState title="Estado actual no disponible" message={currentError} onRetry={() => void loadData()} />
        ) : null}

        {!loading && !currentError && !monitoring ? <EmptyState title="Sin estado actual" /> : null}

        {!loading && monitoring ? <CurrentStatusCard monitoring={monitoring} /> : null}

        {!loading && readingsError ? (
          <ErrorState title="Lecturas no disponibles" message={readingsError} onRetry={() => void loadData()} />
        ) : null}

        {!loading && !readingsError ? (
          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <LatestReadingsChart readings={readings} />
            <LatestReadingsList readings={readings} />
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
