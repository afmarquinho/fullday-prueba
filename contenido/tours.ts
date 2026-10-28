/* =====================================================================
   TOURS. Todo el contenido de los tours vive aquí.
   Para sumar un tour: copiar un bloque de TOURS y cambiar sus textos, fotos y mapa.
   Los itinerarios, lo que incluye y las horas son BORRADOR: falta confirmarlos con cada operador.
   Solo precios públicos: los costos y márgenes NUNCA van en este repositorio.
   ===================================================================== */

export type IdZona = "amazonas" | "marina" | "paramo";
export type IdTour = IdZona | "completa";

export type Dia = {
  titulo: string;
  texto: string;
  horas: [hora: string, actividad: string][];
  paradas: string[]; // claves de mapa.paradas que se visitan ese día
};

/* Mapa isométrico del tour: cada letra de "filas" es una tesela (ver contenido/teselas.ts).
   paradas: x, y = columna y fila de la tesela. ruta: [parada, día al que pertenece ese tramo]. */
export type MapaTour = {
  nombre: string;
  filas: string[];
  paradas: Record<string, { x: number; y: number; nombre: string }>;
  ruta: [parada: string, dia: number][];
};

export type TourZona = {
  linea: string;
  nombre?: string; // nombre comercial; si no tiene, se usa el de la línea
  color: string;
  iso: string;
  foto: string; // foto vertical de la portada del tour
  fotoBanner: string;
  ceja: string;
  frase: string;
  precio: number; // precio público por persona de la ruta, en pesos
  dias: number;
  noches: number;
  clima: string;
  nivel: string;
  comidas?: "desayuno" | "media" | "completa";
  sumaExpedition?: number;
  itinerario: Dia[];
  mapa: MapaTour;
  incluye: { texto: string; porConfirmar?: boolean }[];
  noIncluye: string[];
  sueltos: { dias: string; nombre: string; texto: string; precio: number }[];
  galeria: { img: string | null; texto: string }[];
  preguntas: { pregunta: string; respuesta: string }[];
};

