import type { ReactNode } from "react";
import { Wifi, WifiOff } from "lucide-react";

type MobileHeaderProps = {
  title: string;
  subtitle?: string;
  connection?: "connected" | "disconnected" | "error";
  action?: ReactNode;
};

const connectionCopy = {
  connected: { text: "Conectado", icon: Wifi, className: "text-emerald-200" },
  disconnected: { text: "Desconectado", icon: WifiOff, className: "text-amber-200" },
  error: { text: "Error", icon: WifiOff, className: "text-red-200" },
};

export function MobileHeader({ title, subtitle, connection, action }: MobileHeaderProps) {
  const state = connection ? connectionCopy[connection] : null;
  const Icon = state?.icon;

  return (
    <header className="sticky top-0 z-30 -mx-4 border-b border-white/10 bg-slate-950/76 px-4 pb-4 pt-[calc(1rem+env(safe-area-inset-top))] backdrop-blur-xl sm:-mx-6 sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-200/80">
            {process.env.NEXT_PUBLIC_APP_NAME ?? "Smoke Monitor"}
          </p>
          <h1 className="mt-1 truncate text-2xl font-bold text-white">{title}</h1>
          <div className="mt-1 flex min-h-5 flex-wrap items-center gap-2 text-sm text-slate-400">
            {subtitle ? <span>{subtitle}</span> : null}
            {state && Icon ? (
              <span className={`inline-flex items-center gap-1.5 ${state.className}`}>
                <Icon className="h-4 w-4" />
                {state.text}
              </span>
            ) : null}
          </div>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </header>
  );
}
