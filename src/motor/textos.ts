/**
 * [NO TOCAR · DO NOT EDIT] Motor / Engine
 *
 * ES: Textos de la interfaz (botones, avisos, mensajes de WhatsApp) en los tres idiomas del motor,
 *     y formato de precios, horas y días según el idioma y el país del café.
 *     Los textos propios de cada cafetería (carta, historia…) no van aquí: van en src/data/cafe.config.ts.
 * EN: Interface texts (buttons, notices, WhatsApp messages) in the engine's three languages, and
 *     price, time and day formatting for the café's language and country.
 *     Each café's own texts (menu, story…) do not go here: they live in src/data/cafe.config.ts.
 */
import type { DiaSemana, Idioma, Texto } from "./tipos";

// ES: Diccionario francés. Para añadir un texto nuevo, añade la misma clave en fr, en y es.
// EN: French dictionary. To add a new text, add the same key to fr, en and es.
const fr = {
  carta: "Menu",
  verCarta: "Voir le menu",
  historia: "Notre histoire",
  galeria: "Galerie",
  resenas: "Avis",
  resenasTotal: "{total} avis {fuente}",
  resenasResumen: "Résumé des avis {fuente}",
  menciones: "{n} mentions",
  promos: "À l'affiche",
  visita: "Nous trouver",
  horario: "Heures d'ouverture",
  abiertoAhora: "Ouvert maintenant",
  cerradoAhora: "Fermé pour le moment",
  cierraA: "Ferme à {hora}",
  abreHoy: "Ouvre aujourd'hui à {hora}",
  abreManana: "Ouvre demain à {hora}",
  abreDia: "Ouvre {dia} à {hora}",
  cerrado: "Fermé",
  hoy: "Aujourd'hui",
  comoLlegar: "Itinéraire",
  verEnMaps: "Voir sur Google Maps",
  llamar: "Appeler",
  escribir: "Écrire sur WhatsApp",
  servicios: "Services",
  vegetariano: "Végétarien",
  anadir: "Ajouter",
  anadido: "Ajouté",
  quitarUno: "Retirer un",
  anadirUno: "Ajouter un",
  pedido: "Votre commande",
  verPedido: "Voir la commande",
  pedidoVacio: "Votre commande est vide. Ajoutez un plat depuis le menu.",
  total: "Total",
  totalEstimado: "Total estimé",
  nombre: "Nom",
  horaRecogida: "Heure de cueillette",
  loAntesPosible: "Dès que possible",
  nota: "Note",
  notaAyuda: "Allergies, sauce en extra…",
  enviarPedido: "Envoyer par WhatsApp",
  pedidoAyuda: "WhatsApp s'ouvre avec votre commande déjà écrite. Il ne reste qu'à l'envoyer.",
  reservar: "Réserver une table",
  personas: "Personnes",
  fecha: "Date",
  hora: "Heure",
  enviarReserva: "Demander la réservation",
  reservaAyuda: "La réservation est confirmée par le café sur WhatsApp.",
  campoObligatorio: "Champ obligatoire",
  cerrar: "Fermer",
  idioma: "Langue",
  desde: "Depuis {anio}",
  fotoDe: "Photo : {autor}",
  avisoDemo: "Maquette de démonstration · site non officiel",
  pedidoSaludo: "Bonjour {cafe} ! J'aimerais commander pour emporter :",
  pedidoTotal: "Total estimé : {total}",
  pedidoNombre: "Nom : {nombre}",
  pedidoHora: "Cueillette : {hora}",
  pedidoNota: "Note : {nota}",
  reservaSaludo: "Bonjour {cafe} ! J'aimerais réserver une table :",
  reservaDetalle: "{personas} personne(s), le {fecha} à {hora}",
  reservaNombre: "Au nom de : {nombre}",
  // ES: Títulos de las páginas de reservas (pestaña del navegador). · EN: Booking page titles (browser tab).
  anularReserva: "Annuler une réservation",
  panelReservas: "Réservations\u00a0· gestion",
};

type Diccionario = Record<keyof typeof fr, string>;

