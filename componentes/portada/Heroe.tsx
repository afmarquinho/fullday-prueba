"use client";
/* Héroe de la portada: la escena por capas de contenido/portada.ts con parallax.
   - Mouse: cada capa se desplaza según su "prof" (las de adelante se mueven más).
   - Scroll: cada capa se queda atrás según su "vel" mientras el héroe está en pantalla. */
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ESCENA_PORTADA, TEXTO_PORTADA, type CapaPortada } from "@/contenido/portada";
import { usePlanner } from "@/lib/planner";
import LogoAnimado from "./LogoAnimado";
import "./Heroe.css";

// Movimiento máximo con el mouse (px) y suavidad (0..1: más bajo = más suave)
const MOUSE_X = 40;
const MOUSE_Y = 24;
const SUAVE = 0.08;
// Cuánto se queda atrás cada capa con el scroll
const SCROLL = 0.45;

export default function Heroe() {
  const { abrir } = usePlanner();
  const escena = useRef<HTMLElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const capas = [...escena.current!.querySelectorAll<HTMLElement>(".pc-capa")].map((c) => ({
      capa: c,
      mueve: c.firstElementChild as HTMLElement,
      vel: Number(c.dataset.vel),
      prof: Number(c.dataset.prof),
      x: 0,
      y: 0,
    }));
    let mx = 0;
    let my = 0;
    const alMover = (e: PointerEvent) => {
      mx = e.clientX / innerWidth - 0.5;
      my = e.clientY / innerHeight - 0.5;
    };
    let cuadro = 0;
    const pintar = () => {
      const sy = scrollY;
      if (sy < innerHeight * 1.2) {
        for (const k of capas) {
          k.x += (-mx * k.prof * MOUSE_X - k.x) * SUAVE;
          k.y += (-my * k.prof * MOUSE_Y - k.y) * SUAVE;
          k.mueve.style.transform = `translate3d(${k.x}px,${k.y}px,0)`;
          k.capa.style.transform = `translate3d(0,${sy * (1 - k.vel) * SCROLL}px,0)`;
        }
      }
      cuadro = requestAnimationFrame(pintar);
    };
    addEventListener("pointermove", alMover);
    cuadro = requestAnimationFrame(pintar);
    return () => {
      removeEventListener("pointermove", alMover);
      cancelAnimationFrame(cuadro);
    };
  }, []);

  return (
    <section
      className="pc"
      id="inicio"
      aria-label={ESCENA_PORTADA.nombre}
      ref={escena}
      style={{ backgroundColor: ESCENA_PORTADA.colorFondo, backgroundImage: `url(${ESCENA_PORTADA.fondo})` }}
    >
      {ESCENA_PORTADA.capas.map((c, i) => (
        <div key={c.nombre} className={`pc-capa pc-capa-${c.nombre}`} data-vel={c.vel} data-prof={c.prof} style={{ zIndex: i }}>
          <div className="pc-mueve">
            <Lienzo capa={c} />
          </div>
        </div>
      ))}

      <div className="pc-texto">
        <LogoAnimado titulo={TEXTO_PORTADA.titulo} />
        <p className="pc-frase">
          {TEXTO_PORTADA.frase[0]}
          <br />
          {TEXTO_PORTADA.frase[1]}
        </p>
        <div className="pc-acciones">
          <a className="pc-entrada" href={TEXTO_PORTADA.boton.href}>
            {TEXTO_PORTADA.boton.texto} <span aria-hidden="true">→</span>
          </a>
          <button type="button" className="pc-chat" onClick={() => abrir("chat")}>
            {TEXTO_PORTADA.chat}
          </button>
        </div>
      </div>

      <nav className="pc-zonas" aria-label="Zonas">
        {TEXTO_PORTADA.zonas.map((z) => (
          <Link key={z.href} href={z.href} aria-current={z.actual ? "true" : undefined}>
            {z.texto}
          </Link>
        ))}
      </nav>
    </section>
  );
}

/* Una capa de la ilustración sobre su lienzo (lo reutiliza el carrusel de la galería) */
export function Lienzo({ capa, style }: { capa: CapaPortada; style?: React.CSSProperties }) {
  const pos = capa.pos ?? { left: 0, top: 0, width: 100 };
  return (
    <div className="lienzo" style={style}>
      <img className="lienzo-img" src={capa.img} alt="" style={{ left: pos.left + "%", top: pos.top + "%", width: pos.width + "%" }} />
    </div>
  );
}
