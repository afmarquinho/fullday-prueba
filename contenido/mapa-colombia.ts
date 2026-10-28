/* Mapa isométrico de Colombia (sección "Aventura completa" de la portada).
   Las piezas son recortes del mapa base en su posición exacta, en píxeles de la imagen de 1600 × 1986.
   Para sumar un destino: agrega su pieza (y sus edificios en "extras") y su entrada en ZONAS_MAPA. */

export const MAPA_BASE = { img: "/mapa/base.webp", ancho: 1600, alto: 1986 };

export type Pieza = { x: number; y: number; w: number; h: number; img: string | null; extras: Extra[] };
// mar = barco: se queda quieto en el agua cuando la zona se activa
export type Extra = { x: number; y: number; w: number; h: number; img: string; mar?: boolean };

const P = "/mapa/piezas/";

export const PIEZAS: Record<string, Pieza> = {
  cartagena: {
    x: 558,
    y: 391,
    w: 135,
    h: 114,
    img: P + "cartagena.webp",
    extras: [
      { x: 452, y: 440, w: 35, h: 43, img: P + "cartagena-1.webp", mar: true },
      { x: 516, y: 422, w: 30, h: 62, img: P + "cartagena-2.webp" },
      { x: 529, y: 464, w: 39, h: 46, img: P + "cartagena-3.webp" },
      { x: 604, y: 486, w: 44, h: 35, img: P + "cartagena-4.webp" },
      { x: 688, y: 464, w: 30, h: 46, img: P + "cartagena-5.webp" },
      { x: 699, y: 449, w: 40, h: 35, img: P + "cartagena-6.webp" },
    ],
  },
  "santa-marta": {
    x: 735,
    y: 334,
    w: 140,
    h: 121,
    img: P + "santa-marta.webp",
    extras: [
      { x: 640, y: 318, w: 29, h: 42, img: P + "santa-marta-1.webp", mar: true },
      { x: 691, y: 388, w: 33, h: 45, img: P + "santa-marta-2.webp" },
      { x: 732, y: 418, w: 31, h: 48, img: P + "santa-marta-3.webp" },
      { x: 847, y: 443, w: 32, h: 22, img: P + "santa-marta-4.webp" },
      { x: 890, y: 402, w: 25, h: 31, img: P + "santa-marta-5.webp" },
    ],
  },
  bogota: {
    x: 627,
    y: 896,
    w: 170,
    h: 176,
    img: P + "bogota.webp",
    extras: [
      { x: 594, y: 1014, w: 24, h: 64, img: P + "bogota-1.webp" },
      { x: 617, y: 1050, w: 30, h: 50, img: P + "bogota-2.webp" },
      { x: 648, y: 1082, w: 40, h: 30, img: P + "bogota-3.webp" },
      { x: 740, y: 1074, w: 37, h: 38, img: P + "bogota-4.webp" },
      { x: 777, y: 1052, w: 39, h: 46, img: P + "bogota-5.webp" },
      { x: 802, y: 1030, w: 40, h: 44, img: P + "bogota-6.webp" },
    ],
  },
  leticia: {
    x: 1010,
    y: 1384,
    w: 190,
    h: 176,
    img: P + "leticia.webp",
    extras: [
      { x: 952, y: 1487, w: 42, h: 42, img: P + "leticia-1.webp" },
      { x: 964, y: 1533, w: 38, h: 25, img: P + "leticia-2.webp" },
      { x: 1034, y: 1529, w: 45, h: 49, img: P + "leticia-3.webp" },
      { x: 1143, y: 1532, w: 22, h: 46, img: P + "leticia-4.webp" },
      { x: 1200, y: 1497, w: 52, h: 61, img: P + "leticia-5.webp" },
      { x: 1218, y: 1506, w: 38, h: 23, img: P + "leticia-6.webp" },
    ],
  },
  // San Andrés no tiene pieza propia (está en el mar): solo sus extras
  "san-andres": {
    x: 255,
    y: 320,
    w: 170,
    h: 150,
    img: null,
    extras: [
      { x: 222, y: 468, w: 32, h: 20, img: P + "san-andres-1.webp", mar: true },
      { x: 267, y: 364, w: 37, h: 44, img: P + "san-andres-2.webp" },
      { x: 283, y: 424, w: 33, h: 32, img: P + "san-andres-3.webp" },
      { x: 336, y: 442, w: 27, h: 36, img: P + "san-andres-4.webp", mar: true },
      { x: 384, y: 376, w: 22, h: 16, img: P + "san-andres-5.webp" },
    ],
  },
};

/* Destinos de la lista y de las tarjetas del mapa.
   precio null = "Próximamente" (todavía en estudio). */
export type ZonaMapa = {
  id: string;
  color: string;
  linea: string;
  nombre: string;
  texto: string;
  precio: string | null;
  dias: string | null;
  tour: string | null;
};

export const ZONAS_MAPA: ZonaMapa[] = [
  {
    id: "leticia",
    color: "#2E8B57",
    linea: "Amazonas",
    nombre: "Leticia",
    texto: "Selva, río y tres países en cinco días. Delfines rosados al atardecer.",
    precio: "$2.400.000",
    dias: "5 días",
    tour: "/tours/amazonas",
  },
  {
    id: "bogota",
    color: "#E8A33D",
    linea: "Páramo",
    nombre: "Bogotá",
    texto: "La capital, Monserrate y la Catedral de Sal de Zipaquirá.",
    precio: "$450.000",
    dias: "2 días",
    tour: "/tours/paramo",
  },
  {
    id: "cartagena",
    color: "#12908E",
    linea: "Marina",
    nombre: "Cartagena",
    texto: "Murallas, Torre del Reloj e islas del Rosario.",
    precio: "$510.000",
    dias: "3 días",
    tour: "/tours/marina",
  },
  {
    id: "santa-marta",
    color: "#12908E",
    linea: "Marina",
    nombre: "Santa Marta",
    texto: "La Sierra Nevada que baja al mar y las playas del Tayrona.",
    precio: "$510.000",
    dias: "3 días",
    tour: "/tours/marina",
  },
  {
    id: "san-andres",
    color: "#A9B5AE",
    linea: "Próximamente",
    nombre: "San Andrés",
    texto: "El mar de siete colores. Lo estamos preparando.",
    precio: null,
    dias: null,
    tour: null,
  },
];

/* Rutas del viaje completo según la ciudad de llegada, en orden.
   Bogotá es el centro: todas las líneas salen de ahí (Caribe: Cartagena y luego Santa Marta por tierra).
   San Andrés queda fuera hasta que se lance. */
export const LLEGADAS: { id: string; nombre: string; rutas: string[][] }[] = [
  {
    id: "bogota",
    nombre: "Bogotá",
    rutas: [
      ["bogota", "leticia"],
      ["bogota", "cartagena", "santa-marta"],
    ],
  },
  {
    id: "cartagena",
    nombre: "Cartagena",
    rutas: [
      ["cartagena", "santa-marta"],
      ["cartagena", "bogota", "leticia"],
    ],
  },
  {
    id: "santa-marta",
    nombre: "Santa Marta",
    rutas: [
      ["santa-marta", "cartagena"],
      ["santa-marta", "bogota", "leticia"],
    ],
  },
];

export const TEXTO_MAPA = {
  ceja: "Aventura completa",
  titulo: "Toca una zona y arma tu viaje",
  intro: "Bogotá, Amazonas y el Caribe en un solo viaje. Toca el mapa o la lista: cada zona se ilumina y te muestra qué incluye.",
  repetir: "↻ Ver la ruta otra vez",
};
