"use client";
/* Ficha de un producto en la ventana lateral: historia, opciones (talla, color…),
   quién lo hizo y cuánto recibe, cantidad y botón para agregarlo al planner. */
import { useState } from "react";
import { ENVIO, LINEAS, TIPOS, type Producto } from "@/contenido/tienda";
import { pesos } from "@/lib/formato";
import { Chips } from "../comunes/Filtros";
import Ventana, { CabeceraVentana } from "../comunes/Ventana";
import Ilustracion from "./Ilustracion";

type Props = {
  p: Producto | null; // se mantiene al cerrar, para que no se vacíe durante la animación de salida
  abierta: boolean;
  alCerrar: () => void;
  alAgregar: (p: Producto, variante: string, cant: number) => void;
};

export default function FichaProducto({ p, abierta, alCerrar, alAgregar }: Props) {
  return (
    <Ventana abierta={abierta} alCerrar={alCerrar} clase="producto" etiqueta="Producto">
      {/* key: cada producto empieza con sus opciones por defecto y cantidad 1 */}
      {p && <Ficha key={p.id} p={p} alCerrar={alCerrar} alAgregar={alAgregar} />}
    </Ventana>
  );
}

function Ficha({ p, alCerrar, alAgregar }: { p: Producto; alCerrar: () => void; alAgregar: Props["alAgregar"] }) {
  // Por defecto, la segunda opción de cada lista (M en tallas), o la única
  const [opciones, setOpciones] = useState(() =>
    Object.fromEntries(Object.entries(p.opciones ?? {}).map(([k, v]) => [k, v[Math.min(1, v.length - 1)]])),
  );
  const [cant, setCant] = useState(1);
  const l = LINEAS[p.linea];
  const artesania = p.linea !== "marca";

  return (
    <>
      <CabeceraVentana titulo={p.nombre} sub={`${l.nombre} · ${TIPOS[p.tipo]}`} alCerrar={alCerrar} />
      <div className="v-cuerpo">
        <div className="ficha-foto">
          <Ilustracion p={p} ancho={400} alto={300} />
        </div>
        <div className="ficha">
          <div className="ficha-precio">
            {pesos(p.precio)}
            <small>precio de ejemplo</small>
          </div>
          <p>{p.historia}</p>
          {Object.entries(p.opciones ?? {}).map(([k, valores]) => (
            <div className="ficha-opcion" key={k}>
              <span>{k}</span>
              <Chips
                etiqueta={k}
                radio
                valor={opciones[k]}
                alElegir={(v) => setOpciones((o) => ({ ...o, [k]: v }))}
                opciones={valores.map((v) => ({ id: v, nombre: v }))}
              />
            </div>
          ))}
          <ul className="datos-ficha">
            <li>
              <span>{artesania ? "Hecho por" : "Diseño"}</span>
              <b>{p.quien}</b>
            </li>
            <li>
              <span>Materiales</span>
              <b>{p.materiales}</b>
            </li>
            <li>
              <span>Tiempo</span>
              <b>{p.tiempo}</b>
            </li>
            {artesania && (
              <li className="recibe">
                <span>Lo que recibe quien lo hizo</span>
                <b>{p.recibe}</b>
              </li>
            )}
            <li>
              <span>Entrega</span>
              <b>En tu hotel si tienes tour, o envío nacional</b>
            </li>
          </ul>
          {!p.foto && <p className="provisional">Ilustración provisional: la foto real de la pieza llega con el primer lote.</p>}
        </div>
      </div>
      <div className="v-pie">
        <div className="ficha-pie">
          <div className="p-cant">
            <button type="button" disabled={cant <= 1} aria-label="Quitar uno" onClick={() => setCant(cant - 1)}>
              −
            </button>
            <output>{cant}</output>
            <button type="button" disabled={cant >= ENVIO.maxPorProducto} aria-label="Sumar uno" onClick={() => setCant(cant + 1)}>
              +
            </button>
          </div>
          <button className="b-comprar" type="button" onClick={() => alAgregar(p, Object.values(opciones).join(" · "), cant)}>
            Agregar · {pesos(p.precio * cant)}
          </button>
        </div>
      </div>
    </>
  );
}
