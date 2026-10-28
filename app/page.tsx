/* Portada (página principal). Cada sección es un componente de componentes/portada;
   los textos e imágenes están en contenido/portada.ts. */
import ArmarAlBajar, { type GrupoArmado } from "@/componentes/comunes/ArmarAlBajar";
import Menu from "@/componentes/comunes/Menu";
import PiePagina from "@/componentes/comunes/PiePagina";
import BannersZonas from "@/componentes/portada/BannersZonas";
import CarruselGaleria from "@/componentes/portada/CarruselGaleria";
import Cierre from "@/componentes/portada/Cierre";
import Heroe from "@/componentes/portada/Heroe";
import MapaAventura from "@/componentes/portada/MapaAventura";
import NivelesMovil from "@/componentes/portada/NivelesMovil";
import SinEstres from "@/componentes/portada/SinEstres";
import { MENU_PORTADA } from "@/contenido/sitio";

// Fuerza de los momentos fuertes (mapa e íconos): 1 = suave, 2,5 = potente, 4 = muy dramático
const INTENSIDAD = 2.5;

// Orden en que se arma la página al bajar: [qué, profundidad, fuerza]
const ARMADO: GrupoArmado[] = [
  [".se h2", -140, 1],
  [".se-item", -320, INTENSIDAD],
  [".mapa-envoltura .ceja, .mapa-envoltura h2", -140, 1],
  [".mapa-escena", -160, INTENSIDAD],
  [".mapa-llegada, .mapa-repetir", -280, 1],
  [".mapa-lista li", -260, 1],
  [".car-cab h2", -140, 1],
  [".car-marco", -220, 1],
  [".cierre h2", -160, 1],
  [".cierre-botones", -320, 1],
  [".pie-cols > *", -180, 1],
];

export default function Portada() {
  return (
    <>
      <Menu enlaces={MENU_PORTADA} variante="portada" />
      <main>
        <Heroe />
        <BannersZonas />
        <NivelesMovil />
        <MapaAventura />
        <SinEstres />
        <CarruselGaleria />
        <Cierre />
      </main>
      <PiePagina />
      <ArmarAlBajar grupos={ARMADO} />
    </>
  );
}
