"use client";
/* Tienda: filtros por línea y tipo, grilla de productos, ficha y aviso al agregar.
   El carrito vive en el planner, junto a los viajes. Datos en contenido/tienda.ts. */
import { useEffect, useRef, useState } from "react";
import { LINEAS, PRODUCTOS, TIPOS, type IdLinea, type Producto } from "@/contenido/tienda";
import { pesos } from "@/lib/formato";
import { usePlanner } from "@/lib/planner";
import { Chips, Etiqueta, Filtros } from "../comunes/Filtros";
import FichaProducto from "./FichaProducto";
import Ilustracion, { DefinicionesIlustracion } from "./Ilustracion";
import "./Tienda.css";

const TODO = "todo";
const AVISO_MS = 3600; // cuánto se ve el aviso "en tu planner"
const LISTO_MS = 1400; // cuánto dice "✓ Listo" el botón

export default function Tienda() {
  const { agregarProducto, abrir } = usePlanner();
  const [linea, setLinea] = useState(TODO);
  const [tipo, setTipo] = useState(TODO);
  const [ficha, setFicha] = useState<Producto | null>(null);
  const [fichaAbierta, setFichaAbierta] = useState(false);
  const [aviso, setAviso] = useState("");
  const [listo, setListo] = useState<string | null>(null); // producto recién agregado desde la grilla
  const tiempos = useRef<{ aviso?: ReturnType<typeof setTimeout>; listo?: ReturnType<typeof setTimeout> }>({});

  // Enlace directo a una línea: /tienda#amazonas (al cargar o si cambia el enlace)
  useEffect(() => {
    const leerEnlace = () => {
      const h = location.hash.slice(1);
      if (h in LINEAS) setLinea(h);
    };
    leerEnlace();
    addEventListener("hashchange", leerEnlace);
    const t = tiempos.current;
    return () => {
      removeEventListener("hashchange", leerEnlace);
      clearTimeout(t.aviso);
      clearTimeout(t.listo);
    };
  }, []);

  // Solo los tipos que existen en la línea elegida
  const tiposDeLinea = new Set(PRODUCTOS.filter((p) => linea === TODO || p.linea === linea).map((p) => p.tipo));
  const tipoActivo = tiposDeLinea.has(tipo as Producto["tipo"]) ? tipo : TODO;
  const lista = PRODUCTOS.filter((p) => (linea === TODO || p.linea === linea) && (tipoActivo === TODO || p.tipo === tipoActivo));

  function agregar(p: Producto, variante: string, cant: number) {
    const l = LINEAS[p.linea];
    agregarProducto({ id: p.id, nombre: p.nombre, linea: l.nombre, color: l.color, precio: p.precio, variante, cant });
    setAviso(`${cant > 1 ? cant + " × " : ""}${p.nombre} en tu planner`);
    clearTimeout(tiempos.current.aviso);
    tiempos.current.aviso = setTimeout(() => setAviso(""), AVISO_MS);
  }

  const verFicha = (p: Producto) => {
    setFicha(p);
    setFichaAbierta(true);
  };

  // Con talla o color se abre la ficha para elegir; si no, se agrega directo
  function botonAgregar(p: Producto) {
    if (p.opciones) return verFicha(p);
    agregar(p, "", 1);
    setListo(p.id);
    clearTimeout(tiempos.current.listo);
    tiempos.current.listo = setTimeout(() => setListo(null), LISTO_MS);
  }

  return (
    <>
      <DefinicionesIlustracion />
      <Filtros cuantos={`${lista.length} ${lista.length === 1 ? "producto" : "productos"}`}>
        <Chips
          etiqueta="Línea"
          valor={linea}
          alElegir={setLinea}
          opciones={[
            { id: TODO, nombre: "Todo" },
            ...(Object.keys(LINEAS) as IdLinea[])
              .filter((k) => PRODUCTOS.some((p) => p.linea === k))
              .map((k) => ({ id: k, nombre: LINEAS[k].nombre, color: LINEAS[k].color })),
          ]}
        />
        <Chips
          etiqueta="Tipo de producto"
          secundario
          valor={tipoActivo}
          alElegir={setTipo}
          opciones={[
            { id: TODO, nombre: "Todos los tipos" },
            ...Object.entries(TIPOS)
              .filter(([k]) => tiposDeLinea.has(k as Producto["tipo"]))
              .map(([id, nombre]) => ({ id, nombre })),
          ]}
        />
      </Filtros>

      {/* key: al cambiar el filtro, los productos vuelven a entrar en ola */}
      <div className="caja grilla" key={linea + tipoActivo}>
        {lista.length ? (
          lista.map((p, i) => (
            <article className="prod" key={p.id} style={{ "--i": i } as React.CSSProperties}>
              <button className="prod-foto" type="button" aria-label={`Ver ${p.nombre}`} onClick={() => verFicha(p)}>
                <Ilustracion p={p} />
                <Etiqueta nombre={LINEAS[p.linea].nombre} color={LINEAS[p.linea].color} />
              </button>
              <h3>
                <button type="button" onClick={() => verFicha(p)}>
                  {p.nombre}
                </button>
              </h3>
              <p className="quien">{p.quien}</p>
              <div className="prod-pie">
                <b>{pesos(p.precio)}</b>
                <button className={"agregar" + (listo === p.id ? " listo" : "")} type="button" onClick={() => botonAgregar(p)}>
                  {listo === p.id ? "✓ Listo" : p.opciones ? "Elegir" : "Agregar"}
                </button>
              </div>
            </article>
          ))
        ) : (
          <p className="vacio">No hay productos con ese filtro.</p>
        )}
      </div>

      <FichaProducto
        p={ficha}
        abierta={fichaAbierta}
        alCerrar={() => setFichaAbierta(false)}
        alAgregar={(p, variante, cant) => {
          agregar(p, variante, cant);
          setFichaAbierta(false);
        }}
      />

      {/* Aviso al agregar: no abre el planner, para seguir comprando */}
      <div className="toast" role="status" hidden={!aviso}>
        <span>{aviso}</span>
        <button type="button" onClick={() => (setAviso(""), abrir("planner"))}>
          Ver planner
        </button>
      </div>
    </>
  );
}
