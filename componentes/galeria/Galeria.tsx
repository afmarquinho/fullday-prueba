"use client";
/* Galería: filtros por zona y tipo, muro de fotos tipo revista y visor ampliado.
   Los datos están en contenido/galeria.ts. Mientras llegan las fotos reales,
   cada espacio vacío dice qué foto va ahí. */
import { useState } from "react";
import { MEDIOS, TIPOS_MEDIO, ZONAS_GALERIA, type Medio } from "@/contenido/galeria";
import { Chips, Etiqueta, Filtros } from "../comunes/Filtros";
import Contenido from "./Contenido";
import Visor from "./Visor";
import "./Galeria.css";

const TODO = "todo";

export default function Galeria() {
  const [zona, setZona] = useState(TODO);
  const [tipo, setTipo] = useState(TODO);
  const [abierta, setAbierta] = useState<number | null>(null); // pieza en el visor

  const visibles = MEDIOS.filter((m) => (zona === TODO || m.zona === zona) && (tipo === TODO || m.tipo === tipo));

  return (
    <>
      <Filtros cuantos={`${visibles.length} ${visibles.length === 1 ? "pieza" : "piezas"}`}>
        <Chips
          etiqueta="Zona"
          valor={zona}
          alElegir={setZona}
          opciones={[{ id: TODO, nombre: "Todo" }, ...Object.entries(ZONAS_GALERIA).map(([id, z]) => ({ id, nombre: z.nombre, color: z.color }))]}
        />
        <Chips
          etiqueta="Tipo"
          secundario
          valor={tipo}
          alElegir={setTipo}
          opciones={[{ id: TODO, nombre: "Fotos y videos" }, ...Object.entries(TIPOS_MEDIO).map(([id, nombre]) => ({ id, nombre }))]}
        />
      </Filtros>

      {/* key: al cambiar el filtro, las piezas vuelven a entrar en ola */}
      <div className="caja muro" key={zona + tipo}>
        {visibles.length ? (
          visibles.map((m, i) => <Pieza key={m.titulo} m={m} i={i} alAbrir={() => setAbierta(i)} />)
        ) : (
          <p className="vacio">Todavía no hay piezas con este filtro.</p>
        )}
      </div>

      <Visor medios={visibles} indice={abierta} alCambiar={setAbierta} />
    </>
  );
}

function Pieza({ m, i, alAbrir }: { m: Medio; i: number; alAbrir: () => void }) {
  const z = ZONAS_GALERIA[m.zona];
  return (
    <button
      type="button"
      className={"muro-pieza " + m.forma}
      style={{ "--i": i, "--c": z.color } as React.CSSProperties}
      aria-label={`Ver ${m.titulo}`}
      onClick={alAbrir}
    >
      <Contenido m={m} />
      <Etiqueta nombre={z.nombre} color={z.color} />
      {m.tipo === "video" && <span className="muro-play" aria-hidden="true" />}
      <span className="pie-foto">
        <b>{m.titulo}</b>
        <small>{m.lugar}</small>
      </span>
    </button>
  );
}
