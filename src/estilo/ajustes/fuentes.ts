/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · Fuentes / Fonts
 *
 * ES: Las tres letras de Café LaFontaine, elegidas por lo que se ve en el local. next/font las descarga al compilar
 *     y las sirve desde el propio dominio (sin llamadas a Google desde el navegador).
 * EN: Café LaFontaine's three typefaces, chosen from what can be seen in the shop. next/font downloads them at
 *     build time and serves them from the site's own domain (no calls to Google from the browser).
 *
 *   Variable CSS       Letra · Font            De dónde sale · Where it comes from      Se usa en · Used for
 *   ────────────────   ─────────────────────   ──────────────────────────────────────   ───────────────────────────
 *   --f-josefin        Josefin Sans 400–700    Las pizarras del menú y el mural          Mayúsculas espaciadas, títulos
 *   --f-caslon         Libre Caslon Text       El logotipo redondo "CAFÉ LA FONTAINE"    Nombre, títulos y texto corrido
 *   --f-caslon-it      Libre Caslon Text ital. (la misma, en cursiva)                    Cartelas, notas, descripciones
 *   --f-kalam          Kalam 400–700           El rotulador de las etiquetas             Etiquetas y precios a mano
 *
 * ES: Para cambiar una letra: cambia la importación y la llamada, y deja el mismo nombre de variable (--f-…):
 *     todos los .css la usan por ese nombre. Josefin se pide con pesos fijos (no variable) para que las letras
 *     huecas del mural no enseñen trazos internos. La itálica de Caslon se carga aparte porque la fuente no
 *     tiene itálica en negrita.
 * EN: To swap a font: change the import and the call, and keep the same variable name (--f-…): every .css file
 *     uses it by that name. Josefin is requested with fixed weights (not variable) so the mural's outlined
 *     letters show no inner strokes. Caslon's italic is loaded separately because the font has no bold italic.
 */
import { Josefin_Sans, Kalam, Libre_Caslon_Text } from "next/font/google";

const josefin = Josefin_Sans({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--f-josefin", display: "swap" });
const caslon = Libre_Caslon_Text({ subsets: ["latin"], weight: ["400", "700"], variable: "--f-caslon", display: "swap" });
const caslonItalica = Libre_Caslon_Text({ subsets: ["latin"], weight: "400", style: "italic", variable: "--f-caslon-it", display: "swap" });
const kalam = Kalam({ subsets: ["latin"], weight: ["400", "700"], variable: "--f-kalam", display: "swap" });

/** ES: Clases que layout.tsx pone en <html> para activar las variables. · EN: Classes layout.tsx puts on <html> to enable the variables. */
export const fuentes = [josefin.variable, caslon.variable, caslonItalica.variable, kalam.variable].join(" ");

/** ES: Color de la barra del navegador en el móvil: el techo oscuro del café. · EN: Mobile browser bar color: the café's dark ceiling. */
export const colorNavegador = "#2B1A16";