// ES: Diccionario inglés. · EN: English dictionary.
const en: Diccionario = {
  carta: "Menu",
  verCarta: "See the menu",
  historia: "Our story",
  galeria: "Gallery",
  resenas: "Reviews",
  resenasTotal: "{total} {fuente} reviews",
  resenasResumen: "Summary of {fuente} reviews",
  menciones: "{n} mentions",
  promos: "What's on",
  visita: "Visit us",
  horario: "Opening hours",
  abiertoAhora: "Open now",
  cerradoAhora: "Closed right now",
  cierraA: "Closes at {hora}",
  abreHoy: "Opens today at {hora}",
  abreManana: "Opens tomorrow at {hora}",
  abreDia: "Opens {dia} at {hora}",
  cerrado: "Closed",
  hoy: "Today",
  comoLlegar: "Directions",
  verEnMaps: "View on Google Maps",
  llamar: "Call",
  escribir: "Message on WhatsApp",
  servicios: "Services",
  vegetariano: "Vegetarian",
  anadir: "Add",
  anadido: "Added",
  quitarUno: "Remove one",
  anadirUno: "Add one",
  pedido: "Your order",
  verPedido: "View order",
  pedidoVacio: "Your order is empty. Add something from the menu.",
  total: "Total",
  totalEstimado: "Estimated total",
  nombre: "Name",
  horaRecogida: "Pickup time",
  loAntesPosible: "As soon as possible",
  nota: "Note",
  notaAyuda: "Allergies, extra sauce…",
  enviarPedido: "Send via WhatsApp",
  pedidoAyuda: "WhatsApp opens with your order already written. Just hit send.",
  reservar: "Book a table",
  personas: "Guests",
  fecha: "Date",
  hora: "Time",
  enviarReserva: "Request booking",
  reservaAyuda: "The café confirms your booking on WhatsApp.",
  campoObligatorio: "Required",
  cerrar: "Close",
  idioma: "Language",
  desde: "Since {anio}",
  fotoDe: "Photo: {autor}",
  avisoDemo: "Demo mock-up · not the official website",
  pedidoSaludo: "Hi {cafe}! I'd like to order for pickup:",
  pedidoTotal: "Estimated total: {total}",
  pedidoNombre: "Name: {nombre}",
  pedidoHora: "Pickup: {hora}",
  pedidoNota: "Note: {nota}",
  reservaSaludo: "Hi {cafe}! I'd like to book a table:",
  reservaDetalle: "{personas} guest(s), on {fecha} at {hora}",
  reservaNombre: "Name: {nombre}",
  anularReserva: "Cancel a booking",
  panelReservas: "Bookings\u00a0· management",
};

// ES: Diccionario español. · EN: Spanish dictionary.
const es: Diccionario = {
  carta: "Carta",
  verCarta: "Ver la carta",
  historia: "Nuestra historia",
  galeria: "Galería",
  resenas: "Opiniones",
  resenasTotal: "{total} opiniones en {fuente}",
  resenasResumen: "Resumen de las opiniones de {fuente}",
  menciones: "{n} menciones",
  promos: "Promociones y eventos",
  visita: "Cómo llegar",
  horario: "Horario",
  abiertoAhora: "Abierto ahora",
  cerradoAhora: "Cerrado ahora",
  cierraA: "Cierra a las {hora}",
  abreHoy: "Abre hoy a las {hora}",
  abreManana: "Abre mañana a las {hora}",
  abreDia: "Abre el {dia} a las {hora}",
  cerrado: "Cerrado",
  hoy: "Hoy",
  comoLlegar: "Cómo llegar",
  verEnMaps: "Ver en Google Maps",
  llamar: "Llamar",
  escribir: "Escribir por WhatsApp",
  servicios: "Servicios",
  vegetariano: "Vegetariano",
  anadir: "Añadir",
  anadido: "Añadido",
  quitarUno: "Quitar uno",
  anadirUno: "Añadir uno",
  pedido: "Tu pedido",
  verPedido: "Ver pedido",
  pedidoVacio: "Tu pedido está vacío. Añade algo de la carta.",
  total: "Total",
  totalEstimado: "Total estimado",
  nombre: "Nombre",
  horaRecogida: "Hora de recogida",
  loAntesPosible: "Lo antes posible",
  nota: "Nota",
  notaAyuda: "Alergias, salsa extra…",
  enviarPedido: "Enviar por WhatsApp",
  pedidoAyuda: "WhatsApp se abre con tu pedido ya escrito. Solo tienes que enviarlo.",
  reservar: "Reservar mesa",
  personas: "Personas",
  fecha: "Fecha",
  hora: "Hora",
  enviarReserva: "Pedir la reserva",
  reservaAyuda: "El café confirma la reserva por WhatsApp.",
  campoObligatorio: "Campo obligatorio",
  cerrar: "Cerrar",
  idioma: "Idioma",
  desde: "Desde {anio}",
  fotoDe: "Foto: {autor}",
  avisoDemo: "Maqueta de demostración · no es la web oficial",
  pedidoSaludo: "¡Hola, {cafe}! Quiero hacer un pedido para recoger:",
  pedidoTotal: "Total estimado: {total}",
  pedidoNombre: "Nombre: {nombre}",
  pedidoHora: "Recogida: {hora}",
  pedidoNota: "Nota: {nota}",
  reservaSaludo: "¡Hola, {cafe}! Quiero reservar una mesa:",
  reservaDetalle: "{personas} persona(s), el {fecha} a las {hora}",
  reservaNombre: "A nombre de: {nombre}",
  anularReserva: "Anular una reserva",
  panelReservas: "Reservas\u00a0· gestión",
};

