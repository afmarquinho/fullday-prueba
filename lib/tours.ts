/* Ayudas para leer los tours sin repetir la diferencia entre un tour de zona y la Aventura completa. */
import { COMPLETA, TOURS, type Dia, type IdTour, type IdZona } from "@/contenido/tours";

export const esZona = (id: string): id is IdZona => id in TOURS;

// Nombre comercial del tour; si no tiene, se usa el de la línea
export const nombreDe = (id: IdTour) => (id === "completa" ? COMPLETA.nombre : TOURS[id].nombre || TOURS[id].linea);

// Datos comunes a cualquier tour (de zona o completo)
export function datosDe(id: IdTour) {
  if (id === "completa") return { ...COMPLETA, iso: null as string | null, sumaExpedition: undefined as number | undefined };
  return { ...TOURS[id], precioSuelto: undefined as number | undefined };
}

// Zonas que toca un tour: una sola, o las tres de la Aventura completa
export const zonasDe = (id: IdTour): IdZona[] => (id === "completa" ? COMPLETA.combina : [id]);

/* Días de un tour, o de los tres en orden si es la Aventura completa.
   Entre una zona y otra va un "puente" (el traslado aéreo que compra el viajero). */
export type DiaDelViaje = Dia & { n: number; zona: IdZona; local: number };
export type PasoDelViaje = { tipo: "dia"; dia: DiaDelViaje } | { tipo: "puente"; texto: string };

export function diasDe(id: IdTour, orden: IdZona[]): PasoDelViaje[] {
  if (id !== "completa") return TOURS[id].itinerario.map((d, i) => ({ tipo: "dia", dia: { ...d, n: i + 1, zona: id, local: i + 1 } }));
  const lista: PasoDelViaje[] = [];
  let n = 0;
  orden.forEach((z, k) => {
    if (k > 0) lista.push({ tipo: "puente", texto: COMPLETA.puentes[orden[k - 1] + ">" + z] || "Siguiente zona" });
    TOURS[z].itinerario.forEach((d, i) => lista.push({ tipo: "dia", dia: { ...d, n: ++n, zona: z, local: i + 1 } }));
  });
  return lista;
}
