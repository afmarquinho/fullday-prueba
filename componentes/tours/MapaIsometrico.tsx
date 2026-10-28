"use client";
/* Mapa isométrico de una zona: lee la cuadrícula del tour (contenido/tours.ts → mapa)
   y arma las losas en 3D solo con CSS. Marca las paradas y dibuja la ruta hasta el día que se lee. */
import { useEffect, useMemo, useRef, useState } from "react";
import { ADORNOS, MEDIDAS_MAPA, TESELAS } from "@/contenido/teselas";
import { TOURS, type IdZona } from "@/contenido/tours";
import { dos } from "@/lib/formato";
import "./MapaIsometrico.css";

type Props = {
  zona: IdZona;
  dia: number; // día de la zona que se está leyendo (1, 2, 3…)
  alTocarParada: (dias: number[]) => void; // días que pasan por la parada tocada
};

const CURVA = 0.25; // curvatura de cada tramo de la ruta
const INCLINA_Y = 8; // grados con el mouse
const INCLINA_X = 6;
const CAMBIO_ANCHO = 40; // px: con cambios menores de ancho no se rearma el mapa

// Color más claro u oscuro (k < 1 oscurece) para las caras de cada losa
function tono(hex: string, k: number) {
  const n = parseInt(hex.slice(1), 16);
  const f = (c: number) => Math.round(Math.min(255, Math.max(0, c * k)));
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
}
// Número "al azar" pero fijo por tesela: el mapa no cambia al recargar
function azar(x: number, y: number) {
  const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return s - Math.floor(s);
}

/* Toda la geometría del mapa para un ancho disponible */
function geometria(zona: IdZona, ancho: number) {
  const m = TOURS[zona].mapa;
  const filas = m.filas.length;
  const cols = m.filas[0].length;
  const { giro, lado, ladoMin, colchonArriba } = MEDIDAS_MAPA;
  const L = Math.round(Math.max(ladoMin, Math.min(lado, (ancho - 36) / ((cols + filas) * 0.7071))));
  const W = cols * L;
  const H = filas * L;
  const anchoVista = (W + H) * 0.7071;
  const altoPlano = anchoVista * Math.cos((giro * Math.PI) / 180);
  const arriba = L * colchonArriba + 34;
  const altura = (x: number, y: number) => {
    const t = TESELAS[m.filas[y][x]];
    return t ? Math.round(L * t.alto * (t.agua ? 1 : 0.85 + azar(x, y) * 0.3)) : 0;
  };

  const teselas = m.filas.flatMap((fila, y) =>
    [...fila].flatMap((k, x) => {
      const t = TESELAS[k];
      return t ? [{ x, y, t, h: altura(x, y), d: (x + y) * 0.03 }] : [];
    }),
  );

  // Paradas: en el centro de su tesela, por encima del adorno
  const centro = (id: string) => {
    const { x, y } = m.paradas[id];
    return { x: (x + 0.5) * L, y: (y + 0.5) * L, h: altura(x, y) };
  };
  const diasDeParada: Record<string, number[]> = {};
  m.ruta.forEach(([id, dia]) => (diasDeParada[id] ||= []).push(dia));
  const paradas = Object.entries(m.paradas).map(([id, p]) => ({ id, ...p, ...centro(id), dias: diasDeParada[id] || [1] }));

  // Ruta: un tramo por cada paso; cada tramo pertenece al día al que llega
  const tramos = m.ruta.slice(1).map(([id, dia], i) => {
    const a = centro(m.ruta[i][0]);
    const b = centro(id);
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    return { dia, d: `M${a.x} ${a.y} Q${mx - (b.y - a.y) * CURVA} ${my + (b.x - a.x) * CURVA} ${b.x} ${b.y}` };
  });

  return {
    L,
    W,
    H,
    teselas,
    paradas,
    tramos,
    caja: { width: Math.ceil(anchoVista + 20), height: Math.ceil(altoPlano + arriba + 10) },
    plano: { width: W, height: H, left: (anchoVista + 20) / 2 - W / 2, top: arriba + altoPlano / 2 - H / 2 },
  };
}

export default function MapaIsometrico({ zona, dia, alTocarParada }: Props) {
  const marco = useRef<HTMLDivElement>(null);
  const giro = useRef<HTMLDivElement>(null);
  const [ancho, setAncho] = useState(0);

  // Ancho disponible: al cargar y cuando cambia bastante
  useEffect(() => {
    const medir = () =>
      setAncho((a) => {
        const n = marco.current!.clientWidth;
        return Math.abs(n - a) < CAMBIO_ANCHO ? a : n;
      });
    medir();
    addEventListener("resize", medir);
    return () => removeEventListener("resize", medir);
  }, []);

  const g = useMemo(() => (ancho ? geometria(zona, ancho) : null), [zona, ancho]);

  // En 3D el navegador no siempre detecta qué parada se tocó: se busca por posición en pantalla
  const paradaEn = (x: number, y: number) => {
    let mejor: string | null = null;
    let dist = Infinity;
    marco.current!.querySelectorAll<HTMLElement>(".pin").forEach((p) => {
      const r = p.querySelector(".pin-et")!.getBoundingClientRect();
      const m = 10;
      if (x < r.left - m || x > r.right + m || y < r.top - m || y > r.bottom + m) return;
      const k = Math.hypot(x - (r.left + r.right) / 2, y - (r.top + r.bottom) / 2);
      if (k < dist) {
        dist = k;
        mejor = p.dataset.parada!;
      }
    });
    return mejor;
  };
  const tocar = (id: string | null) => {
    const p = id && g?.paradas.find((x) => x.id === id);
    if (p) alTocarParada(p.dias);
  };

  return (
    <div ref={marco}>
      {g && (
        <Plano
          key={zona + g.L} // otra zona u otro tamaño: el mapa vuelve a entrar en ola
          g={g}
          dia={dia}
          giro={giro}
          alTocar={(e) => tocar(paradaEn(e.clientX, e.clientY))}
          alTeclado={tocar}
          alMover={(e) => {
            if (e.pointerType !== "mouse") return;
            const r = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.cursor = paradaEn(e.clientX, e.clientY) ? "pointer" : "";
            giro.current!.style.transform = `rotateY(${((e.clientX - r.left) / r.width - 0.5) * INCLINA_Y}deg) rotateX(${-((e.clientY - r.top) / r.height - 0.5) * INCLINA_X}deg)`;
          }}
          alSalir={() => giro.current && (giro.current.style.transform = "")}
        />
      )}
    </div>
  );
}

