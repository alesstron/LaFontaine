"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · 14 WhatsApp flotante / Floating WhatsApp
 *
 * ES: Botón redondo fijo abajo a la derecha que abre una conversación de WhatsApp con el café (sin mensaje escrito).
 *     Sale en estándar y premium si hay WhatsApp en cafe.config.ts, y se esconde mientras la bolsa del pedido está
 *     abierta para no taparla.
 * EN: Round button fixed at the bottom right that opens a WhatsApp chat with the café (no message written). Shows on
 *     standard and premium if cafe.config.ts has a WhatsApp number, and hides while the order bag is open so it does
 *     not cover it.
 *
 *                                              ┌────┐
 *                                              │ (☏)│ ← fondo oscuro, aro salmón · dark fill, salmon ring
 *                                              └────┘   (rojo taza al pasar · red cup on hover)
 *
 * Dónde cambiar · Where to change:
 *   Número ...................... src/data/cafe.config.ts → contacto.whatsapp
 *   Quitarlo .................... src/data/cafe.config.ts → funciones: { whatsappFlotante: false }
 *   Tamaño, posición, colores ... whatsapp.css (esta carpeta) · icono: dibujos.tsx
 */
import { useCarrito, useMotor, whatsappUrl } from "@/motor";
import { IconoMensaje } from "./dibujos";

export function WhatsappFlotante() {
  const { cafe, t } = useMotor();
  const carrito = useCarrito();
  if (!cafe.contacto.whatsapp || carrito.abierto) return null;
  return (
    <a className="whatsapp-flotante" href={whatsappUrl(cafe.contacto.whatsapp)} target="_blank" rel="noopener noreferrer" aria-label={t("escribir")}>
      <IconoMensaje className="whatsapp-flotante__icono" />
    </a>
  );
}
