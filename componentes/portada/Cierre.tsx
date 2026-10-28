/* Cierre de la portada (contenido/portada.ts → CIERRE). */
import Link from "next/link";
import { CIERRE } from "@/contenido/portada";
import { PIE } from "@/contenido/sitio";
import "./Cierre.css";

export default function Cierre() {
  return (
    <section className="cierre" id="cierre">
      <h2>{CIERRE.titulo}</h2>
      <p>{CIERRE.texto}</p>
      <div className="cierre-botones">
        <Link className="cierre-armar" href={CIERRE.boton.href}>
          {CIERRE.boton.texto}
        </Link>
        <a href={PIE.redes.whatsapp}>{CIERRE.whatsapp}</a>
      </div>
    </section>
  );
}
