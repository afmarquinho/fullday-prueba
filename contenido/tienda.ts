/* =====================================================================
   TIENDA. Todo el contenido de la tienda vive aquí.
   Para sumar un producto: copiar un bloque de PRODUCTOS y cambiar sus textos.
   Precios DE EJEMPLO. Talleres, materiales y "lo que recibe" están POR CONFIRMAR con cada artesano.
   forma = ilustración provisional (componentes/tienda/formas.ts) mientras llega la foto real.
   ===================================================================== */

export type IdLinea = "marca" | "amazonas" | "caribe" | "centro";
export type IdTipo = "ropa" | "joyeria" | "tallas" | "tejidos" | "hogar";

export const LINEAS: Record<IdLinea, { nombre: string; color: string }> = {
  marca: { nombre: "Marca Full Day", color: "#E2C06A" },
  amazonas: { nombre: "Amazonas", color: "#2E8B57" },
  caribe: { nombre: "Caribe", color: "#12908E" },
  centro: { nombre: "Centro", color: "#E8A33D" },
};

export const TIPOS: Record<IdTipo, string> = { ropa: "Ropa", joyeria: "Joyería", tallas: "Tallas", tejidos: "Tejidos", hogar: "Hogar y viaje" };

const RECIBE = "Por definir con el taller"; // se publica cuando cerremos cada acuerdo

export type Producto = {
  id: string;
  linea: IdLinea;
  tipo: IdTipo;
  forma: string;
  foto?: string;
  nombre: string;
  precio: number;
  quien: string;
  materiales: string;
  tiempo: string;
  recibe: string;
  historia: string;
  opciones?: Record<string, string[]>; // Talla, Color, Animal…: se eligen en la ficha
};

