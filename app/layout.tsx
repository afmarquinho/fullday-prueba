/* Marco de todas las páginas: letras, datos para buscadores y redes,
   y las ventanas compartidas (planner, chat y cuenta) con la burbuja del chat. */
import type { Metadata, Viewport } from "next";
import { Barlow, Syne } from "next/font/google";
import type { ReactNode } from "react";
import VentanaChat, { BurbujaChat } from "@/componentes/planner/VentanaChat";
import VentanaCuenta from "@/componentes/planner/VentanaCuenta";
import VentanaPlanner from "@/componentes/planner/VentanaPlanner";
import { ProveedorPlanner } from "@/lib/planner";
import "./base.css";

// Letras de la marca: Syne para títulos y Barlow para textos (base.css las usa con estas variables)
const syne = Syne({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--fuente-syne" });
const barlow = Barlow({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--fuente-barlow" });

export const metadata: Metadata = {
  title: { default: "Full Day Tours · Aventura en Colombia", template: "%s · Full Day Tours" },
  description: "Amazonas, Caribe y Bogotá. Tres destinos, cero estrés. Cada día, completo.",
  applicationName: "Full Day Tours",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITIO ?? "https://fullday.tours"),
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Full Day Tours",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Full Day Tours: Amazonas, Caribe y Bogotá" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
  appleWebApp: { capable: true, title: "Full Day", statusBarStyle: "black-translucent" },
  icons: {
    icon: [{ url: "/icons/favicon.svg", type: "image/svg+xml" }],
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1F1A",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${syne.variable} ${barlow.variable}`}>
      <body>
        <ProveedorPlanner>
          {children}
          <BurbujaChat />
          <VentanaPlanner />
          <VentanaChat />
          <VentanaCuenta />
        </ProveedorPlanner>
      </body>
    </html>
  );
}
