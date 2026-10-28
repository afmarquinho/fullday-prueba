/* Galería: fotos y videos reales de cada tour. Contenido en contenido/galeria.ts. */
import type { Metadata } from "next";
import CabeceraPagina from "@/componentes/comunes/CabeceraPagina";
import Menu from "@/componentes/comunes/Menu";
import PieSimple from "@/componentes/comunes/PieSimple";
import Galeria from "@/componentes/galeria/Galeria";
import { MENU_GENERAL } from "@/contenido/sitio";

export const metadata: Metadata = {
  title: "Galería",
  description: "Fotos y videos de viajeros reales en el Amazonas, el Caribe y Bogotá.",
};

export default function PaginaGaleria() {
  return (
    <>
      <Menu enlaces={MENU_GENERAL} variante="fija" actual="/galeria" />
      <main>
        <CabeceraPagina
          ceja="Galería"
          titulo="Así se vive, día a día."
          texto="Fotos y videos de viajeros reales en cada zona. Sin filtros raros: lo que ves es lo que vas a vivir."
          aviso="Maqueta: los espacios vacíos dicen qué foto real va en cada uno"
        />
        <Galeria />
      </main>
      <PieSimple />
    </>
  );
}
