/* Contenido de la portada (página principal): escena del héroe, banners de zonas,
   tarjetas de nivel en celular y carrusel "Así se vive cada día".
   Las imágenes viven en public/portada, public/banners y public/galeria. */

/* ---------- Héroe: escena por capas ----------
   vel  = qué tanto se queda atrás con el scroll (1 = se mueve con la página, 0 = se queda quieta)
   prof = qué tanto se mueve con el mouse (0 = nada, 1 = mucho)
   pos  = lugar de la imagen dentro del lienzo (en %), si no ocupa todo el lienzo
   Rotar la escena cada 3 semanas = cambiar esta lista y el fondo. */
export type CapaPortada = {
  nombre: string;
  img: string;
  vel: number;
  prof: number;
  pos?: { left: number; top: number; width: number };
};

export const ESCENA_PORTADA = {
  nombre: "Amazonas: Leticia · Tres Fronteras",
  fondo: "/portada/amazonas/fondo.webp",
  colorFondo: "#E88A7A", // se ve mientras carga el fondo
  capas: [
    { nombre: "cielo", img: "/portada/amazonas/cielo.webp", vel: 0.85, prof: 0.08 },
    { nombre: "neblina", img: "/portada/amazonas/neblina.webp", vel: 0.78, prof: 0.15 },
    { nombre: "aves", img: "/portada/amazonas/aves.webp", vel: 0.76, prof: 0.2, pos: { left: 30.999, top: 34.943, width: 22.593 } },
    // Bandada más arriba: la misma imagen de aves, espejada y más pequeña (ver .pc-capa-aves-altas en Heroe.css)
    { nombre: "aves-altas", img: "/portada/amazonas/aves.webp", vel: 0.82, prof: 0.2, pos: { left: 30.999, top: 34.943, width: 22.593 } },
    { nombre: "lejana", img: "/portada/amazonas/lejana.webp", vel: 0.72, prof: 0.25 },
    { nombre: "rio", img: "/portada/amazonas/rio.webp", vel: 0.55, prof: 0.3 },
    { nombre: "intermedios", img: "/portada/amazonas/intermedios.webp", vel: 0.5, prof: 0.45 },
    { nombre: "delfin", img: "/portada/amazonas/delfin.webp", vel: 0.45, prof: 0.5, pos: { left: 49.749, top: 67.529, width: 15.086 } },
    { nombre: "lianas", img: "/portada/amazonas/lianas.webp", vel: 1, prof: 0.8 },
    { nombre: "arbol", img: "/portada/amazonas/arbol.webp", vel: 0.9, prof: 0.7 },
    { nombre: "hojas", img: "/portada/amazonas/hojas.webp", vel: 0, prof: 0.9 },
  ] as CapaPortada[],
};

export const TEXTO_PORTADA = {
  titulo: "Full Day Tours: Amazonas", // lo leen buscadores y lectores de pantalla (el logo es dibujo)
  frase: ["Tres destinos, cero estrés.", "Cada día, completo."],
  boton: { texto: "Arma tu viaje", href: "#aventura" },
  chat: "o escríbenos por chat",
  // Enlaces de la esquina inferior derecha; "actual" marca la zona de la escena
  zonas: [
    { texto: "01 Amazonas", href: "/tours/amazonas", actual: true },
    { texto: "02 Marina", href: "/tours/marina" },
    { texto: "03 Páramo", href: "/tours/paramo" },
  ],
};

/* ---------- Banners de zonas ----------
   dato = línea corta debajo de la frase: "antes" + **fuerte** + "despues".
   apilado = texto a la izquierda en columna (Expedition y Xanadu).
   soloPc = en celular se reemplaza por las tarjetas de nivel. */
export type BannerZona = {
  href: string;
  img: string;
  imgMovil?: string;
  alt: string;
  posicion: string; // object-position de la foto en escritorio
  etiqueta: string;
  etiquetaClara?: boolean; // etiqueta crema en lugar de dorada
  titulo: string;
  tamanoTitulo: string;
  colorTitulo?: string;
  sombraTitulo?: boolean; // sombra más fuerte cuando el título va sobre una foto clara
  frase: string;
  dato: { antes?: string; fuerte: string; despues?: string };
  boton: string;
  apilado?: boolean;
  soloPc?: boolean;
  alto?: number;
};

