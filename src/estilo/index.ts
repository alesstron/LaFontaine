/**
 * [NO TOCAR · DO NOT EDIT] Contrato de la piel / Skin contract
 *
 * ES: Lo que layout.tsx y las páginas de src/app/ esperan de src/estilo/. Cada café trae su propia piel, pero siempre
 *     exporta estas cosas y tiene un estilo.css (src/estilo/estilo.css):
 *       - Pagina: la página de inicio completa (componente de cliente que usa los hooks de "@/motor").
 *       - fuentes: las clases de next/font que se ponen en <html> (cadena vacía si no hay).
 *       - colorNavegador: color de la barra del navegador en el móvil.
 *     Y en esta demo, con reservas en línea (src/app/reserver/):
 *       - PaginaReserva (/reserver), PaginaAnular (/reserver/anular) y PaginaGestion (/reserver/gestion).
 *     Si mueves un archivo, cambia aquí solo la ruta, nunca los nombres exportados.
 * EN: What layout.tsx and the pages in src/app/ expect from src/estilo/. Every café brings its own skin, but it always
 *     exports these things and has an estilo.css (src/estilo/estilo.css):
 *       - Pagina: the whole home page (a client component that uses the "@/motor" hooks).
 *       - fuentes: the next/font classes set on <html> (empty string if none).
 *       - colorNavegador: the mobile browser bar color.
 *     And in this demo, with online bookings (src/app/reserver/):
 *       - PaginaReserva (/reserver), PaginaAnular (/reserver/anular) and PaginaGestion (/reserver/gestion).
 *     If you move a file, change only the path here, never the exported names.
 */
export { Pagina } from "./Pagina";
export { colorNavegador, fuentes } from "./ajustes/fuentes";
export { PaginaReserva } from "./paginas/reserva/PaginaReserva";
export { PaginaAnular } from "./paginas/anular/PaginaAnular";
export { PaginaGestion } from "./paginas/gestion/PaginaGestion";
