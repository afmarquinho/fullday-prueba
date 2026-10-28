/* "Viaja sin estrés": las seis promesas de la marca.
   Se muestran en la portada (íconos grandes) y en cada tour (íconos pequeños).
   "corto" es la versión breve que usan las páginas de tours; si no hay, se usa "texto". */

export type Promesa = { icono: string; titulo: string; texto: string; corto?: string };

export const PROMESAS: Promesa[] = [
  { icono: "/iconos/traslado.webp", titulo: "Te recogemos", texto: "Traslados en tierra en cada destino." },
  { icono: "/iconos/chat.webp", titulo: "Hablas con personas", texto: "Chat directo con el equipo de cada zona." },
  { icono: "/iconos/guia-local.webp", titulo: "Guías locales", texto: "Gente de cada región que conoce su tierra." },
  { icono: "/iconos/cuidado-24-7.webp", titulo: "Te cuidamos 24/7", texto: "Asistente y equipo pendientes de tu viaje." },
  { icono: "/iconos/precio-claro.webp", titulo: "Precio claro", texto: "Lo que ves es lo que pagas. Sin recargos ni letra pequeña." },
  {
    icono: "/iconos/pago-seguro.webp",
    titulo: "Pago seguro",
    texto: "Reservas con el 30 % y pagas el resto 15 días antes, con tarjeta, PSE o Nequi.",
    corto: "Reservas con el 30 % y pagas el resto 15 días antes.",
  },
];

// Título de la sección en la portada
export const TEXTO_PROMESAS = {
  titulo: "Viaja sin estrés",
  intro: "Tú pones las ganas. Nosotros, todo lo que pasa en tierra.",
};
