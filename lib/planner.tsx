"use client";
/* =====================================================================
   Estado del planner, el chat y la cuenta, compartido por todas las páginas.
   - El plan se guarda en el navegador del viajero (localStorage). Si el navegador
     no deja guardar (modo privado), la página funciona igual, sin recordar.
   - Solo una ventana abierta a la vez: planner, chat o cuenta.
   Todo es maqueta: no cobra ni envía nada.
   ===================================================================== */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CLAVE_GUARDADO, DIAS_LLEGADA_SUGERIDA } from "@/contenido/planner";
import { ENVIO } from "@/contenido/tienda";
import type { Config } from "./armador";
import { aIso, hoy, sumarDias } from "./formato";

/* ---------- Qué guarda el plan ---------- */
export type Tramo = { nombre: string; color: string; dias: number };
export type Viaje = {
  clave: string; // id del tour: armar el mismo tour otra vez reemplaza al anterior
  nombre: string;
  color: string;
  iso: string;
  cfg: Omit<Config, "n">; // lo elegido en el armador, para volver a editarlo
  n: number;
  max: number;
  precio: number; // por persona
  precioSuelto: number | null; // precio sin el descuento de juntar zonas
  fijo: boolean;
  tramos: Tramo[];
  porCotizar: string[];
};
export type ProductoEnPlan = { id: string; nombre: string; linea: string; color: string; precio: number; variante: string; cant: number };
export type Mensaje =
  | { tipo: "yo" | "ellos" | "sistema"; txt: string; quien?: string }
  | { tipo: "plan"; dias: number; llegada: string; viajes: string[]; cotizar: string[] };
export type Usuario = { nombre: string; whatsapp: string | null; correo: string | null; referido: string | null };
export type Caso = { id: string; estado: "Nuevo" | "En revisión"; zona: string | null };

export type Plan = {
  viajes: Viaje[];
  carrito: ProductoEnPlan[];
  entrega: "tour" | "envio";
  llegada: string; // AAAA-MM-DD
  caso: Caso | null;
  chat: Mensaje[];
  usuario: Usuario | null;
};

const planVacio = (): Plan => ({
  viajes: [],
  carrito: [],
  entrega: "tour",
  caso: null,
  chat: [],
  usuario: null,
  llegada: aIso(sumarDias(hoy(), DIAS_LLEGADA_SUGERIDA)),
});

function leer(): Plan | null {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_GUARDADO) || "null");
    return guardado ? { ...planVacio(), ...guardado } : null;
  } catch {
    return null;
  }
}
function guardar(plan: Plan) {
  try {
    localStorage.setItem(CLAVE_GUARDADO, JSON.stringify(plan));
  } catch {}
}

/* ---------- Cálculos que usan varias ventanas ---------- */
export const diasDeViaje = (v: Viaje) => v.tramos.reduce((s, t) => s + t.dias, 0);
export const diasTotales = (p: Plan) => p.viajes.reduce((s, v) => s + diasDeViaje(v), 0);
export const unidades = (p: Plan) => p.carrito.reduce((s, x) => s + x.cant, 0);
// Sin tour no hay hotel donde entregar: la tienda pasa a envío nacional
export const entregaDe = (p: Plan) => (p.viajes.length ? p.entrega : "envio");
export const costoEnvio = (p: Plan) => (p.carrito.length && entregaDe(p) === "envio" ? ENVIO.nacional : 0);

/* ---------- Ventanas ---------- */
export type NombreVentana = "planner" | "chat" | "cuenta";
export type ModoCuenta = "registro" | "ingresar" | "codigo" | "perfil";
type Opciones = { conPlan?: boolean; modo?: ModoCuenta; aviso?: string };

type ContextoPlanner = {
  plan: Plan;
  actualizar: (cambio: (p: Plan) => Plan) => void;
  ventana: NombreVentana | null;
  opciones: Opciones & { vez: number }; // "vez" cambia en cada apertura para que la ventana reaccione
  abrir: (v: NombreVentana, opciones?: Opciones) => void;
  cerrar: () => void;
  // Pagar y cotizar necesitan cuenta: si no la hay, se pide en ese momento y luego se sigue
  conCuenta: (seguir: () => void) => void;
  entrar: (u: Usuario) => void;
  cancelarCuenta: () => void;
  // Lo que usan las páginas
  agregarViaje: (v: Viaje) => void;
  agregarProducto: (p: ProductoEnPlan) => void;
  fijarLlegada: (fecha: string) => void;
  cfgDe: (clave: string) => Config | null;
};

