# Smoke Monitor Frontend

Frontend Next.js para el sistema académico IoT de monitoreo de humo con sensor MQ-2 y ESP32.

## Instalación

```bash
npm install
```

## Variables de entorno

Crea `.env.local` a partir de `.env.example`:

```env
NEXT_PUBLIC_APP_NAME="Smoke Monitor"
BACKEND_API_URL="https://TU-BACKEND.onrender.com"
```

Para usar backend local:

```env
BACKEND_API_URL="http://localhost:3000"
```

`BACKEND_API_URL` se usa desde el servidor de Next.js mediante el proxy interno `/api/backend/...`, evitando CORS entre Vercel y Render.

## Desarrollo

```bash
npm run dev
```

Rutas principales:

- `/` splash screen
- `/login` login local
- `/dashboard` monitoreo actual y últimas lecturas
- `/reportes` reportes diario, rango y mensual
- `/historial` últimas lecturas/eventos
- `/ajustes` health checks, sincronización y prototipo Wi-Fi
- `/perfil` usuario local y cierre de sesión

## Endpoints usados

El frontend llama al proxy interno:

- `/api/backend/monitoring/current`
- `/api/backend/readings/latest?limit=20`
- `/api/backend/reportes/daily`
- `/api/backend/reportes/range?from=YYYY-MM-DD&to=YYYY-MM-DD`
- `/api/backend/reportes/monthly?year=YYYY&month=M`
- `/api/backend/reportes/latest?limit=10`
- `/api/backend/health`
- `/api/backend/db/health`

El proxy reenvía cada solicitud al backend real como `BACKEND_API_URL + /api/...`.
