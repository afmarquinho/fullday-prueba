/* Formatos de texto que se repiten en todo el sitio. */

// 2400000 → "$2.400.000"
export const pesos = (n: number) => "$" + Math.round(n).toLocaleString("es-CO");

// 3 → "03"
export const dos = (n: number | string) => String(n).padStart(2, "0");

// 1 → "1 día" · 2.5 → "2,5 días"
export const diasTxt = (n: number) => (n === 1 ? "1 día" : (n % 1 ? String(n).replace(".", ",") : n) + " días");

// "uno" o "varios" según la cantidad: plural(2, "viaje", "viajes") → "viajes"
export const plural = (n: number, uno: string, varios: string) => (n === 1 ? uno : varios);

/* ---------- Fechas (siempre en UTC para que el día no cambie con la zona horaria) ---------- */
export const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
export const DIAS_SEMANA = ["L", "M", "M", "J", "V", "S", "D"];

export const aIso = (d: Date) => d.toISOString().slice(0, 10);
export const deIso = (s: string) => {
  const [a, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(a, m - 1, d));
};
export const sumarDias = (d: Date, n: number) => {
  const r = new Date(d);
  r.setUTCDate(r.getUTCDate() + n);
  return r;
};
export const hoy = () => {
  const d = new Date();
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
};
export const fechaLarga = (d: Date) => `${d.getUTCDate()} de ${MESES[d.getUTCMonth()]}`;
