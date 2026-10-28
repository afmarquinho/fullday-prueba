/* Mapa isométrico de cada tour: qué es cada letra de la cuadrícula (contenido/tours.ts → mapa.filas).
   alto = altura de la losa en fracción del lado · agua = brilla y no varía de altura
   adorno = figura parada encima (ver ADORNOS). */

export type Tesela = { nombre: string; color: string; alto: number; agua?: boolean; adorno?: keyof typeof ADORNOS };

export const TESELAS: Record<string, Tesela> = {
  "~": { nombre: "agua", color: "#2C8C99", alto: 0.08, agua: true },
  l: { nombre: "lago", color: "#3FA7AF", alto: 0.1, agua: true },
  s: { nombre: "selva", color: "#2E7D4F", alto: 0.34, adorno: "arbol" },
  S: { nombre: "selva alta", color: "#276E45", alto: 0.42, adorno: "arboles" },
  v: { nombre: "campo", color: "#A9B85E", alto: 0.26 },
  p: { nombre: "playa", color: "#EBC98E", alto: 0.16 },
  P: { nombre: "playa con palmas", color: "#EBC98E", alto: 0.16, adorno: "palma" },
  c: { nombre: "pueblo", color: "#E9D9BC", alto: 0.36, adorno: "casas" },
  C: { nombre: "centro histórico", color: "#E7B66A", alto: 0.44, adorno: "torre" },
  m: { nombre: "montaña", color: "#6F8F68", alto: 0.8 },
  M: { nombre: "cumbre nevada", color: "#E8EEF0", alto: 1.25 },
  n: { nombre: "cerro con santuario", color: "#5E7F5A", alto: 1.15, adorno: "iglesia" },
  f: { nombre: "páramo", color: "#8FA77A", alto: 0.7, adorno: "frailejon" },
  a: { nombre: "aeropuerto", color: "#9AA6A0", alto: 0.14, adorno: "avion" },
};

/* Figuras paradas sobre las teselas: ancho y alto en fracción del lado, y su dibujo SVG. */
export const ADORNOS = {
  arbol: {
    ancho: 0.5,
    alto: 0.62,
    svg: '<svg viewBox="0 0 20 26"><rect x="9" y="17" width="2" height="9" fill="#5B3B24"/><ellipse cx="10" cy="11" rx="9" ry="10" fill="#3E9A5E"/><ellipse cx="7" cy="8" rx="4" ry="4" fill="#5BB97A" opacity=".7"/></svg>',
  },
  arboles: {
    ancho: 0.8,
    alto: 0.72,
    svg: '<svg viewBox="0 0 32 28"><rect x="8" y="19" width="2" height="9" fill="#5B3B24"/><ellipse cx="9" cy="13" rx="8" ry="10" fill="#2F8A52"/><rect x="22" y="17" width="2" height="11" fill="#5B3B24"/><ellipse cx="23" cy="10" rx="9" ry="10" fill="#3E9A5E"/><ellipse cx="20" cy="7" rx="4" ry="4" fill="#5BB97A" opacity=".7"/></svg>',
  },
  palma: {
    ancho: 0.55,
    alto: 0.8,
    svg: '<svg viewBox="0 0 22 32"><path d="M11 32 C11 22 12 16 11 10" stroke="#7A5532" stroke-width="2" fill="none"/><path d="M11 10 C6 6 2 8 0 11 C4 8 8 9 11 10 C9 5 5 3 2 3 C7 3 10 6 11 10 C13 5 17 3 21 4 C17 5 14 7 11 10 C15 8 19 9 22 12 C18 9 14 9 11 10Z" fill="#3E9A5E"/></svg>',
  },
  casas: {
    ancho: 0.72,
    alto: 0.48,
    svg: '<svg viewBox="0 0 30 20"><rect x="1" y="9" width="12" height="11" fill="#FFF7EA"/><path d="M0 10 L7 3 L14 10Z" fill="#D9774B"/><rect x="15" y="6" width="14" height="14" fill="#F3E3C8"/><path d="M14 7 L22 0 L30 7Z" fill="#C4623B"/><rect x="19" y="12" width="3" height="4" fill="#5B3B24"/></svg>',
  },
  torre: {
    ancho: 0.6,
    alto: 0.9,
    svg: '<svg viewBox="0 0 22 34"><rect x="2" y="16" width="18" height="18" fill="#FFF7EA"/><path d="M1 17 L11 9 L21 17Z" fill="#D9774B"/><rect x="8" y="4" width="6" height="14" fill="#F2D27E"/><path d="M7 5 L11 0 L15 5Z" fill="#C4623B"/><circle cx="11" cy="10" r="1.8" fill="#0B1F1A"/></svg>',
  },
  iglesia: {
    ancho: 0.42,
    alto: 0.6,
    svg: '<svg viewBox="0 0 16 22"><rect x="3" y="10" width="10" height="12" fill="#FFF7EA"/><rect x="6" y="3" width="4" height="9" fill="#FFF7EA"/><path d="M5 4 L8 0 L11 4Z" fill="#C4623B"/><rect x="7" y="15" width="2" height="4" fill="#5B3B24"/></svg>',
  },
  frailejon: {
    ancho: 0.32,
    alto: 0.5,
    svg: '<svg viewBox="0 0 12 20"><rect x="5" y="8" width="2.4" height="12" fill="#6B5A3E"/><circle cx="6" cy="6" r="5.5" fill="#C9C98F"/><circle cx="6" cy="6" r="3" fill="#E2E0A8"/></svg>',
  },
  avion: {
    ancho: 0.7,
    alto: 0.34,
    svg: '<svg viewBox="0 0 30 14"><path d="M2 8 L24 7 C28 7 30 8 28 9 L24 10 L2 9Z" fill="#FFF7EA"/><path d="M12 8 L8 1 L11 1 L18 8Z M12 9 L8 14 L11 14 L18 9Z" fill="#E9D9BC"/></svg>',
  },
};

// Medidas del mapa: grados de inclinación, px por tesela (máx y mín), aire arriba para cumbres y etiquetas
export const MEDIDAS_MAPA = { giro: 57, lado: 46, ladoMin: 20, colchonArriba: 1.1 };
