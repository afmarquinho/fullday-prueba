/* =====================================================================
   ARMA TU TOUR. Catálogo y reglas aprobadas por Leo el 25 oct 2026
   (doc "Arma tu tour: catálogo y reglas").
   - El cliente NO elige el nivel: sale de lo que arma (nivel → experiencia → zona).
     Empresa con NIT → Xanadu Empresarial. Lujo o todo privado → Xanadu Premium.
     Una actividad extrema o campamento → Expedition. Xanadu gana sobre Expedition, y Expedition sobre Clásico.
   - Mínimo de días por zona (MINIMOS). Cada zona pierde un día entre llegada (tarde) y salida (mañana).
   - "incluida" = viene en el precio de la ruta; lo demás queda "por cotizar" hasta tener las cotizaciones.
   La lógica que usa estos datos está en lib/armador.ts.
   ===================================================================== */
import type { IdZona } from "./tours";

export type IdNivel = "clasico" | "expedition" | "premium" | "empresarial";

export const NIVELES: Record<IdNivel, { nombre: string; iso?: string; color?: string; aviso?: string }> = {
  clasico: { nombre: "Clásico" },
  expedition: {
    nombre: "Expedition",
    iso: "/marca/iso-expedition.svg",
    color: "#E8622A",
    aviso: "Antes del viaje te enviamos la ficha física, la lista de equipo, la exoneración y el seguro obligatorio.",
  },
  premium: {
    nombre: "Xanadu Premium",
    iso: "/marca/iso-xanadu.svg",
    color: "#D9C9A3",
    aviso: "Todo privado y con una persona del equipo para ti 24/7. Pasa por cotización antes del pago.",
  },
  empresarial: {
    nombre: "Xanadu Empresarial",
    iso: "/marca/iso-xanadu.svg",
    color: "#B8C7BC",
    aviso: "Cotización formal válida 15 días, contrato, anticipo del 50 % y factura electrónica a la empresa.",
  },
};

// Mínimo de días por zona. "con" = mínimo si el viaje toca "lugar" (Santa Marta o Zipaquirá).
export const MINIMOS: Record<IdZona, { base: number; con?: number; lugar?: string; txt?: string }> = {
  amazonas: { base: 4 },
  marina: { base: 3, con: 5, lugar: "sm", txt: "con Santa Marta" },
  paramo: { base: 2, con: 3, lugar: "zip", txt: "con Zipaquirá" },
};

// Los días que trae el precio fijo de cada ruta
export const DIAS_RUTA: Record<IdZona, number> = { amazonas: 5, marina: 5, paramo: 3 };
export const DIAS_MAXIMOS = 21; // por zona

// Viajeros por viaje: normal y con empresa
export const VIAJEROS = { min: 2, max: 8, minEmpresa: 10, maxEmpresa: 40 };

/* Opciones básicas.
   incluida = viene en la ruta · sube = nivel que activa · solo = aparece solo cuando el viaje ya es de ese nivel
   empresa = solo aparece en viajes de empresa · def = elegida al empezar */
export type Opcion = { id: string; nombre: string; detalle: string; incluida?: boolean; sube?: IdNivel; solo?: IdNivel; empresa?: boolean };
export type GrupoBasico = { id: string; nombre: string; opciones: Opcion[]; def: string };

