"use client";
/* Mini selector del color de la línea del recorrido (mapas de la portada y de cada tour).
   El color se guarda en el navegador y se aplica en todo el sitio con la variable CSS --ruta. */
import { useEffect, useState } from "react";
import { COLORES_RUTA } from "@/contenido/planner";
import "./ColorRuta.css";

const CLAVE = "fdt-ruta";

function leer() {
  try {
    return localStorage.getItem(CLAVE);
  } catch {
    return null;
  }
}

export default function ColorRuta({ suelta = false }: { suelta?: boolean }) {
  const [color, setColor] = useState<string>(COLORES_RUTA[0].color);

  // Al cargar: el color que el viajero eligió la última vez
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage solo existe en el navegador
    setColor(leer() || COLORES_RUTA[0].color);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--ruta", color);
  }, [color]);

  const poner = (c: string) => {
    setColor(c);
    try {
      localStorage.setItem(CLAVE, c);
    } catch {}
  };

  return (
    <div className={"ruta-color" + (suelta ? " ruta-color--suelta" : "")} role="group" aria-label="Color de la línea del recorrido">
      <span>Línea</span>
      {COLORES_RUTA.map((c) => (
        <button
          key={c.color}
          type="button"
          style={{ "--sw": c.color } as React.CSSProperties}
          aria-label={c.nombre}
          title={c.nombre}
          aria-pressed={color === c.color}
          onClick={() => poner(c.color)}
        />
      ))}
    </div>
  );
}
