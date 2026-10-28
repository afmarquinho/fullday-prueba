"use client";
/* Almanaque del planner: eliges el día de llegada y se pintan los días de cada zona, uno tras otro. */
import { useState } from "react";
import { DIAS_MINIMOS_ANTES } from "@/contenido/planner";
import { aIso, DIAS_SEMANA, deIso, fechaLarga, hoy, MESES, sumarDias } from "@/lib/formato";
import { diasTotales, usePlanner } from "@/lib/planner";

const primeroDelMes = (d: Date, mas = 0) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + mas, 1));

export default function Almanaque() {
  const { plan, fijarLlegada } = usePlanner();
  const llegada = deIso(plan.llegada);
  const [mes, setMes] = useState(() => primeroDelMes(llegada)); // el mes que se ve
  const minimo = sumarDias(hoy(), DIAS_MINIMOS_ANTES);

  const tramos = plan.viajes.flatMap((v) => v.tramos);
  // Color del día k del viaje (desde 0): el de la zona en la que estás ese día
  const colorDe = (k: number) => {
    let acumulado = 0;
    for (const t of tramos) {
      acumulado += t.dias;
      if (k < acumulado) return t.color;
    }
    return null;
  };
  const total = diasTotales(plan);
  const salida = sumarDias(llegada, total - 1);
  const hueco = (mes.getUTCDay() + 6) % 7; // la semana empieza el lunes
  const diasDelMes = new Date(Date.UTC(mes.getUTCFullYear(), mes.getUTCMonth() + 1, 0)).getUTCDate();
  const esteMes = primeroDelMes(hoy());
  const leyenda = [...new Map(tramos.map((t) => [t.nombre, t.color])).entries()];

  const celdas = [];
  for (let i = 0; i < hueco; i++) celdas.push(<span key={"h" + i} />);
  for (let d = 1; d <= diasDelMes; d++) {
    const f = new Date(Date.UTC(mes.getUTCFullYear(), mes.getUTCMonth(), d));
    const k = Math.round((+f - +llegada) / 864e5);
    const enViaje = k >= 0 && k < total;
    const c = enViaje ? colorDe(k) : null;
    const clases = ["alm-dia", enViaje && "viaje", k === 0 && "llegada ini", k === total - 1 && "fin", aIso(f) === aIso(hoy()) && "hoy"]
      .filter(Boolean)
      .join(" ");
    celdas.push(
      <button
        type="button"
        key={d}
        className={clases}
        disabled={f < minimo}
        style={c ? ({ "--c": c, "--k": k } as React.CSSProperties) : undefined}
        aria-label={fechaLarga(f) + (enViaje ? `, día ${k + 1} del viaje` : "")}
        aria-pressed={k === 0 ? true : undefined}
        onClick={() => fijarLlegada(aIso(f))}
      >
        {d}
      </button>,
    );
  }

  return (
    <div className="alm">
      <div className="alm-cab">
        <button type="button" onClick={() => setMes(primeroDelMes(mes, -1))} disabled={mes <= esteMes} aria-label="Mes anterior">
          ‹
        </button>
        <b>
          {MESES[mes.getUTCMonth()]} {mes.getUTCFullYear()}
        </b>
        <button type="button" onClick={() => setMes(primeroDelMes(mes, 1))} aria-label="Mes siguiente">
          ›
        </button>
      </div>
      <div className="alm-grid">
        {DIAS_SEMANA.map((d, i) => (
          <span className="dsem" key={i}>
            {d}
          </span>
        ))}
        {celdas}
      </div>
      <div className="alm-ley">
        {leyenda.map(([n, c]) => (
          <span key={n} style={{ "--c": c } as React.CSSProperties}>
            <i />
            {n}
          </span>
        ))}
      </div>
      <p className="alm-txt">
        Llegas el <b>{fechaLarga(llegada)}</b> y te vas el <b>{fechaLarga(salida)}</b>. Toca otro día para mover el viaje.
      </p>
    </div>
  );
}
