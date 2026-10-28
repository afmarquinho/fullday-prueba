/* =====================================================================
   Lógica de "Arma tu tour": niveles, mínimos de días, agenda y precio.
   No dibuja nada: recibe la configuración del viajero y devuelve resultados.
   Los datos (opciones, actividades, reglas) están en contenido/armador.ts.
   ===================================================================== */
import {
  ACTIVIDADES,
  BASICOS,
  DIAS_MAXIMOS,
  DIAS_RUTA,
  MINIMOS,
  NIVELES,
  ORDEN_COMIDAS,
  PARTIDAS,
  VIAJEROS,
  type ActividadDato,
  type GrupoBasico,
  type IdNivel,
  type Opcion,
} from "@/contenido/armador";
import { TOURS, type IdTour, type IdZona } from "@/contenido/tours";
import { datosDe, nombreDe, zonasDe } from "./tours";

/* Lo que el viajero va armando */
export type Config = {
  sel: Record<string, string>; // opción elegida por grupo básico (alojamiento, comidas…)
  act: string[]; // ids de las actividades elegidas
  dias: Partial<Record<IdZona, number>>;
  empresa: boolean;
  n: number; // viajeros
};

export type Actividad = ActividadDato & { id: string; zona: IdZona | null };

/* ---------- Opciones básicas ---------- */

// Comidas que trae el precio del tour (si no dice, solo desayuno)
export const comidaIncluida = (id: IdTour) => (id === "completa" ? "desayuno" : TOURS[id].comidas || "desayuno");

export const incluida = (id: IdTour, g: GrupoBasico, o: Opcion) => (g.id === "comidas" ? o.id === comidaIncluida(id) : !!o.incluida);

// Qué opciones se muestran: las de empresa solo con empresa, las "solo" en su nivel, y no comidas por debajo de lo incluido
export const visible = (id: IdTour, g: GrupoBasico, o: Opcion, nivel: IdNivel, c: Config) =>
  (!o.empresa || c.empresa) &&
  (!o.solo || o.solo === nivel) &&
  (g.id !== "comidas" || ORDEN_COMIDAS.indexOf(o.id) >= ORDEN_COMIDAS.indexOf(comidaIncluida(id)));

export const opcionElegida = (g: GrupoBasico, c: Config) => g.opciones.find((o) => o.id === c.sel[g.id]) ?? g.opciones[0];

/* ---------- Actividades ---------- */

export function actividadesDe(id: IdTour): Actividad[] {
  return [
    ...zonasDe(id).flatMap((z) => ACTIVIDADES[z].map((a, i) => ({ ...a, id: `${z}-${i}`, zona: z }))),
    ...ACTIVIDADES.empresa.map((a, i) => ({ ...a, id: `empresa-${i}`, zona: null })),
  ];
}

/* ---------- Nivel: sale de lo elegido, con el porqué para mostrárselo al viajero ---------- */
export function nivelDe(id: IdTour, c: Config): { nivel: IdNivel; por: string[] } {
  if (c.empresa) return { nivel: "empresarial", por: ["Viajas con tu empresa"] };
  const acts = actividadesDe(id).filter((a) => c.act.includes(a.id));
  const ops = BASICOS.map((g) => opcionElegida(g, c));
  const premium = [...ops.filter((o) => o.sube === "premium").map((o) => o.nombre), ...acts.filter((a) => a.tipo === "xanadu").map((a) => a.nombre)];
  if (premium.length) return { nivel: "premium", por: premium };
  const expedition = [
    ...ops.filter((o) => o.sube === "expedition").map((o) => o.nombre),
    ...acts.filter((a) => a.tipo === "expedition").map((a) => a.nombre),
  ];
  if (expedition.length) return { nivel: "expedition", por: expedition };
  return { nivel: "clasico", por: [] };
}

/* ---------- Días ---------- */

// Mínimo de días de una zona: sube si el viaje toca Santa Marta o Zipaquirá
export function minimoDe(z: IdZona, c: Config, acts: Actividad[]) {
  const m = MINIMOS[z];
  return m.con && acts.some((a) => a.zona === z && a.lugar === m.lugar && c.act.includes(a.id)) ? m.con : m.base;
}

// Agenda por zona: días útiles = días − 1 (llegas en la tarde, te vas en la mañana)
export function agendaDe(z: IdZona, c: Config, acts: Actividad[]) {
  const mias = acts.filter((a) => a.zona === z && c.act.includes(a.id));
  return {
    usados: mias.reduce((s, a) => s + a.dias, 0),
    utiles: (c.dias[z] ?? 0) - 1,
    extremas: mias.filter((a) => a.exigencia === 3).length,
  };
}

/* ---------- Configuración inicial ----------
   partida = pack de los banners Expedition y Xanadu ("expedition", "premium", "empresarial") */
export function configNueva(id: IdTour, partida?: string | null): Config {
  const sel: Record<string, string> = {};
  BASICOS.forEach((g) => (sel[g.id] = g.def));
  sel.comidas = comidaIncluida(id);
  const acts = actividadesDe(id);
  const c: Config = { sel, act: acts.filter((a) => a.tipo === "base").map((a) => a.id), dias: {}, empresa: false, n: VIAJEROS.min };
  zonasDe(id).forEach((z) => (c.dias[z] = DIAS_RUTA[z]));
  const p = partida && partida in PARTIDAS ? PARTIDAS[partida as keyof typeof PARTIDAS] : null;
  if (p) {
    Object.assign(c.sel, p.sel);
    if (p.empresa) {
      c.empresa = true;
      c.n = p.viajeros ?? VIAJEROS.minEmpresa;
    }
    Object.entries(p.act).forEach(([z, nombres]) =>
      acts.filter((a) => (a.zona || "empresa") === z && nombres?.includes(a.nombre)).forEach((a) => c.act.push(a.id)),
    );
    // El pack de partida cabe en los días: se suman los que falten
    zonasDe(id).forEach((z) => (c.dias[z] = Math.max(c.dias[z] ?? 0, Math.ceil(agendaDe(z, c, acts).usados) + 1)));
  }
  return normalizar(id, c);
}

