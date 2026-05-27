import { RotateCcw, TriangleAlert } from "lucide-react";

type ErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ title = "No se pudo cargar", message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-[1.75rem] border border-red-400/25 bg-red-500/10 p-5 text-left shadow-soft">
      <div className="flex gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-red-500/15 text-red-200">
          <TriangleAlert className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-red-50">{title}</p>
          <p className="mt-1 text-sm leading-6 text-red-100/78">{message}</p>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-400 px-4 py-2 text-sm font-semibold text-red-950 transition hover:bg-red-300"
            >
              <RotateCcw className="h-4 w-4" />
              Reintentar
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
