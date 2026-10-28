"use client";
/* "Aventura completa" de la portada: toca una zona (en el mapa o en la lista) y se ilumina,
   con su tarjeta al lado. Un avión dibuja la ruta del viaje según la ciudad de llegada.
   Datos en contenido/mapa-colombia.ts. */
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import ColorRuta from "@/componentes/planner/ColorRuta";
import { LLEGADAS, MAPA_BASE, PIEZAS, TEXTO_MAPA, ZONAS_MAPA } from "@/contenido/mapa-colombia";
import "./MapaAventura.css";

const { ancho: W, alto: H } = MAPA_BASE;
const pct = (v: number, total: number) => (v / total) * 100 + "%";

// Tarjeta junto a la pieza agrandada: separación (px del mapa base) y escala de la pieza activa
const SEPARACION = 90;
const AGRANDADA = 1.85;
// Curvatura de la ruta entre dos ciudades (0 = recta)
const CURVA = 0.18;
// Inclinación máxima del mapa con el mouse (grados)
const INCLINA_X = 10;
const INCLINA_Y = 8;
// Avión que traza la ruta: duración y pausa antes de salir (ms)
const VUELTA_MS = 2800;
const PAUSA_ENTRADA_MS = 900;
const AVION =
  "M0 -26 C4 -26 5 -20 5 -12 L5 -4 L28 8 L28 14 L5 8 L4 20 L12 26 L12 30 L0 27 L-12 30 L-12 26 L-4 20 L-5 8 L-28 14 L-28 8 L-5 -4 L-5 -12 C-5 -20 -4 -26 0 -26Z";

