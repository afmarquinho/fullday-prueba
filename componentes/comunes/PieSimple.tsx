/* Pie de página corto: logo, lema y accesos a galería y tienda. */
import Link from "next/link";
import { LEMA } from "@/contenido/sitio";
import "./PieSimple.css";

export default function PieSimple() {
  return (
    <footer className="caja">
      <div className="pie-simple">
        <img src="/marca/logo.png" alt="Full Day Tours" />
        <span>{LEMA}</span>
        <span>
          <Link href="/galeria">Galería</Link> · <Link href="/tienda">Tienda Full Day</Link>
        </span>
      </div>
    </footer>
  );
}
