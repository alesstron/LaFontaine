/**
 * [NO TOCAR · DO NOT EDIT] Motor / Engine · Reservas
 *
 * ES: Comprueba una reserva campo a campo. El servidor la pasa siempre (lo que llega del navegador puede
 *     venir manipulado); la pantalla usa validarContacto() para avisar antes de enviar.
 *     Dos modos: "web" (cliente: ventana de días, máximo de personas y antelación) y "telefono" (el café
 *     desde su panel: hasta un año vista, grupos de hasta las plazas del turno y sin antelación).
 * EN: Checks a booking field by field. The server always runs it (what arrives from the browser may have
 *     been tampered with); the screen uses validarContacto() to warn before sending.
 *     Two modes: "web" (guest: day window, people limit and advance notice) and "telefono" (the café from
 *     its panel: up to a year ahead, groups up to the slot's seats and no advance notice).
 */
import { sanitize, soloDigitos } from "../whatsapp";
import type { CafeConfig, Idioma, ReservasConfig } from "../tipos";
import { diasEntre, esFecha, horasDelDia, minutosHasta, type Reloj } from "./disponibilidad";
import type { ErroresReserva } from "./tipos";

/** ES: Longitud máxima de cada texto. · EN: Maximum length of each text. */
export const LIMITES = { nombre: 60, telefono: 30, nota: 300 } as const;

/** ES: Días vista para las reservas por teléfono. · EN: Days ahead for phone bookings. */
const DIAS_TELEFONO = 365;

export interface ReservaValida {
  fecha: string;
  hora: string;
  personas: number;
  nombre: string;
  telefono: string;
  nota: string;
  idioma: Idioma;
}

type Campos = Record<string, unknown>;
const texto = (v: unknown) => (typeof v === "string" ? v : "");

/**
 * ES: Nombre, teléfono y nota. Devuelve los textos limpios y los errores (vacío = todo bien).
 * EN: Name, phone and note. Returns the cleaned texts and the errors (empty = all good).
 */
export function validarContacto(entrada: unknown): {
  limpio: { nombre: string; telefono: string; nota: string };
  errores: ErroresReserva;
} {
  const e: Campos = typeof entrada === "object" && entrada ? (entrada as Campos) : {};
  const errores: ErroresReserva = {};
  const nombre = sanitize(texto(e.nombre), 1000);
  const telefono = sanitize(texto(e.telefono), 1000);
  const nota = sanitize(texto(e.nota), 2000);

  if (!nombre) errores.nombre = "requerido";
  else if (nombre.length > LIMITES.nombre) errores.nombre = "largo";

  // ES: Entre 7 y 15 cifras (norma E.164), con espacios, guiones, puntos, paréntesis o "+".
  // EN: Between 7 and 15 digits (E.164 standard), with spaces, dashes, dots, brackets or "+".
  const cifras = soloDigitos(telefono).length;
  if (!telefono) errores.telefono = "requerido";
  else if (telefono.length > LIMITES.telefono) errores.telefono = "largo";
  else if (!/^[\d\s().+-]+$/.test(telefono) || cifras < 7 || cifras > 15) errores.telefono = "invalido";

  if (nota.length > LIMITES.nota) errores.nota = "largo";
  return { limpio: { nombre, telefono, nota }, errores };
}

/**
 * ES: La reserva entera. `reloj` = hoy y la hora actual en el café (relojDelCafe en disponibilidad.ts).
 * EN: The whole booking. `reloj` = today and the current time at the café (relojDelCafe in disponibilidad.ts).
 */
export function validarReserva(
  entrada: unknown,
  cafe: CafeConfig,
  conf: ReservasConfig,
  reloj: Reloj,
  modo: "web" | "telefono",
): { ok: true; datos: ReservaValida } | { ok: false; errores: ErroresReserva } {
  const e: Campos = typeof entrada === "object" && entrada ? (entrada as Campos) : {};
  const { limpio, errores } = validarContacto(e);
  const web = modo === "web";

  const personas = e.personas;
  const maxPersonas = web ? conf.maxPersonas : conf.plazasPorTurno;
  if (typeof personas !== "number" || !Number.isInteger(personas)) errores.personas = "invalido";
  else if (personas < 1 || personas > maxPersonas) errores.personas = "fuera";

  const fecha = texto(e.fecha);
  const hora = texto(e.hora);
  const diasVista = web ? conf.diasVista : DIAS_TELEFONO;
  if (!fecha) errores.fecha = "requerido";
  else if (!esFecha(fecha)) errores.fecha = "invalido";
  else if (diasEntre(reloj.hoy, fecha) < 0 || diasEntre(reloj.hoy, fecha) >= diasVista) errores.fecha = "fuera";
  else if (horasDelDia(cafe, conf, fecha).length === 0) errores.fecha = "cerrado";

  if (!errores.fecha) {
    if (!hora) errores.hora = "requerido";
    else if (!horasDelDia(cafe, conf, fecha).includes(hora)) errores.hora = "invalido";
    else if (minutosHasta(fecha, hora, reloj) < 0) errores.hora = "pasada";
    else if (web && minutosHasta(fecha, hora, reloj) < conf.antelacionMin) errores.hora = "antelacion";
  }

  if (Object.keys(errores).length) return { ok: false, errores };
  const idioma = cafe.idiomas.includes(e.idioma as Idioma) ? (e.idioma as Idioma) : cafe.idiomaBase;
  return { ok: true, datos: { fecha, hora, personas: personas as number, ...limpio, idioma } };
}
