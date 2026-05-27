import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  label: string;
  value: string;
  helper?: string;
  icon?: LucideIcon;
};

export function MetricCard({ label, value, helper, icon: Icon }: MetricCardProps) {
  return (
    <article className="rounded-[1.35rem] border border-white/10 bg-white/[0.055] p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-bold text-white">{value}</p>
        </div>
        {Icon ? (
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-teal-200">
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
      </div>
      {helper ? <p className="mt-3 text-sm text-slate-400">{helper}</p> : null}
    </article>
  );
}