type PropsPlano = {
  g: ReturnType<typeof geometria>;
  dia: number;
  giro: React.RefObject<HTMLDivElement | null>;
  alTocar: (e: React.MouseEvent) => void;
  alTeclado: (id: string) => void;
  alMover: (e: React.PointerEvent<HTMLDivElement>) => void;
  alSalir: () => void; // el mouse sale: el mapa vuelve a quedar derecho
};

function Plano({ g, dia, giro, alTocar, alTeclado, alMover, alSalir }: PropsPlano) {
  const [lista, setLista] = useState(false);
  const caja = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Largo de cada tramo, para dibujarlo de a poco
    caja
      .current!.querySelectorAll<SVGPathElement>(".ruta-svg path")
      .forEach((p) => p.style.setProperty("--l", String(Math.ceil(p.getTotalLength()) + 1)));
    // Dos cuadros después de pintar, las losas suben en ola
    let a = 0;
    let b = 0;
    a = requestAnimationFrame(() => (b = requestAnimationFrame(() => setLista(true))));
    return () => {
      cancelAnimationFrame(a);
      cancelAnimationFrame(b);
    };
  }, []);

  const { L, W, H } = g;
  const tramos = (clase: string) => g.tramos.map((t, i) => <path key={i} className={clase + (t.dia <= dia ? " hecho" : "")} d={t.d} />);

  return (
    <div
      className={"iso" + (lista ? " lista" : "")}
      ref={caja}
      role="img"
      aria-label="Mapa del recorrido"
      style={g.caja}
      onClick={alTocar}
      onPointerMove={alMover}
      onPointerLeave={alSalir}
    >
      <div className="iso-giro" ref={giro}>
        <div className="plano" style={g.plano}>
          {g.teselas.map(({ x, y, t, h, d }) => {
            const adorno = t.adorno && ADORNOS[t.adorno];
            return [
              <div
                key={`t${x}-${y}`}
                className={"tesela" + (t.agua ? " agua" : "")}
                style={
                  {
                    left: x * L,
                    top: y * L,
                    width: L,
                    height: L,
                    "--h": h + "px",
                    "--c1": t.color,
                    "--c2": tono(t.color, 0.78),
                    "--c3": tono(t.color, 0.62),
                    "--d": d.toFixed(2) + "s",
                  } as React.CSSProperties
                }
              >
                <i />
              </div>,
              adorno && (
                <div
                  key={`a${x}-${y}`}
                  className="adorno"
                  style={
                    {
                      left: (x + 0.5) * L - (adorno.ancho * L) / 2,
                      top: (y + 0.5) * L - adorno.alto * L,
                      width: adorno.ancho * L,
                      height: adorno.alto * L,
                      "--z": h + "px",
                      "--d": (d + 0.25).toFixed(2) + "s",
                    } as React.CSSProperties
                  }
                  dangerouslySetInnerHTML={{ __html: adorno.svg }}
                />
              ),
            ];
          })}

          {g.paradas.map((p) => {
            const hoy = p.dias.includes(dia);
            return (
              <div
                key={p.id}
                className={"pin" + (hoy ? " hoy" : "") + (Math.min(...p.dias) > dia ? " futuro" : "")}
                data-parada={p.id}
                role="button"
                tabIndex={0}
                aria-label={p.nombre}
                onKeyDown={(e) => e.key === "Enter" && alTeclado(p.id)}
                style={
                  {
                    left: p.x - 80,
                    top: p.y - 60,
                    width: 160,
                    height: 60,
                    "--z": p.h + "px",
                    "--palo": Math.round(L * 0.5) + "px",
                    "--d": (0.5 + (p.x / L + p.y / L - 1) * 0.03).toFixed(2) + "s",
                  } as React.CSSProperties
                }
              >
                <span className="pin-et">
                  <b>{dos(hoy ? dia : p.dias[0])}</b>
                  <span className="pin-n">{p.nombre}</span>
                </span>
                <i className="pin-palo" />
              </div>
            );
          })}

          <svg className="ruta-svg" width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ transform: "translateZ(2px)" }}>
            {tramos("sombra")}
          </svg>
          <svg className="ruta-svg" width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ transform: `translateZ(${L * 0.9}px)` }}>
            {tramos("tramo")}
          </svg>
        </div>
      </div>
    </div>
  );
}