export const PRODUCTOS: Producto[] = [
  {
    id: "camiseta-aguila",
    linea: "marca",
    tipo: "ropa",
    forma: "camiseta",
    nombre: "Camiseta Águila",
    precio: 79000,
    quien: "Diseño Full Day · confección en Colombia",
    materiales: "Algodón orgánico, tinta al agua",
    tiempo: "Tiraje corto",
    recibe: "—",
    historia: "El águila pescadora de la marca, con la franja del ojo que es un río. Para el que volvió y quiere que se note.",
    opciones: { Talla: ["S", "M", "L", "XL"], Color: ["Noche", "Crema"] },
  },
  {
    id: "gorra-rio",
    linea: "marca",
    tipo: "ropa",
    forma: "gorra",
    nombre: "Gorra Río",
    precio: 65000,
    quien: "Diseño Full Day · bordado en Bogotá",
    materiales: "Dril de algodón, bordado",
    tiempo: "Tiraje corto",
    recibe: "—",
    historia: "Bordada con el patrón del río. Visera curva para el sol del Caribe y del Amazonas.",
    opciones: { Color: ["Noche", "Arena"] },
  },
  {
    id: "termo",
    linea: "marca",
    tipo: "hogar",
    forma: "termo",
    nombre: "Termo Full Day 500 ml",
    precio: 89000,
    quien: "Diseño Full Day",
    materiales: "Acero inoxidable, doble pared",
    tiempo: "Bajo pedido",
    recibe: "—",
    historia: "Frío 24 horas, caliente 12. Lo llenas en el hotel y te dura el día completo.",
  },
  {
    id: "stickers",
    linea: "marca",
    tipo: "hogar",
    forma: "stickers",
    nombre: "Stickers de viaje (6)",
    precio: 15000,
    quien: "Diseño Full Day",
    materiales: "Vinilo resistente al agua",
    tiempo: "Bajo pedido",
    recibe: "—",
    historia: "El águila, las tres hojas de la cresta y una por cada zona. Para el termo, la maleta o el portátil.",
  },
  {
    id: "tote",
    linea: "marca",
    tipo: "hogar",
    forma: "tote",
    nombre: "Bolsa de tela",
    precio: 45000,
    quien: "Diseño Full Day · estampado en Bogotá",
    materiales: "Lona de algodón",
    tiempo: "Tiraje corto",
    recibe: "—",
    historia: "Para el mercado de Leticia, la playa o el día a día. Reemplaza las bolsas plásticas del viaje.",
  },
  {
    id: "buff",
    linea: "marca",
    tipo: "ropa",
    forma: "buff",
    nombre: "Buff Full Day",
    precio: 39000,
    quien: "Diseño Full Day",
    materiales: "Tela técnica con protección solar",
    tiempo: "Tiraje corto",
    recibe: "—",
    historia: "Cuello, pañoleta o gorro. Protege del sol en la lancha y del viento en el páramo.",
  },
  {
    id: "sudadera",
    linea: "marca",
    tipo: "ropa",
    forma: "sudadera",
    nombre: "Sudadera con capucha",
    precio: 149000,
    quien: "Diseño Full Day · confección en Colombia",
    materiales: "Algodón perchado",
    tiempo: "Tiraje corto",
    recibe: "—",
    historia: "Para las mañanas frías de Bogotá y los vuelos largos de regreso a casa.",
    opciones: { Talla: ["S", "M", "L", "XL"] },
  },
  {
    id: "poncho",
    linea: "marca",
    tipo: "ropa",
    forma: "poncho",
    nombre: "Poncho impermeable",
    precio: 69000,
    quien: "Diseño Full Day",
    materiales: "Nailon impermeable, plegable en su bolsa",
    tiempo: "Bajo pedido",
    recibe: "—",
    historia: "En la selva llueve casi todos los días. Cabe en el bolsillo y te deja seguir caminando.",
  },
  {
    id: "cuaderno",
    linea: "marca",
    tipo: "hogar",
    forma: "cuaderno",
    nombre: "Cuaderno de viaje",
    precio: 35000,
    quien: "Diseño Full Day",
    materiales: "Papel reciclado, tapa dura",
    tiempo: "Bajo pedido",
    recibe: "—",
    historia: "Con una página por día y el mapa de las tres zonas para anotar tu ruta.",
  },
  {
    id: "postales",
    linea: "marca",
    tipo: "hogar",
    forma: "postales",
    nombre: "Postales ilustradas (5)",
    precio: 20000,
    quien: "Diseño Full Day",
    materiales: "Cartulina mate",
    tiempo: "Bajo pedido",
    recibe: "—",
    historia: "Las ilustraciones de cada destino, como los carteles de viaje de antes.",
  },
  {
    id: "collar-semillas",
    linea: "amazonas",
    tipo: "joyeria",
    forma: "collar",
    nombre: "Collar de semillas",
    precio: 120000,
    quien: "Artesana ticuna · Leticia (por confirmar)",
    materiales: "Semillas de huayruro y achira, fibra de chambira",
    tiempo: "2 días",
    recibe: RECIBE,
    historia: "Cada semilla se recoge del suelo de la selva y se ensarta a mano. Ninguna es de especie protegida.",
  },
  {
    id: "aretes-semillas",
    linea: "amazonas",
    tipo: "joyeria",
    forma: "aretes",
    nombre: "Aretes de semillas",
    precio: 55000,
    quien: "Artesana ticuna · Leticia (por confirmar)",
    materiales: "Semillas de la selva, ganchos de acero quirúrgico",
    tiempo: "1 día",
    recibe: RECIBE,
    historia: "Livianos y de colores naturales: cada par sale distinto porque cada semilla es distinta.",
  },
  {
    id: "delfin-tallado",
    linea: "amazonas",
    tipo: "tallas",
    forma: "delfin",
    nombre: "Delfín rosado tallado",
    precio: 180000,
    quien: "Tallador de Leticia (por confirmar)",
    materiales: "Madera de árbol caído, acabado con aceite",
    tiempo: "5 días",
    recibe: RECIBE,
    historia: "El delfín rosado del río Amazonas, tallado en madera que ya estaba en el suelo. Ningún árbol se corta para hacerlo.",
  },
  {
    id: "tallas-selva",
    linea: "amazonas",
    tipo: "tallas",
    forma: "tallas",
    nombre: "Tallas de la selva",
    precio: 150000,
    quien: "Talladores de Leticia (por confirmar)",
    materiales: "Madera de árbol caído, acabado con aceite",
    tiempo: "5 días",
    recibe: RECIBE,
    historia: "Jaguar, tucán o tortuga, tallados a mano en madera que ya estaba en el suelo.",
    opciones: { Animal: ["Jaguar", "Tucán", "Tortuga"] },
  },
  {
    id: "canasto-chambira",
    linea: "amazonas",
    tipo: "tejidos",
    forma: "canasto",
    nombre: "Canasto tejido",
    precio: 150000,
    quien: "Artesanas ticuna (por confirmar)",
    materiales: "Chambira y yaré",
    tiempo: "1 semana",
    recibe: RECIBE,
    historia: "Tejido en espiral, la misma técnica con la que se guardan las semillas y la fariña en la comunidad.",
  },
  {
    id: "sombrero-vueltiao",
    linea: "caribe",
    tipo: "tejidos",
    forma: "sombrero",
    nombre: "Sombrero vueltiao 19 vueltas",
    precio: 260000,
    quien: "Artesanos zenú · Tuchín (por confirmar)",
    materiales: "Caña flecha trenzada",
    tiempo: "1 a 2 semanas",
    recibe: RECIBE,
    historia: "Símbolo cultural de Colombia. Las vueltas son las trenzas de caña flecha: entre más, más fino el tejido.",
  },
  {
    id: "mochila-wayuu",
    linea: "caribe",
    tipo: "tejidos",
    forma: "mochila",
    nombre: "Mochila wayuu",
    precio: 320000,
    quien: "Tejedora wayuu · La Guajira (por confirmar)",
    materiales: "Hilo de algodón, tejida en crochet",
    tiempo: "3 a 4 semanas",
    recibe: RECIBE,
    historia: "Los dibujos (kanaas) cuentan la historia de quien la teje. Cada mochila es única y viene con el nombre de su tejedora.",
  },
  {
    id: "filigrana-mompox",
    linea: "caribe",
    tipo: "joyeria",
    forma: "filigrana",
    nombre: "Aretes en filigrana de Mompox",
    precio: 180000,
    quien: "Orfebre de Mompox (por confirmar)",
    materiales: "Plata en hilos finísimos, trabajada a mano",
    tiempo: "1 a 2 semanas",
    recibe: RECIBE,
    historia: "Mompox es la capital de la filigrana: hilos de plata más delgados que un cabello, torcidos y soldados uno por uno.",
  },
];

