/**
 * [NO TOCAR · DO NOT EDIT] Contrato de la piel / Skin contract
 *
 * ES: Lo que layout.tsx y page.tsx esperan de src/estilo/. Cada café trae su propia piel, pero siempre exporta estas
 *     tres cosas y tiene un estilo.css (src/estilo/estilo.css):
 *       - Pagina: la página completa (componente de cliente que usa los hooks de "@/motor").
 *       - fuentes: las clases de next/font que se ponen en <html> (cadena vacía si no hay).
 *       - colorNavegador: color de la barra del navegador en el móvil.
 *     Si mueves Pagina.tsx o ajustes/fuentes.ts, cambia aquí solo la ruta, nunca los nombres exportados.
 * EN: What layout.tsx and page.tsx expect from src/estilo/. Every café brings its own skin, but it always exports these
 *     three things and has an estilo.css (src/estilo/estilo.css):
 *       - Pagina: the whole page (a client component that uses the "@/motor" hooks).
 *       - fuentes: the next/font classes set on <html> (empty string if none).
 *       - colorNavegador: the mobile browser bar color.
 *     If you move Pagina.tsx or ajustes/fuentes.ts, change only the path here, never the exported names.
 */
export { Pagina } from "./Pagina";
export { colorNavegador, fuentes } from "./ajustes/fuentes";
