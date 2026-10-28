/* Páginas Expedition y Xanadu (/tours/expedition y /tours/xanadu).
   Se entra desde su banner en la portada y se elige la zona. Cada zona abre su tour con el
   pack de partida puesto (contenido/armador.ts → PARTIDAS); el nivel se recalcula con lo que el cliente arme. */
import type { IdZona } from "./tours";

export type PaginaNivel = {
  nombre: string;
  color: string;
  iso: string;
  foto: string;
  ceja: string;
  frase: string;
  pasos: { titulo: string; texto: string }[];
  zonas: { zona: IdZona; texto: string }[];
  partida: "expedition" | "premium"; // pack con el que abre el armador del tour
  empresas?: { titulo: string; ceja: string; texto: string; href: string };
};

export const PAGINAS_NIVEL: Record<"expedition" | "xanadu", PaginaNivel> = {
  expedition: {
    nombre: "Expedition",
    color: "#E8622A",
    iso: "/marca/iso-expedition.svg",
    foto: "/banners/expedition-h.webp",
    ceja: "Aventura extrema · todo el país",
    frase: "Río, cuerdas, selva y montaña. Lo armas sobre cualquier zona, con operadores certificados.",
    pasos: [
      { titulo: "Eliges la zona", texto: "Amazonas, Marina o Páramo. Empiezas con dos aventuras ya puestas." },
      { titulo: "Ajustas tu aventura", texto: "Sumas o quitas actividades; el armador te avisa si te faltan días." },
      {
        titulo: "Pagas en línea",
        texto: "Precio fijo: reservas con el 30 %. Antes del viaje recibes la ficha física, la lista de equipo y la exoneración.",
      },
    ],
    zonas: [
      {
        zona: "amazonas",
        texto: "Canopy, kayak y noche en hamaca en una reserva privada a orillas del Amazonas. Suma $650.000 por persona a la ruta",
      },
      { zona: "marina", texto: "Buceo, kitesurf, tubing y Ciudad Perdida" },
      { zona: "paramo", texto: "Rafting en Tobia, parapente y escalada en Suesca" },
    ],
    partida: "expedition",
  },
  xanadu: {
    nombre: "Xanadu",
    color: "#D9C9A3",
    iso: "/marca/iso-xanadu.svg",
    foto: "/banners/xanadu-h.webp",
    ceja: "Premium y empresas",
    frase: "Hotel boutique, guía y vehículo solo para ti, cocina de chef y experiencias que no están en ningún catálogo.",
    pasos: [
      { titulo: "Eliges la zona", texto: "Empiezas con hotel boutique, cocina de chef, vehículo exclusivo y guía bilingüe privado." },
      { titulo: "Lo ajustamos a ti", texto: "Horarios a tu medida y una persona del equipo para ti 24/7." },
      { titulo: "Te cotizamos", texto: "Recibes el precio final antes de pagar. Puedes sumar encuentros con sabedores ancestrales." },
    ],
    zonas: [
      { zona: "amazonas", texto: "Lodge, lancha privada y delfines sin otros turistas" },
      { zona: "marina", texto: "Hotel amurallado, velero privado y cena en la muralla" },
      { zona: "paramo", texto: "Conductor y guía privados y cena de autor" },
    ],
    partida: "premium",
    empresas: {
      ceja: "Xanadu Empresarial",
      titulo: "Para tu empresa",
      texto: "Grupos de 10 a 40, salón, integración y factura",
      href: "/tours/paramo?nivel=empresarial",
    },
  },
};
