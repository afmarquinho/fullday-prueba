/* Cabecera de las páginas de galería y tienda: título a la izquierda, texto y aviso a la derecha. */
import "./CabeceraPagina.css";

type Props = {
  ceja: string;
  titulo: string;
  texto: string;
  aviso?: string; // aviso de maqueta (se quita cuando lleguen fotos y precios reales)
};

export default function CabeceraPagina({ ceja, titulo, texto, aviso }: Props) {
  return (
    <section className="caja cab-pagina">
      <div>
        <span className="ceja">{ceja}</span>
        <h1>{titulo}</h1>
      </div>
      <div>
        <p>{texto}</p>
        {aviso && <span className="aviso-maqueta">{aviso}</span>}
      </div>
    </section>
  );
}
