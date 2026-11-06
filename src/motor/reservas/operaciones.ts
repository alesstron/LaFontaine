/**
 * [NO TOCAR · DO NOT EDIT] Motor / Engine · Reservas
 *
 * ES: Operaciones con la base de datos que comparten la página de reserva (acciones.ts) y el panel
 *     (gestion.ts). No son acciones de servidor: el navegador no puede llamarlas directamente.
 *     La regla de las plazas vive aquí: en un turno no pueden llegar más personas que plazasPorTurno.
 *     Se comprueba y se guarda dentro de la misma transacción, con un cerrojo por turno, así que si dos
 *     personas cogen la última plaza a la vez solo entra una (la otra recibe "completo").
 * EN: Database operations shared by the booking page (acciones.ts) and the panel (gestion.ts). They are
 *     not server actions: the browser cannot call them directly.
 *     The seats rule lives here: no more than plazasPorTurno people can arrive in one slot. It is checked
 *     and saved inside the same transaction, with one lock per slot, so if two people take the last seat
 *     at once only one gets in (the other one receives "completo").
 */
import "server-only";
import type { CafeConfig, ReservasConfig } from "../tipos";
import { BaseSinConfigurar, type BaseDeDatos } from "./bd";
import { horasReservables, ventanaDeDias, type Reloj } from "./disponibilidad";
import { hashToken, nuevoCodigo, nuevoToken } from "./seguridad";
import type { Disponibilidad, MotivoFallo, ReservaConfirmada } from "./tipos";
import type { ReservaValida } from "./validar";

// ES: Suma de personas confirmadas de un turno. · EN: Sum of confirmed people in a slot.
const OCUPADAS = "SELECT COALESCE(SUM(personas), 0)::int FROM reservas WHERE fecha = $3::date AND hora = $4 AND estado = 'confirmada'";

const INSERTAR_SI_CABE = `
  INSERT INTO reservas (codigo, token_hash, fecha, hora, personas, nombre, telefono, nota, idioma, origen, ip_hash)
  SELECT $1, $2, $3::date, $4, $5::int, $6, $7, $8, $9, $10, $11
  WHERE (${OCUPADAS}) + $5::int <= $12::int
  RETURNING id`;

/**
 * ES: Cerrojo del turno, se suelta solo al terminar la transacción. La forma de dos números (72026002, turno) tiene
 *     su propio espacio de claves: nunca choca con el cerrojo de crear las tablas (esquema.ts).
 * EN: Slot lock, released when the transaction ends. The two-number form (72026002, slot) has its own key space:
 *     it never clashes with the table-creation lock (esquema.ts).
 */
export const cerrojoDelTurno = (fecha: string, hora: string) => ({
  texto: "SELECT pg_advisory_xact_lock(72026002, hashtext($1))",
  valores: [`turno ${fecha} ${hora}`],
});

/** ES: Cupo para las reservas que el café fuerza desde el panel aunque el turno esté lleno. · EN: Seat cap for bookings the café forces from the panel even if the slot is full. */
export const SIN_LIMITE = 10_000;

/**
 * ES: Convierte un error en la respuesta para la pantalla y deja el detalle en el registro del servidor
 *     (en Vercel: pestaña Logs del proyecto).
 * EN: Turns an error into the answer for the screen and leaves the detail in the server log
 *     (on Vercel: the project's Logs tab).
 */
export function fallo(error: unknown): { ok: false; motivo: MotivoFallo } {
  if (error instanceof BaseSinConfigurar) return { ok: false, motivo: "sin-bd" };
  console.error("[reservas]", error);
  return { ok: false, motivo: "bd-caida" };
}

