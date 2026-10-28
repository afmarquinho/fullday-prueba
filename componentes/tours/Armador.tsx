"use client";
/* =====================================================================
   "Arma tu tour" (sección #reserva de cada tour).
   Izquierda: 1. días por zona · 2. lo básico · 3. actividades.
   Derecha: el resumen con el precio y el botón al planner (ResumenArmador.tsx).
   Las reglas (niveles, mínimos, precio) están en lib/armador.ts; los datos en contenido/armador.ts.
   ===================================================================== */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BASICOS,
  DIAS_MAXIMOS,
  MINIMOS,
  NIVELES,
  TIPO_ACTIVIDAD,
  VIAJEROS,
  type GrupoBasico,
  type IdNivel,
  type Opcion,
  type TipoActividad,
} from "@/contenido/armador";
import { TOURS, type IdTour, type IdZona } from "@/contenido/tours";
import { actividadesDe, agendaDe, configNueva, incluida, minimoDe, nivelDe, normalizar, visible, type Actividad, type Config } from "@/lib/armador";
import { diasTxt, pesos } from "@/lib/formato";
import { usePlanner } from "@/lib/planner";
import { datosDe, zonasDe } from "@/lib/tours";
import ResumenArmador from "./ResumenArmador";
import "./Armador.css";

const EXIGENCIA = ["", "suave", "moderada", "extrema"];

type Props = {
  id: IdTour;
  partida?: string | null; // "expedition", "premium", "empresarial" o "editar" (viene del planner)
};

export default function Armador({ id, partida }: Props) {
  const { cfgDe } = usePlanner();
  const [cfg, setCfg] = useState<Config>(() => configNueva(id, partida));
  // Nivel al que pasó el viaje con el último cambio (null si no cambió): se avisa en el resumen
  const [nivelNuevo, setNivelNuevo] = useState<IdNivel | null>(null);
  const acts = useMemo(() => actividadesDe(id), [id]);
  const { nivel } = nivelDe(id, cfg);

  // "Cambiar actividades" desde el planner: se recupera lo que el viajero ya había elegido.
  // El plan se lee del navegador después de montar, por eso se aplica cuando aparece.
  const guardadaAplicada = useRef(false);
  const guardada = partida === "editar" ? cfgDe(id) : null;
  useEffect(() => {
    if (!guardada || guardadaAplicada.current) return;
    guardadaAplicada.current = true;
    // (el plan guardado solo existe en el navegador)
    setCfg(normalizar(id, guardada));
  }, [guardada, id]);

  // Todo cambio pasa por aquí: deja la configuración coherente y avisa si cambió el nivel
  const cambiar = (receta: (c: Config) => Config) => {
    const nueva = normalizar(id, receta(cfg));
    const despues = nivelDe(id, nueva).nivel;
    setNivelNuevo(despues !== nivel ? despues : null);
    setCfg(nueva);
  };

  const sumarDias = (z: IdZona, paso: number) => cambiar((c) => ({ ...c, dias: { ...c.dias, [z]: (c.dias[z] ?? 0) + paso } }));
  const elegir = (grupo: string, opcion: string) => cambiar((c) => ({ ...c, sel: { ...c.sel, [grupo]: opcion } }));
  const marcar = (act: string, si: boolean) => cambiar((c) => ({ ...c, act: si ? [...c.act, act] : c.act.filter((a) => a !== act) }));
  const empresa = (si: boolean) => cambiar((c) => ({ ...c, empresa: si, n: si ? Math.max(c.n, VIAJEROS.minEmpresa) : c.n }));
  const viajeros = (paso: number) => cambiar((c) => ({ ...c, n: c.n + paso }));

  const tipos: TipoActividad[] = ["base", "opcional", "expedition", "xanadu", ...(cfg.empresa ? (["empresa"] as const) : [])];

  return (
    <section className="t-seccion caja" id="reserva">
      <span className="ceja">Arma tu tour</span>
      <h2>Hazlo a tu medida</h2>
      <p className="t-bajada">
        Dinos cuántos días tienes, cómo duermes, comes y te mueves, y suma actividades. La ruta y Expedition tienen precio fijo; lo que salga de ahí
        te lo cotizamos antes de pagar. Si sumas aventura extrema o lujo, tu viaje cambia de nivel solo.
      </p>
      <div className="arma">
        <div className="arma-opciones">
          <Paso n={1}>Tus días</Paso>
          <div className="dias-zonas">
            {zonasDe(id).map((z) => (
              <DiasZona key={z} zona={z} cfg={cfg} acts={acts} alSumar={(paso) => sumarDias(z, paso)} />
            ))}
          </div>
          <label className="empresa-sw">
            <input type="checkbox" checked={cfg.empresa} onChange={(e) => empresa(e.target.checked)} />
            <span>
              <b>Viajo con mi empresa</b>
              <small>Factura con NIT, grupos de 10 a 40 personas, salón e integración</small>
            </span>
          </label>

          <Paso n={2}>Lo básico</Paso>
          {BASICOS.map((g) => (
            <GrupoOpciones key={g.id} id={id} grupo={g} cfg={cfg} nivel={nivel} alElegir={(o) => elegir(g.id, o)} />
          ))}

          <Paso n={3}>
            Actividades{" "}
            <span className="leyenda">
              <Puntos n={1} /> suave <Puntos n={2} /> moderada <Puntos n={3} /> extrema
            </span>
          </Paso>
          {tipos.map((tipo) => (
            <GrupoActividades key={tipo} id={id} tipo={tipo} lista={acts.filter((a) => a.tipo === tipo)} cfg={cfg} nivel={nivel} alMarcar={marcar} />
          ))}
        </div>
        <aside className="arma-resumen" aria-live="polite">
          <ResumenArmador id={id} cfg={cfg} nivelNuevo={nivelNuevo} alCambiarViajeros={viajeros} />
        </aside>
      </div>
    </section>
  );
}

