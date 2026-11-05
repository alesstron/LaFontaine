"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · 04 Plato del día · Dibujos / Drawings
 *
 * ES: El guiso visto desde arriba, en un lienzo de 560 × 440: plato blanco, cinco partes de comida, tortillas en una
 *     servilleta (como en la foto del desayuno), la bebida y seis números salmón que remiten a la leyenda HTML.
 * EN: The guiso seen from above, on a 560 × 440 canvas: white plate, five food portions, tortillas in a napkin (as in
 *     the breakfast photo), the drink and six salmon numbers pointing to the HTML legend.
 *
 *                 ⑥ ☕ (480,110)
 *        ① proteína          ④ guacamole
 *      (128–300, 82–212)    (300–392, 136–228)
 *        ② arroz            ③ frijoles          ⑤ tortillas
 *      (100–236, 228–350)   (252–372, 250–354)   (430–548, 262–410)
 *                 plato · plate: centro (240,226), radio 200
 *
 * ES: Para mover un número, cambia MARCAS (abajo). Para cambiar un color de la comida, el `fill` de su grupo.
 *     En premium, cada parte aparece una detrás de otra al entrar en pantalla (framer-motion; respeta "reducir
 *     movimiento").
 * EN: To move a number, change MARCAS (below). To change a food color, its group's `fill`. On premium, each part
 *     appears one after another when it enters the screen (framer-motion; respects "reduce motion").
 */
import { motion } from "framer-motion";

type Svg = { className?: string };

// ES: Granos de arroz y frijoles en espiral, en posiciones fijas (siempre el mismo dibujo).
// EN: Rice grains and beans in a spiral, at fixed positions (always the same drawing).
const ARROZ = Array.from({ length: 46 }, (_, i) => {
  const a = i * 2.39996;
  const r = 9 + 3.6 * Math.sqrt(i) * 2.2;
  return { x: 170 + Math.cos(a) * r * 1.15, y: 290 + Math.sin(a) * r * 0.82, giro: (i * 47) % 180 };
});
const FRIJOLES = Array.from({ length: 30 }, (_, i) => {
  const a = i * 2.39996;
  const r = 6 + 3.4 * Math.sqrt(i) * 2;
  return { x: 312 + Math.cos(a) * r * 1.1, y: 300 + Math.sin(a) * r * 0.8, giro: (i * 61) % 180 };
});

// ES: Posición de cada número (x, y): proteína, arroz, frijoles, guacamole, tortillas, bebida.
// EN: Position of each number (x, y): protein, rice, beans, guacamole, tortillas, drink.
const MARCAS: [number, number][] = [
  [126, 98],
  [104, 244],
  [366, 266],
  [402, 146],
  [540, 296],
  [532, 62],
];

// ES: Aparición en cascada de cada parte (solo premium). · EN: Staggered appearance of each part (premium only).
const aparecer = {
  oculto: { opacity: 0, scale: 0.85 },
  visible: (i: number) => ({ opacity: 1, scale: 1, transition: { delay: 0.15 + i * 0.18, duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } }),
};

/** ES: El guiso visto desde arriba. `animar` = aparición en cascada (premium). · EN: The guiso seen from above. `animar` = staggered appearance (premium). */
export function DibujoPlato({ animar, className }: Svg & { animar: boolean }) {
  const g = (i: number) =>
    animar ? { variants: aparecer, custom: i, initial: "oculto", whileInView: "visible", viewport: { once: true, amount: 0.4 } } : {};
  return (
    <svg className={className} viewBox="0 0 560 440" aria-hidden="true" focusable="false">
      {/* ⑤ ES: Servilleta con tortillas. · EN: Napkin with tortillas. */}
      <motion.g {...g(4)}>
        <path d="M430 300 L548 262 L540 410 Z" fill="#fffdf8" stroke="var(--trait)" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="478" cy="336" r="50" fill="#f3c66b" stroke="var(--trait)" strokeWidth="2" />
        <circle cx="486" cy="330" r="50" fill="#f6cf7b" stroke="var(--trait)" strokeWidth="2" />
        <path d="M456 316 l6 4 M498 352 l5 -3 M470 360 l4 2 M508 312 l4 3" stroke="#c98f2e" strokeWidth="3" strokeLinecap="round" />
      </motion.g>
      {/* ⑥ ES: Bebida (taza vista desde arriba). · EN: Drink (cup seen from above). */}
      <motion.g {...g(5)}>
        <circle cx="478" cy="110" r="52" fill="#1f2c26" stroke="var(--trait)" strokeWidth="2" />
        <circle cx="478" cy="110" r="40" fill="#4a2a1c" />
        <path d="M530 104 q22 2 20 16 q-2 12 -22 10" fill="none" stroke="#1f2c26" strokeWidth="9" strokeLinecap="round" />
      </motion.g>
      {/* ES: Plato blanco con su borde. · EN: White plate with its rim. */}
      <circle cx="240" cy="226" r="200" fill="#fffdf8" stroke="var(--trait)" strokeWidth="2.5" />
      <circle cx="240" cy="226" r="166" fill="none" stroke="var(--trait)" strokeWidth="1.2" opacity="0.45" />
      {/* ① ES: Proteína. · EN: Protein. */}
      <motion.g {...g(0)}>
        <path d="M128 124 Q176 82 244 104 Q300 124 282 176 Q262 222 196 210 Q128 198 128 124 Z" fill="#a8562f" stroke="var(--trait)" strokeWidth="2" />
        <path d="M160 128 Q200 116 246 134 M150 158 Q206 146 262 164 M170 188 Q214 180 250 192" fill="none" stroke="#7a3a1c" strokeWidth="3" strokeLinecap="round" />
      </motion.g>
      {/* ② ES: Arroz. · EN: Rice. */}
      <motion.g {...g(1)}>
        <path d="M100 286 Q104 224 172 228 Q236 236 236 294 Q232 350 168 350 Q100 346 100 286 Z" fill="#f6efe0" stroke="var(--trait)" strokeWidth="1.5" />
        {ARROZ.map((a, i) => (
          <ellipse key={i} cx={a.x} cy={a.y} rx="5" ry="2.2" transform={`rotate(${a.giro} ${a.x} ${a.y})`} fill="#fffdf6" stroke="#b9ab94" strokeWidth="1" />
        ))}
      </motion.g>
      {/* ③ ES: Frijoles. · EN: Beans. */}
      <motion.g {...g(2)}>
        <path d="M252 300 Q260 246 318 252 Q378 262 372 310 Q366 356 310 354 Q250 350 252 300 Z" fill="#3a2024" stroke="var(--trait)" strokeWidth="1.5" />
        {FRIJOLES.map((f, i) => (
          <ellipse key={i} cx={f.x} cy={f.y} rx="6" ry="3.6" transform={`rotate(${f.giro} ${f.x} ${f.y})`} fill="#4f2a2f" stroke="#26141a" strokeWidth="1" />
        ))}
      </motion.g>
      {/* ④ ES: Guacamole. · EN: Guacamole. */}
      <motion.g {...g(3)}>
        <path d="M300 168 Q318 120 362 136 Q404 150 392 198 Q380 236 338 228 Q296 216 300 168 Z" fill="#8f9e57" stroke="var(--trait)" strokeWidth="2" />
        <path d="M326 160 l6 2 M352 150 l5 4 M372 180 l4 4 M338 196 l6 0 M360 210 l4 -3 M316 186 l5 3" stroke="#5f6e2c" strokeWidth="3" strokeLinecap="round" />
        <circle cx="344" cy="176" r="4" fill="#c84a32" />
        <circle cx="366" cy="164" r="3.5" fill="#c84a32" />
      </motion.g>
      {/* ①–⑥ ES: Números que remiten a la leyenda escrita a mano. · EN: Numbers pointing to the handwritten legend. */}
      {MARCAS.map(([x, y], i) => (
        <motion.g key={i} {...g(i)}>
          <circle cx={x} cy={y} r="16" fill="var(--etiquette)" stroke="var(--trait)" strokeWidth="2" />
          <text x={x} y={y + 6} textAnchor="middle" fontFamily="var(--f-josefin), sans-serif" fontWeight="700" fontSize="17" fill="var(--plafond)">
            {i + 1}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}