// Cómo se entrega: la entrega en el hotel solo existe si hay un tour en el planner
export const ENVIO = { nacional: 15000, dias: "2 a 5 días hábiles", maxPorProducto: 9 };

/* Textos fijos de la página /tienda */
export const PAGINA_TIENDA = {
  ceja: "Tienda Full Day",
  titulo: "Hecho a mano, con nombre propio.",
  texto: "Ropa de la marca y artesanía de las comunidades que visitas. Cada pieza dice quién la hizo y cuánto recibe.",
  aviso: "Maqueta: precios de ejemplo e ilustraciones provisionales",
  entrega: [
    { titulo: "En tu hotel", texto: "Si tienes un tour en tu planner, te lo entregamos el día que llegas. Sin costo." },
    { titulo: "Envío nacional", texto: `A cualquier ciudad de Colombia en ${ENVIO.dias}.` },
    { titulo: "Envío internacional", texto: "En estudio. Por ahora, llévalo contigo desde el hotel.", enEstudio: true },
  ],
  proximamente:
    "Ruanas y vasijas de Ráquira del centro del país, hamacas de chambira y de San Jacinto, máscaras ticuna (con permiso de la comunidad) y pulseras de chambira. Los sumamos cuando cerremos cada acuerdo con los talleres.",
  noVendemos: [
    "Nada hecho con fauna silvestre: plumas, colmillos, pieles, conchas ni semillas protegidas.",
    "Nada «estilo indígena» hecho en serie: si dice comunidad, es de esa comunidad.",
    "Ninguna pieza sin ficha: quién la hizo, con qué y en cuánto tiempo.",
    "Ningún diseño de una comunidad sin su permiso.",
  ],
};
