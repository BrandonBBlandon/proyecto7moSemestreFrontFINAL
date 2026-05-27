"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Flame } from "lucide-react";
import { SESSION_KEY } from "@/components/layout/AppShell";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const session = window.localStorage.getItem(SESSION_KEY);
      router.replace(session ? "/dashboard" : "/login");
    }, 1500);

    return () => window.clearTimeout(timeout);
  }, [router]);

  return (
    <main className="grid min-h-dvh place-items-center px-6">
      <section className="animate-[fadeIn_900ms_ease-out] text-center">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-[2rem] border border-teal-300/25 bg-teal-300/12 text-teal-100 shadow-glow">
          <Flame className="h-12 w-12" />
        </div>
        <h1 className="mt-6 text-4xl font-black text-white">{process.env.NEXT_PUBLIC_APP_NAME ?? "Smoke Monitor"}</h1>
        <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Monitoreo MQ-2 / ESP32</p>
      </section>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </main>
  );
}
