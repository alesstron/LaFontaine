/**
 * [NO TOCAR · DO NOT EDIT] Motor / Engine · Reservas
 *
 * ES: Tablas de las reservas. Se crean solas la primera vez que se usa la base (en Neon no hay que
 *     ejecutar nada a mano) y, de paso, se borran las reservas viejas: se guardan 30 días después de
 *     su fecha y luego desaparecen (privacidad, Ley 25 de Quebec).
 * EN: Booking tables. They create themselves the first time the database is used (nothing to run by
 *     hand on Neon) and, along the way, old bookings are deleted: they are kept 30 days after their
 *     date and then disappear (privacy, Quebec's Law 25).
 *
 *   reservas
 *   ┌─────────────┬───────────────────────────────────────────────────────────────────────────┐
 *   │ id          │ ES: número interno · EN: internal number                                  │
 *   │ codigo      │ "7KQ-3XA": lo que ve el cliente · what the guest sees                     │
 *   │ token_hash  │ huella del enlace para anular · fingerprint of the cancel link           │
 *   │ fecha, hora │ 2026-11-14, "08:30" (hora local del café · café local time)               │
 *   │ personas    │ 1…                                                                        │
 *   │ nombre, telefono, nota, idioma                                                          │
 *   │ origen      │ web | telefono (añadida desde el panel · added from the panel)            │
 *   │ estado      │ confirmada | anulada (+ anulada, anulada_por: cliente | cafe)             │
 *   │ creada      │ cuándo se hizo · when it was made                                         │
 *   │ ip_hash     │ huella de la conexión, para frenar abusos · connection fingerprint        │
 *   └─────────────┴───────────────────────────────────────────────────────────────────────────┘
 *   reservas_intentos: ES: intentos fallidos de entrar al panel (se borran a las 24 h)
 *                      EN: failed panel sign-in attempts (deleted after 24 h)
 */
import "server-only";
import { conectar, type BaseDeDatos } from "./bd";
import { LIMITES } from "./validar";

/** ES: Días que se guarda una reserva después de su fecha. · EN: Days a booking is kept after its date. */
export const DIAS_GUARDADAS = 30;

// ES: Las comprobaciones (CHECK) repiten los límites de validar.ts por si algo se colara. Cambiar este texto no
//     altera una tabla que ya existe: una columna nueva se añade con ALTER TABLE … ADD COLUMN IF NOT EXISTS.
// EN: The CHECK constraints repeat validar.ts's limits in case anything slipped through. Changing this text does
//     not alter a table that already exists: a new column is added with ALTER TABLE … ADD COLUMN IF NOT EXISTS.
const CREAR = [
  // ES: Cerrojo: si dos servidores arrancan a la vez, el segundo espera en vez de chocar al crear las tablas.
  // EN: Lock: if two servers start at once, the second one waits instead of clashing while creating tables.
  "SELECT pg_advisory_xact_lock(72026001)",
  `CREATE TABLE IF NOT EXISTS reservas (
    id          SERIAL PRIMARY KEY,
    codigo      TEXT NOT NULL UNIQUE,
    token_hash  TEXT NOT NULL,
    fecha       DATE NOT NULL,
    hora        TEXT NOT NULL CHECK (hora ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'),
    personas    SMALLINT NOT NULL CHECK (personas BETWEEN 1 AND 500),
    nombre      TEXT NOT NULL CHECK (char_length(nombre) BETWEEN 1 AND ${LIMITES.nombre}),
    telefono    TEXT NOT NULL CHECK (char_length(telefono) BETWEEN 1 AND ${LIMITES.telefono}),
    nota        TEXT NOT NULL DEFAULT '' CHECK (char_length(nota) <= ${LIMITES.nota}),
    idioma      TEXT NOT NULL DEFAULT 'fr' CHECK (idioma IN ('fr', 'en', 'es')),
    origen      TEXT NOT NULL DEFAULT 'web' CHECK (origen IN ('web', 'telefono')),
    estado      TEXT NOT NULL DEFAULT 'confirmada' CHECK (estado IN ('confirmada', 'anulada')),
    creada      TIMESTAMPTZ NOT NULL DEFAULT now(),
    anulada     TIMESTAMPTZ,
    anulada_por TEXT CHECK (anulada_por IN ('cliente', 'cafe')),
    ip_hash     TEXT
  )`,
  // ES: Para sumar rápido las plazas ocupadas de un turno y contar las reservas recientes de una conexión.
  // EN: To add up a slot's taken seats quickly and count a connection's recent bookings.
  "CREATE INDEX IF NOT EXISTS reservas_turno ON reservas (fecha, hora) WHERE estado = 'confirmada'",
  "CREATE INDEX IF NOT EXISTS reservas_conexion ON reservas (ip_hash, creada) WHERE ip_hash IS NOT NULL",
  `CREATE TABLE IF NOT EXISTS reservas_intentos (
    id      SERIAL PRIMARY KEY,
    tipo    TEXT NOT NULL,
    clave   TEXT NOT NULL,
    creado  TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  "CREATE INDEX IF NOT EXISTS reservas_intentos_clave ON reservas_intentos (tipo, clave, creado)",
];

const PURGAR = [
  `DELETE FROM reservas WHERE fecha < CURRENT_DATE - ${DIAS_GUARDADAS}`,
  "DELETE FROM reservas_intentos WHERE creado < now() - interval '1 day'",
];

// ES: Cada cuánto se repite el borrado mientras el servidor sigue encendido. · EN: How often the clean-up repeats while the server stays on.
const PURGA_CADA_MS = 6 * 60 * 60 * 1000;

const enProceso = globalThis as typeof globalThis & { __reservasEsquema?: Promise<void>; __reservasPurga?: number };

const comoConsultas = (textos: string[]) => textos.map((texto) => ({ texto }));

/**
 * ES: La base de datos con las tablas creadas. Es la puerta de entrada de las acciones.
 *     Lanza BaseSinConfigurar (ver bd.ts) si falta configurar la base.
 * EN: The database with its tables created. It is the actions' entry point.
 *     Throws BaseSinConfigurar (see bd.ts) if the database still needs setting up.
 */
export async function baseLista(): Promise<BaseDeDatos> {
  const bd = await conectar();
  if (!enProceso.__reservasEsquema) {
    // ES: Crear y limpiar en una sola transacción: un único viaje a Neon al arrancar.
    // EN: Create and clean up in a single transaction: one single trip to Neon on start-up.
    enProceso.__reservasPurga = Date.now();
    enProceso.__reservasEsquema = bd.transaccion(comoConsultas([...CREAR, ...PURGAR])).then(() => undefined);
    enProceso.__reservasEsquema.catch(() => (enProceso.__reservasEsquema = undefined));
  }
  await enProceso.__reservasEsquema;
  if (Date.now() - (enProceso.__reservasPurga ?? 0) > PURGA_CADA_MS) {
    enProceso.__reservasPurga = Date.now();
    // ES: Si el borrado falla, la reserva en curso sigue adelante; se reintenta en 6 horas.
    // EN: If the clean-up fails, the booking in progress goes ahead; it is retried in 6 hours.
    await bd.transaccion(comoConsultas(PURGAR)).catch((error) => console.error("[reservas] purga", error));
  }
  return bd;
}
