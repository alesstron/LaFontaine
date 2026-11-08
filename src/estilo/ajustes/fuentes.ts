/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · Fuentes / Fonts
 *
 * ES: Las tres letras de Café LaFontaine, elegidas por lo que se ve en el local. Los archivos .woff2 (de Google
 *     Fonts, licencia SIL OFL, subconjunto latino) están en ajustes/tipografias/: la compilación no depende de
 *     Google (en Vercel, la descarga de next/font/google falló) y la web las sirve desde su propio dominio.
 * EN: Café LaFontaine's three typefaces, chosen from what can be seen in the shop. The .woff2 files (from Google
 *     Fonts, SIL OFL licence, latin subset) live in ajustes/tipografias/: the build does not depend on Google
 *     (on Vercel, next/font/google's download failed) and the site serves them from its own domain.
 *
 *   Variable CSS       Letra · Font            De dónde sale · Where it comes from      Se usa en · Used for
 *   ────────────────   ─────────────────────   ──────────────────────────────────────   ───────────────────────────
 *   --f-josefin        Josefin Sans 400–700    Las pizarras del menú y el mural          Mayúsculas espaciadas, títulos
 *   --f-caslon         Libre Caslon Text       El logotipo redondo "CAFÉ LA FONTAINE"    Nombre, títulos y texto corrido
 *   --f-caslon-it      Libre Caslon Text ital. (la misma, en cursiva)                    Cartelas, notas, descripciones
 *   --f-kalam          Kalam 400–700           El rotulador de las etiquetas             Etiquetas y precios a mano
 *
 * ES: Para cambiar una letra: pon sus .woff2 en ajustes/tipografias/, cambia las rutas de abajo y deja el mismo
 *     nombre de variable (--f-…): todos los .css la usan por ese nombre. Josefin va en pesos fijos (no variable)
 *     para que las letras huecas del mural no enseñen trazos internos. La itálica de Caslon va aparte porque la
 *     fuente no tiene itálica en negrita.
 * EN: To swap a font: put its .woff2 files in ajustes/tipografias/, change the paths below and keep the same
 *     variable name (--f-…): every .css file uses it by that name. Josefin comes in fixed weights (not variable)
 *     so the mural's outlined letters show no inner strokes. Caslon's italic is separate because the font has no
 *     bold italic.
 */
import localFont from "next/font/local";

const josefin = localFont({
  src: [
    { path: "./tipografias/josefin-sans-400.woff2", weight: "400", style: "normal" },
    { path: "./tipografias/josefin-sans-600.woff2", weight: "600", style: "normal" },
    { path: "./tipografias/josefin-sans-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--f-josefin",
  display: "swap",
});
const caslon = localFont({
  src: [
    { path: "./tipografias/libre-caslon-text-400.woff2", weight: "400", style: "normal" },
    { path: "./tipografias/libre-caslon-text-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--f-caslon",
  display: "swap",
});
const caslonItalica = localFont({
  src: "./tipografias/libre-caslon-text-400-italic.woff2",
  weight: "400",
  style: "italic",
  variable: "--f-caslon-it",
  display: "swap",
});
const kalam = localFont({
  src: [
    { path: "./tipografias/kalam-400.woff2", weight: "400", style: "normal" },
    { path: "./tipografias/kalam-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--f-kalam",
  display: "swap",
});

/** ES: Clases que layout.tsx pone en <html> para activar las variables. · EN: Classes layout.tsx puts on <html> to enable the variables. */
export const fuentes = [josefin.variable, caslon.variable, caslonItalica.variable, kalam.variable].join(" ");

/** ES: Color de la barra del navegador en el móvil: el techo oscuro del café. · EN: Mobile browser bar color: the café's dark ceiling. */
export const colorNavegador = "#2B1A16";
