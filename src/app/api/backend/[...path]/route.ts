import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_API_URL = process.env.BACKEND_API_URL ?? "http://localhost:3000";
const PROXY_TIMEOUT_MS = 12000;

type RouteContext = {
  params: Promise<{
    path?: string[];
  }>;
};

function buildBackendUrl(pathSegments: string[], request: NextRequest) {
  const baseUrl = BACKEND_API_URL.replace(/\/$/, "");
  const backendUrl = new URL(`${baseUrl}/api/${pathSegments.map(encodeURIComponent).join("/")}`);
  backendUrl.search = request.nextUrl.search;
  return backendUrl;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { path = [] } = await context.params;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROXY_TIMEOUT_MS);

  try {
    const backendUrl = buildBackendUrl(path, request);
    const backendResponse = await fetch(backendUrl, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    const body = await backendResponse.text();
    const contentType = backendResponse.headers.get("content-type") ?? "application/json";

    return new NextResponse(body, {
      status: backendResponse.status,
      headers: {
        "content-type": contentType,
        "cache-control": "no-store",
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Backend proxy failed", error);
    }

    const message =
      error instanceof DOMException && error.name === "AbortError"
        ? "El servidor puede estar iniciando, intenta de nuevo."
        : "No se pudo conectar con el backend.";

    return NextResponse.json(
      {
        ok: false,
        message,
      },
      { status: 504 },
    );
  } finally {
    clearTimeout(timeout);
  }
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
