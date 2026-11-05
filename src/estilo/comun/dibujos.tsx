"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · Dibujos comunes / Shared drawings
 *
 * ES: Dibujos SVG que usan varias secciones. Los dibujos de una sola sección están en su carpeta (dibujos.tsx).
 *     Son decorativos (aria-hidden): el texto importante siempre está en HTML. `currentColor` = toman el color
 *     del texto que los rodea (se cambia con `color:` en el CSS de quien los usa).
 * EN: SVG drawings used by several sections. Single-section drawings live in that section's folder (dibujos.tsx).
 *     They are decorative (aria-hidden): the important text is always HTML. `currentColor` = they take the color of
 *     the surrounding text (change it with `color:` in the CSS of whoever uses them).
 *
 *   <Medallon>   ◯ CAFÉ LA FONTAINE alrededor, taza y granos   Cabecera (46 px) y pie (76 px)
 *   <Flecha>     ↗ enlace que abre otra web                    Opiniones, visita, pie
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
