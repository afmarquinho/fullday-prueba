"use client";
/* Banners de las zonas (Amazonas, Marina, Páramo, Aventura completa, Expedition y Xanadu).
   Los textos e imágenes están en contenido/portada.ts → BANNERS. */
import Link from "next/link";
import { useEffect, useRef } from "react";
import { BANNERS, type BannerZona } from "@/contenido/portada";
import { useVisto } from "@/lib/useVisto";
import "./BannersZonas.css";

// Tiempos de la coreografía, en segundos
const TIEMPOS = {
  etiqueta: 0.2, // cuándo aparece la etiqueta
  titulo: 0.35, // cuándo empieza el título
  ola: 0.5, // cuánto dura la ola de letras del título
  paso: 0.12, // pausa entre frase, precio y botón
};
// Parallax con el scroll: cuántos px se desplaza la foto de arriba a abajo de la pantalla
const PARALLAX = 40;

export default function BannersZonas() {
  const lista = useRef<HTMLElement>(null);

  // Las fotos se desplazan un poco con el scroll (solo las que están en pantalla)
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const banners = [...lista.current!.querySelectorAll<HTMLElement>(".bz")];
    let cuadro = 0;
    const pintar = () => {
      for (const b of banners) {
        const r = b.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) continue;
        const k = (r.top + r.height / 2 - innerHeight / 2) / innerHeight; // -1 arriba … 1 abajo
        (b.querySelector(".bz-img") as HTMLElement).style.transform = `translateY(${k * -PARALLAX}px)`;
      }
      cuadro = requestAnimationFrame(pintar);
    };
    cuadro = requestAnimationFrame(pintar);
    return () => cancelAnimationFrame(cuadro);
  }, []);

  return (
    <section className="bz-lista" id="zonas" ref={lista} aria-label="Zonas">
      {BANNERS.map((b) => (
        <Banner key={b.href} b={b} />
      ))}
    </section>
  );
}

function Banner({ b }: { b: BannerZona }) {
  const [ref, visto] = useVisto<HTMLAnchorElement>();
  // El título termina un poco después de la ola; ahí empiezan frase, precio y botón
  const finTitulo = TIEMPOS.titulo + TIEMPOS.ola + 0.25;
  const despues = (i: number) => ({ "--d": (finTitulo + i * TIEMPOS.paso).toFixed(2) + "s" }) as React.CSSProperties;

  return (
    <Link
      ref={ref}
      href={b.href}
      className={["bz", visto && "visto", b.soloPc && "bz-solo-pc"].filter(Boolean).join(" ")}
      style={{ "--alto": (b.alto ?? 440) + "px" } as React.CSSProperties}
    >
      <picture>
        {b.imgMovil && <source media="(max-width: 820px)" srcSet={b.imgMovil} />}
        <img className={"bz-img" + (b.imgMovil ? " con-movil" : "")} src={b.img} alt={b.alt} style={{ "--pos": b.posicion } as React.CSSProperties} />
      </picture>
      <div className="bz-velo" />
      <div className={"bz-contenido" + (b.apilado ? " bz-apilado" : "")}>
        <div className="bz-izq">
          <span
            className={"bz-etiqueta bz-entra" + (b.etiquetaClara ? " clara" : "")}
            style={{ "--d": TIEMPOS.etiqueta + "s" } as React.CSSProperties}
          >
            {b.etiqueta}
          </span>
          <span
            className={"bz-titulo" + (b.sombraTitulo ? " sombra" : "")}
            style={{ "--tam": b.tamanoTitulo, "--color": b.colorTitulo } as React.CSSProperties}
          >
            <TituloLetras texto={b.titulo} />
          </span>
        </div>
        <div className="bz-der">
          <span className="bz-frase bz-entra" style={despues(0)}>
            {b.frase}
          </span>
          <span className="bz-entra" style={despues(1)}>
            {b.dato.antes}
            <b>{b.dato.fuerte}</b>
            {b.dato.despues}
          </span>
          <span className="bz-boton bz-entra" style={despues(2)}>
            {b.boton}
          </span>
        </div>
      </div>
    </Link>
  );
}

/* Título letra a letra. La ola acelera hacia el final (misma curva en todos los banners).
   Los títulos de dos palabras (Aventura completa) van en dos líneas. */
function TituloLetras({ texto }: { texto: string }) {
  const n = texto.length;
  return (
    <>
      <span className="oculto">{texto}</span>
      <span className="bz-letras" aria-hidden="true">
        {[...texto].map((c, i) => {
          if (c === " ") return <br key={i} />;
          const d = TIEMPOS.titulo + TIEMPOS.ola * Math.sqrt(i / Math.max(1, n - 1));
          return (
            <span key={i} style={{ "--d": d.toFixed(3) + "s" } as React.CSSProperties}>
              {c}
            </span>
          );
        })}
      </span>
    </>
  );
}
