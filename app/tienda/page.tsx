/* Tienda Full Day: ropa de la marca y artesanía con nombre propio.
   Productos y textos en contenido/tienda.ts. */
import type { Metadata } from "next";
import CabeceraPagina from "@/componentes/comunes/CabeceraPagina";
import Menu from "@/componentes/comunes/Menu";
import PieSimple from "@/componentes/comunes/PieSimple";
import Tienda from "@/componentes/tienda/Tienda";
import { PAGINA_TIENDA as T } from "@/contenido/tienda";
import { MENU_GENERAL } from "@/contenido/sitio";

export const metadata: Metadata = {
  title: "Tienda",
  description: T.texto,
};

export default function PaginaTienda() {
  return (
    <>
      <Menu enlaces={MENU_GENERAL} variante="fija" actual="/tienda" />
      <main>
        <CabeceraPagina ceja={T.ceja} titulo={T.titulo} texto={T.texto} aviso={T.aviso} />
        <Tienda />

        <section className="caja tienda-seccion" id="entrega">
          <span className="ceja">Cómo te llega</span>
          <h2>Sin cargar nada en la maleta</h2>
          <div className="tienda-tres">
            {T.entrega.map((e) => (
              <div key={e.titulo} className={e.enEstudio ? "en-estudio" : undefined}>
                <b>{e.titulo}</b>
                <p>{e.texto}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="caja tienda-seccion">
          <span className="ceja">Próximamente</span>
          <h2>Lo que viene después</h2>
          <p>{T.proximamente}</p>
        </section>

        <section className="caja tienda-seccion">
          <span className="ceja">Lo que no vendemos</span>
          <h2>Respeto por la tierra y su gente</h2>
          <ul className="no-vendemos">
            {T.noVendemos.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>
      </main>
      <PieSimple />
    </>
  );
}
