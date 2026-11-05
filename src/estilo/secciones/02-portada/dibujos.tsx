"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · 02 Portada · Dibujos / Drawings
 *
 * ES: Los dos dibujos de la portada, hechos a mano en SVG a partir de la foto del interior.
 * EN: The hero's two drawings, hand-made in SVG from the interior photo.
 *
 *   <Lampara>   lámpara de campana colgante (cordón, campana, bombilla y su luz)
 *                     ┃            ← cordón · cord
 *                    ◖█◗           ← campana · dome (--plafond-2)
 *                   ( ○ )          ← bombilla y halo · bulb and glow (se encienden en premium)
 *
 *   <Paisaje>   el paisaje del mural: volcán con cráter, montaña, nubes, dos colinas, cafetales y árboles
 *                   ⌒       ⌒
 *              /\      /‾‾\        ← montaña · volcán (cráter)
 *             /  \    /    \   ♣
 *           ~~~~~~~~~~~~~~~~~~~~~  ← colinas · hills
 *           ⌒⌒⌒⌒⌒ ⌒⌒⌒⌒⌒ ⌒⌒⌒⌒      ← cafetales · coffee rows
 *
 * ES: Para mover o cambiar un trazo del paisaje, edita TRAZOS_PAISAJE (coordenadas de un lienzo de 640 × 280).
 *     El grosor y el color del trazo están en portada.css (.mural__paisaje); la animación de dibujo, también.
 * EN: To move or change a landscape stroke, edit TRAZOS_PAISAJE (coordinates on a 640 × 280 canvas). The stroke's
 *     width and color are in portada.css (.mural__paisaje); so is the drawing animation.
 */
import { useId } from "react";

type Svg = { className?: string };

/** ES: Lámpara colgante de las fotos (cordón, campana metálica, bombilla). · EN: Pendant lamp from the photos (cord, metal dome, bulb). */
export function Lampara({ className }: Svg) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={className} viewBox="0 0 120 280" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${id}-luz`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff4d6" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#ffe3a8" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ffe3a8" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* ES: Cordón. · EN: Cord. */}
      <path d="M60 0 V168" stroke="var(--plafond)" strokeWidth="1.6" />
      {/* ES: Halo de luz (se enciende en premium: portada.css → encender). · EN: Glow (switches on in premium: portada.css → encender). */}
      <circle className="lampara__halo" cx="60" cy="214" r="58" fill={`url(#${id}-luz)`} />
      {/* ES: Florón y campana con un brillo. · EN: Canopy and dome with a highlight. */}
      <rect x="53" y="164" width="14" height="14" rx="2" fill="var(--plafond)" />
      <path d="M16 214 C 18 186, 40 176, 60 176 C 80 176, 102 186, 104 214 Z" fill="var(--plafond-2)" />
      <path d="M26 206 C 30 190, 44 183, 58 182" fill="none" stroke="#6d5148" strokeWidth="2" strokeLinecap="round" />
      {/* ES: Bombilla. · EN: Bulb. */}
      <circle className="lampara__bombilla" cx="60" cy="214" r="9" fill="#fff6e3" />
    </svg>
  );
}

/** ES: Fila de arbustos de café: arcos pequeños a lo largo de una curva. · EN: Row of coffee shrubs: small arcs along a curve. */
function filaArbustos(x0: number, y0: number, n: number, paso: number, subida: number): string {
  let d = `M${x0} ${y0}`;
  for (let i = 0; i < n; i++) d += ` q${paso / 2} ${-paso * 0.75} ${paso} ${-subida}`;
  return d;
}

// ES: Cada cadena es un trazo del mural (orden = orden en que se dibujan en premium).
// EN: Each string is one mural stroke (order = the order they draw in on premium).
const TRAZOS_PAISAJE = [
  // ES: Volcán con su cráter. · EN: Volcano with its crater.
  "M296 232 L372 96 Q379 84 392 86 L436 86 Q449 84 456 96 L566 238",
  "M392 86 Q414 99 436 86",
  "M404 96 L394 142 M424 96 L438 150 M414 100 L414 126",
  // ES: Montaña de la izquierda. · EN: Left mountain.
  "M38 238 L146 122 Q158 110 170 122 L302 236",
  "M146 122 L136 168 M170 122 L184 160",
  // ES: Nubes. · EN: Clouds.
  "M452 60 q9 -13 24 -8 q11 -12 25 -1 q13 -1 13 12",
  "M86 72 q8 -10 19 -6 q10 -9 21 0 q10 0 10 9",
  // ES: Colinas en dos capas. · EN: Hills in two layers.
  "M0 248 Q92 208 184 234 T368 230 T548 222 T640 214",
  "M0 272 Q122 240 252 262 T504 256 T640 250",
  // ES: Cafetales en hileras. · EN: Coffee plants in rows.
  filaArbustos(22, 262, 9, 22, 1.4),
  filaArbustos(260, 252, 9, 22, -0.6),
  filaArbustos(470, 246, 7, 22, 0.8),
  // ES: Árboles a la derecha. · EN: Trees on the right.
  "M606 246 V206 M606 206 q-20 -4 -15 -24 q-4 -19 15 -21 q19 2 15 21 q5 20 -15 24",
  "M578 250 V222 M578 222 q-13 -3 -10 -16 q-2 -13 10 -14 q12 1 10 14 q3 13 -10 16",
] as const;

/**
 * ES: Paisaje del mural del café, a línea. pathLength=1 permite que el CSS de premium lo "dibuje" trazo a trazo
 *     (cada uno empieza 0,12 s después del anterior).
 * EN: The café's mural landscape, in line. pathLength=1 lets the premium CSS "draw" it stroke by stroke (each one
 *     starts 0.12 s after the previous).
 */
export function Paisaje({ className }: Svg) {
  return (
    <svg className={className} viewBox="0 0 640 280" fill="none" aria-hidden="true" focusable="false">
      {TRAZOS_PAISAJE.map((d, i) => (
        <path key={i} d={d} pathLength={1} className="trazo" style={{ animationDelay: `${0.25 + i * 0.12}s` }} />
      ))}
    </svg>
  );
}