/* ---------- Geometría ---------- */
// Punto de cada destino: centro de su pieza, un poco hacia abajo
const centro = (id: string) => {
  const p = PIEZAS[id];
  return { x: p.x + p.w / 2, y: p.y + p.h * 0.62 };
};
// Curva suave que pasa por las ciudades en orden
function trazo(ciudades: string[]) {
  const pts = ciudades.map(centro);
  let d = `M${pts[0].x} ${pts[0].y}`;
  for (let k = 1; k < pts.length; k++) {
    const a = pts[k - 1];
    const b = pts[k];
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    d += ` Q${mx - (b.y - a.y) * CURVA} ${my + (b.x - a.x) * CURVA} ${b.x} ${b.y}`;
  }
  return d;
}
// Piezas de atrás hacia adelante (las de más abajo en el mapa tapan a las de arriba)
const ORDEN_PIEZAS = Object.keys(PIEZAS).sort((a, b) => PIEZAS[a].y + PIEZAS[a].h - (PIEZAS[b].y + PIEZAS[b].h));
const suave = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export default function MapaAventura() {
  const [activa, setActiva] = useState<string | null>(null); // zona iluminada
  const [fija, setFija] = useState<string | null>(null); // zona elegida con clic (no se apaga al mover el mouse)
  const [llegada, setLlegada] = useState(LLEGADAS[0].id);
  const rutas = LLEGADAS.find((l) => l.id === llegada)!.rutas;

  const escena = useRef<HTMLDivElement>(null);
  const mapa = useRef<HTMLDivElement>(null);
  const capa = useRef<HTMLDivElement>(null);
  const tarjetas = useRef<Record<string, HTMLDivElement | null>>({});
  const hitos = useRef<Record<string, HTMLButtonElement | null>>({});
  const guiaLinea = useRef<SVGLineElement>(null);
  const guiaPunto = useRef<SVGCircleElement>(null);
  const trazos = useRef<SVGPathElement[]>([]);
  const aviones = useRef<SVGPathElement[]>([]);
  const animacion = useRef(0);
  const yaSeVio = useRef(false);

  /* ---------- Zonas: pasar el mouse ilumina; clic deja fija ---------- */
  const tocar = (id: string) => {
    const nueva = fija === id ? null : id;
    setFija(nueva);
    setActiva(nueva || id);
  };
  const eventosZona = (id: string) => ({
    onMouseEnter: () => !fija && setActiva(id),
    onMouseLeave: () => !fija && setActiva(null),
    onFocus: () => setActiva(id),
    onClick: () => tocar(id),
  });

  // Clic fuera del mapa y de la lista: se apaga todo
  useEffect(() => {
    const fuera = (e: MouseEvent) => {
      if ((e.target as Element).closest(".mapa-hito, .mapa-lista button, .mapa-tarjeta")) return;
      setFija(null);
      setActiva(null);
    };
    document.addEventListener("click", fuera);
    return () => document.removeEventListener("click", fuera);
  }, []);

  // En 3D el navegador no siempre detecta el toque sobre una pieza:
  // si no cayó en un botón, se busca el destino por su posición en pantalla
  const hitoEn = (x: number, y: number) => {
    let mejor: string | null = null;
    let dist = Infinity;
    for (const z of ZONAS_MAPA) {
      const r = hitos.current[z.id]?.getBoundingClientRect();
      if (!r || x < r.left || x > r.right || y < r.top || y > r.bottom) continue;
      const k = Math.hypot(x - (r.left + r.right) / 2, y - (r.top + r.bottom) / 2);
      if (k < dist) {
        dist = k;
        mejor = z.id;
      }
    }
    return mejor;
  };

  /* ---------- Tarjeta al lado de la pieza agrandada, unida por una línea guía ---------- */
  useLayoutEffect(() => {
    if (!activa) return;
    const t = tarjetas.current[activa]!;
    const P = PIEZAS[activa];
    const k = W / mapa.current!.clientWidth; // px de pantalla → px del mapa base
    const cw = t.offsetWidth * k;
    const ch = t.offsetHeight * k;
    const cx = P.x + P.w / 2;
    const mitad = (P.w * AGRANDADA) / 2;
    const yPieza = P.y + P.h * 0.1; // la pieza activa sube: la línea apunta a su parte media
    const cabeDer = cx + mitad + SEPARACION + cw < W - 8;
    const cabeIzq = cx - mitad - SEPARACION - cw > 8;
    let x, y, x2, y2;
    let xp = cx;
    if (cabeDer || cabeIzq) {
      // Al lado (a la derecha si cabe)
      x = cabeDer ? cx + mitad + SEPARACION : cx - mitad - SEPARACION - cw;
      y = Math.max(ch / 2 + 8, Math.min(H - ch / 2 - 8, yPieza - P.h * 0.5));
      xp = cabeDer ? cx + mitad * 0.55 : cx - mitad * 0.55;
      x2 = cabeDer ? x : x + cw;
      y2 = y;
    } else {
      // Celular: no cabe al lado, va debajo de la pieza (o encima si abajo no cabe)
      x = Math.max(8, Math.min(W - cw - 8, cx - cw / 2));
      const abajo = P.y + P.h * 1.2 + SEPARACION;
      y = abajo + ch < H - 8 ? abajo + ch / 2 : P.y - P.h * 1.1 - SEPARACION - ch / 2;
      x2 = Math.max(x + 20, Math.min(x + cw - 20, cx));
      y2 = y + (y > yPieza ? -ch / 2 : ch / 2);
    }
    t.style.left = pct(x, W);
    t.style.top = pct(y, H);
    const l = guiaLinea.current!;
    l.setAttribute("x1", String(xp));
    l.setAttribute("y1", String(yPieza));
    l.setAttribute("x2", String(x2));
    l.setAttribute("y2", String(y2));
    guiaPunto.current!.setAttribute("cx", String(xp));
    guiaPunto.current!.setAttribute("cy", String(yPieza));
  }, [activa]);

  /* ---------- Ruta: un avión traza cada línea y gira con la curva ---------- */
  const animarRutas = useCallback((retraso = 0) => {
    cancelAnimationFrame(animacion.current);
    const datos = trazos.current.map((p, i) => {
      const L = p.getTotalLength();
      p.style.setProperty("--largo", String(L));
      p.style.strokeDashoffset = String(L);
      return { p, L, av: aviones.current[i] };
    });
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      datos.forEach((d) => (d.p.style.strokeDashoffset = "0"));
      return;
    }
    const ini = performance.now() + retraso;
    const paso = (ahora: number) => {
      const t = Math.min(Math.max((ahora - ini) / VUELTA_MS, 0), 1);
      const k = suave(t);
      for (const d of datos) {
        const l = d.L * k;
        const a = d.p.getPointAtLength(l);
        const b = d.p.getPointAtLength(Math.min(l + 2, d.L));
        const c = d.p.getPointAtLength(Math.max(l - 2, 0));
        const angulo = (Math.atan2(b.y - c.y, b.x - c.x) * 180) / Math.PI + 90;
        d.p.style.strokeDashoffset = String(d.L - l);
        d.av.setAttribute("transform", `translate(${a.x} ${a.y}) rotate(${angulo}) scale(${1.4 + 0.4 * Math.sin(Math.PI * k)})`);
        d.av.style.opacity = t > 0 ? "1" : "0";
      }
      if (t < 1) animacion.current = requestAnimationFrame(paso);
      else setTimeout(() => datos.forEach((d) => (d.av.style.opacity = "0")), 700);
    };
    animacion.current = requestAnimationFrame(paso);
  }, []);

  // Las piezas vuelven a caer en su lugar y la ruta se dibuja de nuevo
  const dibujar = useCallback(() => {
    const c = capa.current!;
    c.classList.remove("entra");
    void c.offsetWidth; // reinicia la animación de las piezas
    c.classList.add("entra");
    animarRutas(PAUSA_ENTRADA_MS);
  }, [animarRutas]);

  // Al cambiar la ciudad de llegada: ruta nueva (oculta hasta que el mapa se vea por primera vez)
  useEffect(() => {
    if (yaSeVio.current) animarRutas();
    else trazos.current.forEach((p) => p.style.setProperty("--largo", String(p.getTotalLength())));
    return () => cancelAnimationFrame(animacion.current);
  }, [llegada, animarRutas]);

  // La primera vez que el mapa aparece en pantalla
  useEffect(() => {
    const o = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        yaSeVio.current = true;
        dibujar();
        o.disconnect();
      },
      { threshold: 0.35 },
    );
    o.observe(escena.current!);
    return () => o.disconnect();
  }, [dibujar]);

  /* ---------- Inclinación con el mouse y toques sobre las piezas ---------- */
  const alMover = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && !fija) {
      const id = hitoEn(e.clientX, e.clientY);
      escena.current!.style.cursor = id ? "pointer" : "";
      if (id) setActiva(id);
    }
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = escena.current!.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    mapa.current!.style.transform = `rotateY(${x * INCLINA_X}deg) rotateX(${-y * INCLINA_Y}deg) translateZ(0)`;
  };
  const alTocarEscena = (e: React.MouseEvent) => {
    if ((e.target as Element).closest(".mapa-hito, .mapa-tarjeta, a, button")) return;
    const id = hitoEn(e.clientX, e.clientY);
    if (!id) return;
    e.stopPropagation();
    tocar(id);
  };

  return (
    <section className="mapa-envoltura" id="aventura">
      <div className="mapa-texto">
        <span className="ceja">{TEXTO_MAPA.ceja}</span>
        <h2>{TEXTO_MAPA.titulo}</h2>
        <p className="mapa-intro">{TEXTO_MAPA.intro}</p>
        <ul className="mapa-lista">
          {ZONAS_MAPA.map((z) => (
            <li key={z.id}>
              <button
                type="button"
                className={activa === z.id ? "activa" : undefined}
                style={{ "--c": z.color } as React.CSSProperties}
                {...eventosZona(z.id)}
              >
                <span className="mapa-punto" />
                <span>
                  <b>{z.nombre}</b>
                  <small>{z.linea}</small>
                </span>
                {z.precio ? <span className="mapa-precio">{z.precio}</span> : <span className="mapa-estudio">Próximamente</span>}
              </button>
            </li>
          ))}
        </ul>
        <div className="mapa-llegada" role="group" aria-label="Ciudad de llegada">
          <span>Llegas a</span>
          {LLEGADAS.map((l) => (
            <button type="button" key={l.id} aria-pressed={llegada === l.id} onClick={() => setLlegada(l.id)}>
              {l.nombre}
            </button>
          ))}
        </div>
        <button className="mapa-repetir" type="button" onClick={dibujar}>
          {TEXTO_MAPA.repetir}
        </button>
        <ColorRuta suelta />
      </div>

      <div
        className="mapa-escena"
        ref={escena}
        onPointerMove={alMover}
        onPointerLeave={() => (mapa.current!.style.transform = "")}
        onClick={alTocarEscena}
      >
        <div className={"mapa" + (activa ? " enfocado" : "")} ref={mapa}>
          <img className="mapa-base" src={MAPA_BASE.img} alt="Mapa isométrico de Colombia" width={W} height={H} />
          <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
            <g key={llegada}>
              {rutas.map((r, i) => (
                <path key={i} className="mapa-ruta" d={trazo(r)} ref={(el) => void (el && (trazos.current[i] = el))} />
              ))}
              {rutas.map((r, i) => (
                <path key={"avion" + i} className="mapa-avion" d={AVION} ref={(el) => void (el && (aviones.current[i] = el))} />
              ))}
            </g>
            <g className={"mapa-guia" + (activa ? " on" : "")}>
              <line ref={guiaLinea} />
              <circle ref={guiaPunto} r="7" />
            </g>
          </svg>

          <div className="mapa-capa" ref={capa}>
            {ORDEN_PIEZAS.map((id, n) => {
              const p = PIEZAS[id];
              const clase = (extra: string) => ["mapa-pieza", extra, activa === id && "activa"].filter(Boolean).join(" ");
              const lugar = (x: number, y: number, w: number) => ({ left: pct(x, W), top: pct(y, H), width: pct(w, W) });
              return [
                p.img && (
                  <img key={id} className={clase("")} src={p.img} alt="" style={{ ...lugar(p.x, p.y, p.w), "--n": n } as React.CSSProperties} />
                ),
                ...p.extras.map((e, i) => (
                  <img
                    key={id + i}
                    className={clase("extra" + (e.mar ? " barco" : ""))}
                    src={e.img}
                    alt=""
                    style={{ ...lugar(e.x, e.y, e.w), "--n": n, "--i": i } as React.CSSProperties}
                  />
                )),
              ];
            })}

            {ZONAS_MAPA.map((z) => {
              const c = centro(z.id);
              const P = PIEZAS[z.id];
              return (
                <button
                  key={z.id}
                  className="mapa-hito"
                  type="button"
                  aria-label={z.nombre}
                  ref={(el) => void (hitos.current[z.id] = el)}
                  style={{ left: pct(c.x, W), top: pct(c.y, H), width: (Math.max(P.w, P.h) / W) * 100 * 0.8 + "%" }}
                  {...eventosZona(z.id)}
                />
              );
            })}

            {ZONAS_MAPA.map((z) => (
              <div
                key={z.id}
                className={"mapa-tarjeta" + (activa === z.id ? " on" : "")}
                aria-hidden={activa !== z.id}
                ref={(el) => void (tarjetas.current[z.id] = el)}
                style={{ "--c": z.color } as React.CSSProperties}
              >
                <span className="linea">{z.linea}</span>
                <h3>{z.nombre}</h3>
                <p>{z.texto}</p>
                <div className="tarjeta-pie">
                  {z.precio && z.tour ? (
                    <>
                      <span>
                        {z.dias} · desde <b>{z.precio}</b>
                      </span>
                      <Link href={z.tour} tabIndex={activa === z.id ? 0 : -1}>
                        Ver tours
                      </Link>
                    </>
                  ) : (
                    <>
                      <span>En estudio</span>
                      <a className="apagado" href="#" tabIndex={activa === z.id ? 0 : -1}>
                        Avísame
                      </a>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