function Paso({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="arma-paso">
      <b>{n}</b> {children}
    </div>
  );
}

// Tres puntos: qué tan exigente es una actividad
export function Puntos({ n }: { n: number }) {
  return (
    <span className="exige" aria-label={`Exigencia ${EXIGENCIA[n]}`}>
      {[1, 2, 3].map((i) => (
        <i key={i} className={i <= n ? "on" : ""} />
      ))}
    </span>
  );
}

/* ---------- 1. Días de una zona, con su agenda y avisos ---------- */
function DiasZona({ zona, cfg, acts, alSumar }: { zona: IdZona; cfg: Config; acts: Actividad[]; alSumar: (paso: number) => void }) {
  const t = TOURS[zona];
  const regla = MINIMOS[zona];
  const minimo = minimoDe(zona, cfg, acts);
  const ag = agendaDe(zona, cfg, acts);
  const dias = cfg.dias[zona] ?? 0;
  const lleno = Math.min(1, ag.usados / Math.max(ag.utiles, 0.5));
  const conLugar = regla.con ? (minimo === regla.con ? " " + regla.txt : ` (${regla.con} ${regla.txt})`) : "";
  const avisos = [
    ag.usados > ag.utiles &&
      `Te faltan días: tus actividades ocupan ${diasTxt(ag.usados)} y tienes ${diasTxt(ag.utiles)} libres. Suma días o quita algo.`,
    ag.extremas > ag.utiles && "Máximo una actividad extrema por día: suma días o quita una.",
  ].filter(Boolean);

  return (
    <div className="zona-dias" style={{ "--c": t.color } as React.CSSProperties}>
      <div className="zd-cab">
        <b>{t.linea}</b>
        <small>
          Mínimo {diasTxt(minimo)}
          {conLugar}
        </small>
      </div>
      <div className="contador">
        <button type="button" disabled={dias <= minimo} aria-label={`Quitar un día en ${t.linea}`} onClick={() => alSumar(-1)}>
          −
        </button>
        <output>{dias}</output>
        <button type="button" disabled={dias >= DIAS_MAXIMOS} aria-label={`Sumar un día en ${t.linea}`} onClick={() => alSumar(1)}>
          +
        </button>
      </div>
      <div className="agenda" role="img" aria-label={`Agenda: ${diasTxt(ag.usados)} de ${diasTxt(ag.utiles)} libres`}>
        <i style={{ width: `${(lleno * 100).toFixed(0)}%` }} className={ag.usados > ag.utiles ? "pasado" : ""} />
      </div>
      <small className="agenda-txt">
        {diasTxt(ag.usados)} de actividades · {diasTxt(ag.utiles)} libres (llegas en la tarde, te vas en la mañana)
      </small>
      {avisos.map((a) => (
        <p className="aviso-falta" key={String(a)}>
          {a}
        </p>
      ))}
    </div>
  );
}

