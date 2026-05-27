import type { Metadata, Viewport } from "next";
import "./globals.css";

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Smoke Monitor";

export const metadata: Metadata = {
  title: appName,
  description: "Monitoreo IoT de humo con MQ-2 y ESP32",
};

export const viewport: Viewport = {
  themeColor: "#080b12",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
