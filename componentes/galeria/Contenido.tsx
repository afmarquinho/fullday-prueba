/* Lo que se ve de una pieza de la galería: la foto, el video o, si aún no hay archivo,
   el espacio que dice qué va ahí. Lo usan el muro y el visor. */
import { ZONAS_GALERIA, type Medio } from "@/contenido/galeria";

export default function Contenido({ m, enVisor = false }: { m: Medio; enVisor?: boolean }) {
  if (!m.src)
    return (
      <div className="foto-falta" style={{ "--c": ZONAS_GALERIA[m.zona].color } as React.CSSProperties}>
        <span>{m.tipo === "video" ? "Video" : "Foto"} real por subir</span>
      </div>
    );
  if (m.tipo === "video")
    return enVisor ? <video src={m.src} controls autoPlay playsInline /> : <video src={m.src} muted playsInline preload="metadata" />;
  return <img src={m.src} alt={m.titulo} loading={enVisor ? undefined : "lazy"} />;
}
