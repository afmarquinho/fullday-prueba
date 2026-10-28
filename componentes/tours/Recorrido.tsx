"use client";
/* Día a día con el mapa al lado. El día más cerca del centro de la pantalla es el "día activo":
   el mapa marca dónde estás y la línea dorada avanza con el viaje. */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ColorRuta from "@/componentes/planner/ColorRuta";
import { COMPLETA, TOURS, type IdTour, type IdZona } from "@/contenido/tours";
import { dos } from "@/lib/formato";
import { datosDe, diasDe, type DiaDelViaje } from "@/lib/tours";
import MapaIsometrico from "./MapaIsometrico";
import "./Recorrido.css";

type Props = {
  id: IdTour;
  orden: IdZona[]; // orden de las zonas (en la Aventura completa depende de la ciudad de llegada)
  alCambiarLlegada?: (llegada: keyof typeof COMPLETA.entradas) => void;
};

// Altura de la "línea de lectura": 42 % de la pantalla visible bajo el mapa
const LECTURA = 0.42;

export default function Recorrido({ id, orden, alCambiarLlegada }: Props) {
  const t = datosDe(id);
  const esCompleta = id === "completa";
  const pasos = useMemo(() => diasDe(id, orden), [id, orden]);
  const dias = useMemo(() => pasos.flatMap((p) => (p.tipo === "dia" ? [p.dia] : [])), [pasos]);
  const [activo, setActivo] = useState<DiaDelViaje>(dias[0]);
  const lista = useRef<HTMLDivElement>(null);
  const fijo = useRef<HTMLDivElement>(null);
  const tarjetas = useRef<Record<number, HTMLElement | null>>({});

  // Al cambiar el orden (otra llegada) se empieza por el primer día
  const primero = dias[0];
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- el viaje se reordenó
    setActivo(primero);
  }, [primero]);

  // Con el scroll: avanza el riel y se activa el día que está a la altura de lectura
  useEffect(() => {
    const revisar = () => {
      const r = lista.current!.getBoundingClientRect();
      const f = fijo.current!;
      const arriba = getComputedStyle(f).order === "-1" ? f.getBoundingClientRect().bottom : 0; // en celular el mapa va arriba
      const medio = arriba + (innerHeight - arriba) * LECTURA;
      lista.current!.style.setProperty("--p", Math.min(1, Math.max(0, (medio - r.top) / r.height)).toFixed(3));
      let mejor = dias[0];
      let dist = Infinity;
      for (const d of dias) {
        const b = tarjetas.current[d.n]?.getBoundingClientRect();
        if (!b) continue;
        const k = Math.abs(b.top + b.height / 2 - medio);
        if (k < dist) {
          dist = k;
          mejor = d;
        }
      }
      setActivo((a) => (a.n === mejor.n && a.zona === mejor.zona ? a : mejor));
    };
    addEventListener("scroll", revisar, { passive: true });
    revisar();
    return () => removeEventListener("scroll", revisar);
  }, [dias]);

  const irAlDia = useCallback((d: DiaDelViaje | undefined) => {
    if (!d) return;
    tarjetas.current[d.n]?.scrollIntoView({ behavior: "smooth", block: "center" });
    setActivo(d);
  }, []);

  // Tocar una parada lleva a su día (si tiene varios días, cada toque pasa al siguiente)
  const alTocarParada = (diasParada: number[]) => {
    const i = diasParada.indexOf(activo.local);
    const local = i >= 0 && i < diasParada.length - 1 ? diasParada[i + 1] : diasParada[0];
    irAlDia(dias.find((d) => d.zona === activo.zona && d.local === local));
  };

  return (
    <section className="t-seccion caja" id="recorrido">
      <span className="ceja">Día a día</span>
      <h2>{esCompleta ? "Trece días, tres zonas" : `${t.dias} días, cada uno completo`}</h2>
      <p className="t-bajada">Baja por los días: el mapa marca dónde estás y la línea dorada avanza con tu viaje.</p>

      {esCompleta && alCambiarLlegada && (
        <div className="llegas" role="group" aria-label="Ciudad de llegada">
          <span>Llegas a</span>
          {(Object.keys(COMPLETA.entradas) as (keyof typeof COMPLETA.entradas)[]).map((e) => (
            <button type="button" key={e} aria-pressed={COMPLETA.entradas[e].orden.join() === orden.join()} onClick={() => alCambiarLlegada(e)}>
              {COMPLETA.entradas[e].nombre}
            </button>
          ))}
        </div>
      )}

      <div className="recorrido">
        <div className="dias" ref={lista}>
          <span className="riel" aria-hidden="true" />
          {pasos.map((p, i) =>
            p.tipo === "puente" ? (
              <div className="puente" key={"p" + i}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M2.5 13.5l7-1.5L14 4.5c.6-1 2-.8 2 .4L15 11.5l5.5 1.5c.8.2 1 1.3.3 1.7L15 17l-1 4c-.2.8-1.3.9-1.6.2L11 18l-4 .5-1.5 2-1-.3.5-2.7-2.5-2.5z" />
                </svg>
                <span>
                  <b>{p.texto}.</b> Tú compras el tiquete; te llevamos al aeropuerto y te esperamos al llegar.
                </span>
              </div>
            ) : (
              <article
                key={p.dia.n}
                className={"dia" + (activo.n === p.dia.n ? " activo" : "")}
                ref={(el) => void (tarjetas.current[p.dia.n] = el)}
                onMouseEnter={() => setActivo(p.dia)}
                onFocus={() => setActivo(p.dia)}
              >
                <div className="dia-cab">
                  <span className="dia-num">{dos(p.dia.n)}</span>
                  <h3>{p.dia.titulo}</h3>
                  {esCompleta && (
                    <span className="dia-zona" style={{ "--c": TOURS[p.dia.zona].color } as React.CSSProperties}>
                      {TOURS[p.dia.zona].linea}
                    </span>
                  )}
                </div>
                <p>{p.dia.texto}</p>
                <ul className="horas">
                  {p.dia.horas.map(([h, a]) => (
                    <li key={h + a}>
                      <b>{h}</b>
                      {a}
                    </li>
                  ))}
                </ul>
              </article>
            ),
          )}
        </div>

        <div className="iso-fijo" ref={fijo}>
          <div className="iso-marco">
            <div className="iso-cab">
              <div>
                <b>{TOURS[activo.zona].mapa.nombre}</b>
                <br />
                <small>
                  Día {dos(activo.n)}
                  {esCompleta && ` de ${dias.length}`}
                </small>
              </div>
              {esCompleta && (
                <div className="pestanas" role="tablist" aria-label="Zona del mapa">
                  {orden.map((z) => (
                    <button
                      type="button"
                      role="tab"
                      key={z}
                      aria-selected={z === activo.zona}
                      onClick={() => irAlDia(dias.find((d) => d.zona === z))}
                    >
                      {TOURS[z].linea}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <MapaIsometrico zona={activo.zona} dia={activo.local} alTocarParada={alTocarParada} />
            <div className="iso-pie">
              <span>
                <i />
                Tu recorrido
              </span>
              <span>Toca una parada para ir a su día</span>
              <ColorRuta />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
