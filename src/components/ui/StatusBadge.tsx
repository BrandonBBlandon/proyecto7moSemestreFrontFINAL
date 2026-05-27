import { AlertTriangle, CheckCircle2, Siren } from "lucide-react";
import { clsx } from "clsx";
import { normalizeStatus, statusMeta } from "@/lib/status";

type StatusBadgeProps = {
  status?: string | null;
  compact?: boolean;
};

export function StatusBadge({ status, compact = false }: StatusBadgeProps) {
  const normalized = normalizeStatus(status);
  const meta = statusMeta[normalized];
  const Icon = normalized === "alarm" ? Siren : normalized === "warning" ? AlertTriangle : CheckCircle2;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
        meta.badge,
      )}
    >
      <Icon className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
      {meta.label}
    </span>
  );
}
