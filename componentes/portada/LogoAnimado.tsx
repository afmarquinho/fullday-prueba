"use client";
/* Logo grande y animado del héroe (ver LogoAnimado.css).
   El título real de la página va oculto para buscadores y lectores de pantalla. */
import { useEffect, useState } from "react";
import { FULL_DAY, ISOTIPO, TOURS, TRANSFORMA_ISOTIPO, TRANSFORMA_LOGOTIPO, VISTA_LOGO } from "./trazos-logo";
import "./LogoAnimado.css";

// La ola no interrumpe la entrada: se habilita cuando el logo ya terminó de aparecer
const OLA_DESDE_MS = 1800;

// Colores de la marca para cada capa del águila
const CAPAS = [
  { id: "relleno", color: "#0B1F1A" },
  { id: "noche", color: "#0B1F1A" },
  { id: "arena", color: "#F3EBDD" },
  { id: "turquesa", color: "#00A6A6" },
  { id: "verde", color: "#1F7A4D" },
  { id: "dorado", color: "#C9A24A" },
] as const;

export default function LogoAnimado({ titulo }: { titulo: string }) {
  const [lista, setLista] = useState(false);
  const [ola, setOla] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLista(true), OLA_DESDE_MS);
    return () => clearTimeout(t);
  }, []);

  const hacerOla = () => lista && setOla(true);

  return (
    <h1 className={"logo-heroe" + (ola ? " ola" : "")} onPointerEnter={(e) => e.pointerType === "mouse" && hacerOla()} onClick={hacerOla}>
      <span className="oculto">{titulo}</span>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox={VISTA_LOGO} aria-hidden="true" focusable="false">
        <g className="logo-aguila">
          <g transform={TRANSFORMA_ISOTIPO}>
            <path fill="#F3EBDD" stroke="#F3EBDD" strokeWidth="16" strokeLinejoin="round" d={ISOTIPO.filete} />
            {CAPAS.map((c) => (
              <path key={c.id} className={c.id === "verde" ? "logo-cresta" : undefined} fill={c.color} fillRule="evenodd" d={ISOTIPO[c.id]} />
            ))}
          </g>
        </g>
        <g transform={TRANSFORMA_LOGOTIPO}>
          <g className="logo-full-day" fill="#F3EBDD">
            {FULL_DAY.map((d, n) => (
              <path key={n} className="letra" style={{ "--n": n } as React.CSSProperties} d={d} />
            ))}
          </g>
          <g className="logo-tours" fill="#C9A24A">
            {TOURS.map((d, n) => (
              <path
                key={n}
                className="letra"
                style={{ "--n": n } as React.CSSProperties}
                d={d}
                // Cuando la última letra termina la ola, el logo queda listo para otra
                onAnimationEnd={n === TOURS.length - 1 ? (e) => e.animationName === "logo-ola" && setOla(false) : undefined}
              />
            ))}
          </g>
        </g>
      </svg>
    </h1>
  );
}
