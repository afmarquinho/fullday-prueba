import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Full Day Tours",
    short_name: "Full Day",
    description: "Tu aventura en Colombia: Amazonas, Caribe y Bogotá.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B1F1A",
    theme_color: "#0B1F1A",
    lang: "es-CO",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
