"use client";
/* Portada de un tour (o de Expedition y Xanadu): ceja, título animado, frase, datos y botón,
   con la foto a la derecha. Con tres fotos (Aventura completa) van en escalera. */
import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePlanner } from "@/lib/planner";
import "./Tour.css";
import "./PortadaTour.css";

type Props = {
  iso?: string | null;
  ceja: string;
  titulo: string;
  color?: string; // color del título (Expedition y Xanadu)
  frase: string;
  datos?: [etiqueta: string, valor: string][];
  fotos: string[];
  posicionFoto?: string;
  boton: { texto: string; salto: string }; // salto = id de la sección a la que baja
};

const PARALLAX = 0.12; // la foto baja un poco más lento que la página

export default function PortadaTour({ iso, ceja, titulo, color, frase, datos, fotos, posicionFoto, boton }: Props) {
  const { abrir } = usePlanner();
  const foto = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const mover = () => {
      const f = foto.current?.firstElementChild as HTMLElement | null;
      if (f) f.style.transform = `translateY(${Math.min(scrollY, 900) * PARALLAX}px)`;
    };
    addEventListener("scroll", mover, { passive: true });
    return () => removeEventListener("scroll", mover);
  }, []);

  const bajar = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(boton.salto)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="tp" style={color ? ({ "--c": color } as React.CSSProperties) : undefined}>
      <div className="tp-txt">
        <Link className="volver" href="/#zonas">
          <span aria-hidden="true">←</span> Todos los tours
        </Link>
        <div className="tp-ceja">
          {iso && <img src={iso} alt="" />}
          <span className="ceja">{ceja}</span>
        </div>
        <h1>
          <TituloLetras texto={titulo} />
        </h1>
        <p className="tp-frase">{frase}</p>
        {datos && (
          <div className="datos">
            {datos.map(([k, v]) => (
              <div key={k}>
                <small>{k}</small>
                <b>{v}</b>
              </div>
            ))}
          </div>
        )}
        <div className="acciones">
          <a className="reservar" href={"#" + boton.salto} onClick={bajar}>
            {boton.texto} <span aria-hidden="true">→</span>
          </a>
          <button type="button" className="suave" onClick={() => abrir("chat")}>
            o escríbenos por chat
          </button>
        </div>
      </div>
      <div className="tp-foto-wrap">
        <div className="tp-foto" ref={foto}>
          {fotos.length > 1 ? (
            <div className="trio">
              {fotos.map((f) => (
                <img key={f} src={f} alt="" />
              ))}
            </div>
          ) : (
            <img src={fotos[0]} alt="" style={posicionFoto ? { objectPosition: posicionFoto } : undefined} />
          )}
        </div>
        <span className="anillo" aria-hidden="true" />
      </div>
    </section>
  );
}

/* Título en letras sueltas para la entrada animada (el texto completo queda para lectores de pantalla) */
function TituloLetras({ texto }: { texto: string }) {
  const palabras = texto.split(" ");
  // Número de cada letra en todo el título, para que la entrada vaya en orden
  const inicio = palabras.map((_, k) => palabras.slice(0, k).join("").length);
  return (
    <>
      <span className="oculto">{texto}</span>
      {palabras.map((palabra, k) => (
        <span key={k}>
          {k > 0 && " "}
          <span className="tp-palabra" aria-hidden="true">
            {[...palabra].map((c, j) => (
              <span key={j} style={{ "--i": inicio[k] + j } as React.CSSProperties}>
                {c}
              </span>
            ))}
          </span>
        </span>
      ))}
    </>
  );
}
