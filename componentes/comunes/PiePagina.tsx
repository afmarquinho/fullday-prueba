/* Pie de página grande de la portada. Enlaces y textos en contenido/sitio.ts → PIE. */
import Link from "next/link";
import { LEMA, PIE } from "@/contenido/sitio";
import "./PiePagina.css";

// Íconos de redes (trazos simples, heredan el color dorado)
const ICONOS = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </>
  ),
  tiktok: (
    <>
      <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M14 3c.5 2.8 2.4 4.6 5 5" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z" />
      <path d="M9 9c0 3 3 6 6 6l1-1.5-2-1-1 1c-1-.5-2-1.5-2.5-2.5l1-1-1-2z" />
    </>
  ),
};
const NOMBRES = { instagram: "Instagram", tiktok: "TikTok", whatsapp: "WhatsApp" };

export default function PiePagina() {
  return (
    <footer className="pie-grande">
      <div className="pie-cols">
        <div className="pie-marca">
          <img src="/marca/logo.png" alt="Full Day Tours" />
          <span>{LEMA}</span>
        </div>
        <nav className="pie-col" aria-label="Zonas">
          <b>Zonas</b>
          {PIE.zonas.map((e) => (
            <Link key={e.href} href={e.href}>
              {e.texto}
            </Link>
          ))}
        </nav>
        <nav className="pie-col" aria-label="Ayuda">
          <b>Ayuda</b>
          {PIE.ayuda.map((e) => (
            <a key={e.texto} href={e.href}>
              {e.texto}
            </a>
          ))}
        </nav>
        <div className="pie-col">
          <b>Síguenos</b>
          <div className="pie-redes">
            {(Object.keys(ICONOS) as (keyof typeof ICONOS)[]).map((red) => (
              <a key={red} href={PIE.redes[red]} aria-label={NOMBRES[red]}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  {ICONOS[red]}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="pie-legal">
        <span>{PIE.legal}</span>
        <span>{PIE.nota}</span>
      </div>
    </footer>
  );
}
