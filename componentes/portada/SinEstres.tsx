"use client";
/* "Viaja sin estrés": las promesas de contenido/promesas.ts con íconos grandes.
   Con el mouse, cada ícono se inclina hacia el cursor (mini parallax). */
import { PROMESAS, TEXTO_PROMESAS } from "@/contenido/promesas";
import "./SinEstres.css";

const INCLINACION = 14; // grados

export default function SinEstres() {
  const inclinar = (e: React.PointerEvent<HTMLDivElement>) => {
    const img = e.currentTarget.querySelector("img")!;
    const r = img.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    img.style.transform = `translateY(-6px) perspective(400px) rotateY(${x * INCLINACION}deg) rotateX(${-y * INCLINACION}deg) scale(1.06)`;
  };
  const soltar = (e: React.PointerEvent<HTMLDivElement>) => (e.currentTarget.querySelector("img")!.style.transform = "");

  return (
    <section className="se">
      <h2>{TEXTO_PROMESAS.titulo}</h2>
      <p className="se-intro">{TEXTO_PROMESAS.intro}</p>
      <div className="se-lista">
        {PROMESAS.map((p) => (
          <div className="se-item" key={p.titulo} onPointerMove={inclinar} onPointerLeave={soltar}>
            <img src={p.icono} alt="" width={112} height={112} />
            <b>{p.titulo}</b>
            <span>{p.texto}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
