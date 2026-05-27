import type {
  CurrentMonitoring,
  DailyReport,
  HealthResponse,
  MonthlyReport,
  RangeReport,
  Reading,
} from "@/types/api";

const DEFAULT_TIMEOUT_MS = 9000;

type FetchOptions = {
  timeoutMs?: number;
};

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function fetchJson<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(`/api/backend${path}`, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    const rawText = await response.text();
    let payload: unknown = null;

    if (rawText) {
      try {
        payload = JSON.parse(rawText);
      } catch {
        throw new ApiError("El servidor respondió con un formato inválido.", response.status);
      }
    }

    if (!response.ok) {
      const message =
        typeof payload === "object" && payload && "message" in payload && typeof payload.message === "string"
          ? payload.message
          : response.status === 504
            ? "El servidor puede estar iniciando, intenta de nuevo."
            : "No fue posible consultar el backend.";
      throw new ApiError(message, response.status);
    }

    return payload as T;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("API request failed", { path, error });
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("El servidor puede estar iniciando, intenta de nuevo.");
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError("No se pudo conectar con el backend.");
  } finally {
    window.clearTimeout(timeout);
  }
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export async function getCurrentMonitoring() {
  const response = await fetchJson<{ ok?: boolean; data?: CurrentMonitoring }>("/monitoring/current");
  if (response.ok === false) throw new ApiError("El backend no pudo entregar el estado actual.");
  return response.data ?? null;
}

export async function getLatestReadings(limit = 20) {
  const response = await fetchJson<{ ok?: boolean; data?: Reading[]; items?: Reading[] }>(
    `/readings/latest?limit=${encodeURIComponent(limit)}`,
  );
  if (response.ok === false) throw new ApiError("El backend no pudo entregar las últimas lecturas.");
  return asArray<Reading>(response.data ?? response.items);
}

export async function getDailyReport(date?: string) {
  const query = date ? `?date=${encodeURIComponent(date)}` : "";
  const response = await fetchJson<DailyReport>(`/reportes/daily${query}`);
  if (response.ok === false) throw new ApiError(response.message ?? "No se pudo generar el reporte diario.");
  return response;
}

export async function getRangeReport(from: string, to: string) {
  const response = await fetchJson<RangeReport>(
    `/reportes/range?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
  );
  if (response.ok === false) throw new ApiError(response.message ?? "No se pudo generar el reporte por rango.");
  return response;
}

export async function getMonthlyReport(year: number, month: number) {
  const response = await fetchJson<MonthlyReport>(
    `/reportes/monthly?year=${encodeURIComponent(year)}&month=${encodeURIComponent(month)}`,
  );
  if (response.ok === false) throw new ApiError(response.message ?? "No se pudo generar el reporte mensual.");
  return response;
}

export async function getLatestReportReadings(limit = 10) {
  const response = await fetchJson<{ ok?: boolean; items?: Reading[]; data?: Reading[] }>(
    `/reportes/latest?limit=${encodeURIComponent(limit)}`,
  );
  if (response.ok === false) throw new ApiError("No se pudo consultar el historial reciente.");
  return asArray<Reading>(response.items ?? response.data);
}

export async function getHealth() {
  return fetchJson<HealthResponse>("/health", { timeoutMs: 7000 });
}

export async function getDbHealth() {
  return fetchJson<HealthResponse>("/db/health", { timeoutMs: 7000 });
}
