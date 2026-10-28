# Sitio web Full Day Tours

Next.js 16 (App Router) + React 19 + TypeScript. Se publica en Cloudflare con OpenNext.
Todas las páginas se generan al compilar (estáticas); el planner, el chat y la cuenta viven en el navegador del viajero.

> **Maqueta funcional.** Todavía no cobra ni envía nada: el pago, el chat con el equipo y el ingreso con código son de ejemplo.
> Nada se publica hasta tener las fotos y videos reales.

## Correr en tu computador

```bash
cd web
npm install
npm run dev        # abre http://localhost:3000
```

Antes de guardar cambios: `npm run format` (ordena el código) y `npm run revisar` (tipos, lint y formato).

## Páginas

| Ruta                                  | Qué es                                                                                       |
| ------------------------------------- | -------------------------------------------------------------------------------------------- |
| `/`                                   | Portada: héroe con capas, banners de zonas, mapa de la aventura, promesas, galería y cierre  |
| `/tours/amazonas`, `marina`, `paramo` | Tour de una zona: día a día con mapa, incluye, armador, sueltos, galería, preguntas          |
| `/tours/completa`                     | Aventura completa (las tres zonas; el orden cambia según la ciudad de llegada)               |
| `/tours/expedition`, `/tours/xanadu`  | Niveles: cómo funciona y elegir la zona                                                      |
| `/tours/[zona]?nivel=…`               | El armador arranca con un punto de partida: `expedition`, `premium`, `empresarial`, `editar` |
| `/galeria`                            | Muro de fotos y videos con filtros y visor                                                   |
| `/tienda`                             | Productos, ficha y carrito (el carrito vive en el planner). `/tienda#amazonas` filtra        |

## Cómo está organizado

```
web/
├─ app/            Rutas. Cada page.tsx solo junta secciones; no tiene lógica.
├─ contenido/      TEXTOS, PRECIOS PÚBLICOS E IMÁGENES. Aquí se edita casi todo.
├─ componentes/    Una carpeta por página y una pieza por sección, cada una con su .css al lado.
│  ├─ comunes/     Menú, pies de página, ventana lateral, filtros, animación al bajar
│  ├─ portada/     Secciones de la página principal
│  ├─ tours/       Secciones de la página de un tour y el armador
│  ├─ planner/     Planner, chat y cuenta (se abren desde cualquier página)
│  ├─ galeria/     Muro y visor
│  └─ tienda/      Grilla, ficha e ilustraciones provisionales
├─ lib/            Lógica sin dibujo: reglas del armador, estado del planner, formatos
└─ public/         Imágenes (banners, capas del héroe, íconos, marca)
```

### Dónde cambiar qué

| Quiero cambiar…                                     | Archivo                                                 |
| --------------------------------------------------- | ------------------------------------------------------- |
| Textos, precios, días e itinerario de un tour       | `contenido/tours.ts`                                    |
| Opciones, actividades y reglas del armador          | `contenido/armador.ts` (lógica en `lib/armador.ts`)     |
| Expedition y Xanadu (textos y pasos)                | `contenido/niveles.ts`                                  |
| Portada: héroe, banners, mapa, cierre               | `contenido/portada.ts`                                  |
| Menú, pie, redes, lema                              | `contenido/sitio.ts`                                    |
| Preguntas frecuentes                                | `contenido/preguntas.ts`                                |
| Fotos de la galería                                 | `contenido/galeria.ts` (archivos en `public/galeria/`)  |
| Productos de la tienda                              | `contenido/tienda.ts`                                   |
| Respuestas de ejemplo del chat, códigos de referido | `contenido/planner.ts`                                  |
| Colores y letras de la marca                        | `app/base.css` (variables) y `app/layout.tsx` (fuentes) |

### Reglas del código

- **Contenido separado de la lógica.** Un texto o una imagen nunca se escribe dentro de un componente: va en `contenido/`.
- **Una pieza por sección.** Cada componente tiene su `.css` al lado con clases propias de la sección (por ejemplo `bz-` en los banners, `tp-` en la portada del tour), para que no choquen entre páginas.
- **Números con nombre.** Velocidades, tiempos y medidas van en constantes arriba de cada archivo (`PARALLAX`, `ESPERA_CIERRE`…).
- **Comentarios cortos en español** que dicen qué hace cada parte y por qué.
- **Solo precios públicos.** Costos, márgenes y comisiones nunca van en este repositorio.
- **Turquesa = comprar o reservar; oro = navegar** (regla de marca).
- **No usar la palabra "vuelo" como metáfora** en textos para clientes (el combinado se llama "Aventura completa").

## Publicar en Cloudflare (gratis)

1. `npm run preview`: arma la versión de Cloudflare y la abre en `http://localhost:8787`.
2. `npx wrangler login`: una sola vez, con la cuenta de Cloudflare de Full Day Tours.
3. `npm run deploy`: publica en `fullday-tours.<cuenta>.workers.dev`. El dominio propio se conecta después en el panel de Cloudflare.

## Pendiente

- Fotos y videos reales (galería, banners, tours) y fotos de los productos de la tienda.
- Pago en línea (Wompi), chat real con el equipo y CRM, ingreso con código real.
- Número oficial de WhatsApp y redes (`contenido/sitio.ts`).
- Dominio.