export const UI: Record<Idioma, Diccionario> = { fr, en, es };
export type ClaveUI = keyof Diccionario;
export type Variables = Record<string, string | number>;

export const NOMBRE_IDIOMA: Record<Idioma, string> = { fr: "Français", en: "English", es: "Español" };

/** ES: Sustituye las {variables} de una cadena. · EN: Replaces the {variables} in a string. */
export function rellenar(cadena: string, vars?: Variables): string {
  if (!vars) return cadena;
  return cadena.replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? String(vars[k]) : `{${k}}`));
}

/**
 * ES: Texto en el idioma pedido; si falta, en el idioma base; si falta, el primero que haya.
 * EN: Text in the requested language; otherwise the base language; otherwise the first available.
 */
export function traducir(t: Texto | undefined, idioma: Idioma, base: Idioma): string {
  if (t === undefined) return "";
  if (typeof t === "string") return t;
  return t[idioma] ?? t[base] ?? Object.values(t).find(Boolean) ?? "";
}

/** ES: Locale de Intl: "fr" + "CA" → "fr-CA". · EN: Intl locale: "fr" + "CA" → "fr-CA". */
export function localeDe(idioma: Idioma, region: string): string {
  return `${idioma}-${region.toUpperCase()}`;
}

/**
 * ES: Precio con el símbolo local: 11,80 $ (fr-CA) · $11.80 (en-CA) · 11,80 € (es-ES).
 * EN: Price with the local symbol: 11,80 $ (fr-CA) · $11.80 (en-CA) · 11,80 € (es-ES).
 */
export function formatoPrecio(valor: number, idioma: Idioma, region: string, moneda: string): string {
  return new Intl.NumberFormat(localeDe(idioma, region), {
    style: "currency",
    currency: moneda,
    currencyDisplay: "narrowSymbol",
  }).format(valor);
}

/**
 * ES: Hora "22:00" a la manera de cada idioma: 22 h (fr) · 10 p.m. (en) · 22:00 (es).
 * EN: Time "22:00" written the way each language does: 22 h (fr) · 10 p.m. (en) · 22:00 (es).
 */
export function formatoHora(hhmm: string, idioma: Idioma, region: string): string {
  const [h, m = 0] = hhmm.split(":").map(Number);
  const mm = String(m).padStart(2, "0");
  if (idioma === "fr") return m ? `${h} h ${mm}` : `${h} h`;
  if (idioma === "es") return `${String(h).padStart(2, "0")}:${mm}`;
  return new Intl.DateTimeFormat(localeDe(idioma, region), {
    hour: "numeric",
    minute: m ? "2-digit" : undefined,
    timeZone: "UTC",
  }).format(new Date(Date.UTC(2024, 0, 1, h, m)));
}

/**
 * ES: Nombre del día (0 = domingo) en el idioma pedido, largo ("mercredi") o corto ("mer.").
 * EN: Day name (0 = Sunday) in the requested language, long ("Wednesday") or short ("Wed").
 */
export function nombreDia(dia: DiaSemana, idioma: Idioma, region: string, estilo: "long" | "short" = "long"): string {
  // ES: El 7 de enero de 2024 fue domingo: sumando el día se obtiene una fecha de ese día de la semana.
  // EN: January 7, 2024 was a Sunday: adding the day gives a date on that weekday.
  return new Intl.DateTimeFormat(localeDe(idioma, region), { weekday: estilo, timeZone: "UTC" }).format(
    new Date(Date.UTC(2024, 0, 7 + dia)),
  );
}

/** ES: Fecha "2026-11-14" escrita entera. · EN: Date "2026-11-14" written out in full. */
export function formatoFecha(iso: string, idioma: Idioma, region: string): string {
  const [a, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(localeDe(idioma, region), { dateStyle: "full", timeZone: "UTC" }).format(
    new Date(Date.UTC(a, m - 1, d)),
  );
}