export const BASICOS: GrupoBasico[] = [
  {
    id: "alojamiento",
    nombre: "Cómo duermes",
    def: "hotel",
    opciones: [
      { id: "posada", nombre: "Posada o casa local", detalle: "Sencillo y con gente de la zona" },
      { id: "hotel", nombre: "Hotel de la ruta", detalle: "Habitación con baño privado", incluida: true },
      { id: "boutique", nombre: "Hotel boutique", detalle: "Pequeño, con diseño y buena ubicación" },
      { id: "campamento", nombre: "Algunas noches de campamento", detalle: "Carpa o hamaca en una reserva privada de selva", solo: "expedition" },
      { id: "lujo", nombre: "Lodge u hotel 5 estrellas", detalle: "Lo mejor de cada destino", sube: "premium" },
    ],
  },
  {
    // Las comidas incluidas dependen del tour (TOURS[id].comidas); las opciones por debajo no se muestran
    id: "comidas",
    nombre: "Qué comes",
    def: "desayuno",
    opciones: [
      { id: "desayuno", nombre: "Desayuno", detalle: "Incluido en el hotel", incluida: true },
      { id: "media", nombre: "Desayuno y almuerzo", detalle: "Almuerzo en la actividad del día" },
      { id: "completa", nombre: "Todas las comidas", detalle: "Cocina local, con opción vegetariana" },
      { id: "autor", nombre: "Cocina de autor", detalle: "Cenas con chef e ingredientes de la zona", sube: "premium" },
    ],
  },
  {
    id: "transporte",
    nombre: "Cómo te mueves",
    def: "grupo",
    opciones: [
      { id: "grupo", nombre: "Traslados incluidos", detalle: "Aeropuerto, hotel y cada actividad", incluida: true },
      { id: "privado", nombre: "Privado para ti", detalle: "Solo tu grupo, a tu hora" },
      { id: "dedicado", nombre: "Conductor dedicado", detalle: "El mismo carro y conductor todo el viaje", sube: "premium" },
      { id: "bus", nombre: "Bus o van para el grupo", detalle: "Para equipos de 10 a 40 personas", empresa: true },
    ],
  },
  {
    id: "guia",
    nombre: "Quién te acompaña",
    def: "local",
    opciones: [
      { id: "local", nombre: "Guía local en cada actividad", detalle: "Gente de la zona que conoce su tierra", incluida: true },
      { id: "fullday", nombre: "Guía Full Day todo el viaje", detalle: "Una persona del equipo de principio a fin" },
      { id: "bilingue", nombre: "Guía bilingüe privado", detalle: "Español, inglés o portugués", sube: "premium" },
      { id: "coordinador", nombre: "Coordinador del grupo", detalle: "Lleva la agenda, los tiempos y la logística", empresa: true },
    ],
  },
];

// Orden de las comidas, de menos a más
export const ORDEN_COMIDAS = ["desayuno", "media", "completa", "autor"];

/* Actividades por zona.
   tipo: base (viene en la ruta) · opcional · expedition (sube a Expedition) · xanadu (sube a Premium) · empresa (solo empresas)
   exigencia: 1 suave, 2 moderada, 3 extrema · quien: "nos" = equipo de la zona; "aliado" = operador certificado
   dias: días que ocupa en la agenda · lugar: sube el mínimo de días de la zona (ver MINIMOS) */
export type TipoActividad = "base" | "opcional" | "expedition" | "xanadu" | "empresa";
export type ActividadDato = {
  nombre: string;
  tipo: TipoActividad;
  duracion: string;
  exigencia: 1 | 2 | 3;
  quien: "nos" | "aliado";
  dias: number;
  lugar?: string;
};