/** ES: Días de la ventana con las plazas libres de cada hora. · EN: Window days with the free seats of each time. */
export async function leerDisponibilidad(
  bd: BaseDeDatos,
  cafe: CafeConfig,
  conf: ReservasConfig,
  reloj: Reloj,
): Promise<Disponibilidad> {
  const fechas = ventanaDeDias(reloj.hoy, conf.diasVista);
  const ocupadas = await bd.consultar<{ fecha: string; hora: string; personas: number }>(
    `SELECT fecha::text AS fecha, hora, SUM(personas)::int AS personas FROM reservas
     WHERE estado = 'confirmada' AND fecha BETWEEN $1::date AND $2::date GROUP BY fecha, hora`,
    [fechas[0], fechas[fechas.length - 1]],
  );
  const porTurno = new Map(ocupadas.map((o) => [`${o.fecha} ${o.hora}`, o.personas]));
  return {
    hoy: reloj.hoy,
    plazasPorTurno: conf.plazasPorTurno,
    maxPersonas: conf.maxPersonas,
    dias: fechas.map((fecha) => ({
      fecha,
      turnos: horasReservables(cafe, conf, fecha, reloj).map((hora) => ({
        hora,
        libres: Math.max(0, conf.plazasPorTurno - (porTurno.get(`${fecha} ${hora}`) ?? 0)),
      })),
    })),
  };
}

/**
 * ES: Guarda la reserva si cabe en su turno (`cupo` = plazasPorTurno, o SIN_LIMITE si el café la fuerza).
 *     Devuelve "completo" si no cabe.
 * EN: Saves the booking if it fits in its slot (`cupo` = plazasPorTurno, or SIN_LIMITE if the café forces it).
 *     Returns "completo" if it does not fit.
 */
export async function insertarSiCabe(
  bd: BaseDeDatos,
  datos: ReservaValida,
  cupo: number,
  origen: "web" | "telefono",
  ipHash: string | null,
): Promise<{ ok: true; reserva: ReservaConfirmada } | { ok: false; motivo: "completo" }> {
  // ES: Hasta 3 intentos por si el código al azar ya existiera (casi imposible). · EN: Up to 3 tries in case the random code already exists (almost impossible).
  for (let intento = 1; ; intento++) {
    const codigo = nuevoCodigo();
    const token = nuevoToken();
    try {
      const [, filas] = await bd.transaccion([
        cerrojoDelTurno(datos.fecha, datos.hora),
        {
          texto: INSERTAR_SI_CABE,
          valores: [
            codigo,
            hashToken(token),
            datos.fecha,
            datos.hora,
            datos.personas,
            datos.nombre,
            datos.telefono,
            datos.nota,
            datos.idioma,
            origen,
            ipHash,
            cupo,
          ],
        },
      ]);
      if (!filas.length) return { ok: false, motivo: "completo" };
      const { fecha, hora, personas, nombre } = datos;
      return { ok: true, reserva: { codigo, token, fecha, hora, personas, nombre } };
    } catch (error) {
      // ES: 23505 = valor repetido en una columna única (el código). · EN: 23505 = duplicate value in a unique column (the code).
      if ((error as { code?: string }).code === "23505" && intento < 3) continue;
      throw error;
    }
  }
}

/**
 * ES: Vuelve a confirmar una reserva anulada si todavía cabe en su turno (panel → "Restaurar").
 * EN: Confirms a cancelled booking again if it still fits in its slot (panel → "Restore").
 */
export async function reconfirmarSiCabe(bd: BaseDeDatos, id: number, conf: ReservasConfig, reloj: Reloj) {
  const [reserva] = await bd.consultar<{ fecha: string; hora: string }>(
    "SELECT fecha::text AS fecha, hora FROM reservas WHERE id = $1 AND estado = 'anulada' AND fecha >= $2::date",
    [id, reloj.hoy],
  );
  if (!reserva) return false;
  const [, filas] = await bd.transaccion([
    cerrojoDelTurno(reserva.fecha, reserva.hora),
    {
      // ES: Mismos $3/$4 que OCUPADAS para reutilizar la suma. · EN: Same $3/$4 as OCUPADAS to reuse the sum.
      texto: `UPDATE reservas SET estado = 'confirmada', anulada = NULL, anulada_por = NULL
              WHERE id = $1::int AND estado = 'anulada' AND (${OCUPADAS}) + personas <= $2::int RETURNING id`,
      valores: [id, conf.plazasPorTurno, reserva.fecha, reserva.hora],
    },
  ]);
  return filas.length > 0;
}
