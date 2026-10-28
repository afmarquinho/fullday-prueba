"use client";
/* Visor ampliado de la galería: flechas, teclado (← →, Esc) y deslizar en celular. */
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ZONAS_GALERIA, type Medio } from "@/contenido/galeria";
import Contenido from "./Contenido";

const DESLIZAR_MIN = 50; // px de dedo para pasar a la siguiente

type Props = {
  medios: Medio[];
  indice: number | null; // null = cerrado
  alCambiar: (i: number | null) => void;
};

export default function Visor({ medios, indice, alCambiar }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const inicioDedo = useRef<number | null>(null);
  const abierto = indice !== null && medios.length > 0;

  useEffect(() => {
    const d = dialogo.current!;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();
  }, [abierto]);

  const ir = (paso: number) => indice !== null && alCambiar((indice + paso + medios.length) % medios.length);
  const m = abierto ? medios[indice] : null;
  const z = m ? ZONAS_GALERIA[m.zona] : null;

  return (
    <dialog
      className="visor"
      ref={dialogo}
      aria-label="Foto ampliada"
      onClose={() => alCambiar(null)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") ir(-1);
        if (e.key === "ArrowRight") ir(1);
      }}
    >
      {m && z && (
        <>
          <div className="visor-cab">
            <span>
              {indice! + 1} de {medios.length} · {z.nombre}
            </span>
            <button type="button" aria-label="Cerrar" onClick={() => alCambiar(null)}>
              ×
            </button>
          </div>
          <div
            className="visor-escena"
            onTouchStart={(e) => (inicioDedo.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (inicioDedo.current === null) return;
              const dx = e.changedTouches[0].clientX - inicioDedo.current;
              if (Math.abs(dx) > DESLIZAR_MIN) ir(dx < 0 ? 1 : -1);
              inicioDedo.current = null;
            }}
          >
            <button type="button" className="visor-ant" aria-label="Anterior" onClick={() => ir(-1)}>
              ←
            </button>
            <div className="visor-marco">
              <Contenido m={m} enVisor key={indice} />
            </div>
            <button type="button" className="visor-sig" aria-label="Siguiente" onClick={() => ir(1)}>
              →
            </button>
          </div>
          <div className="visor-pie">
            <b>{m.titulo}</b>
            <small>{m.lugar}</small>
            <br />
            <Link href={z.tour}>Ver el tour {z.nombre} →</Link>
          </div>
        </>
      )}
    </dialog>
  );
}