/* ---------- 2. Un grupo de lo básico (alojamiento, comidas, transporte, guía) ---------- */
function GrupoOpciones({
  id,
  grupo,
  cfg,
  nivel,
  alElegir,
}: {
  id: IdTour;
  grupo: GrupoBasico;
  cfg: Config;
  nivel: IdNivel;
  alElegir: (o: string) => void;
}) {
  const conExpedition = !!datosDe(id).sumaExpedition;
  const etiqueta = (o: Opcion) =>
    incluida(id, grupo, o)
      ? "Incluido"
      : o.solo === "expedition" && conExpedition
        ? "Incluido en Expedition"
        : o.sube
          ? "Por cotizar · " + NIVELES[o.sube].nombre
          : "Por cotizar";

  return (
    <fieldset className="grupo">
      <legend>{grupo.nombre}</legend>
      <div className="ops">
        {grupo.opciones
          .filter((o) => visible(id, grupo, o, nivel, cfg))
          .map((o) => {
            const txt = etiqueta(o);
            return (
              <label key={o.id} className={"op" + (o.sube ? " sube-" + o.sube : "")}>
                <input type="radio" name={"g-" + grupo.id} value={o.id} checked={cfg.sel[grupo.id] === o.id} onChange={() => alElegir(o.id)} />
                <span>
                  <b>{o.nombre}</b>
                  <small>{o.detalle}</small>
                </span>
                <em className={txt.startsWith("Incluido") ? "incl" : ""}>{txt}</em>
              </label>
            );
          })}
      </div>
    </fieldset>
  );
}

/* ---------- 3. Un grupo de actividades (en la ruta, opcionales, Expedition, Xanadu, empresa) ---------- */
type PropsActividades = {
  id: IdTour;
  tipo: TipoActividad;
  lista: Actividad[];
  cfg: Config;
  nivel: IdNivel;
  alMarcar: (act: string, si: boolean) => void;
};

function GrupoActividades({ id, tipo, lista, cfg, nivel, alMarcar }: PropsActividades) {
  if (!lista.length) return null;
  const suma = datosDe(id).sumaExpedition;
  const etiqueta =
    tipo === "base"
      ? "Incluida"
      : tipo === "expedition" && suma
        ? nivel === "expedition"
          ? "Incluida en Expedition"
          : "Expedition · +" + pesos(suma)
        : "Por cotizar";
  const incl = tipo === "base" || (tipo === "expedition" && !!suma);

  return (
    <div className={"act-grupo tipo-" + tipo}>
      <div className="act-cab">
        <h4>{TIPO_ACTIVIDAD[tipo]}</h4>
      </div>
      <ul>
        {lista.map((a) => (
          <li key={a.id}>
            <label className="act">
              <input type="checkbox" value={a.id} checked={cfg.act.includes(a.id)} onChange={(e) => alMarcar(a.id, e.target.checked)} />
              <span>
                <b>{a.nombre}</b>
                <small>
                  {id === "completa" && a.zona ? TOURS[a.zona].linea + " · " : ""}
                  {a.duracion} · {a.quien === "nos" ? "Lo hace nuestro equipo" : "Con operador certificado"}
                </small>
              </span>
              <Puntos n={a.exigencia} />
              <em className={incl ? "incl" : ""}>{etiqueta}</em>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
