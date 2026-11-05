"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · 06 Historia · Dibujos / Drawings
 *
 * ES: El sello redondo de tinta (lienzo de 200 × 200): texto de arriba en arco (radio 66), texto de abajo en arco
 *     (radio 72) y una palabra en el centro. Toma el color con `currentColor` (historia.css → .sello-redondo).
 * EN: The round ink stamp (200 × 200 canvas): top text on an arc (radius 66), bottom text on an arc (radius 72) and
 *     one word in the centre. Its color comes from `currentColor` (historia.css → .sello-redondo).
 *
 *          ╭── CAFÉ LAFONTAINE ──╮      ← arriba · top (Josefin 15)
 *         │    ┌───────────┐      │
 *         │    │ Papineau  │      │     ← centro · centre (Caslon itálica 20)
 *         │    └───────────┘      │
 *          ╰───── MONTRÉAL ──────╯      ← abajo · bottom (Josefin 15)
 */
import { useId } from "react";

type Svg = { className?: string };

/** ES: Sello redondo de tinta con el nombre, la ciudad y la calle. · EN: Round ink stamp with the name, the city and the street. */
export function SelloRedondo({ arriba, abajo, centro, className }: Svg & { arriba: string; abajo: string; centro: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <defs>
        {/* ES: Arco de arriba (de izquierda a derecha por encima) y de abajo (por debajo). · EN: Top arc (left to right over the top) and bottom arc (underneath). */}
        <path id={`${id}-a`} d="M 34 100 A 66 66 0 0 1 166 100" />
        <path id={`${id}-b`} d="M 28 100 A 72 72 0 0 0 172 100" />
      </defs>
      <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeWidth="4" />
      <circle cx="100" cy="100" r="86" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="48" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text fontFamily="var(--f-josefin), sans-serif" fontWeight="700" fontSize="15" letterSpacing="3" fill="currentColor">
        <textPath href={`#${id}-a`} startOffset="50%" textAnchor="middle">
          {arriba.toUpperCase()}
        </textPath>
      </text>
      <text fontFamily="var(--f-josefin), sans-serif" fontWeight="700" fontSize="15" letterSpacing="3" fill="currentColor">
        <textPath href={`#${id}-b`} startOffset="50%" textAnchor="middle">
          {abajo.toUpperCase()}
        </textPath>
      </text>
      <text x="100" y="106" textAnchor="middle" fontFamily="var(--f-caslon), serif" fontStyle="italic" fontSize="20" fill="currentColor">
        {centro}
      </text>
    </svg>
  );
}
