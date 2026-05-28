import { Inbox } from "lucide-react";

type EmptyStateProps = {
  title?: string;
  message?: string;
};

export function EmptyState({
  title = "Sin datos disponibles",
  message = "El backend respondió correctamente, pero no entregó registros para mostrar.",
}: EmptyStateProps) {
  return (
    <div className="--[1.75rem] border border-white/10 bg-white/[0.045] p-6 text-center">
      <span className="mx-auto grid h-12 w-12 place-items-center --2xl bg-white/10 text-slate-300">
        <Inbox className="h-6 w-6" />
      </span>
      <p className="mt-4 font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-400">{message}</p>
    </div>
  );
}
