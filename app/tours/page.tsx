/* /tours no tiene página propia: el listado de tours vive en la portada (sección #zonas). */
import { redirect } from "next/navigation";

export default function Tours() {
  redirect("/#zonas");
}