/* Deja la configuración coherente después de cada cambio:
   - si una actividad necesita más días (Santa Marta sube el mínimo de Marina), los días suben solos
   - si una opción dejó de verse (p. ej. campamento al dejar de ser Expedition), vuelve a la de la ruta
   - los viajeros quedan dentro del rango (2 a 8, o 10 a 40 con empresa) */
export function normalizar(id: IdTour, c: Config): Config {
  const acts = actividadesDe(id);
  const r: Config = { ...c, sel: { ...c.sel }, dias: { ...c.dias }, act: [...c.act] };
  zonasDe(id).forEach((z) => (r.dias[z] = Math.min(DIAS_MAXIMOS, Math.max(r.dias[z] ?? 0, minimoDe(z, r, acts)))));
  if (!r.empresa) r.act = r.act.filter((a) => !a.startsWith("empresa-"));
  const { nivel } = nivelDe(id, r);
  BASICOS.forEach((g) => {
    if (!visible(id, g, opcionElegida(g, r), nivel, r)) r.sel[g.id] = g.id === "comidas" ? comidaIncluida(id) : g.def;
  });
  const [min, max] = r.empresa ? [VIAJEROS.minEmpresa, VIAJEROS.maxEmpresa] : [VIAJEROS.min, VIAJEROS.max];
  r.n = Math.min(max, Math.max(min, r.n));
  return r;
}

/* ---------- Resumen y precio ----------
   Precio fijo si: es la ruta tal cual (Clásico sin cambios), o es Expedition con precio fijo
   (la ruta + sumaExpedition, si solo suma actividades de aventura, campamento o todas las comidas,
   y los días que esas aventuras necesitan). Xanadu y todo lo demás va por cotización. */
export function resumenDe(id: IdTour, c: Config) {
  const t = datosDe(id);
  const acts = actividadesDe(id);
  const { nivel, por } = nivelDe(id, c);
  const N = NIVELES[nivel];
  const elegidos = BASICOS.map((g) => {
    const o = opcionElegida(g, c);
    return { grupo: g.nombre, opcion: o.nombre, porCotizar: !incluida(id, g, o), grupoId: g.id };
  });
  const extras = acts.filter((a) => c.act.includes(a.id) && a.tipo !== "base");
  const quitadas = acts.filter((a) => a.tipo === "base" && !c.act.includes(a.id));
  const deRuta = acts.filter((a) => a.tipo === "base" && c.act.includes(a.id)).length;
  const zonas = zonasDe(id);
  const totalDias = zonas.reduce((s, z) => s + (c.dias[z] ?? 0), 0);
  const diasRuta = zonas.every((z) => c.dias[z] === DIAS_RUTA[z]);

  const permitidoEnExpedition = (g: { grupoId: string }) =>
    ["comidas:completa", "alojamiento:campamento"].includes(g.grupoId + ":" + c.sel[g.grupoId]);
  const diasExpedition = zonas.every(
    (z) => (c.dias[z] ?? 0) <= DIAS_RUTA[z] + Math.ceil(extras.reduce((n, a) => n + (a.zona === z ? a.dias : 0), 0)),
  );
  const fijoExpedition =
    nivel === "expedition" &&
    !!t.sumaExpedition &&
    diasExpedition &&
    extras.every((a) => a.tipo === "expedition") &&
    elegidos.every((e) => !e.porCotizar || permitidoEnExpedition(e));
  const fijo = (nivel === "clasico" && !extras.length && !elegidos.some((e) => e.porCotizar) && diasRuta) || fijoExpedition;
  const precioPorPersona = t.precio + (fijoExpedition ? (t.sumaExpedition ?? 0) : 0);
  const nombre = nivel === "clasico" ? nombreDe(id) : nivel === "expedition" ? t.linea + " Expedition" : t.linea + " · " + N.nombre;
  const color = nivel === "clasico" ? t.color : N.color!;
  const iso = nivel === "clasico" ? t.iso || "/marca/iso-amazonas.svg" : N.iso!;

  // Lo que el equipo tiene que cotizar antes del pago
  const porCotizar = fijoExpedition
    ? []
    : [
        ...elegidos.filter((e) => e.porCotizar).map((e) => e.grupo + ": " + e.opcion),
        ...extras.map((a) => a.nombre),
        ...(!diasRuta ? ["Días distintos a la ruta"] : []),
      ];

  // Zonas donde lo elegido no cabe en los días
  const sinDias = zonas.filter((z) => {
    const ag = agendaDe(z, c, acts);
    return ag.usados > ag.utiles || ag.extremas > ag.utiles;
  });

  return {
    nivel,
    por,
    N,
    nombre,
    color,
    iso,
    elegidos,
    extras,
    quitadas,
    deRuta,
    zonas,
    totalDias,
    diasRuta,
    fijo,
    fijoExpedition,
    precioPorPersona,
    porCotizar,
    sinDias,
    maxViajeros: c.empresa ? VIAJEROS.maxEmpresa : VIAJEROS.max,
  };
}
