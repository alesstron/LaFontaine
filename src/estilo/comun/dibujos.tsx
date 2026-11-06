"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · Dibujos comunes / Shared drawings
 *
 * ES: Dibujos SVG que usan varias secciones o páginas. Los dibujos de una sola sección están en su carpeta
 *     (dibujos.tsx). Son decorativos (aria-hidden): el texto importante siempre está en HTML. `currentColor` = toman
 *     el color del texto que los rodea (se cambia con `color:` en el CSS de quien los usa).
 * EN: SVG drawings used by several sections or pages. Single-section drawings live in that section's folder
 *     (dibujos.tsx). They are decorative (aria-hidden): the important text is always HTML. `currentColor` = they take
 *     the color of the surrounding text (change it with `color:` in the CSS of whoever uses them).
 *
 *   <Medallon>   ◯ CAFÉ LA FONTAINE alrededor, taza y granos   Cabecera (46 px) y pie (76 px)
 *   <Flecha>     ↗ enlace que abre otra web                    Opiniones, visita, pie
 *   <Sillon>     sillón de madera y cuero coñac               Reserva de la portada y página de reserva
 *   <MesaBaja>   mesa baja negra del salón                    Reserva de la portada y página de reserva
 */
import { useId } from "react";

type Svg = { className?: string };

/**
 * ES: Medallón inspirado en el logotipo redondo de su Facebook: el nombre en serif alrededor (arco de 240° por
 *     arriba), una taza con vapor y tres granos. El círculo de fondo es crema; el dibujo, `currentColor`.
 * EN: Medallion inspired by their round Facebook logo: the name in serif around it (240° arc over the top), a cup
 *     with steam and three beans. The background circle is cream; the drawing, `currentColor`.
 *
 *          ╭─ CAFÉ LAFONTAINE ─╮
 *         │      ) )          │
 *         │    ╰═══╯ ← taza    │
 *          ╰──── ● ● ● ───────╯  ← granos · beans
 */
export function Medallon({ nombre, className }: Svg & { nombre: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <circle cx="60" cy="60" r="58" fill="var(--creme)" />
      <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="2.6" />
      <circle cx="60" cy="60" r="31" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <defs>
        {/* ES: Arco de 240° por arriba para el nombre. · EN: 240° arc over the top for the name. */}
        <path id={`${id}-arco`} d="M 22.3 81.8 A 43.5 43.5 0 1 1 97.7 81.8" />
      </defs>
      <text fontFamily="var(--f-caslon), Georgia, serif" fontSize="12.5" fontWeight="700" letterSpacing="1.4" fill="currentColor">
        <textPath href={`#${id}-arco`} startOffset="50%" textAnchor="middle">
          {nombre.toUpperCase()}
        </textPath>
      </text>
      {/* ES: Taza con vapor. · EN: Cup with steam. */}
      <path d="M45 60 h28 v4 c0 9 -6 14 -14 14 c-8 0 -14 -5 -14 -14 z" fill="currentColor" />
      <path d="M73 63 c6 0 7 8 1 9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M41 81 h36" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M54 55 c-3 -4 3 -6 0 -11 M62 55 c-3 -4 3 -6 0 -11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      {/* ES: Tres granos abajo. · EN: Three beans at the bottom. */}
      <g fill="currentColor">
        <ellipse cx="50" cy="99" rx="4.2" ry="2.8" transform="rotate(-25 50 99)" />
        <ellipse cx="60" cy="102" rx="4.2" ry="2.8" />
        <ellipse cx="70" cy="99" rx="4.2" ry="2.8" transform="rotate(25 70 99)" />
      </g>
    </svg>
  );
}

/** ES: Flecha ↗ junto a los enlaces que abren otra web. · EN: ↗ arrow next to links that open another site. */
export function Flecha({ className }: Svg) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M5 11 L11 5 M6 5 H11 V10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * ES: Sillón de madera y cuero coñac, como los del salón (foto interieur-mur). `espejo` lo da la vuelta para que los
 *     dos sillones se miren. Lienzo 220 × 210.
 * EN: Wood and cognac leather armchair, like the room's (interieur-mur photo). `espejo` flips it so the two
 *     armchairs face each other. Canvas 220 × 210.
 *
 *        ▟▀▙   ← respaldo · back (--cognac)
 *        █▄▄▄▄╲ ← asiento y brazo · seat and arm
 *       ╱    ╲  ← patas de madera · wooden legs
 */
export function Sillon({ espejo = false, className }: Svg & { espejo?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 220 210" aria-hidden="true" focusable="false">
      <g transform={espejo ? "translate(220 0) scale(-1 1)" : undefined}>
        {/* ES: Respaldo. · EN: Back. */}
        <path d="M34 22 Q30 14 40 12 L92 18 Q102 20 100 30 L92 122 L30 116 Z" fill="var(--cognac)" stroke="#5c2c16" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M44 40 L90 44 M42 66 L88 70 M40 92 L86 96" stroke="#8a4524" strokeWidth="2" opacity="0.7" />
        {/* ES: Asiento. · EN: Seat. */}
        <path d="M30 118 Q28 104 44 104 L178 112 Q192 114 190 128 L188 144 Q186 154 172 154 L42 148 Q30 146 30 134 Z" fill="var(--cognac)" stroke="#5c2c16" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M58 116 L174 122" stroke="#d58a5e" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        {/* ES: Brazo y patas de madera. · EN: Wooden arm and legs. */}
        <path d="M60 86 L196 92 Q206 93 204 102 L200 108" fill="none" stroke="#6b3e26" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M188 96 L182 204 M70 88 L64 152 M48 150 L30 204 M172 154 L176 204" stroke="#6b3e26" strokeWidth="7" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/**
 * ES: Mesa baja negra del salón. Lienzo 240 × 110.
 * EN: The room's low black table. Canvas 240 × 110.
 *
 *     ▀▀▀▀▀▀▀▀▀▀▀▀▀   ← tablero · top
 *     ┃  ─────  ┃   ← patas y balda · legs and shelf
 */
export function MesaBaja({ className }: Svg) {
  return (
    <svg className={className} viewBox="0 0 240 110" aria-hidden="true" focusable="false">
      <rect x="6" y="10" width="228" height="16" rx="2" fill="#1d1513" />
      <rect x="18" y="62" width="204" height="8" rx="1" fill="#1d1513" />
      <path d="M22 26 V104 M218 26 V104" stroke="#1d1513" strokeWidth="10" strokeLinecap="square" />
    </svg>
  );
}
