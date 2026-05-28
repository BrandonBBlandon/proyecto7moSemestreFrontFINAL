"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Flag, Flame, LogIn, Monitor } from "lucide-react";
import { SESSION_KEY } from "@/components/layout/AppShell";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (window.localStorage.getItem(SESSION_KEY)) {
      router.replace("/dashboard");
    }
  }, [router]);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Ingresa usuario y contraseña.");
      return;
    }

    window.localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        username: username.trim(),
        createdAt: new Date().toISOString(),
      }),
    );
    router.replace("/dashboard");
  }

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-8">
      <section className="w-full max-w-md [2rem] border border-white/10 bg-slate-950/72 p-5 shadow-soft backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center [1.75rem] bg-teal-300/14 text-teal-100">
            <Monitor className="h-10 w-10" />
          </div>
          <h1 className="mt-5 text-3xl font-black text-white">{process.env.NEXT_PUBLIC_APP_NAME ?? "Monitoreo de Humo"}</h1>
          <p className="mt-2 text-sm text-slate-400">iniciar sesion para  ver las estadisiticas</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Usuario</span>
            <input
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                setError("");
              }}
              className="w-full --2xl border-white/10 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-600 focus:border-teal-300 focus:ring-teal-300"
              placeholder="estudiante"
              autoComplete="username"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              className="w-full --2xl border-white/10 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-600 focus:border-teal-300 focus:ring-teal-300"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>
          {error ? <p className="--2xl bg-red-500/12 px-4 py-3 text-sm text-red-100">{error}</p> : null}
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 --2xl bg-teal-300 px-5 py-3 font-black text-slate-950 transition hover:bg-teal-200"
          >
            Iniciar Sesion
          </button>
        </form>
      </section>
    </main>
  );
}
