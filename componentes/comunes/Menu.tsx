"use client";
/* Menú superior de todas las páginas. Ver variantes en Menu.css. */
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Enlace } from "@/contenido/sitio";
import { unidades, usePlanner } from "@/lib/planner";
import "./Menu.css";

type Props = {
  enlaces: Enlace[];
  variante: "portada" | "fija";
  actual?: string; // href del enlace de la página en la que estás
};

// En la portada, el menú se vuelve sólido cuando ya bajaste casi toda la pantalla del héroe
const UMBRAL_SOLIDO = 0.85;

export default function Menu({ enlaces, variante, actual }: Props) {
  const { plan, abrir } = usePlanner();
  const [solida, setSolida] = useState(false);

  useEffect(() => {
    if (variante !== "portada") return;
    const revisar = () => setSolida(scrollY > innerHeight * UMBRAL_SOLIDO);
    revisar();
    addEventListener("scroll", revisar, { passive: true });
    return () => removeEventListener("scroll", revisar);
  }, [variante]);

  const cuenta = plan.viajes.length + unidades(plan);
  const clases = ["ns", `ns--${variante}`, solida ? "ns-solida" : ""].join(" ");

  return (
    <header className={clases}>
      <Link className="ns-logo" href={variante === "portada" ? "#inicio" : "/"} aria-label="Full Day Tours, inicio">
        <img src="/marca/logo.png" alt="" />
      </Link>
      <nav aria-label="Principal">
        {enlaces.map((e) => (
          <Link key={e.href} href={e.href} aria-current={e.href === actual ? "page" : undefined}>
            {e.texto}
          </Link>
        ))}
      </nav>
      <span className="ns-acciones">
        <button type="button" className="ns-ingresar" onClick={() => abrir("cuenta", { modo: plan.usuario ? "perfil" : "ingresar" })}>
          {plan.usuario ? plan.usuario.nombre.split(" ")[0] : "Ingresar"}
        </button>
        <button type="button" className="ns-planner" onClick={() => abrir("planner")}>
          Mi planner
          {cuenta > 0 && (
            <span className="ns-cuenta" key={cuenta}>
              {cuenta}
            </span>
          )}
        </button>
      </span>
    </header>
  );
}
