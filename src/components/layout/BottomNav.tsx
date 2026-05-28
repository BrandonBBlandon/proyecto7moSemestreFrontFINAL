"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Clock3, Gauge, Settings, UserRound } from "lucide-react";
import { clsx } from "clsx";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/historial", label: "Historial", icon: Clock3 },
  { href: "/ajustes", label: "Ajustes", icon: Settings },
  { href: "/perfil", label: "Perfil", icon: UserRound },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-slate-950/86 px-2 pb-[calc(0.65rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:left-1/2 md:w-[28rem] md:-translate-x-1/2 md:--t-[1.6rem] md:border-x">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex h-14 flex-col items-center justify-center gap-1 --2xl text-[0.68rem] font-medium transition",
                active ? "bg-teal-300/14 text-teal-100" : "text-slate-400 hover:bg-white/6 hover:text-slate-100",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
