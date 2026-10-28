"use client";
/* Avisa una sola vez cuando un elemento aparece en pantalla (para animaciones de entrada). */
import { useEffect, useRef, useState } from "react";

export function useVisto<T extends Element>(umbral = 0.35, margen = "0px") {
  const ref = useRef<T>(null);
  const [visto, setVisto] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisto(true);
          o.disconnect();
        }
      },
      { threshold: umbral, rootMargin: margen },
    );
    o.observe(el);
    return () => o.disconnect();
  }, [umbral, margen]);
  return [ref, visto] as const;
}
