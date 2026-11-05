/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · Ayudas para los datos / Data helpers
 *
 * ES: Pequeñas funciones que usan varias secciones para leer o presentar los datos del café.
 * EN: Small functions several sections use to read or present the café's data.
 *
 *   numero(4.8, "fr-CA")            → "4,8"        Opiniones · Reviews
 *   rellenar("Pour : {nombre}", …)  → "Pour : Alex" Pedido, opiniones · Order, reviews
 *   platoDestacado(cafe)            → el plato con destacado: true · the item with destacado: true
 *                                     Cabecera (enlace) y plato del día · Header (link) and dish of the day
 */
import type { CafeConfig, Plato } from "@/motor";

/** ES: Número con la coma o el punto del idioma (4,8 / 4.8). · EN: Number with the language's decimal mark (4,8 / 4.8). */
export function numero(valor: number, locale: string): string {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(valor);
}

/** ES: Sustituye {variables} en un texto propio de la piel (ajustes/textos.ts). · EN: Replaces {variables} in a skin text (ajustes/textos.ts). */
export function rellenar(texto: string, vars: Record<string, string | number>): string {
  return texto.replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? String(vars[k]) : `{${k}}`));
}

/**
 * ES: El plato del día: el primero de la carta marcado `destacado: true` en cafe.config.ts. Sin él, la sección
 *     "Le plat du jour" y su enlace de la cabecera no salen.
 * EN: The dish of the day: the first menu item marked `destacado: true` in cafe.config.ts. Without one, the
 *     "Le plat du jour" section and its header link do not show.
 */
export function platoDestacado(cafe: CafeConfig): Plato | undefined {
  return cafe.carta.flatMap((c) => c.platos).find((p) => p.destacado);
}
