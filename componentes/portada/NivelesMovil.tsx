/* Celular: tarjetas de Expedition y Xanadu con accesos directos a cada zona.
   Contenido en contenido/portada.ts → NIVELES_MOVIL. */
import Link from "next/link";
import { NIVELES_MOVIL } from "@/contenido/portada";
import "./NivelesMovil.css";

export default function NivelesMovil() {
  return (
    <section className="nm" aria-label="Expedition y Xanadu">
      <span className="ceja">{NIVELES_MOVIL.ceja}</span>
      <h2>{NIVELES_MOVIL.titulo}</h2>
      {NIVELES_MOVIL.tarjetas.map((t) => (
        <article className="nm-tarjeta" key={t.nombre} style={{ "--c": t.color } as React.CSSProperties}>
          <div className="nm-img">
            <img src={t.img} alt={t.alt} loading="lazy" />
          </div>
          <div className="nm-texto">
            <span className="ceja">{t.ceja}</span>
            <h3>{t.nombre}</h3>
            <p>{t.texto}</p>
            <div className="nm-zonas">
              {t.enlaces.map((e) => (
                <Link key={e.href} href={e.href}>
                  {e.texto}
                </Link>
              ))}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
