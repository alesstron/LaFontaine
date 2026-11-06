"use server";

/**
 * [NO TOCAR · DO NOT EDIT] Motor / Engine · Reservas
 *
 * ES: Acciones de servidor del panel del café (/reserver/gestion). Todas, salvo `entrar`, empiezan
 *     comprobando la sesión: sin la cookie firmada no devuelven nada.
 *     Entrar: máximo 5 fallos cada 15 minutos por conexión, y cada fallo espera ~1 s antes de contestar.
 * EN: Server actions for the café's panel (/reserver/gestion). All of them except `entrar` start by
 *     checking the session: without the signed cookie they return nothing.
 *     Sign-in: at most 5 failures every 15 minutes per connection, and each failure waits ~1 s before answering.
 */
import { cafe } from "@/data/cafe.config";
import { carpetaLocal, motorElegido } from "./bd";
import { esFecha, relojDelCafe, sumarDias } from "./disponibilidad";
import { baseLista } from "./esquema";
import { SIN_LIMITE, fallo, insertarSiCabe, reconfirmarSiCabe } from "./operaciones";
import { abrirSesion, cerrarSesion, claveCorrecta, claveLista, huella, ipDelVisitante, sesionValida } from "./seguridad";
import type { EstadoBaseDeDatos, ReservaConfirmada, ReservaPanel, Respuesta } from "./tipos";
import { validarReserva } from "./validar";

const MAX_FALLOS = 5;
const VENTANA_FALLOS_MIN = 15;
/** ES: Días que se pueden pedir de una vez al listar. · EN: Days that can be requested at once when listing. */
const MAX_DIAS_LISTA = 31;

const reloj = () => relojDelCafe(cafe.horario.zonaHoraria);
const pausa = () => new Promise((r) => setTimeout(r, 800 + Math.random() * 400));
const SIN_SESION = { ok: false, motivo: "sesion" } as const;

// ES: Si la base no responde, los fallos se cuentan en memoria (vale hasta que el servidor se reinicia).
// EN: If the database does not answer, failures are counted in memory (valid until the server restarts).
const fallosEnMemoria = new Map<string, number[]>();

async function contarFallos(quien: string): Promise<number> {
  try {
    const bd = await baseLista();
    const [fila] = await bd.consultar<{ n: number }>(
      `SELECT COUNT(*)::int AS n FROM reservas_intentos
       WHERE tipo = 'entrar' AND clave = $1 AND creado > now() - make_interval(mins => $2::int)`,
      [quien, VENTANA_FALLOS_MIN],
    );
    return fila.n;
  } catch {
    const desde = Date.now() - VENTANA_FALLOS_MIN * 60_000;
    return (fallosEnMemoria.get(quien) ?? []).filter((t) => t > desde).length;
  }
}

async function anotarFallo(quien: string): Promise<void> {
  fallosEnMemoria.set(quien, [...(fallosEnMemoria.get(quien) ?? []).slice(-MAX_FALLOS), Date.now()]);
  try {
    const bd = await baseLista();
    await bd.consultar("INSERT INTO reservas_intentos (tipo, clave) VALUES ('entrar', $1)", [quien]);
  } catch {
    // ES: Ya quedó anotado en memoria. · EN: Already noted in memory.
  }
}

/** ES: Entra al panel con la contraseña (RESERVAS_CLAVE). · EN: Signs in to the panel with the password (RESERVAS_CLAVE). */
export async function entrar(clave: unknown): Promise<Respuesta> {
  if (!claveLista()) return { ok: false, motivo: "sin-clave" };
  const quien = huella(`entrar:${await ipDelVisitante()}`);
  if ((await contarFallos(quien)) >= MAX_FALLOS) {
    await pausa();
    return { ok: false, motivo: "bloqueado" };
  }
  if (!claveCorrecta(typeof clave === "string" ? clave.slice(0, 500) : "")) {
    await anotarFallo(quien);
    await pausa();
    return { ok: false, motivo: "clave" };
  }
  await abrirSesion();
  return { ok: true };
}

export async function salir(): Promise<Respuesta> {
  await cerrarSesion();
  return { ok: true };
}

/** ES: Qué base se usa y si responde (tarjeta de estado del panel). · EN: Which database is used and whether it answers (panel status card). */
export async function estadoBaseDeDatos(): Promise<Respuesta<{ estado: EstadoBaseDeDatos }>> {
  if (!(await sesionValida())) return SIN_SESION;
  const motor = motorElegido();
  if (!motor) {
    const problema = process.env.DATABASE_URL?.trim() ? "url-invalida" : "sin-url";
    return { ok: true, estado: { motor: null, conectada: false, problema } };
  }
  try {
    const bd = await baseLista();
    const [fila] = await bd.consultar<{ n: number }>("SELECT COUNT(*)::int AS n FROM reservas");
    const ubicacion = motor === "pglite" ? carpetaLocal() : undefined;
    return { ok: true, estado: { motor, conectada: true, total: fila.n, ubicacion } };
  } catch (error) {
    const detalle = error instanceof Error ? error.message.slice(0, 300) : String(error);
    console.error("[reservas] estado", error);
    return { ok: true, estado: { motor, conectada: false, problema: "conexion", detalle } };
  }
}

