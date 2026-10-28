"use client";
/* "Así se vive cada día": carrusel de cine (contenido/portada.ts → CARRUSEL).
   Cada cuadro se inclina y se achica según su distancia al centro. En escritorio se arrastra
   con el mouse y sigue deslizando con inercia; en celular el dedo ya tiene inercia propia. */
import { useEffect, useRef, useState } from "react";
import { CARRUSEL, ESCENA_PORTADA } from "@/contenido/portada";
import { Lienzo } from "./Heroe";
import "./CarruselGaleria.css";

const INCLINACION = 22; // grados de los cuadros de los lados
const ESCALA = 0.16; // cuánto se achican los cuadros de los lados
const PARALLAX = 9; // % que se desplaza la foto dentro de su cuadro
const SUAVE = 0.25; // 0..1: más bajo = movimiento más suave
const FRICCION = 0.94; // 0..1: más alto = se desliza más tiempo al soltar

const dosDigitos = (n: number) => String(n).padStart(2, "0");

export default function CarruselGaleria() {
  const pista = useRef<HTMLDivElement>(null);
  const [actual, setActual] = useState(0);
  const total = CARRUSEL.cuadros.length;

  const ir = (i: number) => {
    const p = pista.current!;
    const it = p.children[Math.max(0, Math.min(total - 1, i))] as HTMLElement;
    p.scrollTo({ left: it.offsetLeft + it.offsetWidth / 2 - p.clientWidth / 2, behavior: "smooth" });
  };

  // Cada cuadro: inclinación, tamaño y parallax según su distancia al centro
  useEffect(() => {
    const p = pista.current!;
    const items = [...p.children] as HTMLElement[];
    const reducir = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const estado = items.map(() => 0);
    let cuadro = 0;
    const pintar = () => {
      const centro = p.scrollLeft + p.clientWidth / 2;
      let mejor = Infinity;
      let cerca = 0;
      items.forEach((it, i) => {
        const meta = Math.max(-1.5, Math.min(1.5, (it.offsetLeft + it.offsetWidth / 2 - centro) / it.offsetWidth));
        if (Math.abs(meta) < mejor) {
          mejor = Math.abs(meta);
          cerca = i;
        }
        if (reducir) return;
        estado[i] += (meta - estado[i]) * SUAVE;
        const d = estado[i];
        const ad = Math.min(1, Math.abs(d));
        it.style.transform = `rotateY(${-d * INCLINACION}deg) scale(${1 - ad * ESCALA})`;
        it.style.zIndex = String(10 - Math.round(ad * 4));
        const foto = it.querySelector<HTMLElement>(".car-foto > img");
        if (foto) foto.style.transform = `translateX(${-d * PARALLAX}%)`;
        it.querySelector<HTMLElement>("figcaption")!.style.opacity = String(1 - ad * 0.8);
      });
      setActual(cerca); // React no vuelve a pintar si no cambió
      cuadro = requestAnimationFrame(pintar);
    };
    cuadro = requestAnimationFrame(pintar);
    return () => cancelAnimationFrame(cuadro);
  }, []);

  // Arrastre con el mouse, con inercia al soltar
  useEffect(() => {
    const p = pista.current!;
    let x0: number | null = null;
    let s0 = 0;
    let vel = 0;
    let ultX = 0;
    let ultT = 0;
    let inercia = 0;
    const bajar = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      cancelAnimationFrame(inercia);
      x0 = ultX = e.clientX;
      s0 = p.scrollLeft;
      ultT = performance.now();
      vel = 0;
      p.style.cursor = "grabbing";
    };
    const mover = (e: PointerEvent) => {
      if (x0 === null) return;
      const t = performance.now();
      vel = ((ultX - e.clientX) / Math.max(1, t - ultT)) * 16;
      ultX = e.clientX;
      ultT = t;
      p.scrollLeft = s0 - (e.clientX - x0);
    };
    const soltar = () => {
      if (x0 === null) return;
      x0 = null;
      p.style.cursor = "";
      const deslizar = () => {
        if (Math.abs(vel) < 0.3) return;
        p.scrollLeft += vel;
        vel *= FRICCION;
        inercia = requestAnimationFrame(deslizar);
      };
      deslizar();
    };
    const sinArrastrarImagen = (e: DragEvent) => e.preventDefault();
    p.addEventListener("pointerdown", bajar);
    p.addEventListener("dragstart", sinArrastrarImagen);
    addEventListener("pointermove", mover);
    addEventListener("pointerup", soltar);
    return () => {
      cancelAnimationFrame(inercia);
      p.removeEventListener("pointerdown", bajar);
      p.removeEventListener("dragstart", sinArrastrarImagen);
      removeEventListener("pointermove", mover);
      removeEventListener("pointerup", soltar);
    };
  }, []);

  return (
    <section className="car" aria-label="Galería">
      <div className="car-cab">
        <h2>{CARRUSEL.titulo}</h2>
      </div>
      <div className="car-marco">
        <div className="car-pista" ref={pista}>
          {CARRUSEL.cuadros.map((c, i) => (
            <figure className="car-item" key={i}>
              <div className="car-foto">
                {c.tipo === "escena" ? (
                  <>
                    {/* Las capas del héroe, cada una con su propia deriva */}
                    <div className="car-video" role="img" aria-label={"Video: " + c.titulo}>
                      {ESCENA_PORTADA.capas.map((capa, k) => (
                        <Lienzo key={capa.nombre} capa={capa} style={{ "--dx": (k - 4) * -6 + "px", zIndex: k } as React.CSSProperties} />
                      ))}
                    </div>
                    <span className="car-marca">Video</span>
                  </>
                ) : c.img ? (
                  <img src={c.img} alt={c.titulo} draggable={false} loading="lazy" />
                ) : (
                  <div className="car-vacia">[Foto o video]</div>
                )}
              </div>
              <figcaption>
                <span className="car-dia">{dosDigitos(i + 1)}</span>
                <b>{c.titulo}</b>
                <small>{c.zona}</small>
              </figcaption>
            </figure>
          ))}
        </div>
        <button type="button" className="car-flecha ant" aria-label="Foto anterior" disabled={actual === 0} onClick={() => ir(actual - 1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button type="button" className="car-flecha sig" aria-label="Foto siguiente" disabled={actual === total - 1} onClick={() => ir(actual + 1)}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="car-puntos" aria-label="Fotos">
        {CARRUSEL.cuadros.map((_, i) => (
          <button type="button" key={i} aria-label={`Ir a la foto ${i + 1}`} aria-current={i === actual ? "true" : undefined} onClick={() => ir(i)} />
        ))}
      </div>
    </section>
  );
}
