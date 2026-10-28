/* Qué incluye el tour (y qué no), con las seis promesas de la marca. */
import { PROMESAS } from "@/contenido/promesas";
import { COMPLETA, TOURS, type IdTour } from "@/contenido/tours";
import "./Incluye.css";

const SI = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7" />
  </svg>
);
const NO = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export default function Incluye({ id }: { id: IdTour }) {
  const si = id === "completa" ? COMPLETA.incluye.map((texto) => ({ texto, porConfirmar: false })) : TOURS[id].incluye;
  const no = id === "completa" ? COMPLETA.noIncluye : TOURS[id].noIncluye;
  return (
    <section className="t-seccion caja">
      <span className="ceja">Qué incluye</span>
      <h2>
        Tú pones las ganas.
        <br />
        Nosotros, lo que pasa en tierra.
      </h2>
      <div className="incluye t-sube">
        <div className="incluye-si">
          <h3>Incluye</h3>
          <ul>
            {si.map((x) => (
              <li key={x.texto}>
                {SI}
                <span>
                  {x.texto}
                  {x.porConfirmar && <span className="chip-pend">por confirmar</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="incluye-no">
          <h3>No incluye</h3>
          <ul>
            {no.map((x) => (
              <li key={x}>
                {NO}
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="promesas">
        {PROMESAS.map((p, i) => (
          <div className="t-sube" key={p.titulo} style={{ "--d": i * 0.06 + "s" } as React.CSSProperties}>
            <img src={p.icono} alt="" width={64} height={64} />
            <b>{p.titulo}</b>
            <span>{p.corto ?? p.texto}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
