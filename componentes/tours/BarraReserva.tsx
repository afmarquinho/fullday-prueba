"use client";
/* Barra flotante con el precio y "Reservar": se ve entre la portada del tour y el armador.
   Mientras se ve, la burbuja del chat sube para no taparla (body[data-barra="ver"] en Chat.css). */
import { useEffect, useState } from "react";
import { pesos } from "@/lib/formato";
import "./BarraReserva.css";

export default function BarraReserva({ texto, precio }: { texto: string; precio: number }) {
  const [ver, setVer] = useState(false);

  useEffect(() => {
    const visibles = { portada: true, reserva: false };
    const portada = document.querySelector(".tp");
    const reserva = document.getElementById("reserva");
    if (!portada || !reserva) return;
    const o = new IntersectionObserver((es) => {
      es.forEach((e) => (visibles[e.target === reserva ? "reserva" : "portada"] = e.isIntersecting));
      setVer(!visibles.portada && !visibles.reserva);
    });
    o.observe(portada);
    o.observe(reserva);
    return () => o.disconnect();
  }, []);

  useEffect(() => {
    document.body.dataset.barra = ver ? "ver" : "";
    return () => void delete document.body.dataset.barra;
  }, [ver]);

  return (
    <div className={"barra" + (ver ? " ver" : "")} aria-hidden={!ver}>
      <div>
        <small>{texto}</small>
        <b>{pesos(precio)}</b>
      </div>
      <a
        className="reservar"
        href="#reserva"
        tabIndex={ver ? 0 : -1}
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("reserva")?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        Reservar <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}
