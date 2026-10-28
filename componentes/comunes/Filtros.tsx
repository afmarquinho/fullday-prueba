/* Filtros con botones redondos (galería, tienda y las opciones de un producto).
   - <Filtros> es la barra fija bajo el menú, con el conteo a la derecha.
   - <Chips> es un grupo de botones; uno queda elegido.
   - <Etiqueta> es el letrero con punto de color sobre una foto. */
import type { ReactNode } from "react";
import "./Filtros.css";

export function Filtros({ cuantos, children }: { cuantos: string; children: ReactNode }) {
  return (
    <div className="caja filtros">
      {children}
      <span className="cuantos" aria-live="polite">
        {cuantos}
      </span>
    </div>
  );
}

export type OpcionChip = { id: string; nombre: string; color?: string };

type PropsChips = {
  etiqueta: string; // nombre del grupo para lectores de pantalla
  opciones: OpcionChip[];
  valor: string;
  alElegir: (id: string) => void;
  secundario?: boolean; // estilo más discreto (el filtro de tipo)
  radio?: boolean; // en la ficha de producto se comporta como opciones de radio
};

export function Chips({ etiqueta, opciones, valor, alElegir, secundario, radio }: PropsChips) {
  return (
    <div className={"chips" + (secundario ? " tipo" : "")} role={radio ? "radiogroup" : "group"} aria-label={etiqueta}>
      {opciones.map((o) => (
        <button
          type="button"
          key={o.id}
          role={radio ? "radio" : undefined}
          aria-checked={radio ? valor === o.id : undefined}
          aria-pressed={valor === o.id}
          style={o.color ? ({ "--c": o.color } as React.CSSProperties) : undefined}
          onClick={() => alElegir(o.id)}
        >
          {o.color && <i />}
          {o.nombre}
        </button>
      ))}
    </div>
  );
}

export function Etiqueta({ nombre, color }: { nombre: string; color: string }) {
  return (
    <span className="etiqueta" style={{ "--c": color } as React.CSSProperties}>
      <i />
      {nombre}
    </span>
  );
}
