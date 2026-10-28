/* Páginas de tours: /tours/amazonas, marina, paramo, completa (tour con su armador)
   y /tours/expedition, xanadu (elegir la zona de ese nivel). Se generan todas al compilar. */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Menu from "@/componentes/comunes/Menu";
import PaginaNivel from "@/componentes/tours/PaginaNivel";
import PaginaTour, { PaginaTourConNivel } from "@/componentes/tours/PaginaTour";
import { PAGINAS_NIVEL } from "@/contenido/niveles";
import { MENU_TOURS } from "@/contenido/sitio";
import { TODOS_LOS_TOURS, type IdTour } from "@/contenido/tours";
import { datosDe, nombreDe } from "@/lib/tours";

type Parametros = { params: Promise<{ id: string }> };

const esNivel = (id: string): id is keyof typeof PAGINAS_NIVEL => id in PAGINAS_NIVEL;
const esTour = (id: string): id is IdTour => (TODOS_LOS_TOURS as string[]).includes(id);

// Cualquier otra dirección da "página no encontrada"
export const dynamicParams = false;

export function generateStaticParams() {
  return [...TODOS_LOS_TOURS, ...Object.keys(PAGINAS_NIVEL)].map((id) => ({ id }));
}

export async function generateMetadata({ params }: Parametros): Promise<Metadata> {
  const { id } = await params;
  if (esNivel(id)) return { title: PAGINAS_NIVEL[id].nombre, description: PAGINAS_NIVEL[id].frase };
  if (esTour(id)) return { title: nombreDe(id), description: datosDe(id).frase };
  return {};
}

export default async function PaginaDeTour({ params }: Parametros) {
  const { id } = await params;
  const actual = `/tours/${id}`;

  if (esNivel(id))
    return (
      <>
        <Menu enlaces={MENU_TOURS} variante="fija" actual={actual} />
        <PaginaNivel id={id} />
      </>
    );

  if (!esTour(id)) notFound();
  return (
    <>
      <Menu enlaces={MENU_TOURS} variante="fija" actual={actual} />
      {/* El ?nivel=… solo se conoce en el navegador: mientras tanto se ve el tour sin punto de partida */}
      <Suspense fallback={<PaginaTour id={id} nivel={null} />}>
        <PaginaTourConNivel id={id} />
      </Suspense>
    </>
  );
}
