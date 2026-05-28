import type { SmokeStatus } from "@/types/api";

export const statusMeta: Record<
  SmokeStatus,
  {
    label: string;
    message: string;
    tone: string;
    badge: string;
    panel: string;
    chart: string;
  }
> = {
  normal: {
    label: "Normal",
    message: "Ambiente estable",
    tone: "text-emerald-200",
    badge: "border-emerald-400/30 bg-emerald-400/12 text-emerald-100",
    panel: "border-emerald-400/30 bg-emerald-500/12",
    chart: "#22d63d",
  },
  warning: {
    label: "Advertencia",
    message: "Nivel elevado de humo",
    tone: "text-amber-200",
    badge: "border-amber-400/35 bg-amber-400/14 text-amber-100",
    panel: "border-amber-400/35 bg-amber-500/14",
    chart: "#def50b",
  },
  alarm: {
    label: "Alarma",
    message: "Riesgo crítico detectado",
    tone: "text-red-200",
    badge: "border-red-400/40 bg-red-500/16 text-red-100",
    panel: "border-red-400/45 bg-red-500/16",
    chart: "#ff0000",
  },
};

export function normalizeStatus(value?: string | null): SmokeStatus {
  if (value === "warning" || value === "alarm" || value === "normal") {
    return value;
  }

  return "normal";
}

export function getStatusLabel(value?: string | null) {
  return statusMeta[normalizeStatus(value)].label;
}

export function getStatusMessage(value?: string | null) {
  return statusMeta[normalizeStatus(value)].message;
}
