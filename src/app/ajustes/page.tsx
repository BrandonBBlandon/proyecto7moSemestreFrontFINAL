import { AppShell } from "@/components/layout/AppShell";
import { SyncSettingsPanel } from "@/components/settings/SyncSettingsPanel";
import { WifiConfigMockPanel } from "@/components/settings/WifiConfigMockPanel";

export default function AjustesPage() {
  return (
    <AppShell title="Ajustes" subtitle="Conexión, sincronización y dispositivo">
      <div className="grid gap-4 lg:grid-cols-2">
        <SyncSettingsPanel />
        <WifiConfigMockPanel />
      </div>
    </AppShell>
  );
}
