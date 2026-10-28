/* Ilustración provisional de un producto (estilo cartel): fondo del color de la línea,
   un sol, el horizonte, el objeto (componentes/tienda/formas.ts) y grano.
   Si el producto ya tiene foto real, se muestra la foto. */
import { LINEAS, type Producto } from "@/contenido/tienda";
import { FORMAS } from "./formas";

const C = { crema: "#FFF7EA", noche: "#0B1F1A" };
const LIENZO = 300; // las formas se dibujan en 300 × 300

export default function Ilustracion({ p, ancho = LIENZO, alto = LIENZO }: { p: Producto; ancho?: number; alto?: number }) {
  if (p.foto) return <img src={p.foto} alt={p.nombre} loading="lazy" />;
  const forma = FORMAS[p.forma];
  const dibujo = typeof forma === "function" ? forma() : (forma ?? "");
  // Centra el dibujo si el lienzo no es cuadrado (la ficha usa 400 × 300)
  const dx = (ancho - LIENZO) / 2;
  const dy = (alto - LIENZO) / 2;

  return (
    <svg viewBox={`0 0 ${ancho} ${alto}`} role="img" aria-label={`${p.nombre} (ilustración provisional)`} preserveAspectRatio="xMidYMid slice">
      <rect width={ancho} height={alto} fill={LINEAS[p.linea].color} />
      <rect width={ancho} height={alto} fill="url(#t-sombra)" />
      <circle cx={dx + 214} cy={dy + 86} r={58} fill={C.crema} opacity={0.22} />
      <rect y={dy + 232} width={ancho} height={alto} fill={C.noche} opacity={0.28} />
      {/* El dibujo viene de formas.ts (texto fijo nuestro, no del usuario) */}
      <g transform={`translate(${dx} ${dy})`} dangerouslySetInnerHTML={{ __html: dibujo }} />
      <rect width={ancho} height={alto} filter="url(#t-grano)" opacity={0.16} />
    </svg>
  );
}

// Filtro de grano y degradado que comparten todas las ilustraciones (va una vez por página)
export function DefinicionesIlustracion() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <filter id="t-grano">
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves={2} stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0" />
        </filter>
        <linearGradient id="t-sombra" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0B1F1A" stopOpacity="0" />
          <stop offset="1" stopColor="#0B1F1A" stopOpacity=".45" />
        </linearGradient>
      </defs>
    </svg>
  );
}