export const ACTIVIDADES: Record<IdZona | "empresa", ActividadDato[]> = {
  amazonas: [
    { nombre: "Isla de los Micos", tipo: "base", duracion: "Medio día", exigencia: 1, quien: "nos", dias: 0.5 },
    { nombre: "Puerto Nariño y Lago Tarapoto (delfines)", tipo: "base", duracion: "1 día", exigencia: 1, quien: "nos", dias: 1 },
    { nombre: "Tres fronteras: visita corta a Brasil y Perú", tipo: "base", duracion: "Medio día", exigencia: 1, quien: "nos", dias: 0.5 },
    { nombre: "Loros del Parque Santander", tipo: "base", duracion: "1 hora, al atardecer", exigencia: 1, quien: "nos", dias: 0 },
    { nombre: "Selva adentro con guía local", tipo: "base", duracion: "1 día", exigencia: 2, quien: "nos", dias: 1 },
    { nombre: "Full Day Selva con una familia indígena", tipo: "opcional", duracion: "9:00 a 20:00", exigencia: 2, quien: "nos", dias: 1 },
    { nombre: "Reserva Zacambú e Islandia, Perú", tipo: "opcional", duracion: "1 día", exigencia: 1, quien: "nos", dias: 1 },
    { nombre: "Comunidad tikuna de Macedonia", tipo: "base", duracion: "Medio día", exigencia: 1, quien: "nos", dias: 0.5 },
    { nombre: "Pesca artesanal", tipo: "opcional", duracion: "3 horas", exigencia: 1, quien: "nos", dias: 0.5 },
    { nombre: "Caminata nocturna de fauna", tipo: "opcional", duracion: "2 horas, de noche", exigencia: 2, quien: "nos", dias: 0 },
    { nombre: "Canopy y escalada de árboles gigantes", tipo: "expedition", duracion: "Medio día", exigencia: 3, quien: "aliado", dias: 0.5 },
    {
      nombre: "Noche en una reserva privada a orillas del Amazonas: avistamiento de pirarucú, comunidad y caminata nocturna",
      tipo: "expedition",
      duracion: "1 día y 1 noche",
      exigencia: 2,
      quien: "aliado",
      dias: 1,
    },
    { nombre: "Kayak por los caños", tipo: "expedition", duracion: "Medio día", exigencia: 2, quien: "aliado", dias: 0.5 },
    { nombre: "Supervivencia con guía indígena", tipo: "expedition", duracion: "1 día", exigencia: 3, quien: "nos", dias: 1 },
    { nombre: "Travesía de 2 días selva adentro", tipo: "expedition", duracion: "2 días", exigencia: 3, quien: "nos", dias: 2 },
    { nombre: "Lancha privada todo el viaje", tipo: "xanadu", duracion: "Todo el viaje", exigencia: 1, quien: "nos", dias: 0 },
    { nombre: "Delfines al amanecer, sin otros turistas", tipo: "xanadu", duracion: "Madrugada", exigencia: 1, quien: "nos", dias: 0 },
    { nombre: "Cena de autor con ingredientes amazónicos", tipo: "xanadu", duracion: "1 noche", exigencia: 1, quien: "aliado", dias: 0 },
    { nombre: "Fotógrafo el día de Tarapoto", tipo: "xanadu", duracion: "1 día", exigencia: 1, quien: "aliado", dias: 0 },
  ],
  marina: [
    { nombre: "Cartagena amurallada a pie", tipo: "base", duracion: "Medio día", exigencia: 1, quien: "nos", dias: 0.5 },
    { nombre: "Islas del Rosario", tipo: "base", duracion: "1 día", exigencia: 1, quien: "aliado", dias: 1 },
    { nombre: "Traslado por tierra a Santa Marta", tipo: "base", duracion: "4 horas", exigencia: 1, quien: "nos", dias: 0.5, lugar: "sm" },
    { nombre: "Tayrona y noche en Cabo San Juan", tipo: "base", duracion: "2 días", exigencia: 2, quien: "aliado", dias: 2, lugar: "sm" },
    { nombre: "Volcán de lodo del Totumo", tipo: "opcional", duracion: "Medio día", exigencia: 1, quien: "aliado", dias: 0.5 },
    { nombre: "Manglares de La Boquilla en canoa", tipo: "opcional", duracion: "2 horas", exigencia: 1, quien: "aliado", dias: 0.5 },
    { nombre: "Plancton luminoso en Barú", tipo: "opcional", duracion: "1 noche", exigencia: 1, quien: "aliado", dias: 0 },
    { nombre: "Minca: cascadas y finca de café", tipo: "opcional", duracion: "1 día", exigencia: 2, quien: "nos", dias: 1, lugar: "sm" },
    { nombre: "Buceo en el Rosario (bautizo)", tipo: "expedition", duracion: "1 día", exigencia: 2, quien: "aliado", dias: 1 },
    { nombre: "Kitesurf en La Boquilla (diciembre a abril)", tipo: "expedition", duracion: "3 horas", exigencia: 3, quien: "aliado", dias: 0.5 },
    { nombre: "Kayak por los manglares", tipo: "expedition", duracion: "3 horas", exigencia: 2, quien: "aliado", dias: 0.5 },
    {
      nombre: "Tubing por el río Don Diego",
      tipo: "expedition",
      duracion: "1 día desde Palomino",
      exigencia: 2,
      quien: "aliado",
      dias: 1,
      lugar: "sm",
    },
    {
      nombre: "Bici de montaña de bajada en Minca",
      tipo: "expedition",
      duracion: "Medio día",
      exigencia: 3,
      quien: "aliado",
      dias: 0.5,
      lugar: "sm",
    },
    { nombre: "Ciudad Perdida", tipo: "expedition", duracion: "4 días", exigencia: 3, quien: "aliado", dias: 4, lugar: "sm" },
    { nombre: "Velero privado a las islas", tipo: "xanadu", duracion: "1 día", exigencia: 1, quien: "aliado", dias: 1 },
    { nombre: "Cena privada en la muralla", tipo: "xanadu", duracion: "1 noche", exigencia: 1, quien: "aliado", dias: 0 },
  ],
  paramo: [
    { nombre: "La Candelaria y Museo del Oro", tipo: "base", duracion: "Medio día", exigencia: 1, quien: "nos", dias: 0.5 },
    { nombre: "Atardecer en Monserrate", tipo: "base", duracion: "3 horas", exigencia: 1, quien: "nos", dias: 0.5 },
    { nombre: "Zipaquirá y Catedral de Sal", tipo: "base", duracion: "1 día", exigencia: 1, quien: "nos", dias: 1, lugar: "zip" },
    { nombre: "Laguna de Guatavita", tipo: "opcional", duracion: "Medio día", exigencia: 2, quien: "nos", dias: 0.5 },
    { nombre: "Paloquemao: frutas y cocina", tipo: "opcional", duracion: "3 horas", exigencia: 1, quien: "nos", dias: 0.5 },
    { nombre: "Usaquén y su mercado del domingo", tipo: "opcional", duracion: "Medio día", exigencia: 1, quien: "nos", dias: 0.5 },
    { nombre: "Rafting en Tobia (río Negro)", tipo: "expedition", duracion: "1 día", exigencia: 3, quien: "aliado", dias: 1 },
    { nombre: "Parapente en La Calera", tipo: "expedition", duracion: "Medio día", exigencia: 3, quien: "aliado", dias: 0.5 },
    { nombre: "Escalada en roca en Suesca", tipo: "expedition", duracion: "1 día", exigencia: 3, quien: "aliado", dias: 1 },
    { nombre: "Rappel en La Chorrera (Choachí)", tipo: "expedition", duracion: "1 día", exigencia: 3, quien: "aliado", dias: 1 },
    { nombre: "Caminata a las lagunas de Siecha (Chingaza)", tipo: "expedition", duracion: "1 día", exigencia: 3, quien: "aliado", dias: 1 },
    { nombre: "Conductor y guía privado en Bogotá", tipo: "xanadu", duracion: "Todo el viaje", exigencia: 1, quien: "nos", dias: 0 },
    { nombre: "Cena de autor en Bogotá", tipo: "xanadu", duracion: "1 noche", exigencia: 1, quien: "aliado", dias: 0 },
  ],
  empresa: [
    { nombre: "Actividad de integración para el equipo", tipo: "empresa", duracion: "Medio día", exigencia: 2, quien: "nos", dias: 0.5 },
    { nombre: "Salón para reuniones", tipo: "empresa", duracion: "Medio día", exigencia: 1, quien: "aliado", dias: 0.5 },
    { nombre: "Cena de grupo", tipo: "empresa", duracion: "1 noche", exigencia: 1, quien: "aliado", dias: 0 },
    { nombre: "Kit de bienvenida con la marca de tu empresa", tipo: "empresa", duracion: "Al llegar", exigencia: 1, quien: "nos", dias: 0 },
  ],
};

