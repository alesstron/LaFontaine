/**
 * [NO TOCAR · DO NOT EDIT] Motor / Engine
 *
 * ES: Mapa: enlaces de Google Maps que funcionan sin API key. El iframe del mapa está permitido en la CSP
 *     de next.config.js (frame-src). La dirección se cambia en src/data/cafe.config.ts (contacto).
 * EN: Map: Google Maps links that work without an API key. The map iframe is allowed in the CSP of
 *     next.config.js (frame-src). The address is changed in src/data/cafe.config.ts (contacto).
 */
import type { CafeConfig, Idioma } from "./tipos";

/**
 * ES: Lo que se busca en Maps: nombre y dirección, para que salga la ficha del local y no solo un punto.
 * EN: What is searched in Maps: name and address, so the place card shows up instead of just a pin.
 */
export function consultaLugar(cafe: CafeConfig): string {
  const { direccion, ciudad } = cafe.contacto;
  return `${cafe.marca.nombre}, ${direccion}, ${ciudad}`;
}

/** ES: URL para el iframe del mapa. · EN: URL for the map iframe. */
export function urlMapaIncrustado(cafe: CafeConfig, idioma: Idioma, zoom = 16): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(consultaLugar(cafe))}&z=${zoom}&hl=${idioma}&output=embed`;
}

/** ES: Ruta hasta el café en Google Maps (abre la app en el móvil). · EN: Directions to the café in Google Maps (opens the app on mobile). */
export function urlComoLlegar(cafe: CafeConfig): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(consultaLugar(cafe))}`;
}

/** ES: Ficha del café en Google Maps (la de la config o una búsqueda). · EN: The café's Google Maps listing (from the config or a search). */
export function urlFicha(cafe: CafeConfig): string {
  return cafe.contacto.mapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consultaLugar(cafe))}`;
}
