import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Las imágenes ya vienen optimizadas en WebP desde public/; en Cloudflare no usamos el optimizador de Next.
  images: { unoptimized: true },
};

export default nextConfig;
