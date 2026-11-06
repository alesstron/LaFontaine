"use server";

/**
 * [NO TOCAR · DO NOT EDIT] Motor / Engine · Reservas
 *
 * ES: Acciones de servidor de la página de reserva (/reserver) y de la de anular (/reserver/anular).
 *     Las llaman los hooks de cliente.ts; cada función exportada aquí es una puerta pública del
 *     servidor, así que todas vuelven a validar lo que reciben y nunca devuelven teléfonos ni notas.
 *     Antiabuso: campo trampa, máximo 5 reservas por hora desde una misma conexión y máximo 3
 *     reservas futuras con el mismo teléfono.
 * EN: Server actions for the booking page (/reserver) and the cancel page (/reserver/anular).
 *     The hooks in cliente.ts call them; every function exported here is a public door into the
 *     server, so all of them validate what they receive again and never return phones or notes.
 *     Anti-abuse: trap field, at most 5 bookings per hour from one connection and at most 3 future
 *     bookings with the same phone.
 */
import { cafe } from "@/data/cafe.config";
import { soloDigitos } from "../whatsapp";
import { minutosHasta, relojDelCafe } from "./disponibilidad";
import { baseLista } from "./esquema";
import { fallo, insertarSiCabe, leerDisponibilidad } from "./operaciones";
import { claveLista, esCodigo, esToken, hashToken, huella, ipDelVisitante } from "./seguridad";
import type { Disponibilidad, ReservaConfirmada, ReservaPublica, Respuesta } from "./tipos";
import { validarReserva } from "./validar";

const POR_CONEXION_HORA = 5;
const POR_TELEFONO = 3;

const reloj = () => relojDelCafe(cafe.horario.zonaHoraria);

// ES: En Vercel, sin contraseña del panel nadie podría ver las reservas: no se aceptan (la página dice que aún
//     no están abiertas). En tu ordenador sí, para poder probar sin configurar nada.
// EN: On Vercel, without a panel password nobody could see the bookings: they are not accepted (the page says
//     they are not open yet). On your computer they are, so you can try it without setting anything up.
const cerradas = () => Boolean(process.env.VERCEL) && !claveLista();

/** ES: Días y horas con plazas libres. · EN: Days and times with free seats. */
export async function consultarDisponibilidad(): Promise<Respuesta<{ disponibilidad: Disponibilidad }>> {
  if (!cafe.reservas) return { ok: false, motivo: "error" };
  if (cerradas()) return { ok: false, motivo: "sin-bd" };
  try {
    const bd = await baseLista();
    return { ok: true, disponibilidad: await leerDisponibilidad(bd, cafe, cafe.reservas, reloj()) };
  } catch (error) {
    return fallo(error);
  }
}

/** ES: Guarda la reserva si cabe; devuelve el código y el secreto del enlace para anular. · EN: Saves the booking if it fits; returns the code and the cancel link secret. */
export async function crearReserva(entrada: unknown): Promise<Respuesta<{ reserva: ReservaConfirmada }>> {
  const conf = cafe.reservas;
  if (!conf) return { ok: false, motivo: "error" };
  if (cerradas()) return { ok: false, motivo: "sin-bd" };
  // ES: Un robot rellena todos los campos, también el invisible. · EN: A bot fills in every field, the invisible one too.
  const trampa = (entrada as { web?: unknown } | null)?.web;
  if (typeof trampa === "string" && trampa.trim()) return { ok: false, motivo: "error" };

  const ahora = reloj();
  const validada = validarReserva(entrada, cafe, conf, ahora, "web");
  if (!validada.ok) return { ok: false, motivo: "datos", errores: validada.errores };
  const datos = validada.datos;

  try {
    const bd = await baseLista();
    // ES: La fecha entra en la huella: el mismo visitante da otra huella cada día (no se le puede seguir).
    // EN: The date goes into the fingerprint: the same visitor gets a different one each day (cannot be tracked).
    const conexion = huella(`ip:${ahora.hoy}:${await ipDelVisitante()}`);
    const [cuenta] = await bd.consultar<{ conexion: number; telefono: number }>(
      `SELECT
         (SELECT COUNT(*) FROM reservas WHERE ip_hash = $1 AND creada > now() - interval '1 hour')::int AS conexion,
         (SELECT COUNT(*) FROM reservas WHERE estado = 'confirmada' AND fecha >= $3::date
            AND regexp_replace(telefono, '[^0-9]', '', 'g') = $2)::int AS telefono`,
      [conexion, soloDigitos(datos.telefono), ahora.hoy],
    );
    if (cuenta.conexion >= POR_CONEXION_HORA || cuenta.telefono >= POR_TELEFONO) return { ok: false, motivo: "limite" };
    return await insertarSiCabe(bd, datos, conf.plazasPorTurno, "web", conexion);
  } catch (error) {
    return fallo(error);
  }
}

const SELECCION_PUBLICA = "SELECT codigo, fecha::text AS fecha, hora, personas::int AS personas, nombre, estado FROM reservas";

type FilaPublica = Omit<ReservaPublica, "anulable">;

function aPublica(fila: FilaPublica): ReservaPublica {
  return { ...fila, anulable: fila.estado === "confirmada" && minutosHasta(fila.fecha, fila.hora, reloj()) > 0 };
}

/** ES: La reserva del enlace para anular (sin teléfono ni nota). · EN: The cancel link's booking (no phone or note). */
export async function verReservaParaAnular(codigo: unknown, token: unknown): Promise<Respuesta<{ reserva: ReservaPublica }>> {
  if (!esCodigo(codigo) || !esToken(token)) return { ok: false, motivo: "no-encontrada" };
  try {
    const bd = await baseLista();
    const [fila] = await bd.consultar<FilaPublica>(`${SELECCION_PUBLICA} WHERE codigo = $1 AND token_hash = $2`, [
      codigo,
      hashToken(token),
    ]);
    return fila ? { ok: true, reserva: aPublica(fila) } : { ok: false, motivo: "no-encontrada" };
  } catch (error) {
    return fallo(error);
  }
}

/** ES: Anula la reserva del enlace mientras no haya pasado su hora. · EN: Cancels the link's booking as long as its time has not passed. */
export async function anularReserva(codigo: unknown, token: unknown): Promise<Respuesta<{ reserva: ReservaPublica }>> {
  const vista = await verReservaParaAnular(codigo, token);
  if (!vista.ok || vista.reserva.estado === "anulada") return vista;
  if (!vista.reserva.anulable) return { ok: false, motivo: "pasada" };
  try {
    const bd = await baseLista();
    const [fila] = await bd.consultar<FilaPublica>(
      `UPDATE reservas SET estado = 'anulada', anulada = now(), anulada_por = 'cliente'
       WHERE codigo = $1 AND token_hash = $2 AND estado = 'confirmada'
       RETURNING codigo, fecha::text AS fecha, hora, personas::int AS personas, nombre, estado`,
      [codigo as string, hashToken(token as string)],
    );
    return fila ? { ok: true, reserva: aPublica(fila) } : { ok: false, motivo: "no-encontrada" };
  } catch (error) {
    return fallo(error);
  }
}
