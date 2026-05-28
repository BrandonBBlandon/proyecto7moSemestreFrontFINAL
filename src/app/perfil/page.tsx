"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, UserRound } from "lucide-react";
import { AppShell, SESSION_KEY } from "@/components/layout/AppShell";
import { formatDateTime } from "@/lib/dates";

type LocalSession = {
  username?: string;
  createdAt?: string;
};

export default function PerfilPage() {
  const router = useRouter();
  const [session, setSession] = useState<LocalSession | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return;

    try {
      setSession(JSON.parse(raw) as LocalSession);
    } catch {
      setSession(null);
    }
  }, []);

  function logout() {
    window.localStorage.removeItem(SESSION_KEY);
    router.replace("/login");
  }

  return (
    <AppShell title="Perfil" subtitle="Sesión local del usuario">
      <section className="glass-panel --[2rem] p-5">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center --[1.4rem] bg-teal-300/14 text-teal-100">
            <UserRound className="h-8 w-8" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-2xl font-black text-white">{session?.username ?? "Usuario local"}</p>
            <p className="text-sm text-slate-400">{process.env.NEXT_PUBLIC_APP_NAME ?? "Smoke Monitor"}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="--2xl bg-white/[0.055] p-4">
            <p className="text-sm text-slate-400">Tipo de acceso</p>
            <p className="font-bold text-white">Autenticación local</p>
          </div>
          <div className="--2xl bg-white/[0.055] p-4">
            <p className="text-sm text-slate-400">Inicio de sesión</p>
            <p className="font-bold text-white">{formatDateTime(session?.createdAt)}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 --2xl bg-red-400 px-5 py-3 font-black text-red-950 transition hover:bg-red-300"
        >
          <LogOut className="h-5 w-5" />
          Cerrar sesión
        </button>
      </section>
    </AppShell>
  );
}
