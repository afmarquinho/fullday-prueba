"use client";
/* Cuenta: registro en el momento justo, ingreso con código.
   No se pide cuenta para mirar ni para armar. Se pide al cotizar o pagar ("Guarda tu viaje"),
   porque ahí la cuenta guarda el plan, el caso del chat y los pagos. Ingreso sin contraseña.
   Maqueta: Google y el código de 6 números no se verifican de verdad. */
import { useEffect, useRef, useState, type FormEvent } from "react";
import { CODIGOS_REFERIDO } from "@/contenido/planner";
import { ESPERA_CIERRE, usePlanner, type ModoCuenta } from "@/lib/planner";
import Ventana, { CabeceraVentana } from "../comunes/Ventana";
import "./Ventanas.css";
import "./Cuenta.css";

const MIN_DIGITOS_WHATSAPP = 10;
const DIGITOS_CODIGO = 6;

export default function VentanaCuenta() {
  const { plan, actualizar, ventana, opciones, entrar, cancelarCuenta, abrir } = usePlanner();
  const abierta = ventana === "cuenta";
  const [modo, setModo] = useState<ModoCuenta>("ingresar");
  const [dato, setDato] = useState(""); // a dónde se "envió" el código
  const [aviso, setAviso] = useState("");
  const [codigoRef, setCodigoRef] = useState("");
  const formulario = useRef<HTMLFormElement>(null);

  // Cada vez que se abre, empieza en el modo pedido (o perfil si ya entró)
  useEffect(() => {
    if (!abierta) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- el modo depende de cómo se abrió la ventana
    setModo(opciones.modo ?? (plan.usuario ? "perfil" : "ingresar"));
    setAviso("");
    setCodigoRef("");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al abrir
  }, [abierta, opciones]);

  // El primer campo recibe el foco (solo con mouse, para no abrir el teclado del celular de golpe)
  useEffect(() => {
    if (!abierta) return;
    const t = setTimeout(() => {
      if (matchMedia("(hover:hover)").matches) formulario.current?.querySelector("input")?.focus();
    }, 350);
    return () => clearTimeout(t);
  }, [abierta, modo]);

  const cambiar = (m: ModoCuenta) => {
    setModo(m);
    setAviso("");
  };
  const google = () => entrar({ nombre: "Viajero Google", correo: "cuenta de Google", whatsapp: null, referido: null });
  const cab = (titulo: string, sub: string) => <CabeceraVentana titulo={titulo} sub={sub} alCerrar={cancelarCuenta} />;
  const avisoP = aviso ? <p className="v-aviso">{aviso}</p> : null;
  const botonGoogle = (
    <button className="b-google" type="button" onClick={google}>
      <span aria-hidden="true">G</span> Seguir con Google
    </button>
  );

  function registrar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const cod = (d.codigo || "").trim().toLowerCase();
    if (!d.nombre?.trim()) return setAviso("Escribe tu nombre.");
    if ((d.whatsapp || "").replace(/\D/g, "").length < MIN_DIGITOS_WHATSAPP) return setAviso("Revisa tu WhatsApp: deben ser al menos 10 números.");
    if (!/^\S+@\S+\.\S+$/.test(d.correo || "")) return setAviso("Revisa tu correo.");
    if (cod && !CODIGOS_REFERIDO[cod]) return setAviso("Ese código de referido no existe. Bórralo o corrígelo.");
    if (!d.acepto) return setAviso("Para seguir, acepta el tratamiento de datos.");
    entrar({ nombre: d.nombre.trim(), whatsapp: d.whatsapp.trim(), correo: d.correo.trim(), referido: cod ? CODIGOS_REFERIDO[cod] : null });
  }

  function pedirCodigo(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const v = String(new FormData(e.currentTarget).get("dato") || "").trim();
    if (v.length < 6) return setAviso("Escribe tu WhatsApp o tu correo.");
    setDato(v);
    cambiar("codigo");
  }

  function revisarCodigo(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const cod = [...e.currentTarget.querySelectorAll<HTMLInputElement>("[data-i]")].map((i) => i.value).join("");
    if (cod.length < DIGITOS_CODIGO) return setAviso("Faltan números del código.");
    entrar(plan.usuario || { nombre: "Viajero", whatsapp: null, correo: null, referido: null });
  }

  // El código salta solo al siguiente cuadro
  function digito(e: React.ChangeEvent<HTMLInputElement>) {
    const i = e.target;
    i.value = i.value.replace(/\D/g, "");
    if (i.value) (i.nextElementSibling as HTMLInputElement | null)?.focus();
  }

  const refCodigo = codigoRef.trim().toLowerCase();
  const nombreRef = CODIGOS_REFERIDO[refCodigo];

  let contenido;
  if (modo === "registro")
    contenido = (
      <>
        {cab("Guarda tu viaje", "Así tu plan, tu chat y tus pagos quedan en un solo lugar")}
        <form className="v-cuerpo cuenta-form" ref={formulario} onSubmit={registrar} noValidate>
          {botonGoogle}
          <p className="cuenta-o">
            <span>o con tus datos</span>
          </p>
          <label>
            Nombre
            <input name="nombre" autoComplete="name" required placeholder="Como quieres que te llamemos" />
          </label>
          <label>
            WhatsApp
            <input name="whatsapp" type="tel" inputMode="tel" autoComplete="tel" required placeholder="+57 300 000 0000" />
          </label>
          <label>
            Correo
            <input name="correo" type="email" autoComplete="email" required placeholder="tu@correo.com" />
          </label>
          <label>
            Código de referido <small>(opcional)</small>
            <input
              name="codigo"
              autoComplete="off"
              placeholder="ej. paola-fullday"
              value={codigoRef}
              onChange={(e) => setCodigoRef(e.target.value)}
            />
            <small className={"c-codigo " + (refCodigo ? (nombreRef ? "ok" : "mal") : "")} aria-live="polite">
              {!refCodigo ? "" : nombreRef ? `✓ Código de ${nombreRef}` : "Ese código no existe"}
            </small>
          </label>
          <label className="acepto">
            <input type="checkbox" name="acepto" required /> <span>Acepto el tratamiento de mis datos para armar y atender mi viaje.</span>
          </label>
          {avisoP}
          <button className="b-comprar" type="submit">
            Crear cuenta y seguir <span aria-hidden="true">→</span>
          </button>
          <p className="cuenta-cambio">
            ¿Ya tienes cuenta?{" "}
            <a href="#" onClick={(e) => (e.preventDefault(), cambiar("ingresar"))}>
              Ingresar
            </a>
          </p>
        </form>
      </>
    );
  else if (modo === "ingresar")
    contenido = (
      <>
        {cab("Ingresar", "Sin contraseña: te enviamos un código")}
        <form className="v-cuerpo cuenta-form" ref={formulario} onSubmit={pedirCodigo} noValidate>
          {botonGoogle}
          <p className="cuenta-o">
            <span>o con tu WhatsApp o correo</span>
          </p>
          <label>
            WhatsApp o correo
            <input name="dato" autoComplete="username" required placeholder="+57 300… o tu@correo.com" />
          </label>
          {avisoP}
          <button className="b-comprar" type="submit">
            Enviarme el código <span aria-hidden="true">→</span>
          </button>
          <p className="cuenta-cambio">
            ¿Primera vez?{" "}
            <a href="#" onClick={(e) => (e.preventDefault(), cambiar("registro"))}>
              Crear cuenta
            </a>
          </p>
        </form>
      </>
    );
  else if (modo === "codigo")
    contenido = (
      <>
        {cab("Escribe el código", `Lo enviamos a ${dato}`)}
        <form className="v-cuerpo cuenta-form" ref={formulario} onSubmit={revisarCodigo} noValidate>
          <div className="cuenta-codigo">
            {Array.from({ length: DIGITOS_CODIGO }, (_, i) => (
              <input key={i} inputMode="numeric" maxLength={1} aria-label={`Dígito ${i + 1}`} data-i={i} onChange={digito} />
            ))}
          </div>
          <p className="calc-nota">Maqueta: cualquier código de 6 números funciona.</p>
          {avisoP}
          <button className="b-comprar" type="submit">
            Entrar <span aria-hidden="true">→</span>
          </button>
          <p className="cuenta-cambio">
            <a href="#" onClick={(e) => (e.preventDefault(), cambiar("ingresar"))}>
              Usar otro dato
            </a>
          </p>
        </form>
      </>
    );
  else {
    const u = plan.usuario;
    contenido = u && (
      <>
        {cab(`Hola, ${u.nombre.split(" ")[0]}`, u.correo || u.whatsapp || "")}
        <div className="v-cuerpo cuenta-form">
          <ul className="cuenta-perfil">
            <li>
              <span>WhatsApp</span>
              <b>{u.whatsapp || "—"}</b>
            </li>
            <li>
              <span>Correo</span>
              <b>{u.correo || "—"}</b>
            </li>
            {u.referido && (
              <li>
                <span>Te atiende</span>
                <b>{u.referido}</b>
              </li>
            )}
            <li>
              <span>Viajes en tu planner</span>
              <b>{plan.viajes.length}</b>
            </li>
            {plan.caso && (
              <li>
                <span>Tu caso</span>
                <b>
                  {plan.caso.id} · {plan.caso.estado}
                </b>
              </li>
            )}
          </ul>
          <button className="b-suave" type="button" onClick={() => (cancelarCuenta(), setTimeout(() => abrir("planner"), ESPERA_CIERRE))}>
            Ver mi planner
          </button>
          <button className="b-suave" type="button" onClick={() => (cancelarCuenta(), setTimeout(() => abrir("chat"), ESPERA_CIERRE))}>
            Abrir mi chat
          </button>
          <button className="p-quitar" type="button" onClick={() => (actualizar((p) => ({ ...p, usuario: null })), cancelarCuenta())}>
            Cerrar sesión
          </button>
        </div>
      </>
    );
  }

  return (
    <Ventana abierta={abierta} alCerrar={cancelarCuenta} clase="ventana-cuenta" etiqueta="Cuenta">
      {contenido}
    </Ventana>
  );
}
