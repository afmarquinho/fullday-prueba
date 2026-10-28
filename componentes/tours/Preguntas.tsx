/* Preguntas frecuentes: las propias del tour y luego las comunes (contenido/preguntas.ts). La primera va abierta. */
import { PREGUNTAS_COMUNES } from "@/contenido/preguntas";
import { COMPLETA, TOURS, type IdTour } from "@/contenido/tours";
import "./Secciones.css";

export default function Preguntas({ id }: { id: IdTour }) {
  const propias = id === "completa" ? COMPLETA.preguntas : TOURS[id].preguntas;
  const todas = [...propias, ...PREGUNTAS_COMUNES];
  return (
    <section className="t-seccion caja">
      <span className="ceja">Preguntas</span>
      <h2>Antes de reservar</h2>
      <div className="preguntas">
        {todas.map((p, i) => (
          <details key={p.pregunta} open={i === 0}>
            <summary>{p.pregunta}</summary>
            <p>{p.respuesta}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