const Contexto = createContext<ContextoPlanner | null>(null);

export const ESPERA_CIERRE = 280; // ms: lo que dura la animación de cerrar una ventana

export function ProveedorPlanner({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<Plan>(planVacio);
  const [ventana, setVentana] = useState<NombreVentana | null>(null);
  const [opciones, setOpciones] = useState<Opciones & { vez: number }>({ vez: 0 });
  const alSeguir = useRef<(() => void) | null>(null);

  // El plan guardado se lee al cargar la página (en el servidor no hay navegador)
  useEffect(() => {
    const guardado = leer();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- leer localStorage solo es posible después de montar
    if (guardado) setPlan(guardado);
  }, []);

  const actualizar = useCallback((cambio: (p: Plan) => Plan) => {
    setPlan((p) => {
      const nuevo = cambio(p);
      guardar(nuevo);
      return nuevo;
    });
  }, []);

  const abrir = useCallback((v: NombreVentana, o: Opciones = {}) => {
    setOpciones((a) => ({ ...o, vez: a.vez + 1 }));
    setVentana(v);
  }, []);
  const cerrar = useCallback(() => setVentana(null), []);

  const conCuenta = useCallback(
    (seguir: () => void) => {
      setVentana(null);
      if (plan.usuario) return void setTimeout(seguir, ESPERA_CIERRE);
      alSeguir.current = seguir;
      setTimeout(() => abrir("cuenta", { modo: "registro" }), ESPERA_CIERRE);
    },
    [plan.usuario, abrir],
  );

  const entrar = useCallback(
    (u: Usuario) => {
      actualizar((p) => ({ ...p, usuario: u }));
      setVentana(null);
      const seguir = alSeguir.current;
      alSeguir.current = null;
      if (seguir) setTimeout(seguir, ESPERA_CIERRE + 20);
    },
    [actualizar],
  );
  const cancelarCuenta = useCallback(() => {
    alSeguir.current = null;
    setVentana(null);
  }, []);

  const agregarViaje = useCallback(
    (v: Viaje) => {
      actualizar((p) => {
        const i = p.viajes.findIndex((x) => x.clave === v.clave);
        const viajes = [...p.viajes];
        if (i >= 0) viajes.splice(i, 1, v);
        else viajes.push(v);
        return { ...p, viajes };
      });
      abrir("planner");
    },
    [actualizar, abrir],
  );

  // El mismo producto con la misma variante suma cantidad; no abre el planner para seguir comprando
  const agregarProducto = useCallback(
    (x: ProductoEnPlan) =>
      actualizar((p) => {
        const i = p.carrito.findIndex((y) => y.id === x.id && y.variante === x.variante);
        const carrito = [...p.carrito];
        if (i >= 0) carrito[i] = { ...carrito[i], cant: Math.min(ENVIO.maxPorProducto, carrito[i].cant + x.cant) };
        else carrito.push(x);
        return { ...p, carrito };
      }),
    [actualizar],
  );

  const fijarLlegada = useCallback((fecha: string) => fecha && actualizar((p) => ({ ...p, llegada: fecha })), [actualizar]);

  // Lo que el viajero eligió en el armador, para volver a editarlo (viajeros al día con el planner)
  const cfgDe = useCallback(
    (clave: string) => {
      const v = plan.viajes.find((x) => x.clave === clave);
      return v ? { ...v.cfg, n: v.n } : null;
    },
    [plan.viajes],
  );

  const valor = useMemo(
    () => ({
      plan,
      actualizar,
      ventana,
      opciones,
      abrir,
      cerrar,
      conCuenta,
      entrar,
      cancelarCuenta,
      agregarViaje,
      agregarProducto,
      fijarLlegada,
      cfgDe,
    }),
    [plan, actualizar, ventana, opciones, abrir, cerrar, conCuenta, entrar, cancelarCuenta, agregarViaje, agregarProducto, fijarLlegada, cfgDe],
  );
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function usePlanner() {
  const c = useContext(Contexto);
  if (!c) throw new Error("usePlanner debe usarse dentro de <ProveedorPlanner>");
  return c;
}
