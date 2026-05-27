"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { AppShell } from "@/components/layout/AppShell";
import { DailyReportPanel } from "@/components/reports/DailyReportPanel";
import { RangeReportPanel } from "@/components/reports/RangeReportPanel";
import { MonthlyReportPanel } from "@/components/reports/MonthlyReportPanel";

const tabs = [
  { id: "daily", label: "Diario" },
  { id: "range", label: "Rango" },
  { id: "monthly", label: "Mensual" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function ReportesPage() {
  const [activeTab, setActiveTab] = useState<TabId>("daily");

  return (
    <AppShell title="Reportes" subtitle="Indicadores diarios, por rango y mensuales">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2 rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "rounded-2xl px-3 py-3 text-sm font-bold transition",
                activeTab === tab.id ? "bg-teal-300 text-slate-950" : "text-slate-300 hover:bg-white/10",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "daily" ? <DailyReportPanel /> : null}
        {activeTab === "range" ? <RangeReportPanel /> : null}
        {activeTab === "monthly" ? <MonthlyReportPanel /> : null}
      </div>
    </AppShell>
  );
}
