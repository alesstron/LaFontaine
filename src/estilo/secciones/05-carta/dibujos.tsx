"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · 05 Carta · Dibujos / Drawings
 *
 * ES: Los detalles de las pizarras del mostrador, a línea (lienzo de 200 × 120 los dibujos de fondo).
 * EN: The counter boards' details, in line (200 × 120 canvas for the background doodles).
 *
 *   <Tornillo giro>      ⊖  tornillo de las esquinas (la ranura gira `giro` grados)
 *   <DibujoTablero id>   dibujo de fondo de cada pizarra (arriba a la derecha, muy suave):
 *                          "boire"  → taza con plato y latte art · cup, saucer and latte art
 *                          "latino" → rama con hojas y cerezas de café · branch with leaves and coffee cherries
 *                          otro     → dos bagels con sésamo · two sesame bagels
 *                        (trazo y opacidad 0,32 en carta.css · stroke and 0.32 opacity in carta.css)
 *   <Estrella>           ✦  junto a "À MANGER", como en el menú real
 */

type Svg = { className?: string };

/** ES: Tornillo de las esquinas de las pizarras. · EN: Screw from the board corners. */
export function Tornillo({ giro = 0 }: { giro?: number }) {
  return (
    <svg className="tornillo" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <circle cx="10" cy="10" r="8" fill="#cfc9c1" stroke="#1d1310" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="3" fill="#f2efea" opacity="0.7" />
      <path d="M4.5 10 H15.5" stroke="#1d1310" strokeWidth="1.8" strokeLinecap="round" transform={`rotate(${giro} 10 10)`} />
    </svg>
  );
}

/** ES: Dibujo a línea de fondo de cada pizarra (el trazo y la opacidad están en carta.css → .tablero__dibujo). · EN: Each board's background line doodle (stroke and opacity in carta.css → .tablero__dibujo). */
export function DibujoTablero({ id, className }: Svg & { id: string }) {
  if (id === "boire") {
    return (
      <svg className={className} viewBox="0 0 200 120" fill="none" aria-hidden="true" focusable="false">
        <ellipse cx="96" cy="96" rx="82" ry="14" />
        <path d="M36 52 Q38 96 96 98 Q154 96 156 52" />
        <ellipse cx="96" cy="52" rx="60" ry="13" />
        <path d="M74 52 Q96 38 118 52 Q96 64 74 52 Z M96 42 V62 M84 47 L96 52 L108 47 M86 57 L96 52 L106 57" />
        <path d="M156 60 q24 2 18 22 q-4 11 -21 8" />
        <path d="M78 30 c-6 -7 6 -11 0 -18 M100 28 c-6 -7 6 -11 0 -18 M122 30 c-6 -7 6 -11 0 -18" />
      </svg>
    );
  }
  if (id === "latino") {
    return (
      <svg className={className} viewBox="0 0 200 120" fill="none" aria-hidden="true" focusable="false">
        <path d="M8 112 Q78 82 192 14" />
        <path d="M46 96 q6 -24 32 -24 q-6 24 -32 24 Z M46 96 L78 72" />
        <path d="M88 76 q-2 -26 24 -32 q2 26 -24 32 Z M88 76 L112 44" />
        <path d="M130 52 q10 -22 36 -16 q-10 22 -36 16 Z M130 52 L166 36" />
        <path d="M70 92 q14 14 34 6 q-14 -14 -34 -6 Z" />
        <circle cx="122" cy="80" r="7" />
        <circle cx="136" cy="86" r="7" />
        <circle cx="128" cy="96" r="7" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 200 120" fill="none" aria-hidden="true" focusable="false">
      <ellipse cx="72" cy="66" rx="50" ry="42" />
      <ellipse cx="72" cy="64" rx="15" ry="11" />
      <ellipse cx="138" cy="60" rx="50" ry="42" />
      <ellipse cx="138" cy="58" rx="15" ry="11" />
      <path d="M48 40 l4 2 M60 30 l4 -1 M92 34 l3 3 M100 52 l4 1 M44 78 l3 3 M56 94 l4 0 M88 90 l3 -2 M118 26 l4 1 M150 22 l3 3 M170 36 l4 2 M178 62 l3 3 M166 88 l4 0 M140 98 l3 -2 M114 84 l3 3 M126 40 l4 -1" strokeLinecap="round" />
    </svg>
  );
}

/** ES: Estrella de cuatro puntas (junto a "À MANGER" en la pizarra). · EN: Four-point star (next to "À MANGER" on the board). */
export function Estrella({ className }: Svg) {
  return (
    <svg className={className} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M10 0 C11 7 13 9 20 10 C13 11 11 13 10 20 C9 13 7 11 0 10 C7 9 9 7 10 0 Z" fill="currentColor" />
    </svg>
  );
}
