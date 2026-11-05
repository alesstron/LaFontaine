/**
 * [NO TOCAR · DO NOT EDIT] Motor / Engine
 *
 * ES: WhatsApp: sanea lo que escribe el visitante y arma el enlace con el mensaje ya escrito.
 *     No hay servidor ni pasarela de pago: el pedido o la reserva llegan al WhatsApp del café.
 *     El número se cambia en src/data/cafe.config.ts (contacto.whatsapp), no aquí.
 * EN: WhatsApp: sanitizes what the visitor types and builds the link with the message already written.
 *     There is no server or payment gateway: orders and bookings arrive in the café's WhatsApp.
 *     The number is changed in src/data/cafe.config.ts (contacto.whatsapp), not here.
 */

/**
 * ES: Sanea texto del visitante antes de meterlo en el mensaje: quita etiquetas, caracteres de control
 *     y símbolos de marcado, colapsa espacios y limita la longitud.
 * EN: Sanitizes visitor text before adding it to the message: strips tags, control characters and
 *     markup symbols, collapses spaces and limits the length.
 */
export function sanitize(input: string, max = 200): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[<>`]/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

/** ES: "+1 438-836-9706" → "14388369706" (formato de api.whatsapp.com). · EN: (api.whatsapp.com format). */
export function soloDigitos(numero: string): string {
  return numero.replace(/\D/g, "");
}

/**
 * ES: Enlace universal de WhatsApp (app o web, móvil o escritorio) con el mensaje ya escrito.
 * EN: Universal WhatsApp link (app or web, mobile or desktop) with the message already written.
 */
export function whatsappUrl(numero: string, mensaje = ""): string {
  const texto = mensaje ? `&text=${encodeURIComponent(mensaje)}` : "";
  return `https://api.whatsapp.com/send?phone=${soloDigitos(numero)}${texto}`;
}

/** ES: Abre WhatsApp en una pestaña nueva sin dar acceso a esta página. · EN: Opens WhatsApp in a new tab without access to this page. */
export function abrirWhatsApp(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer");
}

/** ES: Enlace de teléfono: "+1 438-836-9706" → "tel:+14388369706". · EN: Phone link. */
export function urlTelefono(telefono: string): string {
  return `tel:${telefono.replace(/[^\d+]/g, "")}`;
}
