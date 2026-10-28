"use client";
/* Páginas Expedition y Xanadu (/tours/expedition y /tours/xanadu): cómo funciona y elegir la zona.
   Cada zona abre su tour con el pack de partida (?nivel=expedition o premium). Textos en contenido/niveles.ts. */
import Link from "next/link";
import { PAGINAS_NIVEL } from "@/contenido/niveles";
import { TOURS } from "@/contenido/tours";
import { dos } from "@/lib/formato";
import { useSubidas } from "@/lib/useSubidas";
import PieSimple from "../comunes/PieSimple";
import PortadaTour from "./PortadaTour";
import "./Secciones.css";
import "./Tour.css";

export default function PaginaNivel({ id }: { id: keyof typeof PAGINAS_NIVEL }) {
  const n = PAGINAS_NIVEL[id];
  useSubidas(id);

  return (
    <>
      <main>
        <PortadaTour
          iso={n.iso}
          ceja={n.ceja}
          titulo={n.nombre}
          color={n.color}
          frase={n.frase}
          fotos={[n.foto]}
          posicionFoto="70% 50%"
          boton={{ texto: "Elige tu zona", salto: "zonas-nivel" }}
        />

        <section className="t-seccion caja">
          <span className="ceja">Cómo funciona</span>
          <h2>Tres pasos</h2>
          <ol className="pasos-nivel">
            {n.pasos.map((p, i) => (
              <li className="t-sube" key={p.titulo}>
                <b>{dos(i + 1)}</b>
                <span>
                  <strong>{p.titulo}</strong>
                  <small>{p.texto}</small>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className="t-seccion caja" id="zonas-nivel">
          <span className="ceja">Elige tu zona</span>
          <h2>¿Dónde quieres tu {n.nombre}?</h2>
          <div className="combina">
            {n.zonas.map(({ zona, texto }) => (
              <Link key={zona} href={`/tours/${zona}?nivel=${n.partida}`}>
                <img src={TOURS[zona].foto} alt="" loading="lazy" />
                <small>{TOURS[zona].ceja}</small>
                <b>
                  {TOURS[zona].linea} {n.nombre}
                </b>
                <span>{texto}</span>
              </Link>
            ))}
            {n.empresas && (
              <Link href={n.empresas.href} className="destacada">
                <img src={n.foto} alt="" loading="lazy" />
                <small>{n.empresas.ceja}</small>
                <b>{n.empresas.titulo}</b>
                <span>{n.empresas.texto}</span>
              </Link>
            )}
          </div>
        </section>
      </main>
      <PieSimple />
    </>
  );
}
