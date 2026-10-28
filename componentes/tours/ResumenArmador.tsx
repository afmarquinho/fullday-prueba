"use client";
/* Resumen de "Arma tu tour": nivel, lo elegido, fecha, viajeros, precio y el botón al planner.
   Si el plan no cabe en sus días, no se agrega (mismo aviso que se ve en "Tus días"). */
import { useState, type FormEvent } from "react";
import { VIAJEROS, type IdNivel } from "@/contenido/armador";
import { TOURS, type IdTour } from "@/contenido/tours";
import { resumenDe, type Config } from "@/lib/armador";
import { aIso, hoy, pesos, sumarDias } from "@/lib/formato";
import { usePlanner } from "@/lib/planner";
import { datosDe } from "@/lib/tours";

const DIAS_MINIMOS_PARA_LLEGAR = 3; // la fecha de llegada más cercana que se puede elegir

type Props = {
  id: IdTour;
  cfg: Config;
  nivelNuevo: IdNivel | null;
  alCambiarViajeros: (paso: number) => void;
};

export default function ResumenArmador({ id, cfg, nivelNuevo, alCambiarViajeros }: Props) {
  const { plan, fijarLlegada, agregarViaje } = usePlanner();
  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [aviso, setAviso] = useState("");
  const t = datosDe(id);
  const r = resumenDe(id, cfg);
  const minimo = cfg.empresa ? VIAJEROS.minEmpresa : VIAJEROS.min;

  function agregar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (r.sinDias.length) {
      setAviso(`Te faltan días en ${r.sinDias.map((z) => TOURS[z].linea).join(" y ")}: suma días o quita una actividad.`);
      return;
    }
    setAviso("");
    agregarViaje({
      clave: id,
      nombre: r.nombre,
      color: r.color,
      iso: r.iso,
      cfg: { sel: { ...cfg.sel }, act: [...cfg.act], dias: { ...cfg.dias }, empresa: cfg.empresa },
      n: cfg.n,
      max: r.maxViajeros,
      precio: r.precioPorPersona,
      precioSuelto: r.fijo ? (t.precioSuelto ?? null) : null,
      fijo: r.fijo,
      tramos: r.zonas.map((z) => ({ nombre: TOURS[z].linea, color: TOURS[z].color, dias: cfg.dias[z] ?? 0 })),
      porCotizar: r.porCotizar,
    });
  }

  const conExpedition = r.nivel === "expedition" && !!t.sumaExpedition;
  const cotiza = (si: boolean) => si && !r.fijoExpedition && <em>por cotizar</em>;

  return (
    <form className="arma-form" noValidate onSubmit={agregar}>
      {nivelNuevo && (
        <p className="nivel-nuevo" style={{ "--c": nivelNuevo === "clasico" ? t.color : r.N.color } as React.CSSProperties} role="status">
          {nivelNuevo === "clasico" ? "Tu viaje volvió a ser " : "Tu viaje ahora es "}
          <b>{nivelNuevo === "clasico" ? "Clásico" : r.N.nombre}</b>
        </p>
      )}

      <div className="res-cab" style={{ "--c": r.color } as React.CSSProperties}>
        <img src={r.iso} alt="" />
        <div>
          <small>Tu tour</small>
          <b>{r.nombre}</b>
          <span>
            {r.totalDias} días · {r.totalDias - 1} noches
            {r.zonas.length > 1 && " · " + r.zonas.map((z) => `${TOURS[z].linea} ${cfg.dias[z]}`).join(", ")}
          </span>
        </div>
      </div>

      {r.por.length > 0 && (
        <p className="por-que">
          {r.nivel === "empresarial"
            ? "Porque viajas con tu empresa."
            : "Porque elegiste " + r.por.slice(0, 2).join(" y ") + (r.por.length > 2 ? ` y ${r.por.length - 2} más` : "") + "."}{" "}
          {r.N.aviso}
        </p>
      )}

      <ul className="res-lista">
        {r.elegidos.map((e) => (
          <li key={e.grupoId}>
            <span>{e.grupo}</span>
            <b>{e.opcion}</b>
            {cotiza(e.porCotizar)}
          </li>
        ))}
        <li>
          <span>Actividades</span>
          <b>
            {r.deRuta} de la ruta
            {r.extras.length > 0 && ` + ${r.extras.length} extra${r.extras.length > 1 ? "s" : ""}`}
          </b>
          {cotiza(r.extras.length > 0)}
        </li>
        {!r.diasRuta && !r.fijoExpedition && (
          <li>
            <span>Días</span>
            <b>Distintos a la ruta</b>
            <em>por cotizar</em>
          </li>
        )}
        {r.quitadas.length > 0 && (
          <li>
            <span>Quitaste</span>
            <b>{r.quitadas.map((a) => a.nombre).join(", ")}</b>
          </li>
        )}
      </ul>

      <label>
        Llego el
        <input
          type="date"
          value={plan.llegada}
          min={aIso(sumarDias(hoy(), DIAS_MINIMOS_PARA_LLEGAR))}
          required
          onChange={(e) => fijarLlegada(e.target.value)}
        />
      </label>
      {cfg.empresa && (
        <label>
          Empresa
          <input type="text" placeholder="Nombre para la factura" value={nombreEmpresa} onChange={(e) => setNombreEmpresa(e.target.value)} />
        </label>
      )}

      <div className="contador">
        <span className="contador-txt">{cfg.empresa ? `Personas (${minimo} a ${r.maxViajeros})` : `Viajeros (${minimo} a ${r.maxViajeros})`}</span>
        <div>
          <button type="button" aria-label="Quitar un viajero" onClick={() => alCambiarViajeros(-1)}>
            −
          </button>
          <output>{cfg.n}</output>
          <button type="button" aria-label="Sumar un viajero" onClick={() => alCambiarViajeros(1)}>
            +
          </button>
        </div>
      </div>

      {r.fijo ? (
        <>
          <div className="arma-total">
            <span>Total</span>
            <span>
              {t.precioSuelto && <s>{pesos(t.precioSuelto * cfg.n)}</s>}
              <b>{pesos(r.precioPorPersona * cfg.n)}</b>
            </span>
          </div>
          {r.fijoExpedition && <p className="arma-ahorro">La ruta más {pesos(t.sumaExpedition ?? 0)} por persona de Expedition.</p>}
          {t.precioSuelto && <p className="arma-ahorro">Ahorras 5 % al juntar las tres zonas.</p>}
        </>
      ) : (
        <>
          <div className="arma-total cotizar">
            <span>Desde</span>
            <span>
              <b>{pesos(t.precio + (conExpedition ? (t.sumaExpedition ?? 0) : 0))}</b>
              <small> por persona</small>
            </span>
          </div>
          <p className="arma-ahorro">
            {conExpedition && `La ruta más ${pesos(t.sumaExpedition ?? 0)} por persona de Expedition. `}
            Más lo que elegiste: te enviamos el precio final por chat antes de pagar.
          </p>
        </>
      )}

      <button className="reservar" type="submit">
        Agregar a mi planner <span aria-hidden="true">→</span>
      </button>
      <p className="arma-nota">{r.fijo ? "Pago seguro en línea · " : ""}Tú compras los tiquetes aéreos</p>
      {aviso && <p className="form-aviso">{aviso}</p>}
    </form>
  );
}