export const TIPO_ACTIVIDAD: Record<TipoActividad, string> = {
  base: "En la ruta",
  opcional: "Opcionales",
  expedition: "Aventura extrema · vuelve tu viaje Expedition",
  xanadu: "Exclusivas · vuelven tu viaje Xanadu",
  empresa: "Para tu empresa",
};

/* Punto de partida al entrar desde los banners Expedition y Xanadu (los packs de ejemplo del doc).
   sel = opciones básicas ya elegidas · act = nombres de actividades ya puestas, por zona */
export type Partida = { empresa?: boolean; viajeros?: number; sel: Record<string, string>; act: Partial<Record<IdZona | "empresa", string[]>> };

export const PARTIDAS: Record<Exclude<IdNivel, "clasico">, Partida> = {
  expedition: {
    sel: { comidas: "completa" },
    act: {
      amazonas: [
        "Canopy y escalada de árboles gigantes",
        "Noche en una reserva privada a orillas del Amazonas: avistamiento de pirarucú, comunidad y caminata nocturna",
      ],
      marina: ["Buceo en el Rosario (bautizo)", "Tubing por el río Don Diego"],
      paramo: ["Rafting en Tobia (río Negro)", "Parapente en La Calera"],
    },
  },
  premium: {
    sel: { alojamiento: "lujo", comidas: "autor", transporte: "dedicado", guia: "bilingue" },
    act: {
      amazonas: ["Lancha privada todo el viaje", "Delfines al amanecer, sin otros turistas"],
      marina: ["Velero privado a las islas", "Cena privada en la muralla"],
      paramo: ["Conductor y guía privado en Bogotá", "Cena de autor en Bogotá"],
    },
  },
  empresarial: {
    empresa: true,
    viajeros: 12,
    sel: { alojamiento: "boutique", comidas: "completa", transporte: "bus", guia: "coordinador" },
    act: {
      empresa: ["Actividad de integración para el equipo", "Salón para reuniones", "Cena de grupo", "Kit de bienvenida con la marca de tu empresa"],
    },
  },
};
