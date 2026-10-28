"use client";
/* Ventana lateral animada (planner, chat, cuenta y ficha de producto).
   En escritorio entra desde la derecha; en celular sube desde abajo como una hoja.
   Se cierra con la X, con Esc o tocando fuera. Estilos en componentes/planner/Ventanas.css. */
import { useEffect, useRef, type ReactNode } from "react";
import { ESPERA_CIERRE } from "@/lib/planner";

type Props = { abierta: boolean; alCerrar: () => void; clase?: string; etiqueta: string; children: ReactNode };

export default function Ventana({ abierta, alCerrar, clase = "", etiqueta, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (abierta && !d.open) {
      d.classList.remove("cerrando");
      d.showModal();
      document.documentElement.style.overflow = "hidden";
    }
    if (!abierta && d.open) {
      // Primero la animación de salida, después se cierra de verdad
      d.classList.add("cerrando");
      const t = setTimeout(() => {
        d.close();
        d.classList.remove("cerrando");
        document.documentElement.style.overflow = "";
      }, ESPERA_CIERRE - 20);
      return () => clearTimeout(t);
    }
  }, [abierta]);

  return (
    <dialog
      ref={ref}
      className={"ventana " + clase}
      aria-label={etiqueta}
      onClick={(e) => e.target === e.currentTarget && alCerrar()} // tocar fuera cierra
      onCancel={(e) => {
        e.preventDefault(); // Esc: cerramos con animación
        alCerrar();
      }}
    >
      {children}
    </dialog>
  );
}

// Cabecera de ventana: título, subtítulo y botón cerrar
export function CabeceraVentana({ titulo, sub, alCerrar, antes }: { titulo: string; sub?: string; alCerrar: () => void; antes?: ReactNode }) {
  return (
    <div className="v-cab">
      {antes}
      <div>
        <h2>{titulo}</h2>
        {sub && <small>{sub}</small>}
      </div>
      <button className="v-cerrar" type="button" aria-label="Cerrar" onClick={alCerrar}>
        ×
      </button>
    </div>
  );
}
