"use client";

import { FormEvent, useState } from "react";
import { Wifi } from "lucide-react";

export function WifiConfigMockPanel() {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [saved, setSaved] = useState(false);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <article className="glass-panel rounded-[1.75rem] p-4">
      <div className="flex gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-teal-100">
          <Wifi className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-white">Red Wi-Fi</h2>
          <p className="text-sm leading-6 text-slate-400">
            Prototipo visual. Aún no existe un endpoint real para enviar esta configuración al ESP32.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-300">SSID</span>
          <input
            value={ssid}
            onChange={(event) => {
              setSsid(event.target.value);
              setSaved(false);
            }}
            placeholder="Nombre de red"
            className="w-full rounded-2xl border-white/10 bg-slate-950/70 text-white placeholder:text-slate-600 focus:border-teal-300 focus:ring-teal-300"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-300">Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setSaved(false);
            }}
            placeholder="Clave Wi-Fi"
            className="w-full rounded-2xl border-white/10 bg-slate-950/70 text-white placeholder:text-slate-600 focus:border-teal-300 focus:ring-teal-300"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-2xl bg-white/10 px-5 py-3 font-bold text-white transition hover:bg-white/15"
        >
          Guardar configuración
        </button>
        {saved ? <p className="text-sm text-emerald-200">Configuración guardada solo en la vista actual.</p> : null}
      </form>
    </article>
  );
}
