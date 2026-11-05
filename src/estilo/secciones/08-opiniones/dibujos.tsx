"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · 08 Opiniones · Dibujos / Drawings
 *
 * ES: Estrella de valoración rellena en parte: con 4,8 de nota, las cuatro primeras van llenas y la quinta al 80 %.
 *     Relleno salmón (--etiquette) y contorno oscuro (--plafond).
 * EN: Partly filled rating star: with a 4.8 rating, the first four are full and the fifth is 80 % filled.
 *     Salmon fill (--etiquette) and dark outline (--plafond).
 *
 *     ★ ★ ★ ★ ◐      parte = nota − índice (1 o más = llena · 0 o menos = vacía)
 */
import { useId } from "react";

/** ES: Estrella rellena según `parte` (0–1). · EN: Star filled according to `parte` (0–1). */
export function EstrellaNota({ parte }: { parte: number }) {
  const id = useId().replace(/:/g, "");
  const relleno = Math.max(0, Math.min(1, parte));
  return (
    <svg className="estrella-nota" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <defs>
        {/* ES: Degradado con corte duro: salmón hasta `relleno`, transparente después. · EN: Hard-stop gradient: salmon up to `relleno`, transparent after. */}
        <linearGradient id={`${id}-r`}>
          <stop offset={relleno} stopColor="var(--etiquette)" />
          <stop offset={relleno} stopColor="transparent" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.5 L14.8 8.6 L21.4 9.3 L16.5 13.8 L17.9 20.4 L12 17 L6.1 20.4 L7.5 13.8 L2.6 9.3 L9.2 8.6 Z"
        fill={`url(#${id}-r)`}
        stroke="var(--plafond)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
