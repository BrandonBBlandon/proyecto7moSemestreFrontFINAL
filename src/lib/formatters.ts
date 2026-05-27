import type { Reading } from "@/types/api";

export function getSmokeValue(reading?: Reading | null) {
  if (!reading) return null;
  const value = reading.smokeValue ?? reading.sensorValue;
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function formatNumber(value?: number | null, digits = 0) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "Sin dato";
  return new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatSeconds(value?: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "Sin dato";
  if (value < 60) return `${Math.round(value)} s`;
  const minutes = Math.floor(value / 60);
  const seconds = Math.round(value % 60);
  return `${minutes} min ${seconds} s`;
}

export function formatDeviceId(value?: string | number | null) {
  if (value === undefined || value === null || value === "") return "Sin dispositivo";
  return `ESP32-${value}`;
}
