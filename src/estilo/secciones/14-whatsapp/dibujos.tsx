"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · 14 WhatsApp flotante · Dibujos / Drawings
 *
 * ES: Burbuja de conversación con un teléfono dentro (icono genérico de mensajería, en `currentColor`).
 * EN: Chat bubble with a phone inside (generic messaging icon, in `currentColor`).
 */

type Svg = { className?: string };

/** ES: Burbuja con teléfono (WhatsApp). · EN: Bubble with a phone (WhatsApp). */
export function IconoMensaje({ className }: Svg) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3 a9 9 0 0 0 -7.8 13.5 L3 21 l4.6 -1.2 A9 9 0 1 0 12 3 Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 8.5 c0.4 -0.6 1.2 -0.6 1.5 0 l0.7 1.4 c0.2 0.4 0.1 0.8 -0.2 1.1 l-0.5 0.5 c0.6 1.2 1.6 2.2 2.8 2.8 l0.5 -0.5 c0.3 -0.3 0.7 -0.4 1.1 -0.2 l1.4 0.7 c0.6 0.3 0.6 1.1 0 1.5 c-0.8 0.6 -1.8 0.8 -2.7 0.4 c-2.4 -1 -4.2 -2.8 -5.2 -5.2 c-0.4 -0.9 -0.2 -1.9 0.4 -2.7 Z" fill="currentColor" />
    </svg>
  );
}
