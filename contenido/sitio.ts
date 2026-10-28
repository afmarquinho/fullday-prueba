/* Datos generales del sitio: menús, pie de página y contacto.
   Para cambiar un enlace del menú, edita la lista correspondiente. */

export type Enlace = { texto: string; href: string };

// Menú de la portada (la página principal)
export const MENU_PORTADA: Enlace[] = [
  { texto: "Amazonas", href: "/tours/amazonas" },
  { texto: "Marina", href: "/tours/marina" },
  { texto: "Páramo", href: "/tours/paramo" },
  { texto: "Aventura completa", href: "/#aventura" },
  { texto: "Galería", href: "/galeria" },
  { texto: "Tienda", href: "/tienda" },
  { texto: "Hablemos", href: "/#cierre" },
];

// Menú de las páginas de tours: suma Expedition y Xanadu
export const MENU_TOURS: Enlace[] = [
  { texto: "Amazonas", href: "/tours/amazonas" },
  { texto: "Marina", href: "/tours/marina" },
  { texto: "Páramo", href: "/tours/paramo" },
  { texto: "Aventura completa", href: "/tours/completa" },
  { texto: "Expedition", href: "/tours/expedition" },
  { texto: "Xanadu", href: "/tours/xanadu" },
  { texto: "Galería", href: "/galeria" },
  { texto: "Tienda", href: "/tienda" },
];

// Menú de galería y tienda
export const MENU_GENERAL: Enlace[] = [
  { texto: "Amazonas", href: "/tours/amazonas" },
  { texto: "Marina", href: "/tours/marina" },
  { texto: "Páramo", href: "/tours/paramo" },
  { texto: "Aventura completa", href: "/tours/completa" },
  { texto: "Galería", href: "/galeria" },
  { texto: "Tienda", href: "/tienda" },
];

export const LEMA = "Aventura en Colombia, cada día completo.";

// Pie de página grande de la portada
export const PIE = {
  zonas: [
    { texto: "Amazonas", href: "/tours/amazonas" },
    { texto: "Marina", href: "/tours/marina" },
    { texto: "Páramo", href: "/tours/paramo" },
    { texto: "Aventura completa", href: "/tours/completa" },
    { texto: "Galería", href: "/galeria" },
    { texto: "Tienda", href: "/tienda" },
  ],
  // Páginas de ayuda: aún no existen (van a "#")
  ayuda: [
    { texto: "Cómo funciona", href: "#" },
    { texto: "Preguntas frecuentes", href: "#" },
    { texto: "Términos y cancelaciones", href: "#" },
    { texto: "Hablemos", href: "#" },
  ],
  // Redes: faltan los enlaces reales
  redes: { instagram: "#", tiktok: "#", whatsapp: "#" },
  // El RNT de Full Day Tours se publica aquí cuando exista (es obligatorio mostrarlo)
  legal: "© 2026 Full Day Tours · RNT [NÚMERO]",
  nota: "Precios en pesos colombianos, por persona.",
};
