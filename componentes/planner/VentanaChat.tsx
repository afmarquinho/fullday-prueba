"use client";
/* Chat con el equipo (con caso de CRM) y la burbuja flotante que lo abre.
   Maqueta: el asistente responde con textos de ejemplo (contenido/planner.ts → CHAT). */
import { useCallback, useEffect, useRef, useState } from "react";
import { CHAT } from "@/contenido/planner";
import { deIso, fechaLarga, plural } from "@/lib/formato";
import { diasTotales, unidades, usePlanner, type Mensaje, type Plan } from "@/lib/planner";
import Ventana, { CabeceraVentana } from "../comunes/Ventana";
import "./Ventanas.css";
import "./Chat.css";

const LOGO = "/marca/logo.png";
const espera = (ms: number) => new Promise((r) => setTimeout(r, ms));
const zonaDelPlan = (p: Plan) => p.viajes[0]?.tramos[0]?.nombre ?? null;

export default function VentanaChat() {
  const { plan, actualizar, ventana, opciones, cerrar } = usePlanner();
  const abierta = ventana === "chat";
  const [escribiendo, setEscribiendo] = useState(false);
  const [texto, setTexto] = useState("");
  const cuerpo = useRef<HTMLDivElement>(null);
  const entrada = useRef<HTMLInputElement>(null);
  // Las respuestas llegan después de una espera: leen siempre el plan más reciente
  const ultimo = useRef(plan);
  useEffect(() => {
    ultimo.current = plan;
  }, [plan]);

  const decir = useCallback((m: Mensaje) => actualizar((p) => ({ ...p, chat: [...p.chat, m] })), [actualizar]);

  // El asistente "escribe" un momento antes de responder
  const responder = useCallback(
    async (txt: string, quien = "Asistente", ms = 900) => {
      setEscribiendo(true);
      await espera(ms);
      setEscribiendo(false);
      decir({ tipo: "ellos", quien, txt });
    },
    [decir],
  );

  // Abre el caso del CRM (o lo actualiza) y devuelve cómo quedó
  const abrirCaso = useCallback(
    (estado?: "En revisión") => {
      const p = ultimo.current;
      const antes = p.caso ?? { id: "FD-" + Math.floor(1000 + Math.random() * 9000), estado: "Nuevo" as const, zona: null };
      const caso = { ...antes, estado: estado ?? antes.estado, zona: zonaDelPlan(p) || antes.zona };
      actualizar((x) => ({ ...x, caso }));
      return caso;
    },
    [actualizar],
  );

  const pasarAPersona = useCallback(async () => {
    const caso = abrirCaso("En revisión");
    const zona = caso.zona || "Bogotá";
    decir({ tipo: "sistema", txt: `Tu caso ${caso.id} pasó al equipo ${zona}` });
    const txt = ultimo.current.viajes.length
      ? `Hola, te escribe el equipo ${zona}. Ya tengo tu plan a la vista. ¿Viajas con niños o alguien con alguna necesidad especial?`
      : `Hola, te escribe el equipo ${zona}. ¿En qué te ayudo? Si ya sabes qué zonas quieres, cuéntame y te armo el plan.`;
    await responder(txt, "Equipo " + zona, 1600);
  }, [abrirCaso, decir, responder]);

  const enviarPlan = useCallback(async () => {
    const p = ultimo.current;
    if (!p.viajes.length && !p.carrito.length) {
      await responder("Aún no tienes viajes en tu planner. Entra a un tour, ármalo y vuelve aquí: te lo cotizamos.");
      return;
    }
    abrirCaso();
    const n = unidades(p);
    decir({
      tipo: "plan",
      dias: diasTotales(p),
      llegada: fechaLarga(deIso(p.llegada)),
      viajes: p.viajes
        .map((v) => `${v.nombre} · ${v.n} ${plural(v.n, "viajero", "viajeros")}`)
        .concat(p.carrito.length ? [`Tienda · ${n} ${plural(n, "producto", "productos")}`] : []),
      cotizar: p.viajes.flatMap((v) => v.porCotizar),
    });
    await responder("¡Recibido! Tu plan quedó guardado en tu caso. Te paso con el equipo para el precio final.");
    await pasarAPersona();
  }, [abrirCaso, decir, responder, pasarAPersona]);

  const recibir = useCallback(
    async (txt: string) => {
      decir({ tipo: "yo", txt });
      const t = txt.toLowerCase();
      const r = CHAT.respuestas.find((x) => x.claves.some((k) => t.includes(k)));
      if (r?.accion === "persona") return pasarAPersona();
      if (r?.accion === "cotizar" && ultimo.current.viajes.length) return enviarPlan();
      await responder(r ? r.texto : CHAT.otra);
    },
    [decir, pasarAPersona, enviarPlan, responder],
  );

  // Al abrir: saludo la primera vez y, si viene del planner, se envía el plan
  useEffect(() => {
    if (!abierta) return;
    if (!ultimo.current.chat.length) {
      const u = ultimo.current.usuario;
      decir({ tipo: "ellos", quien: "Asistente", txt: (u ? `¡Hola, ${u.nombre.split(" ")[0]}! ` : "¡Hola! ") + CHAT.saludo });
    }
    const t = setTimeout(() => {
      if (opciones.conPlan) enviarPlan();
      else if (matchMedia("(hover:hover)").matches) entrada.current?.focus();
    }, 350);
    return () => clearTimeout(t);
  }, [abierta, opciones, decir, enviarPlan]);

  // Siempre se ve el último mensaje
  useEffect(() => {
    cuerpo.current?.scrollTo({ top: cuerpo.current.scrollHeight });
  }, [plan.chat.length, escribiendo]);

  const caso = plan.caso;
  return (
    <Ventana abierta={abierta} alCerrar={cerrar} clase="ventana-chat" etiqueta="Chat con el equipo">
      <CabeceraVentana
        titulo="Full Day Tours"
        sub="Asistente 24/7 · equipo en línea"
        alCerrar={cerrar}
        antes={
          <span className="cara">
            <img src={LOGO} alt="" />
          </span>
        }
      />
      {caso && (
        <div className="chat-caso">
          Caso <b>{caso.id}</b>
          <span className={"chat-estado " + (caso.estado === "En revisión" ? "revision" : "")}>{caso.estado}</span>
          {caso.zona && `· Equipo ${caso.zona}`}
        </div>
      )}
      <div className="v-cuerpo" style={{ padding: 0 }} ref={cuerpo}>
        <div className="chat-msgs">
          {plan.chat.map((m, i) => (
            <Burbuja m={m} key={i} />
          ))}
          {escribiendo && (
            <div className="escribiendo" aria-label="Escribiendo">
              <i />
              <i />
              <i />
            </div>
          )}
        </div>
      </div>
      <div className="chat-rapidas">
        {CHAT.rapidas.map((r, i) => (
          <button
            type="button"
            key={r}
            // La primera ("Quiero cotizar mi plan") envía el plan directo
            onClick={() => (i === 0 ? (decir({ tipo: "yo", txt: r }), enviarPlan()) : recibir(r))}
          >
            {r}
          </button>
        ))}
      </div>
      <form
        className="chat-form"
        onSubmit={(e) => {
          e.preventDefault();
          const t = texto.trim();
          if (!t) return;
          setTexto("");
          recibir(t);
        }}
      >
        <input
          ref={entrada}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          type="text"
          placeholder="Escribe tu mensaje"
          autoComplete="off"
          aria-label="Mensaje"
        />
        <button type="submit" aria-label="Enviar">
          ➤
        </button>
      </form>
    </Ventana>
  );
}

