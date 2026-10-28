/* Galería corta del tour: tira horizontal de fotos. Las que faltan se ven rayadas. */
import { COMPLETA, TOURS, type IdTour } from "@/contenido/tours";
import "./Secciones.css";

export default function GaleriaTour({ id }: { id: IdTour }) {
  const fotos =
    id === "completa"
      ? COMPLETA.combina.map((z) => ({ img: TOURS[z].foto as string | null, texto: TOURS[z].linea + " · " + TOURS[z].ceja }))
      : TOURS[id].galeria;
  return (
    <section className="t-seccion caja">
      <span className="ceja">Galería</span>
      <h2>Así se vive</h2>
      <div className="tira">
        {fotos.map((f, i) => (
          <figure key={i}>
            <div className="tira-foto">{f.img ? <img src={f.img} alt={f.texto} loading="lazy" /> : "Foto real pendiente"}</div>
            <figcaption>{f.texto}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