/**
 * ES: Reservas de `dias` días desde `desde` (vacío = hoy), anuladas incluidas, con teléfono y nota.
 * EN: Bookings for `dias` days from `desde` (empty = today), cancelled ones included, with phone and note.
 */
export async function listarReservas(
  desde: unknown,
  dias: unknown,
): Promise<Respuesta<{ hoy: string; desde: string; dias: number; reservas: ReservaPanel[]; plazasPorTurno: number }>> {
  if (!(await sesionValida())) return SIN_SESION;
  if (!cafe.reservas) return { ok: false, motivo: "error" };
  const { hoy } = reloj();
  const inicio = typeof desde === "string" && esFecha(desde) ? desde : hoy;
  const n = typeof dias === "number" && Number.isInteger(dias) ? Math.min(Math.max(dias, 1), MAX_DIAS_LISTA) : 7;
  try {
    const bd = await baseLista();
    const reservas = await bd.consultar<ReservaPanel>(
      `SELECT id, codigo, fecha::text AS fecha, hora, personas::int AS personas, nombre, telefono, nota, idioma, origen,
              estado, to_char(creada AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS creada, anulada_por AS "anuladaPor"
       FROM reservas WHERE fecha BETWEEN $1::date AND $2::date ORDER BY fecha, hora, creada`,
      [inicio, sumarDias(inicio, n - 1)],
    );
    return { ok: true, hoy, desde: inicio, dias: n, reservas, plazasPorTurno: cafe.reservas.plazasPorTurno };
  } catch (error) {
    return fallo(error);
  }
}

const esId = (id: unknown): id is number => typeof id === "number" && Number.isInteger(id) && id > 0;

/** ES: El café anula una reserva (queda en la lista como anulada). · EN: The café cancels a booking (it stays listed as cancelled). */
export async function anularDesdePanel(id: unknown): Promise<Respuesta> {
  if (!(await sesionValida())) return SIN_SESION;
  if (!esId(id)) return { ok: false, motivo: "no-encontrada" };
  try {
    const bd = await baseLista();
    const filas = await bd.consultar(
      "UPDATE reservas SET estado = 'anulada', anulada = now(), anulada_por = 'cafe' WHERE id = $1 AND estado = 'confirmada' RETURNING id",
      [id],
    );
    return filas.length ? { ok: true } : { ok: false, motivo: "no-encontrada" };
  } catch (error) {
    return fallo(error);
  }
}

/** ES: Vuelve a confirmar una reserva anulada, si su turno todavía tiene sitio. · EN: Confirms a cancelled booking again, if its slot still has room. */
export async function restaurarReserva(id: unknown): Promise<Respuesta> {
  if (!(await sesionValida())) return SIN_SESION;
  if (!esId(id) || !cafe.reservas) return { ok: false, motivo: "no-encontrada" };
  try {
    const bd = await baseLista();
    return (await reconfirmarSiCabe(bd, id, cafe.reservas, reloj())) ? { ok: true } : { ok: false, motivo: "completo" };
  } catch (error) {
    return fallo(error);
  }
}

/**
 * ES: El café apunta una reserva que le han hecho por teléfono o en persona. Con `forzar: true` entra aunque el
 *     turno esté lleno (el café sabe si cabe una mesa más).
 * EN: The café records a booking made by phone or in person. With `forzar: true` it goes in even if the slot is
 *     full (the café knows whether one more table fits).
 */
export async function crearReservaTelefono(entrada: unknown): Promise<Respuesta<{ reserva: ReservaConfirmada }>> {
  if (!(await sesionValida())) return SIN_SESION;
  const conf = cafe.reservas;
  if (!conf) return { ok: false, motivo: "error" };
  const validada = validarReserva(entrada, cafe, conf, reloj(), "telefono");
  if (!validada.ok) return { ok: false, motivo: "datos", errores: validada.errores };
  try {
    const bd = await baseLista();
    const forzar = (entrada as { forzar?: unknown } | null)?.forzar === true;
    return await insertarSiCabe(bd, validada.datos, forzar ? SIN_LIMITE : conf.plazasPorTurno, "telefono", null);
  } catch (error) {
    return fallo(error);
  }
}