function Burbuja({ m }: { m: Mensaje }) {
  if (m.tipo === "plan")
    return (
      <div className="msg-plan">
        <b>Mi plan{m.dias ? ` · ${m.dias} días · llego el ${m.llegada}` : ""}</b>
        {m.viajes.map((v, i) => (
          <span key={i}>
            {i > 0 && <br />}
            {v}
          </span>
        ))}
        {m.cotizar.length > 0 && (
          <ul>
            {m.cotizar.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        )}
      </div>
    );
  return (
    <div className={"msg " + m.tipo}>
      {m.quien && <small>{m.quien}</small>}
      {m.txt}
    </div>
  );
}

/* Burbuja flotante "¿Hablamos?". A los segundos de CHAT.avisoBurbujaSegundos muestra un "1", una sola vez. */
export function BurbujaChat() {
  const { plan, abrir, ventana } = usePlanner();
  const [aviso, setAviso] = useState(false);
  const sinMensajes = plan.chat.length === 0;

  useEffect(() => {
    if (!sinMensajes) return;
    const t = setTimeout(() => setAviso(true), CHAT.avisoBurbujaSegundos * 1000);
    return () => clearTimeout(t);
  }, [sinMensajes]);

  return (
    <button
      type="button"
      className="chat-burbuja"
      aria-label="Abrir chat con el equipo"
      onClick={() => {
        setAviso(false);
        abrir("chat");
      }}
    >
      <span className="cara">
        <img src={LOGO} alt="" />
      </span>
      <span className="txt">¿Hablamos?</span>
      {aviso && sinMensajes && ventana !== "chat" && <span className="burbuja-aviso">1</span>}
    </button>
  );
}
