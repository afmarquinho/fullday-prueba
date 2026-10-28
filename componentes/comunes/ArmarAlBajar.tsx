"use client";
/* Hace que las piezas de la página entren en escalera cuando aparecen en pantalla.
   Recibe grupos: [selector CSS, profundidad en px, fuerza].
   - profundidad: lo de fondo llega desde cerca (-140); lo de primer plano, desde más lejos (-320).
   - fuerza: 1 = llegada suave; más alto = más dramático (para los momentos fuertes). */
import { useEffect } from "react";
import "./ArmarAlBajar.css";

export type GrupoArmado = [selector: string, profundidad: number, fuerza: number];

const ESCALON = 0.1; // segundos entre piezas del mismo grupo

export default function ArmarAlBajar({ grupos }: { grupos: GrupoArmado[] }) {
  useEffect(() => {
    const o = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("armado");
          o.unobserve(e.target);
        }),
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    for (const [selector, z, f] of grupos) {
      const todos = document.querySelectorAll<HTMLElement>(selector);
      todos.forEach((el, i) => {
        const lado = todos.length > 1 ? (i / (todos.length - 1) - 0.5) * 2 : 0; // -1 izquierda … 1 derecha
        el.classList.add("armar");
        el.style.setProperty("--d", (i * ESCALON).toFixed(2) + "s");
        el.style.setProperty("--z", z * f + "px");
        el.style.setProperty("--x", lado * -40 * f + "px"); // llegan abriéndose desde el centro
        el.style.setProperty("--y", 14 * f + "px");
        el.style.setProperty("--ry", lado * 10 * f + "deg");
        el.style.setProperty("--rx", 6 * f + "deg");
        o.observe(el);
      });
    }
    return () => o.disconnect();
  }, [grupos]);
  return null;
}
