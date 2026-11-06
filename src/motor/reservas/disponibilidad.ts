/**
 * [NO TOCAR · DO NOT EDIT] Motor / Engine · Reservas
 *
 * ES: Cálculos de fechas y horas de las reservas, sin base de datos (sirven igual en el servidor y en el
 *     navegador). Todo va en la hora local del café (cafe.horario.zonaHoraria), nunca en la del visitante
 *     ni en la del servidor, que en Vercel está en UTC.
 *     Qué horas salen: las de horasParaReserva() (cada `paso` minutos, hasta 1 h antes del cierre),
 *     quitando las que ya pasaron o están a menos de `antelacionMin` minutos.
 * EN: Booking date and time maths, without a database (they work the same on the server and in the
 *     browser). Everything is in the café's local time (cafe.horario.zonaHoraria), never the visitor's
 *     nor the server's, which is UTC on Vercel.
 *     Which times show: those from horasParaReserva() (every `paso` minutes, up to 1 h before closing),
 *     minus the ones already past or less than `antelacionMin` minutes away.
 */
import { aMinutos, ahoraEn, fechaHoyEn, horasParaReserva } from "../horario";
import type { CafeConfig, ReservasConfig } from "../tipos";

const DIA_MS = 86_400_000;

function aUTC(fecha: string): number {
  const [a, m, d] = fecha.split("-").map(Number);
  return Date.UTC(a, m - 1, d);
}

/** ES: ¿Es una fecha real "AAAA-MM-DD"? ("2026-02-30" no lo es). · EN: Is it a real "YYYY-MM-DD" date? ("2026-02-30" is not). */
export function esFecha(texto: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;
  const t = aUTC(texto);
  return !Number.isNaN(t) && new Date(t).toISOString().slice(0, 10) === texto;
}

/** ES: "2026-11-30" + 1 → "2026-12-01". · EN: "2026-11-30" + 1 → "2026-12-01". */
export function sumarDias(fecha: string, n: number): string {
  return new Date(aUTC(fecha) + n * DIA_MS).toISOString().slice(0, 10);
}

/** ES: Días de `desde` a `hasta` (negativo si `hasta` va antes). · EN: Days from `desde` to `hasta` (negative if `hasta` comes first). */
export function diasEntre(desde: string, hasta: string): number {
  return Math.round((aUTC(hasta) - aUTC(desde)) / DIA_MS);
}

/** ES: `n` fechas seguidas desde `inicio`. · EN: `n` consecutive dates from `inicio`. */
export function ventanaDeDias(inicio: string, n: number): string[] {
  return Array.from({ length: n }, (_, i) => sumarDias(inicio, i));
}

/** ES: Hoy y la hora actual en el café, calculados una vez. · EN: Today and the current time at the café, computed once. */
export interface Reloj {
  hoy: string;
  /** ES: Minutos desde medianoche. · EN: Minutes since midnight. */
  minutos: number;
}

export function relojDelCafe(zona: string, ahora: Date = new Date()): Reloj {
  return { hoy: fechaHoyEn(zona, ahora), minutos: ahoraEn(zona, ahora).minutos };
}

/** ES: Minutos que faltan para fecha + hora (negativo = ya pasó). · EN: Minutes left until date + time (negative = already past). */
export function minutosHasta(fecha: string, hora: string, reloj: Reloj): number {
  return diasEntre(reloj.hoy, fecha) * 1440 + aMinutos(hora) - reloj.minutos;
}

/**
 * ES: Todas las horas de un día según el horario, pasen o no. Vacío en los días de `cerrados`.
 * EN: Every time of a day according to the hours, past or not. Empty on `cerrados` days.
 */
export function horasDelDia(cafe: CafeConfig, conf: ReservasConfig, fecha: string): string[] {
  if (conf.cerrados?.includes(fecha)) return [];
  return horasParaReserva(cafe.horario.franjas, fecha, conf.paso);
}

/**
 * ES: Horas que todavía se pueden reservar en `fecha`. Vacío si el día está fuera de la ventana o cerrado.
 *     `antelacion` = 0 para las reservas que añade el café desde el panel.
 * EN: Times that can still be booked on `fecha`. Empty if the day is outside the window or closed.
 *     `antelacion` = 0 for the bookings the café adds from the panel.
 */
export function horasReservables(
  cafe: CafeConfig,
  conf: ReservasConfig,
  fecha: string,
  reloj: Reloj,
  antelacion = conf.antelacionMin,
): string[] {
  const d = diasEntre(reloj.hoy, fecha);
  if (d < 0 || d >= conf.diasVista) return [];
  return horasDelDia(cafe, conf, fecha).filter((h) => minutosHasta(fecha, h, reloj) >= antelacion);
}
