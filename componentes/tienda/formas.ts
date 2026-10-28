/* Ilustraciones PROVISIONALES de la tienda (estilo cartel: sol, horizonte y el objeto).
   Cada forma es el dibujo SVG del objeto en un lienzo de 300 × 300.
   Se reemplazan por fotos reales: basta con agregar foto: "/tienda/..." al producto en contenido/tienda.ts. */

const C = { crema: "#FFF7EA", oro: "#E2C06A", noche: "#0B1F1A", arena: "#D9C9A3" };

// Una forma es el dibujo fijo o una función que lo arma (para dibujos repetitivos como cuentas o tejidos)
export const FORMAS: Record<string, string | (() => string)> = {
  tote: `<path d="M118 96q32-58 64 0" stroke="${C.oro}" stroke-width="7" fill="none"/><path d="M92 100h116l10 144H82z" fill="${C.crema}"/><circle cx="150" cy="168" r="18" fill="${C.oro}"/><path d="M136 168h28" stroke="#12908E" stroke-width="5"/>`,
  buff: `<path d="M104 80h92q-10 80 0 160h-92q10-80 0-160z" fill="${C.oro}"/><path d="M110 120q40 14 80 0M108 160q42 14 84 0M110 200q40 14 80 0" stroke="${C.noche}" stroke-width="4" fill="none" opacity=".5"/>`,
  sudadera: `<path d="M120 70q30-26 60 0l46 22 32 74-30 12-14-30v118H86V138l-14 30-30-12 32-74z" fill="${C.arena}"/><path d="M128 72q22 34 44 0" fill="${C.noche}" opacity=".35"/><rect x="118" y="196" width="64" height="30" rx="6" fill="${C.noche}" opacity=".25"/><circle cx="150" cy="140" r="14" fill="${C.oro}"/>`,
  poncho: `<circle cx="150" cy="86" r="22" fill="${C.oro}"/><path d="M150 100l104 132H46z" fill="#12908E"/><path d="M150 100v132" stroke="${C.crema}" stroke-width="3" stroke-dasharray="6 6"/>`,
  cuaderno: `<rect x="94" y="64" width="116" height="176" rx="8" fill="${C.crema}"/><rect x="94" y="64" width="20" height="176" fill="${C.oro}"/><path d="M134 112h56M134 136h56M134 160h40" stroke="${C.noche}" stroke-width="4" opacity=".4"/><circle cx="170" cy="204" r="14" fill="#2E8B57"/>`,
  postales: `<rect x="62" y="96" width="120" height="84" rx="4" fill="${C.crema}" transform="rotate(-10 122 138)"/><rect x="114" y="128" width="124" height="88" rx="4" fill="${C.arena}" transform="rotate(6 176 172)"/><circle cx="200" cy="160" r="16" fill="${C.oro}"/><path d="M130 196q30-30 60-6 24 16 44-6" stroke="#12908E" stroke-width="5" fill="none"/>`,
  aretes: () => {
    let s = "";
    for (const x of [112, 188]) {
      s += `<path d="M${x} 70v34" stroke="${C.crema}" stroke-width="3"/>`;
      for (let i = 0; i < 5; i++) s += `<circle cx="${x}" cy="${114 + i * 22}" r="${11 - i}" fill="${i % 2 ? C.oro : "#B5362B"}"/>`;
    }
    return s;
  },
  tallas: `<rect x="62" y="222" width="176" height="22" rx="4" fill="${C.oro}"/><path d="M78 222q0-40 40-46l10-20 12 18q40 2 46 48z" fill="${C.arena}"/><circle cx="104" cy="196" r="4" fill="${C.noche}"/><path d="M196 222v-60q0-26 22-26 18 0 18 18l18 4-18 8v56z" fill="#C46A3A"/><circle cx="222" cy="152" r="4" fill="${C.noche}"/>`,
  filigrana: () => {
    let s = "";
    for (const x of [110, 190]) {
      s += `<path d="M${x} 70v26" stroke="${C.crema}" stroke-width="3"/><path d="M${x} 96q-34 40 0 92 34-52 0-92z" fill="none" stroke="${C.crema}" stroke-width="4"/>`;
      for (let i = 1; i < 4; i++)
        s += `<path d="M${x} ${96 + i * 10}q${-30 + i * 7} ${36 - i * 4} 0 ${82 - i * 20} ${30 - i * 7} ${-46 + i * 16} 0 ${-82 + i * 20}z" fill="none" stroke="${C.oro}" stroke-width="2"/>`;
    }
    return s;
  },
  camiseta: `<path d="M96 76l34-16q20 16 40 0l34 16 38 36-26 26-14-12v124H98V126l-14 12-26-26z" fill="${C.crema}"/><circle cx="150" cy="128" r="16" fill="${C.oro}"/><path d="M138 128h24" stroke="#12908E" stroke-width="5"/>`,
  gorra: `<path d="M84 192q0-82 66-86 66 4 66 86z" fill="${C.crema}"/><path d="M150 106v86M116 116q-10 36-10 76M184 116q10 36 10 76" stroke="${C.arena}" stroke-width="3" fill="none"/><path d="M66 190q90-16 186 8-90 22-186 6z" fill="${C.oro}"/><circle cx="150" cy="104" r="7" fill="${C.oro}"/><path d="M128 160q22-12 44 0" stroke="#12908E" stroke-width="6" fill="none"/>`,
  termo: `<rect x="122" y="54" width="56" height="24" rx="6" fill="${C.oro}"/><rect x="116" y="76" width="68" height="168" rx="20" fill="${C.crema}"/><rect x="116" y="150" width="68" height="16" fill="${C.oro}"/><circle cx="150" cy="118" r="12" fill="${C.noche}"/>`,
  stickers: `<rect x="70" y="80" width="80" height="80" rx="14" fill="${C.crema}" transform="rotate(-12 110 120)"/><circle cx="196" cy="118" r="42" fill="${C.oro}"/><rect x="104" y="160" width="96" height="72" rx="36" fill="${C.arena}" transform="rotate(8 152 196)"/><circle cx="110" cy="120" r="14" fill="#12908E"/><path d="M176 132q4-30 34-36-2 30-34 36z" fill="#2E8B57"/>`,
  collar: () => {
    let s = `<path d="M86 70q64 190 128 0" stroke="${C.arena}" stroke-width="3" fill="none"/>`;
    for (let i = 0; i <= 18; i++) {
      const t = i / 18,
        x = (1 - t) * (1 - t) * 86 + 2 * (1 - t) * t * 150 + t * t * 214,
        y = (1 - t) * (1 - t) * 70 + 2 * (1 - t) * t * 260 + t * t * 70;
      s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i === 9 ? 16 : 8}" fill="${i === 9 ? C.oro : i % 2 ? "#B23A2E" : C.noche}"/>`;
    }
    return s;
  },
  pulsera: `<ellipse cx="150" cy="160" rx="78" ry="46" fill="none" stroke="${C.arena}" stroke-width="22"/><ellipse cx="150" cy="160" rx="78" ry="46" fill="none" stroke="${C.oro}" stroke-width="22" stroke-dasharray="10 14"/><ellipse cx="150" cy="160" rx="78" ry="46" fill="none" stroke="${C.noche}" stroke-width="3" stroke-dasharray="2 22"/>`,
  delfin: `<rect x="70" y="222" width="160" height="22" rx="4" fill="${C.oro}"/><path d="M62 176q56-74 140-58 34 6 48 30l16-2-12 15q-22 14-52 10l-22 30-6-28q-50 4-80 18l-18 26 2-30z" fill="#E7A9A0"/><circle cx="226" cy="140" r="4" fill="${C.noche}"/><path d="M150 210v12" stroke="${C.oro}" stroke-width="10"/>`,
  canasto: () => {
    let s = `<path d="M78 112h144l-20 128H98z" fill="${C.arena}"/><ellipse cx="150" cy="112" rx="72" ry="16" fill="${C.oro}"/>`;
    for (let y = 134; y < 236; y += 16)
      s += `<path d="M${82 + (y - 112) * 0.16} ${y}h${136 - (y - 112) * 0.32}" stroke="${C.noche}" stroke-width="3" stroke-dasharray="10 6" opacity=".55"/>`;
    return s;
  },
  sombrero: () => {
    let s = `<ellipse cx="150" cy="196" rx="118" ry="34" fill="${C.crema}"/>`;
    for (let r = 0; r < 5; r++)
      s += `<ellipse cx="150" cy="196" rx="${108 - r * 12}" ry="${30 - r * 3.2}" fill="none" stroke="${C.noche}" stroke-width="3"/>`;
    s += `<path d="M100 194q2-74 50-76 48 2 50 76z" fill="${C.crema}"/>`;
    for (let y = 138; y < 190; y += 12)
      s += `<path d="M${104 + (190 - y) * 0.1} ${y}h${92 - (190 - y) * 0.2}" stroke="${C.noche}" stroke-width="3" stroke-dasharray="6 6"/>`;
    return s;
  },
  mochila: () => {
    let s = `<path d="M112 92q38-60 76 0" stroke="${C.oro}" stroke-width="8" fill="none"/><path d="M92 100h116l-6 140q-52 14-104 0z" fill="#12908E"/>`;
    for (let y = 124; y < 230; y += 34) {
      let z = "";
      for (let x = 96; x <= 204; x += 18) z += `${x},${y} ${x + 9},${y - 12} `;
      s += `<polyline points="${z}" fill="none" stroke="${C.crema}" stroke-width="5"/><path d="M96 ${y + 10}h108" stroke="${C.oro}" stroke-width="3"/>`;
    }
    return s;
  },
  vasija: `<path d="M126 70h48v18q46 20 46 76 0 60-70 76-70-16-70-76 0-56 46-76z" fill="#C46A3A"/><path d="M88 150h124" stroke="${C.crema}" stroke-width="6"/><path d="M96 176h108" stroke="${C.noche}" stroke-width="4" stroke-dasharray="8 8"/><rect x="120" y="62" width="60" height="12" rx="4" fill="#A9552C"/>`,
  ruana: () => {
    let s = `<path d="M96 76h108l40 168H56z" fill="${C.arena}"/><path d="M136 76h28l-14 40z" fill="${C.noche}"/>`;
    for (let x = 70; x < 240; x += 26) s += `<path d="M${x} 236l${(150 - x) * 0.18} -150" stroke="#8C6A3E" stroke-width="3" opacity=".5"/>`;
    s += `<path d="M56 244h188" stroke="${C.noche}" stroke-width="6" stroke-dasharray="3 5"/>`;
    return s;
  },
};