export const BANNERS: BannerZona[] = [
  {
    href: "/tours/amazonas",
    img: "/banners/amazonas-h.webp",
    imgMovil: "/banners/amazonas-v.webp",
    alt: "Canoa al amanecer en un caño de la selva amazónica, con una maloca y un guacamayo",
    posicion: "50% 55%",
    etiqueta: "01 · Leticia · Tres fronteras",
    titulo: "Amazon Jungle Tour",
    tamanoTitulo: "clamp(52px, 5.6vw, 80px)",
    frase: "Selva, río y tres países en cinco días.",
    dato: { antes: "Desde ", fuerte: "$2.400.000" },
    boton: "Ver tours",
  },
  {
    href: "/tours/marina",
    img: "/banners/marina-h.webp",
    alt: "Bahía de Santa Marta con rocas, palmas y la Sierra Nevada",
    posicion: "50% 62%",
    etiqueta: "02 · Cartagena · Santa Marta",
    titulo: "Marina",
    tamanoTitulo: "112px",
    frase: "Islas, murallas y selva que baja al mar.",
    dato: { antes: "Desde ", fuerte: "$510.000" },
    boton: "Ver tours",
  },
  {
    href: "/tours/paramo",
    img: "/banners/paramo-h.webp",
    alt: "Montañas de Bogotá con Monserrate y un cóndor",
    posicion: "50% 38%",
    etiqueta: "03 · Bogotá · Zipaquirá",
    titulo: "Páramo",
    tamanoTitulo: "112px",
    frase: "La capital, la sal y la montaña.",
    dato: { antes: "Desde ", fuerte: "$450.000" },
    boton: "Ver tours",
  },
  {
    href: "/tours/completa",
    img: "/banners/completa-h.webp",
    imgMovil: "/banners/completa-v.webp",
    alt: "Águila sobre las murallas de Cartagena, los Andes y el Amazonas",
    posicion: "50% 40%",
    etiqueta: "04 · Bogotá · Amazonas · Caribe",
    etiquetaClara: true,
    titulo: "Aventura completa",
    tamanoTitulo: "96px",
    colorTitulo: "#E2C06A",
    frase: "Tres zonas en un solo viaje. Cada día, completo.",
    dato: { fuerte: "13 días", despues: " · ahorras 5 %" },
    boton: "Ver tour",
  },
  {
    href: "/tours/expedition",
    img: "/banners/expedition-h.webp",
    imgMovil: "/banners/expedition-v.webp",
    alt: "Jaguar sobre una roca mirando un cañón con un río de rápidos",
    posicion: "70% 20%",
    etiqueta: "05 · Aventura extrema · todo el país",
    etiquetaClara: true,
    titulo: "Expedition",
    tamanoTitulo: "84px",
    colorTitulo: "#E8622A",
    frase: "Rafting, canopy, buceo y noches de campamento, con operadores certificados.",
    dato: { fuerte: "A tu medida", despues: " · te lo cotizamos" },
    boton: "Ver aventuras",
    apilado: true,
    soloPc: true,
  },
  {
    href: "/tours/xanadu",
    img: "/banners/xanadu-h.webp",
    imgMovil: "/banners/xanadu-v.webp",
    alt: "Garza blanca en una laguna caribeña al atardecer",
    posicion: "75% 20%", // más arriba no le corta la cabeza a la garza
    etiqueta: "06 · Premium y empresas",
    etiquetaClara: true,
    titulo: "Xanadu",
    tamanoTitulo: "96px",
    colorTitulo: "#D9C9A3",
    sombraTitulo: true,
    frase: "Todo privado, los mejores hoteles y experiencias exclusivas. También viajes de empresa.",
    dato: { fuerte: "A tu medida", despues: " · te lo cotizamos" },
    boton: "Ver Xanadu",
    apilado: true,
    soloPc: true,
    alto: 540,
  },
];

/* ---------- Celular: Expedition y Xanadu como tarjetas con accesos por zona ---------- */
export const NIVELES_MOVIL = {
  ceja: "Otra forma de viajar",
  titulo: "¿Más aventura o más lujo?",
  tarjetas: [
    {
      nombre: "Expedition",
      ceja: "Aventura extrema",
      color: "#E8622A",
      img: "/banners/expedition-v.webp",
      alt: "Jaguar sobre una roca mirando un cañón",
      texto: "Rafting, canopy, buceo, parapente y noches de campamento, con operadores certificados.",
      enlaces: [
        { texto: "Amazonas", href: "/tours/amazonas?nivel=expedition" },
        { texto: "Marina", href: "/tours/marina?nivel=expedition" },
        { texto: "Páramo", href: "/tours/paramo?nivel=expedition" },
      ],
    },
    {
      nombre: "Xanadu",
      ceja: "Premium y empresas",
      color: "#D9C9A3",
      img: "/banners/xanadu-v.webp",
      alt: "Garza blanca en una laguna caribeña",
      texto: "Todo privado, los mejores hoteles y experiencias que no están en ningún catálogo. También viajes de empresa.",
      enlaces: [
        { texto: "Amazonas", href: "/tours/amazonas?nivel=premium" },
        { texto: "Marina", href: "/tours/marina?nivel=premium" },
        { texto: "Páramo", href: "/tours/paramo?nivel=premium" },
        { texto: "Para empresas", href: "/tours/paramo?nivel=empresarial" },
      ],
    },
  ],
};

/* ---------- Carrusel "Así se vive cada día" ----------
   tipo "escena" = el primer cuadro reutiliza las capas vivas del héroe (hasta tener un video real).
   img vacía = cuadro rayado "[Foto o video]" hasta que llegue la foto real. */
export type CuadroCarrusel = { tipo: "escena" | "foto"; img?: string; titulo: string; zona: string };

export const CARRUSEL = {
  titulo: "Así se vive cada día",
  cuadros: [
    { tipo: "escena", titulo: "Leticia en 20 segundos", zona: "Amazonas" },
    { tipo: "foto", img: "/galeria/amanecer-rio.webp", titulo: "06:00 · Amanecer en el río", zona: "Amazonas" },
    { tipo: "foto", titulo: "09:30 · Mercado de Leticia", zona: "Amazonas" },
    { tipo: "foto", img: "/banners/marina-h.webp", titulo: "07:00 · Tayrona", zona: "Marina" },
    { tipo: "foto", img: "/banners/paramo-h.webp", titulo: "17:40 · Monserrate", zona: "Páramo" },
    { tipo: "foto", titulo: "11:00 · Islas del Rosario", zona: "Marina" },
  ] as CuadroCarrusel[],
};

/* ---------- Cierre ---------- */
export const CIERRE = {
  titulo: "¿Cuál es tu próximo día completo?",
  texto: "Arma tu viaje en el planner o escríbenos y lo armamos contigo.",
  boton: { texto: "Armar mi viaje", href: "/tours/completa" },
  whatsapp: "Hablemos por WhatsApp",
};
