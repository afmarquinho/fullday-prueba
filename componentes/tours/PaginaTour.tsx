"use client";
/* =====================================================================
   Página de un tour (/tours/amazonas, marina, paramo y completa), sección por sección.
   Con ?nivel=… (desde los banners Expedition y Xanadu, o "editar" desde el planner)
   el armador arranca con ese punto de partida y la página abre directo en "Arma tu tour".
   ===================================================================== */
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { COMPLETA, TOURS, type IdTour } from "@/contenido/tours";
import { pesos } from "@/lib/formato";
import { datosDe, nombreDe } from "@/lib/tours";
import { useSubidas } from "@/lib/useSubidas";
import PieSimple from "../comunes/PieSimple";
import Armador from "./Armador";
import BarraReserva from "./BarraReserva";
import Combina from "./Combina";
import GaleriaTour from "./GaleriaTour";
import Incluye from "./Incluye";
import PortadaTour from "./PortadaTour";
import Preguntas from "./Preguntas";
import Recorrido from "./Recorrido";
import Sueltos from "./Sueltos";
import "./Tour.css";

type Llegada = keyof typeof COMPLETA.entradas;

const irAReserva = (comportamiento: ScrollBehavior = "smooth") => document.getElementById("reserva")?.scrollIntoView({ behavior: comportamiento });

export default function PaginaTour({ id, nivel }: { id: IdTour; nivel: string | null }) {
  const t = datosDe(id);
  // Aventura completa: el orden de las zonas depende de la ciudad de llegada
  const [llegada, setLlegada] = useState<Llegada>("bogota");
  const orden = id === "completa" ? COMPLETA.entradas[llegada].orden : [id];
  const fotos = id === "completa" ? COMPLETA.combina.map((z) => TOURS[z].foto) : [TOURS[id].foto];

  useSubidas(id + llegada);

  // Si llega con un punto de partida, abre en el armador
  useEffect(() => {
    if (nivel) irAReserva("instant");
  }, [nivel]);

  return (
    <>
      <main>
        <PortadaTour
          iso={t.iso}
          ceja={t.ceja}
          titulo={nombreDe(id)}
          frase={t.frase}
          datos={[
            ["Duración", `${t.dias} días · ${t.noches} noches`],
            ["Desde", pesos(t.precio)],
            ["Clima", t.clima],
            ["Nivel", t.nivel],
          ]}
          fotos={fotos}
          boton={{ texto: "Reservar este tour", salto: "reserva" }}
        />
        <Recorrido id={id} orden={orden} alCambiarLlegada={setLlegada} />
        <Incluye id={id} />
        <Armador id={id} partida={nivel} />
        <Sueltos id={id} alReservar={() => irAReserva()} />
        <GaleriaTour id={id} />
        <Preguntas id={id} />
        <Combina id={id} />
      </main>
      <PieSimple />
      <BarraReserva texto={`${nombreDe(id)} · desde`} precio={t.precio} />
    </>
  );
}

/* Lee ?nivel=… del enlace. Solo valen los puntos de partida conocidos;
   la página se arma de nuevo (key) si cambia el tour o el nivel. */
const NIVELES_VALIDOS = ["expedition", "premium", "empresarial", "editar"];

export function PaginaTourConNivel({ id }: { id: IdTour }) {
  const pedido = useSearchParams().get("nivel");
  const nivel = pedido && NIVELES_VALIDOS.includes(pedido) ? pedido : null;
  return <PaginaTour key={id + (nivel ?? "")} id={id} nivel={nivel} />;
}
