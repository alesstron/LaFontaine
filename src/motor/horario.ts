/**
 * [NO TOCAR · DO NOT EDIT] Motor / Engine
 *
 * ES: Horario: si el café está abierto ahora (en su zona horaria, no en la del visitante), cuándo abre
 *     o cierra, la semana agrupada para mostrarla y las horas de recogida de un pedido.
 *     El horario se cambia en src/data/cafe.config.ts (horario.franjas), no aquí.
 * EN: Opening hours: whether the café is open now (in its own time zone, not the visitor's), when it
 *     opens or closes, the grouped week for display and the pickup times for an order.
 *     Hours are changed in src/data/cafe.config.ts (horario.franjas), not here.
 */
import { UI, formatoHora, nombreDia } from "./textos";
import type { DiaSemana, Franja, Idioma } from "./tipos";

const DIA_EN: Record<string, DiaSemana> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

/** ES: "22:30" → 1350 minutos desde medianoche. · EN: "22:30" → 1350 minutes since midnight. */
export function aMinutos(hhmm: string): number {
  const [h, m = 0] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function aHHMM(minutos: number): string {
  const m = ((minutos % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

/** ES: Día y minutos actuales en la zona horaria del café. · EN: Current weekday and minutes in the café's time zone. */
export function ahoraEn(zona: string, fecha: Date = new Date()): { dia: DiaSemana; minutos: number } {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: zona,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(fecha);
  const valor = (tipo: string) => partes.find((p) => p.type === tipo)?.value ?? "0";
  return { dia: DIA_EN[valor("weekday")] ?? 0, minutos: Number(valor("hour")) * 60 + Number(valor("minute")) };
}

export type EstadoHorario =
  | { abierto: true; cierra: string }
  | { abierto: false; abre?: { dia: DiaSemana; hora: string; enDias: number } };

/**
 * ES: ¿Está abierto ahora? Si sí, a qué hora cierra; si no, cuándo vuelve a abrir.
 * EN: Is it open now? If so, when it closes; if not, when it opens again.
 */
export function estadoHorario(franjas: Franja[], zona: string, fecha: Date = new Date()): EstadoHorario {
  const { dia, minutos } = ahoraEn(zona, fecha);
  const ayer = ((dia + 6) % 7) as DiaSemana;
  for (const f of franjas) {
    const abre = aMinutos(f.abre);
    let cierra = aMinutos(f.cierra);
    const cruzaMedianoche = cierra <= abre;
    if (cruzaMedianoche) cierra += 1440;
    if (f.dia === dia && minutos >= abre && minutos < cierra) return { abierto: true, cierra: f.cierra };
    // ES: Franja de ayer que sigue abierta pasada la medianoche.
    // EN: Yesterday's slot that is still open after midnight.
    if (cruzaMedianoche && f.dia === ayer && minutos < cierra - 1440) return { abierto: true, cierra: f.cierra };
  }
  // ES: Próxima apertura: hoy más tarde o en los 7 días siguientes.
  // EN: Next opening: later today or within the next 7 days.
  for (let k = 0; k <= 7; k++) {
    const d = ((dia + k) % 7) as DiaSemana;
    const delDia = franjas.filter((f) => f.dia === d).sort((a, b) => aMinutos(a.abre) - aMinutos(b.abre));
    const siguiente = delDia.find((f) => k > 0 || aMinutos(f.abre) > minutos);
    if (siguiente) return { abierto: false, abre: { dia: d, hora: siguiente.abre, enDias: k } };
  }
  return { abierto: false };
}

/** ES: Frase del estado: "Ferme à 22 h", "Ouvre demain à 10 h"… · EN: Status sentence: "Closes at 10 p.m."… */
export function fraseEstado(estado: EstadoHorario, idioma: Idioma, region: string): string {
  const ui = UI[idioma];
  const hora = (h: string) => formatoHora(h, idioma, region);
  if (estado.abierto) return ui.cierraA.replace("{hora}", hora(estado.cierra));
  if (!estado.abre) return ui.cerradoAhora;
  const { dia, enDias } = estado.abre;
  const plantilla = enDias === 0 ? ui.abreHoy : enDias === 1 ? ui.abreManana : ui.abreDia;
  return plantilla.replace("{hora}", hora(estado.abre.hora)).replace("{dia}", nombreDia(dia, idioma, region));
}

export interface DiaHorario {
  dia: DiaSemana;
  nombre: string;
  /** ES: "10 h – 22 h", varias franjas separadas por coma, o "Fermé". · EN: "10 a.m. – 10 p.m.", comma-separated slots, or "Closed". */
  horas: string;
  cerrado: boolean;
}

function horasDelDia(franjas: Franja[], dia: DiaSemana, idioma: Idioma, region: string): string {
  const delDia = franjas.filter((f) => f.dia === dia).sort((a, b) => aMinutos(a.abre) - aMinutos(b.abre));
  if (!delDia.length) return UI[idioma].cerrado;
  return delDia.map((f) => `${formatoHora(f.abre, idioma, region)} – ${formatoHora(f.cierra, idioma, region)}`).join(", ");
}

/** ES: Los 7 días en orden desde `inicio` (1 = lunes, 0 = domingo). · EN: The 7 days in order from `inicio` (1 = Monday, 0 = Sunday). */
export function semana(franjas: Franja[], idioma: Idioma, region: string, inicio: DiaSemana = 1): DiaHorario[] {
  return Array.from({ length: 7 }, (_, i) => {
    const dia = ((inicio + i) % 7) as DiaSemana;
    return {
      dia,
      nombre: nombreDia(dia, idioma, region),
      horas: horasDelDia(franjas, dia, idioma, region),
      cerrado: !franjas.some((f) => f.dia === dia),
    };
  });
}

export interface GrupoHorario {
  dias: DiaSemana[];
  /** ES: "Dimanche" o "dim. – mer." · EN: "Sunday" or "Sun – Wed" */
  etiqueta: string;
  horas: string;
  cerrado: boolean;
}

/**
 * ES: La semana agrupando días seguidos con el mismo horario: "dim. – mer. · 10 h – 22 h".
 * EN: The week grouping consecutive days with the same hours: "Sun – Wed · 10 a.m. – 10 p.m.".
 */
export function semanaAgrupada(franjas: Franja[], idioma: Idioma, region: string, inicio: DiaSemana = 1): GrupoHorario[] {
  const grupos: GrupoHorario[] = [];
  for (const d of semana(franjas, idioma, region, inicio)) {
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.horas === d.horas) ultimo.dias.push(d.dia);
    else grupos.push({ dias: [d.dia], etiqueta: "", horas: d.horas, cerrado: d.cerrado });
  }
  for (const g of grupos) {
    const corto = (dia: DiaSemana) => nombreDia(dia, idioma, region, "short");
    g.etiqueta = g.dias.length === 1 ? nombreDia(g.dias[0], idioma, region) : `${corto(g.dias[0])} – ${corto(g.dias[g.dias.length - 1])}`;
  }
  return grupos;
}

/**
 * ES: Fecha de hoy en la zona del café, en formato "2026-11-01" (el que usan los <input type="date">).
 * EN: Today's date in the café's time zone, as "2026-11-01" (the format <input type="date"> uses).
 */
export function fechaHoyEn(zona: string, fecha: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: zona, year: "numeric", month: "2-digit", day: "2-digit" }).format(fecha);
}

/**
 * ES: Horas de reserva para una fecha ("2026-11-14"): cada `paso` minutos, hasta una hora antes del cierre.
 * EN: Booking times for a date ("2026-11-14"): every `paso` minutes, up to one hour before closing.
 */
export function horasParaReserva(franjas: Franja[], fechaISO: string, paso = 30): string[] {
  const [a, m, d] = fechaISO.split("-").map(Number);
  if (!a || !m || !d) return [];
  const dia = new Date(Date.UTC(a, m - 1, d)).getUTCDay() as DiaSemana;
  const horas: string[] = [];
  for (const f of franjas.filter((x) => x.dia === dia).sort((x, y) => aMinutos(x.abre) - aMinutos(y.abre))) {
    const abre = aMinutos(f.abre);
    let cierra = aMinutos(f.cierra);
    if (cierra <= abre) cierra += 1440;
    for (let min = Math.ceil(abre / paso) * paso; min <= cierra - 60; min += paso) horas.push(aHHMM(min));
  }
  return horas;
}

/**
 * ES: Horas de recogida posibles para hoy, cada `paso` minutos, desde ahora + `margen` hasta el cierre.
 *     Vacío si hoy ya no abre. Las devuelve en "HH:MM" (hora local del café).
 * EN: Possible pickup times for today, every `paso` minutes, from now + `margen` until closing.
 *     Empty if it no longer opens today. Returned as "HH:MM" (café local time).
 */
export function horasDeRecogida(franjas: Franja[], zona: string, paso = 15, margen = 20, fecha: Date = new Date()): string[] {
  const { dia, minutos } = ahoraEn(zona, fecha);
  const desde = Math.ceil((minutos + margen) / paso) * paso;
  const horas: string[] = [];
  for (const f of franjas.filter((x) => x.dia === dia)) {
    const abre = aMinutos(f.abre);
    let cierra = aMinutos(f.cierra);
    if (cierra <= abre) cierra += 1440;
    // ES: Último pedido 10 minutos antes del cierre. · EN: Last order 10 minutes before closing.
    for (let m = Math.max(desde, Math.ceil(abre / paso) * paso); m <= cierra - 10; m += paso) horas.push(aHHMM(m));
  }
  return horas;
}
