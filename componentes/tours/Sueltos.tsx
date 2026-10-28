/* Tours sueltos de la zona ("¿Poco tiempo?") o, en la Aventura completa, las tres rutas que junta. */
import Link from "next/link";
import { COMPLETA, TOURS, type IdTour } from "@/contenido/tours";
import { pesos } from "@/lib/formato";
import { nombreDe } from "@/lib/tours";
import "./Secciones.css";

export default function Sueltos({ id, alReservar }: { id: IdTour; alReservar: () => void }) {
  if (id === "completa")
    return (
      <section className="t-seccion caja">
        <span className="ceja">Las tres rutas</span>
        <h2>Lo que juntas en este viaje</h2>
        <div className="sueltos">
          {COMPLETA.combina.map((z) => (
            <div className="suelto" key={z}>
              <small>{TOURS[z].dias} días</small>
              <h3>
                {nombreDe(z)} · {TOURS[z].ceja}
              </h3>
              <p>{TOURS[z].frase}</p>
              <div className="suelto-pie">
                <b>{pesos(TOURS[z].precio)}</b>
                <Link className="suave" href={`/tours/${z}`}>
                  Ver la ruta
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    );

  const sueltos = TOURS[id].sueltos;
  if (!sueltos.length) return null;
  return (
    <section className="t-seccion caja">
      <span className="ceja">También por separado</span>
      <h2>¿Poco tiempo? Toma un solo tour</h2>
      <p className="t-bajada">Cada parte de la ruta se compra sola, con los mismos traslados y el mismo cuidado.</p>
      <div className="sueltos">
        {sueltos.map((s) => (
          <div className="suelto t-sube" key={s.nombre}>
            <small>{s.dias}</small>
            <h3>{s.nombre}</h3>
            <p>{s.texto}</p>
            <div className="suelto-pie">
              <b>{pesos(s.precio)}</b>
              <button type="button" onClick={alReservar}>
                Reservar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
