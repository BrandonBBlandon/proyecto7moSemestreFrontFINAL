type LoadingStateProps = {
  title?: string;
  message?: string;
};

export function LoadingState({
  title = "Cargando datos",
  message = "Consultando el backend del sistema.",
}: LoadingStateProps) {
  return (
    <div className="glass-panel flex min-h-44 flex-col items-center justify-center rounded-[1.75rem] p-6 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-teal-300/20 border-t-teal-300" />
      <p className="mt-4 text-base font-semibold text-white">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-slate-400">{message}</p>
    </div>
  );
}
