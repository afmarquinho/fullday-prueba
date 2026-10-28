"use client";
/* Mi planner: los viajes armados, el almanaque de llegada, lo de la tienda y la cuenta total.
   Desde aquí se paga (precio fijo) o se pide cotización por chat (si hay algo por cotizar). */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ATAJOS, RESERVA } from "@/contenido/planner";
import { ENVIO } from "@/contenido/tienda";
import { pesos, plural } from "@/lib/formato";
import { costoEnvio, diasDeViaje, diasTotales, entregaDe, unidades, usePlanner, type Plan } from "@/lib/planner";
import Ventana, { CabeceraVentana } from "../comunes/Ventana";
import Almanaque from "./Almanaque";
import "./Ventanas.css";
import "./Planner.css";

export default function VentanaPlanner() {
  const { plan, actualizar, ventana, opciones, cerrar, conCuenta, abrir } = usePlanner();
  const [aviso, setAviso] = useState("");
  const abierta = ventana === "planner";

  // El aviso (p. ej. el del pago de la maqueta) llega al abrir; se borra al volver a abrir
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- el aviso depende de cómo se abrió la ventana
    if (abierta) setAviso(opciones.aviso ?? "");
  }, [abierta, opciones]);

  const total = diasTotales(plan);
  const hayAlgo = plan.viajes.length > 0 || plan.carrito.length > 0;
  const resumen = [
    plan.viajes.length && `${plan.viajes.length} ${plural(plan.viajes.length, "viaje", "viajes")} · ${total} días`,
    plan.carrito.length && `${unidades(plan)} ${plural(unidades(plan), "producto", "productos")}`,
  ]
    .filter(Boolean)
    .join(" · ");

  // Pasos numerados: solo se cuentan los que se muestran
  let paso = 0;
  const titulo = (texto: string) => (
    <div className="v-paso">
      <b>{++paso}</b> {texto}
    </div>
  );

  const cotizar = plan.viajes.some((v) => !v.fijo || v.porCotizar.length);
  const pagar = () => conCuenta(() => abrir("planner", { aviso: "Maqueta: aquí sigue el pago del 30 % con Wompi (tarjeta, PSE o Nequi)." }));
  const pedirCotizacion = () => conCuenta(() => abrir("chat", { conPlan: true }));

  return (
    <Ventana abierta={abierta} alCerrar={cerrar} etiqueta="Mi planner">
      <CabeceraVentana titulo="Mi planner" sub={resumen || "Arma tu viaje y míralo aquí"} alCerrar={cerrar} />
      <div className="v-cuerpo">
        {titulo("Tus viajes")}
        <Viajes plan={plan} actualizar={actualizar} alEditar={cerrar} />
        {plan.viajes.length > 0 && (
          <>
            {titulo("¿Cuándo llegas?")}
            <Almanaque key={opciones.vez} /* vuelve al mes de llegada cada vez que se abre */ />
          </>
        )}
        {plan.carrito.length > 0 && (
          <>
            {titulo("Tu tienda")}
            <Tienda plan={plan} actualizar={actualizar} />
          </>
        )}
        {hayAlgo && (
          <>
            {titulo("Tu cuenta")}
            <Calculadora plan={plan} />
          </>
        )}
      </div>
      {hayAlgo && (
        <div className="v-pie">
          {cotizar ? (
            <button className="b-comprar" type="button" onClick={pedirCotizacion}>
              Pedir cotización por chat <span aria-hidden="true">→</span>
            </button>
          ) : (
            <>
              <button className="b-comprar" type="button" onClick={pagar}>
                Pagar seguro <span aria-hidden="true">→</span>
              </button>
              <button className="b-suave" type="button" onClick={pedirCotizacion}>
                Tengo una pregunta
              </button>
            </>
          )}
          {aviso && <p className="v-aviso">{aviso}</p>}
        </div>
      )}
    </Ventana>
  );
}

type ConPlan = { plan: Plan; actualizar: (c: (p: Plan) => Plan) => void };

