/* Configuración del planner, la cuenta y el chat (lo que se edita a mano).
   Todo es maqueta: no cobra ni envía nada. El plan se guarda en el navegador del viajero. */

// Reserva: abono al reservar y saldo N días antes (aprobado por Leo, 26 oct 2026)
export const RESERVA = { abono: 30, diasSaldo: 15 };

// No se puede llegar antes de hoy + estos días
export const DIAS_MINIMOS_ANTES = 3;

// Llegada sugerida cuando el viajero aún no eligió fecha: hoy + estos días
export const DIAS_LLEGADA_SUGERIDA = 21;

// Dónde se guarda el plan en el navegador
export const CLAVE_GUARDADO = "fdt-planner";

// Códigos de la red: atribuyen la venta a quien trajo al cliente
export const CODIGOS_REFERIDO: Record<string, string> = {
  "paola-fullday": "Paola",
  "juancarlos-fullday": "Juan Carlos",
  "marquinhos-fullday": "Marquinhos",
};

// Atajos del planner vacío
export const ATAJOS = [
  { texto: "Amazonas", href: "/tours/amazonas" },
  { texto: "Marina", href: "/tours/marina" },
  { texto: "Páramo", href: "/tours/paramo" },
  { texto: "Aventura completa", href: "/tours/completa" },
];

export const CHAT = {
  saludo: "Soy el asistente de Full Day Tours. Respondo a cualquier hora y te paso con el equipo de tu zona cuando lo necesites.",
  rapidas: ["Quiero cotizar mi plan", "¿Qué incluye el precio?", "¿Cómo pago?", "Hablar con una persona"],
  // Respuestas de ejemplo del asistente: palabras que la activan → respuesta.
  // "persona" pasa al equipo humano; "cotizar" envía el plan.
  respuestas: [
    {
      claves: ["incluye", "precio", "cuesta"],
      texto:
        "El precio de la ruta incluye alojamiento, traslados en tierra, guía local y las actividades de la ruta. Los tiquetes aéreos los compras tú.",
    },
    {
      claves: ["pago", "pagar", "tarjeta", "pse", "nequi"],
      texto:
        "Reservas con el 30 % y pagas el resto 15 días antes del viaje, en línea con tarjeta (también extranjera), PSE o Nequi, en pesos o dólares. Si tu plan tiene cosas por cotizar, primero te enviamos el precio por aquí.",
    },
    {
      claves: ["cancel", "devol", "reembols"],
      texto:
        "Si cancelas hasta 30 días antes te devolvemos el 100 %; entre 30 y 15 días, el 50 %; con menos de 15 días no hay devolución. Si cancelamos nosotros por clima u orden público, cambias la fecha gratis o te devolvemos el 100 %.",
    },
    {
      claves: ["cotiz", "plan"],
      texto: "Abre tu planner y toca «Pedir cotización por chat». Así el equipo recibe tu plan completo con fechas y viajeros.",
      accion: "cotizar",
    },
    { claves: ["persona", "asesor", "humano", "equipo"], texto: "", accion: "persona" },
    {
      claves: ["vuelo", "tiquete", "avión", "avion"],
      texto: "Tú compras tus tiquetes y nos das el número de vuelo. Nosotros seguimos tu llegada y te recogemos.",
    },
  ] as { claves: string[]; texto: string; accion?: "cotizar" | "persona" }[],
  otra: "Te entiendo. Le paso tu pregunta al equipo y te responden por aquí mismo. Mientras tanto, ¿quieres que revisemos tu planner?",
  avisoBurbujaSegundos: 8, // a los 8 segundos aparece un "1" en la burbuja, una sola vez
};

/* Color de la línea del recorrido en los mapas (lo elige el viajero).
   Sin rojos ni naranjas: el rojo se lee como alerta o peligro. */
export const COLORES_RUTA = [
  { nombre: "Oro", color: "#F2D27E" },
  { nombre: "Crema", color: "#FFF7EA" },
  { nombre: "Turquesa", color: "#16C2BE" },
  { nombre: "Verde selva", color: "#7BD8A6" },
  { nombre: "Lila río", color: "#B9A6E8" },
];