export const TOURS: Record<IdZona, TourZona> = {
  amazonas: {
    linea: "Amazonas",
    nombre: "Amazon Jungle Tour",
    color: "#2E8B57",
    iso: "/marca/iso-amazonas.svg",
    foto: "/banners/amazonas-v.webp",
    fotoBanner: "/banners/amazonas-h.webp",
    ceja: "Leticia · Tres fronteras",
    frase: "Selva, río y tres países en cinco días.",
    precio: 2400000,
    dias: 5,
    noches: 4,
    clima: "28 °C, selva",
    nivel: "Moderado",
    comidas: "completa", // comidas que trae el precio de la ruta (si no dice, solo desayuno)
    sumaExpedition: 650000, // Expedition: lo que se suma por persona a la ruta (Leo, 26 oct 2026)
    itinerario: [
      {
        titulo: "Llegas a Leticia",
        texto:
          "Te esperamos en el aeropuerto y te llevamos al hotel. En la tarde cruzas a pie la frontera para un city tour por Tabatinga, en Brasil.",
        horas: [
          ["Al llegar", "Recogida en el aeropuerto"],
          ["15:00", "City tour por Tabatinga, Brasil"],
        ],
        paradas: ["leticia", "tabatinga"],
      },
      {
        titulo: "Río arriba",
        texto:
          "Lancha por el Amazonas hasta la Isla de los Micos y la comunidad tikuna de Macedonia, famosa por sus tallas en madera. Noche en Puerto Nariño, un pueblo sin carros, con cena en su mercado nocturno. Si quieres, te quedas una segunda noche allá.",
        horas: [
          ["07:00", "Salida en lancha"],
          ["10:00", "Isla de los Micos"],
          ["14:00", "Macedonia"],
          ["18:00", "Puerto Nariño"],
          ["19:30", "Cena en el mercado nocturno"],
        ],
        paradas: ["micos", "macedonia", "narino"],
      },
      {
        titulo: "Lago Tarapoto",
        texto:
          "Al amanecer salen los delfines rosados. Después, canoa por los caños entre victorias regias y almuerzo con una familia del lago. En la tarde vuelves a Leticia por el río.",
        horas: [
          ["05:45", "Delfines al amanecer"],
          ["09:00", "Canoa por los caños"],
          ["12:30", "Almuerzo local"],
          ["15:00", "Regreso a Leticia"],
        ],
        paradas: ["tarapoto"],
      },
      {
        titulo: "Selva, cultura y tres países",
        texto:
          "Caminata con guía local en la selva cerca de Leticia, entre árboles gigantes y plantas medicinales. En la tarde cruzas a Santa Rosa, en Perú, y te queda tiempo para compras.",
        horas: [
          ["07:00", "Caminata en selva"],
          ["15:00", "Santa Rosa, Perú, y compras"],
          ["20:00", "Caminata nocturna (opcional)"],
        ],
        paradas: ["selva", "santarosa"],
      },
      {
        titulo: "Día de regreso",
        texto: "Desayuno con calma y te llevamos al aeropuerto a la hora de tu vuelo.",
        horas: [["Según tu vuelo", "Traslado al aeropuerto"]],
        paradas: ["leticia"],
      },
    ],
    mapa: {
      nombre: "Trapecio amazónico",
      filas: ["SSSsSSSsSSSS", "SllSsSSSsScc", "SllcSscSSScc", "~~~~~~~~~~~~", "~~~~~~sS~~~~", "S~~~~~~~~~c~", "SSSs~~sSSSSS", "SSSSSSsSSSSS"],
      paradas: {
        leticia: { x: 10, y: 2, nombre: "Leticia" },
        micos: { x: 7, y: 4, nombre: "Isla de los Micos" },
        macedonia: { x: 6, y: 2, nombre: "Macedonia" },
        narino: { x: 3, y: 2, nombre: "Puerto Nariño" },
        tarapoto: { x: 1, y: 1, nombre: "Lago Tarapoto" },
        selva: { x: 9, y: 0, nombre: "Selva y cultura" },
        tabatinga: { x: 11, y: 1, nombre: "Tabatinga · Brasil" },
        santarosa: { x: 10, y: 5, nombre: "Santa Rosa · Perú" },
      },
      ruta: [
        ["leticia", 1],
        ["tabatinga", 1],
        ["micos", 2],
        ["macedonia", 2],
        ["narino", 2],
        ["tarapoto", 3],
        ["leticia", 3],
        ["selva", 4],
        ["santarosa", 4],
        ["leticia", 5],
      ],
    },
    incluye: [
      { texto: "Traslados en tierra: aeropuerto, hotel y cada actividad" },
      { texto: "4 noches en hotel con baño privado, TV y salita", porConfirmar: true },
      { texto: "Lanchas, canoas y actividades del día a día" },
      { texto: "Guía local de Leticia" },
      { texto: "Desayuno, almuerzo y cena con el menú del día (bebidas alcohólicas y platos a la carta, aparte)" },
      { texto: "Chat directo con el equipo de Leticia y asistente 24/7" },
    ],
    noIncluye: ["Tiquetes aéreos (los compras tú)", "Impuestos de entrada a Leticia y Puerto Nariño", "Gastos personales y propinas"],
    sueltos: [],
    galeria: [
      { img: "/banners/amazonas-h.webp", texto: "Amanecer en el caño" },
      { img: null, texto: "Delfines rosados en Tarapoto" },
      { img: null, texto: "Puerto Nariño" },
      { img: null, texto: "Tres fronteras" },
    ],
    preguntas: [
      {
        pregunta: "¿Desde qué edad pueden ir los niños?",
        respuesta: "Desde los 10 años. Las caminatas en selva y las salidas al amanecer piden algo de resistencia.",
      },
      {
        pregunta: "¿Necesito alguna vacuna?",
        respuesta:
          "Se recomienda la vacuna contra la fiebre amarilla al menos 10 días antes del viaje. Al reservar te enviamos la lista completa de qué llevar.",
      },
    ],
  },
  marina: {
    linea: "Marina",
    color: "#12908E",
    iso: "/marca/iso-marina.svg",
    foto: "/banners/marina-v.webp",
    fotoBanner: "/banners/marina-v.webp",
    ceja: "Cartagena · Santa Marta",
    frase: "Islas, murallas y selva que baja al mar.",
    precio: 2640000,
    dias: 5,
    noches: 4,
    clima: "30 °C, mar",
    nivel: "Moderado",
    itinerario: [
      {
        titulo: "Cartagena amurallada",
        texto: "Te recogemos en el aeropuerto. En la tarde caminas por la Torre del Reloj y Getsemaní, y ves el atardecer desde la muralla.",
        horas: [
          ["Al llegar", "Recogida en el aeropuerto"],
          ["16:00", "Ciudad amurallada a pie"],
          ["17:45", "Atardecer en la muralla"],
        ],
        paradas: ["cartagena"],
      },
      {
        titulo: "Islas del Rosario",
        texto: "Una hora en lancha hasta las islas: arrecife de coral, careteo y playa de agua clara. Regresas a Cartagena al final de la tarde.",
        horas: [
          ["08:00", "Salida del muelle"],
          ["10:00", "Careteo en el arrecife"],
          ["16:00", "Regreso"],
        ],
        paradas: ["rosario"],
      },
      {
        titulo: "Por la costa a Santa Marta",
        texto: "Traslado por tierra con el equipo del Caribe, unas cuatro horas junto al mar. Tarde libre en la bahía y el centro histórico.",
        horas: [
          ["09:00", "Salida por tierra"],
          ["13:30", "Llegada a Santa Marta"],
          ["17:30", "Atardecer en la bahía"],
        ],
        paradas: ["santamarta"],
      },
      {
        titulo: "Tayrona",
        texto: "Entras al parque y caminas dos horas por la selva hasta Cabo San Juan. Noche en hamaca frente al mar.",
        horas: [
          ["07:00", "Entrada al parque"],
          ["09:00", "Caminata a Cabo San Juan"],
          ["Noche", "Hamaca frente al mar"],
        ],
        paradas: ["cabo"],
      },
      {
        titulo: "Amanecer en Cabo San Juan",
        texto: "Baño temprano antes de que llegue la gente, regreso por el sendero y traslado al aeropuerto de Santa Marta.",
        horas: [
          ["06:00", "Mar en calma"],
          ["10:00", "Regreso por el sendero"],
          ["15:00", "Traslado al aeropuerto"],
        ],
        paradas: ["cabo", "santamarta"],
      },
    ],
    mapa: {
      nombre: "Costa Caribe",
      filas: ["~~~~~~~~~~~PS", "~~~~~~~~~~cSM", "~~~~~~~~PpvmM", "~cC~~~ppvvvmm", "~ccpvvvvvvvvm", "P~~pvvvvvvvvv", "~P~~vvvvvvvvv"],
      paradas: {
        cartagena: { x: 2, y: 3, nombre: "Cartagena" },
        rosario: { x: 0, y: 5, nombre: "Islas del Rosario" },
        santamarta: { x: 10, y: 1, nombre: "Santa Marta" },
        cabo: { x: 11, y: 0, nombre: "Cabo San Juan" },
      },
      ruta: [
        ["cartagena", 1],
        ["rosario", 2],
        ["cartagena", 2],
        ["santamarta", 3],
        ["cabo", 4],
        ["santamarta", 5],
      ],
    },
    incluye: [
      { texto: "Traslados en tierra, incluido Cartagena a Santa Marta" },
      { texto: "4 noches: 2 en Cartagena, 1 en Santa Marta y 1 en Cabo San Juan", porConfirmar: true },
      { texto: "Lancha a las Islas del Rosario" },
      { texto: "Entrada y caminata guiada en el Tayrona", porConfirmar: true },
      { texto: "Desayuno en el hotel todos los días" },
      { texto: "Chat directo con el equipo del Caribe y asistente 24/7" },
    ],
    noIncluye: ["Tiquetes aéreos (los compras tú)", "Tasa del muelle en Cartagena", "Gastos personales y propinas"],
    sueltos: [
      { dias: "1 día", nombre: "Cartagena · Islas del Rosario", texto: "Lancha, arrecife y playa, con regreso en la tarde.", precio: 510000 },
      { dias: "2 días", nombre: "Santa Marta · Tayrona", texto: "Caminata a Cabo San Juan y noche frente al mar.", precio: 890000 },
    ],
    galeria: [
      { img: "/banners/marina-v.webp", texto: "Bahía de Santa Marta" },
      { img: null, texto: "Murallas de Cartagena" },
      { img: null, texto: "Islas del Rosario" },
      { img: null, texto: "Cabo San Juan" },
    ],
    preguntas: [
      {
        pregunta: "¿Cómo es el traslado de Cartagena a Santa Marta?",
        respuesta: "Por tierra, unas cuatro horas por la costa, con el equipo del Caribe. Te recogemos en tu hotel y te dejamos en el siguiente.",
      },
      {
        pregunta: "¿El Tayrona abre todo el año?",
        respuesta: "Cierra unos días al año (normalmente en febrero, junio y octubre). Armamos tu fecha con eso en cuenta.",
      },
    ],
  },
  paramo: {
    linea: "Páramo",
    color: "#E8A33D",
    iso: "/marca/iso-paramo.svg",
    foto: "/banners/paramo-v.webp",
    fotoBanner: "/banners/paramo-v.webp",
    ceja: "Bogotá · Zipaquirá",
    frase: "La capital, la sal y la montaña.",
    precio: 1940000,
    dias: 3,
    noches: 2,
    clima: "14 °C, 2.600 m",
    nivel: "Suave",
    itinerario: [
      {
        titulo: "Llegas a Bogotá",
        texto:
          "Te recogemos en El Dorado y te llevamos al hotel en La Candelaria. La ciudad está a 2.600 metros: el primer día va suave, con chocolate y queso.",
        horas: [
          ["Al llegar", "Recogida en El Dorado"],
          ["17:00", "Chocolate en La Candelaria"],
        ],
        paradas: ["dorado", "candelaria"],
      },
      {
        titulo: "Bogotá en un día",
        texto: "La Candelaria a pie, el Museo del Oro y el atardecer en Monserrate, a 3.152 metros, con toda la ciudad a tus pies.",
        horas: [
          ["09:00", "La Candelaria a pie"],
          ["11:30", "Museo del Oro"],
          ["16:30", "Atardecer en Monserrate"],
        ],
        paradas: ["candelaria", "museo", "monserrate"],
      },
      {
        titulo: "Zipaquirá y la Catedral de Sal",
        texto: "Una hora por la sabana hasta Zipaquirá. Bajas 180 metros a la catedral tallada en una mina de sal. Después, traslado al aeropuerto.",
        horas: [
          ["08:00", "Salida por la sabana"],
          ["10:00", "Catedral de Sal"],
          ["15:00", "Traslado al aeropuerto"],
        ],
        paradas: ["zipaquira", "dorado"],
      },
    ],
    mapa: {
      nombre: "Bogotá y la sabana",
      filas: ["vvcvvvvmfff", "vvvvvvvmmff", "vvvvvvmmmmf", "vvvccccmnmm", "vvcccCcmmmm", "avccCCcmmmm", "vvvccccmmmS", "vvvvvvvmmSS"],
      paradas: {
        dorado: { x: 0, y: 5, nombre: "El Dorado" },
        candelaria: { x: 5, y: 5, nombre: "La Candelaria" },
        museo: { x: 5, y: 4, nombre: "Museo del Oro" },
        monserrate: { x: 8, y: 3, nombre: "Monserrate" },
        zipaquira: { x: 2, y: 0, nombre: "Catedral de Sal" },
      },
      ruta: [
        ["dorado", 1],
        ["candelaria", 1],
        ["museo", 2],
        ["monserrate", 2],
        ["zipaquira", 3],
        ["dorado", 3],
      ],
    },
    incluye: [
      { texto: "Traslados en tierra: aeropuerto, hotel y Zipaquirá" },
      { texto: "2 noches en La Candelaria", porConfirmar: true },
      { texto: "Entradas al Museo del Oro, Monserrate y la Catedral de Sal", porConfirmar: true },
      { texto: "Guía local de Bogotá" },
      { texto: "Desayuno en el hotel todos los días" },
      { texto: "Chat directo con el equipo de Bogotá y asistente 24/7" },
    ],
    noIncluye: ["Tiquetes aéreos (los compras tú)", "Comidas que no estén en el plan", "Gastos personales y propinas"],
    sueltos: [
      { dias: "1 día", nombre: "Bogotá en un día", texto: "La Candelaria, Museo del Oro y Monserrate.", precio: 450000 },
      { dias: "1 día", nombre: "Zipaquirá y Catedral de Sal", texto: "La sabana y la catedral bajo tierra.", precio: 650000 },
    ],
    galeria: [
      { img: "/banners/paramo-v.webp", texto: "Monserrate y el cóndor" },
      { img: null, texto: "La Candelaria" },
      { img: null, texto: "Museo del Oro" },
      { img: null, texto: "Catedral de Sal" },
    ],
    preguntas: [
      {
        pregunta: "¿Me va a afectar la altura?",
        respuesta:
          "Bogotá está a 2.600 metros. Por eso el primer día es suave: toma agua, camina despacio y el segundo día ya estás listo para Monserrate.",
      },
    ],
  },
};

