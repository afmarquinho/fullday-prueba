/* =====================================================================
   GALERÍA. Todo el contenido de la página /galeria vive aquí.
   Para sumar una foto: pon el archivo en public/galeria/ y escribe su ruta en "src".
   Si "src" está vacío se muestra el espacio de "foto por subir".
   forma: "alto" (4:5), "ancho" (16:10) o "cuadro" (1:1). tipo: "foto" o "video".
   ===================================================================== */

export type IdZonaGaleria = "amazonas" | "marina" | "paramo" | "expedition" | "xanadu";

export const ZONAS_GALERIA: Record<IdZonaGaleria, { nombre: string; color: string; tour: string }> = {
  amazonas: { nombre: "Amazonas", color: "#2E8B57", tour: "/tours/amazonas" },
  marina: { nombre: "Marina", color: "#12908E", tour: "/tours/marina" },
  paramo: { nombre: "Páramo", color: "#E8A33D", tour: "/tours/paramo" },
  expedition: { nombre: "Expedition", color: "#E0662E", tour: "/tours/expedition" },
  xanadu: { nombre: "Xanadu", color: "#C9A24A", tour: "/tours/xanadu" },
};

export const TIPOS_MEDIO = { foto: "Fotos", video: "Videos" };

export type Medio = {
  zona: IdZonaGaleria;
  tipo: "foto" | "video";
  forma: "alto" | "ancho" | "cuadro";
  src: string;
  titulo: string;
  lugar: string;
};

export const MEDIOS: Medio[] = [
  {
    zona: "amazonas",
    tipo: "foto",
    forma: "ancho",
    src: "/banners/amazonas-h.webp",
    titulo: "El río al amanecer",
    lugar: "Leticia · ilustración de la portada",
  },
  { zona: "amazonas", tipo: "foto", forma: "alto", src: "", titulo: "Delfines rosados en el lago Tarapoto", lugar: "Puerto Nariño · día 3" },
  { zona: "amazonas", tipo: "video", forma: "cuadro", src: "", titulo: "Canoa entre árboles inundados", lugar: "Lago Tarapoto · día 3" },
  { zona: "amazonas", tipo: "foto", forma: "alto", src: "", titulo: "Mercado nocturno", lugar: "Puerto Nariño · día 2" },
  { zona: "amazonas", tipo: "foto", forma: "cuadro", src: "", titulo: "Caminata con guía local", lugar: "Selva de Leticia · día 4" },
  { zona: "amazonas", tipo: "foto", forma: "ancho", src: "", titulo: "Tres países en una tarde", lugar: "Leticia, Tabatinga y Santa Rosa · día 4" },
  {
    zona: "marina",
    tipo: "foto",
    forma: "alto",
    src: "/banners/marina-v.webp",
    titulo: "Donde la selva baja al mar",
    lugar: "Santa Marta · ilustración de la portada",
  },
  { zona: "marina", tipo: "foto", forma: "ancho", src: "", titulo: "Ciudad amurallada al atardecer", lugar: "Cartagena · día 1" },
  { zona: "marina", tipo: "video", forma: "cuadro", src: "", titulo: "Lancha a Islas del Rosario", lugar: "Cartagena · día 2" },
  { zona: "marina", tipo: "foto", forma: "alto", src: "", titulo: "Playa de agua clara", lugar: "Islas del Rosario · día 2" },
  { zona: "marina", tipo: "foto", forma: "ancho", src: "", titulo: "La costa camino a Santa Marta", lugar: "Por tierra · día 3" },
  {
    zona: "paramo",
    tipo: "foto",
    forma: "alto",
    src: "/banners/paramo-v.webp",
    titulo: "Montaña y frailejones",
    lugar: "Altiplano · ilustración de la portada",
  },
  { zona: "paramo", tipo: "foto", forma: "ancho", src: "", titulo: "Bogotá desde Monserrate", lugar: "Bogotá · día 2" },
  { zona: "paramo", tipo: "foto", forma: "cuadro", src: "", titulo: "La Candelaria a pie", lugar: "Bogotá · día 2" },
  { zona: "paramo", tipo: "video", forma: "alto", src: "", titulo: "Catedral de Sal por dentro", lugar: "Zipaquirá · día 3" },
  { zona: "expedition", tipo: "foto", forma: "ancho", src: "/banners/expedition-h.webp", titulo: "Más aventura", lugar: "Expedition · ilustración" },
  { zona: "expedition", tipo: "video", forma: "cuadro", src: "", titulo: "Canopy sobre la selva", lugar: "Amazonas Expedition" },
  { zona: "expedition", tipo: "foto", forma: "alto", src: "", titulo: "Noche en hamaca en la reserva", lugar: "Amazonas Expedition" },
  { zona: "xanadu", tipo: "foto", forma: "ancho", src: "/banners/xanadu-h.webp", titulo: "Más lujo", lugar: "Xanadu · ilustración" },
  { zona: "xanadu", tipo: "foto", forma: "cuadro", src: "", titulo: "Cena de autor", lugar: "Xanadu Premium" },
];
