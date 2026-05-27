"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/layout/BottomNav";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { LoadingState } from "@/components/ui/LoadingState";

type AppShellProps = {
  title: string;
  subtitle?: string;
  connection?: "connected" | "disconnected" | "error";
  action?: ReactNode;
  children: ReactNode;
};

export const SESSION_KEY = "smoke-monitor-session";

export function AppShell({ title, subtitle, connection, action, children }: AppShellProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = window.localStorage.getItem(SESSION_KEY);
    if (!session) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md items-center justify-center px-4">
        <LoadingState title="Preparando sesión" message="Validando acceso local." />
      </main>
    );
  }

  return (
    <div className="min-h-dvh">
      <main className="app-safe-bottom mx-auto w-full max-w-5xl px-4 sm:px-6">
        <MobileHeader title={title} subtitle={subtitle} connection={connection} action={action} />
        <section className="py-5">{children}</section>
      </main>
      <BottomNav />
    </div>
  );
}