/* Aventura completa: se arma con los tres tours de arriba; no repite su contenido. */
export const COMPLETA = {
  linea: "Aventura completa",
  nombre: "Aventura completa",
  color: "#E2C06A",
  fotoBanner: "/banners/completa-h.webp",
  combina: ["paramo", "amazonas", "marina"] as IdZona[],
  ceja: "Bogotá · Amazonas · Caribe",
  frase: "Tres zonas en un solo viaje. Cada día, completo.",
  precio: 6630000,
  precioSuelto: 6980000, // la suma de las tres rutas por separado (se ve tachado)
  dias: 13,
  noches: 12,
  clima: "14 a 30 °C",
  nivel: "Moderado",
  // Orden de las zonas según la ciudad de llegada
  entradas: {
    bogota: { nombre: "Bogotá", orden: ["paramo", "amazonas", "marina"] as IdZona[] },
    cartagena: { nombre: "Cartagena", orden: ["marina", "paramo", "amazonas"] as IdZona[] },
  },
  // Texto del aviso entre una zona y la siguiente
  puentes: {
    "paramo>amazonas": "Bogotá → Leticia",
    "amazonas>marina": "Leticia → Cartagena",
    "marina>paramo": "Santa Marta → Bogotá",
  } as Record<string, string>,
  incluye: [
    "Todo lo que incluye cada zona (Bogotá, Amazonas y Marina)",
    "Traslados en tierra en los tres destinos",
    "Un solo equipo que te acompaña de principio a fin",
    "Chat directo con cada zona y asistente 24/7",
  ],
  noIncluye: ["Tiquetes aéreos entre zonas (los compras tú)", "Tasas locales de cada destino", "Gastos personales y propinas"],
  preguntas: [
    {
      pregunta: "¿Puedo empezar por el Caribe?",
      respuesta:
        "Sí. Si llegas a Cartagena, el viaje empieza en Marina, sigue en Bogotá y termina en el Amazonas. Elige tu llegada arriba y el día a día se reordena.",
    },
  ],
};

export const ZONAS: IdZona[] = ["amazonas", "marina", "paramo"];
export const TODOS_LOS_TOURS: IdTour[] = ["amazonas", "marina", "paramo", "completa"];
