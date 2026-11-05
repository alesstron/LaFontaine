"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · 01 Cabecera · Dibujos / Drawings
 *
 * ES: El icono de la bolsa de café kraft del botón del pedido (cuerpo kraft, pliegue y etiqueta salmón).
 * EN: The kraft coffee-bag icon of the order button (kraft body, fold and salmon label).
 *
 *      ╱‾‾‾‾╲   ← pliegue · fold
 *     │ ▭▭  │  ← etiqueta salmón · salmon label
 *     └─────┘
 */

type Svg = { className?: string };

/** ES: Bolsa de café kraft (botón del pedido de la cabecera). · EN: Kraft coffee bag (header order button). */
export function Bolsa({ className }: Svg) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6 7 L18 7 L19 21 L5 21 Z" fill="var(--kraft)" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6 7 L7.5 3 L16.5 3 L18 7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="8.5" y="11" width="7" height="5" rx="0.8" fill="var(--etiquette)" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
