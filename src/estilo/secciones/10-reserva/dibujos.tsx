"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · 10 Reserva · Dibujos / Drawings
 *
 * ES: Los sillones de madera y cuero coñac y la mesa baja negra de la foto del salón.
 * EN: The wood-and-cognac-leather armchairs and the low black table from the room photo.
 *
 *   <Sillon espejo?>  (lienzo 220 × 210)          <MesaBaja>  (lienzo 240 × 110)
 *        ▟▀▙   ← respaldo · back (--cognac)         ▀▀▀▀▀▀▀▀▀▀▀▀▀   ← tablero · top
 *        █▄▄▄▄╲ ← asiento y brazo · seat and arm     ┃  ─────  ┃   ← patas y balda · legs and shelf
 *       ╱    ╲  ← patas de madera · wooden legs     ┃         ┃
 *   `espejo` lo da la vuelta para que los dos sillones se miren · flips it so the two armchairs face each other.
 */

type Svg = { className?: string };

/** ES: Sillón de madera y cuero coñac, como los del salón. · EN: Wood and cognac leather armchair, like the room's. */
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

/** ES: Mesa baja negra del salón. · EN: The room's low black table. */
export function MesaBaja({ className }: Svg) {
  return (
    <svg className={className} viewBox="0 0 240 110" aria-hidden="true" focusable="false">
      <rect x="6" y="10" width="228" height="16" rx="2" fill="#1d1513" />
      <rect x="18" y="62" width="204" height="8" rx="1" fill="#1d1513" />
      <path d="M22 26 V104 M218 26 V104" stroke="#1d1513" strokeWidth="10" strokeLinecap="square" />
    </svg>
  );
}
