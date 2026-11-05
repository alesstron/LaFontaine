"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · 11 Visita · Dibujos / Drawings
 *
 * ES: El estanque del parque La Fontaine con su chorro de agua y dos árboles, a línea (lienzo de 300 × 150). El
 *     chorro (.fuente__chorro) late suave en premium (visita.css). Trazo y grosor: visita.css → .fuente.
 * EN: The Parc La Fontaine pond with its water jet and two trees, in line (300 × 150 canvas). The jet
 *     (.fuente__chorro) gently pulses on premium (visita.css). Stroke and width: visita.css → .fuente.
 *
 *        ♣          ╽ ╱╲          ♣
 *        │        ╱  │  ╲         │      ← chorro · jet
 *     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~     ← estanque · pond
 */

type Svg = { className?: string };

/** ES: El estanque del parque La Fontaine con su chorro de agua. · EN: The Parc La Fontaine pond with its water jet. */
export function Fuente({ className }: Svg) {
  return (
    <svg className={className} viewBox="0 0 300 150" fill="none" aria-hidden="true" focusable="false">
      <path d="M12 124 Q150 96 288 124 Q150 150 12 124 Z" />
      <path d="M60 126 q20 -6 40 0 M190 128 q22 -6 44 0 M120 136 q30 -6 60 0" />
      <path className="fuente__chorro" d="M150 116 V34 M150 34 q-16 10 -30 44 M150 34 q16 10 30 44 M150 50 q-8 16 -14 40 M150 50 q8 16 14 40" />
      <path d="M150 116 q-10 -6 -20 0 q10 6 20 0 q10 -6 20 0 q-10 6 -20 0" />
      <path d="M256 112 V64 M256 64 q-24 -6 -18 -30 q-4 -24 18 -26 q22 2 18 26 q6 24 -18 30" />
      <path d="M40 116 V86 M40 86 q-14 -4 -11 -18 q-3 -14 11 -15 q14 1 11 15 q3 14 -11 18" />
    </svg>
  );
}
