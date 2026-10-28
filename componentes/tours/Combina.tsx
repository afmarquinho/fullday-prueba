/* "Combínalo": tarjetas a los otros tours. La Aventura completa va destacada (ahorras 5 %). */
import Link from "next/link";
import { COMPLETA, TODOS_LOS_TOURS, TOURS, type IdTour } from "@/contenido/tours";
import { pesos } from "@/lib/formato";
import { nombreDe } from "@/lib/tours";
import "./Secciones.css";

export default function Combina({ id }: { id: IdTour }) {
  return (
    <section className="t-seccion caja">
      <span className="ceja">Combínalo</span>
      <h2>Suma otra zona</h2>
      <div className="combina">
        {TODOS_LOS_TOURS.filter((x) => x !== id).map((o) => {
          const t = o === "completa" ? COMPLETA : TOURS[o];
          return (
            <Link key={o} href={`/tours/${o}`} className={o === "completa" ? "destacada" : undefined}>
              <img src={o === "completa" ? COMPLETA.fotoBanner : TOURS[o].foto} alt="" loading="lazy" />
              <small>{o === "completa" ? "Ahorras 5 %" : t.ceja}</small>
              <b>{nombreDe(o)}</b>
              <span>
                {t.dias} días · {pesos(t.precio)}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
