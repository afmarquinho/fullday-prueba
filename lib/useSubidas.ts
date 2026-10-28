"use client";
/* Piezas con la clase .t-sube que suben al aparecer en pantalla (ver componentes/tours/Tour.css).
   Las que ya están en pantalla al cargar arrancan visibles. */
import { useEffect } from "react";

export function useSubidas(cambio: unknown) {
  useEffect(() => {
    const o = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.remove("pendiente");
          o.unobserve(e.target);
        }),
      { rootMargin: "0px 0px -6% 0px" },
    );
    document.querySelectorAll(".t-sube").forEach((el) => {
      if (el.getBoundingClientRect().top <= innerHeight) return;
      el.classList.add("pendiente");
      o.observe(el);
    });
    return () => o.disconnect();
  }, [cambio]);
}