/* ---------- Viajes ---------- */
function Viajes({ plan, actualizar, alEditar }: ConPlan & { alEditar: () => void }) {
  const atajos = (
    <div className="p-atajos">
      {ATAJOS.map((a) => (
        <Link key={a.href} href={a.href}>
          {a.texto}
        </Link>
      ))}
    </div>
  );
  if (!plan.viajes.length && plan.carrito.length)
    return (
      <div className="p-vacio corto">
        ¿Y el viaje? Con un tour en el planner, lo de la tienda te lo entregamos en tu hotel.
        {atajos}
      </div>
    );
  if (!plan.viajes.length)
    return (
      <div className="p-vacio">
        <b>Aún no tienes viajes</b>Entra a un tour, ármalo a tu medida y toca «Agregar a mi planner».
        {atajos}
      </div>
    );

  const quitar = (i: number) => actualizar((p) => ({ ...p, viajes: p.viajes.filter((_, k) => k !== i) }));
  const viajeros = (i: number, paso: number) =>
    actualizar((p) => ({ ...p, viajes: p.viajes.map((v, k) => (k === i ? { ...v, n: Math.min(v.max, Math.max(1, v.n + paso)) } : v)) }));

  return (
    <>
      {plan.viajes.map((v, i) => (
        <div className="p-viaje" style={{ "--c": v.color } as React.CSSProperties} key={v.clave}>
          <img src={v.iso} alt="" />
          <div>
            <b>{v.nombre}</b>
            <small>
              {diasDeViaje(v)} días · {diasDeViaje(v) - 1} noches
              {v.tramos.length > 1 && " · " + v.tramos.map((t) => t.nombre + " " + t.dias).join(", ")}
            </small>
            {v.porCotizar.length > 0 && (
              <small className="p-cot">
                {v.porCotizar.length} {plural(v.porCotizar.length, "cosa", "cosas")} por cotizar
              </small>
            )}
          </div>
          <div className="p-acciones">
            <Link className="p-quitar" href={`/tours/${v.clave}?nivel=editar`} onClick={alEditar}>
              Cambiar actividades
            </Link>
            <button className="p-quitar" type="button" onClick={() => quitar(i)}>
              Quitar
            </button>
          </div>
          <div className="p-contador">
            <span>Viajeros</span>
            <div>
              <button type="button" onClick={() => viajeros(i, -1)} disabled={v.n <= 1} aria-label="Quitar un viajero">
                −
              </button>
              <output>{v.n}</output>
              <button type="button" onClick={() => viajeros(i, 1)} disabled={v.n >= v.max} aria-label="Sumar un viajero">
                +
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

/* ---------- Tienda: productos con cantidad y cómo se entregan ---------- */
function Tienda({ plan, actualizar }: ConPlan) {
  const conTour = plan.viajes.length > 0;
  const e = entregaDe(plan);
  const cantidad = (i: number, paso: number) =>
    actualizar((p) => ({
      ...p,
      carrito: p.carrito.map((x, k) => (k === i ? { ...x, cant: x.cant + paso } : x)).filter((x) => x.cant > 0),
    }));
  return (
    <>
      {plan.carrito.map((x, i) => (
        <div className="p-prod" style={{ "--c": x.color } as React.CSSProperties} key={x.id + x.variante}>
          <i aria-hidden="true" />
          <div>
            <b>{x.nombre}</b>
            <small>
              {x.linea}
              {x.variante && " · " + x.variante} · {pesos(x.precio)}
            </small>
          </div>
          <div className="p-cant">
            <button type="button" onClick={() => cantidad(i, -1)} aria-label="Quitar uno">
              −
            </button>
            <output>{x.cant}</output>
            <button type="button" onClick={() => cantidad(i, 1)} disabled={x.cant >= ENVIO.maxPorProducto} aria-label="Sumar uno">
              +
            </button>
          </div>
        </div>
      ))}
      <div className="p-entrega" role="radiogroup" aria-label="Entrega">
        <button
          type="button"
          role="radio"
          aria-checked={e === "tour"}
          disabled={!conTour}
          onClick={() => actualizar((p) => ({ ...p, entrega: "tour" }))}
        >
          <b>En tu hotel</b>
          <small>{conTour ? "El día que llegas · sin costo" : "Necesita un tour en el planner"}</small>
        </button>
        <button type="button" role="radio" aria-checked={e === "envio"} onClick={() => actualizar((p) => ({ ...p, entrega: "envio" }))}>
          <b>Envío nacional</b>
          <small>
            {ENVIO.dias} · {pesos(ENVIO.nacional)}
          </small>
        </button>
      </div>
    </>
  );
}

/* ---------- Calculadora: precio fijo × viajeros, ahorro y lo que falta por cotizar ---------- */
function Calculadora({ plan }: { plan: Plan }) {
  // Cada viaje: precio sin descuento × viajeros, menos el ahorro por juntar zonas
  const viajes = plan.viajes.map((v) => {
    const unitario = v.precioSuelto || v.precio;
    const base = unitario * v.n;
    const ahorro = v.precioSuelto ? (v.precioSuelto - v.precio) * v.n : 0;
    return { v, unitario, base, ahorro };
  });
  const envio = costoEnvio(plan);
  const total = viajes.reduce((s, x) => s + x.base - x.ahorro, 0) + plan.carrito.reduce((s, x) => s + x.precio * x.cant, 0) + envio;
  const cotizar = plan.viajes.reduce((s, v) => s + v.porCotizar.length, 0);

  const lineas = viajes.map(({ v, unitario, base, ahorro }) => (
    <div key={v.clave}>
      <div className="calc-linea">
        <span>
          {v.nombre} · {pesos(unitario)} × {v.n}
        </span>
        <b>{pesos(base)}</b>
        {!v.fijo && <small>Precio desde: lo que cambiaste se cotiza aparte</small>}
      </div>
      {ahorro > 0 && (
        <div className="calc-linea ahorro">
          <span>Ahorro por juntar zonas (5 %)</span>
          <b>−{pesos(ahorro)}</b>
        </div>
      )}
      {v.porCotizar.map((x) => (
        <div className="calc-linea cot" key={x}>
          <span>{x}</span>
          <b>por cotizar</b>
        </div>
      ))}
    </div>
  ));

  // El total salta un poco cuando cambia
  const antes = useRef(total);
  const [salta, setSalta] = useState(false);
  useEffect(() => {
    if (antes.current !== total) {
      antes.current = total;
      setSalta(true);
      const t = setTimeout(() => setSalta(false), 500);
      return () => clearTimeout(t);
    }
  }, [total]);

  const notaFinal = `Precio final, sin recargos.${plan.viajes.length ? " Tú compras los tiquetes aéreos." : ""}${plan.carrito.length ? " Precios de la tienda: de ejemplo." : ""}`;
  return (
    <div className="calc" aria-live="polite">
      {lineas}
      {plan.carrito.map((x) => (
        <div className="calc-linea" key={x.id + x.variante}>
          <span>
            {x.nombre} × {x.cant}
          </span>
          <b>{pesos(x.precio * x.cant)}</b>
        </div>
      ))}
      {plan.carrito.length > 0 && (
        <div className="calc-linea">
          <span>{entregaDe(plan) === "tour" ? "Entrega en tu hotel" : "Envío nacional"}</span>
          <b>{envio ? pesos(envio) : "sin costo"}</b>
        </div>
      )}
      <div className="calc-total">
        <span>{cotizar ? "Total desde" : "Total"}</span>
        <output className={salta ? "salta-total" : ""}>{pesos(total)}</output>
      </div>
      {plan.viajes.length > 0 && !cotizar && (
        <div className="calc-linea">
          <span>Para reservar hoy ({RESERVA.abono} %)</span>
          <b>{pesos(Math.round((total * RESERVA.abono) / 100))}</b>
        </div>
      )}
      <p className="calc-nota">
        {cotizar
          ? `Faltan ${cotizar} ${plural(cotizar, "cosa", "cosas")} por cotizar: te enviamos el precio final por chat antes de pagar.`
          : notaFinal}
      </p>
    </div>
  );
}
