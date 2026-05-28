"use client";

import { useEffect, useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import { getDbHealth, getHealth } from "@/lib/api";
import { formatDateTime } from "@/lib/dates";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";

const SYNC_INTERVAL_KEY = "smoke-monitor-sync-interval";
const LAST_SYNC_KEY = "smoke-monitor-last-sync";

export function SyncSettingsPanel() {
  const [interval, setIntervalValue] = useState(10);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendOk, setBackendOk] = useState<boolean | null>(null);
  const [dbOk, setDbOk] = useState<boolean | null>(null);

  useEffect(() => {
    const savedInterval = Number(window.localStorage.getItem(SYNC_INTERVAL_KEY));
    if (savedInterval >= 5 && savedInterval <= 120) {
      setIntervalValue(savedInterval);
    }
    setLastSync(window.localStorage.getItem(LAST_SYNC_KEY));
    void testConnection();
  }, []);

  function saveInterval() {
    window.localStorage.setItem(SYNC_INTERVAL_KEY, String(interval));
  }

  async function testConnection() {
    setLoading(true);
    setError(null);
    try {
      const [health, dbHealth] = await Promise.all([getHealth(), getDbHealth()]);
      setBackendOk(health.ok !== false);
      setDbOk(dbHealth.ok !== false);
      const now = new Date().toISOString();
      window.localStorage.setItem(LAST_SYNC_KEY, now);
      setLastSync(now);
    } catch (err) {
      setBackendOk(false);
      setDbOk(false);
      setError(err instanceof Error ? err.message : "No se pudo probar la conexión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="glass-panel --[1.75rem] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white">Sincronización</h2>
          <p className="text-sm text-slate-400">Control visual del refresco de datos y prueba de conexión.</p>
        </div>
        <button
          type="button"
          onClick={() => void testConnection()}
          className="grid h-11 w-11 place-items-center --2xl bg-white/10 text-teal-100 transition hover:bg-white/15"
          title="Probar conexión"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="--2xl bg-white/[0.055] p-4">
          <p className="text-sm text-slate-400">Backend</p>
          <p className={backendOk ? "font-bold text-emerald-200" : "font-bold text-red-200"}>
            {backendOk === null ? "Sin probar" : backendOk ? "Disponible" : "No disponible"}
          </p>
        </div>
        <div className="--2xl bg-white/[0.055] p-4">
          <p className="text-sm text-slate-400">Base de datos</p>
          <p className={dbOk ? "font-bold text-emerald-200" : "font-bold text-red-200"}>
            {dbOk === null ? "Sin probar" : dbOk ? "Disponible" : "No disponible"}
          </p>
        </div>
      </div>

      <label className="mt-5 block">
        <span className="mb-2 block text-sm font-medium text-slate-300">Intervalo de actualización</span>
        <div className="flex gap-3">
          <input
            type="number"
            min={5}
            max={120}
            value={interval}
            onChange={(event) => setIntervalValue(Number(event.target.value))}
            className="min-w-0 flex-1 --2xl border-white/10 bg-slate-950/70 text-white focus:border-teal-300 focus:ring-teal-300"
          />
          <button
            type="button"
            onClick={saveInterval}
            className="inline-flex items-center gap-2 --2xl bg-teal-300 px-4 font-bold text-slate-950 transition hover:bg-teal-200"
          >
            <Save className="h-4 w-4" />
            Guardar
          </button>
        </div>
        <span className="mt-2 block text-xs text-slate-500">Valor en segundos. El dashboard usa 10 s por defecto.</span>
      </label>

      <p className="mt-4 text-sm text-slate-400">Última sincronización: {formatDateTime(lastSync)}</p>

      {loading ? <div className="mt-4"><LoadingState title="Probando conexión" message="Consultando health checks." /></div> : null}
      {!loading && error ? <div className="mt-4"><ErrorState message={error} onRetry={() => void testConnection()} /></div> : null}
    </article>
  );
}
