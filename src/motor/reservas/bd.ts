/**
 * [NO TOCAR · DO NOT EDIT] Motor / Engine · Reservas
 *
 * ES: Conexión con la base de datos de las reservas. Elige sola dónde guardar:
 *       - Hay DATABASE_URL (Vercel, o tu .env.local) → Neon, Postgres en la nube (plan gratuito).
 *       - No hay y estás en tu ordenador → PGlite, un Postgres completo dentro de Node (sin cuentas ni
 *         instalar nada). Guarda los datos fuera de OneDrive (ver carpetaLocal) o en RESERVAS_PGLITE_DIR.
 *       - No hay y estás en Vercel → "sin configurar": las páginas lo dicen en vez de romperse.
 *     Las dos bases entienden el mismo SQL, así que el resto del motor no sabe cuál está usando.
 * EN: Bookings database connection. It picks where to store by itself:
 *       - DATABASE_URL is set (Vercel, or your .env.local) → Neon, cloud Postgres (free plan).
 *       - It is not set and you are on your computer → PGlite, a full Postgres inside Node (no accounts,
 *         nothing to install). It keeps the data outside OneDrive (see carpetaLocal) or in RESERVAS_PGLITE_DIR.
 *       - It is not set and you are on Vercel → "not set up": the pages say so instead of breaking.
 *     Both databases speak the same SQL, so the rest of the engine does not know which one it uses.
 */
import "server-only";
import { mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

export type Valor = string | number | boolean | null;
export type Fila = Record<string, unknown>;

/** ES: Una sentencia SQL con sus parámetros ($1, $2…). · EN: One SQL statement with its parameters ($1, $2…). */
export interface Consulta {
  texto: string;
  valores?: Valor[];
}

export interface BaseDeDatos {
  motor: "neon" | "pglite";
  /** ES: Una sentencia; devuelve sus filas. · EN: One statement; returns its rows. */
  consultar: <T = Fila>(texto: string, valores?: Valor[]) => Promise<T[]>;
  /**
   * ES: Varias sentencias en una sola transacción (o todas o ninguna) en READ COMMITTED: cada sentencia ve
   *     lo confirmado antes de empezar ella, por eso el cerrojo de un turno va en una sentencia aparte.
   *     Devuelve las filas de cada una.
   * EN: Several statements in a single READ COMMITTED transaction (all or nothing): each statement sees
   *     what was committed before it started, which is why a slot's lock goes in a statement of its own.
   *     Returns the rows of each one.
   */
  transaccion: (consultas: Consulta[]) => Promise<Fila[][]>;
}

/** ES: Falta DATABASE_URL en Vercel, o no es una dirección de Postgres. · EN: DATABASE_URL missing on Vercel, or not a Postgres address. */
export class BaseSinConfigurar extends Error {
  constructor(readonly problema: "sin-url" | "url-invalida") {
    super(problema === "sin-url" ? "Falta DATABASE_URL" : "DATABASE_URL no es una dirección postgresql://");
    this.name = "BaseSinConfigurar";
  }
}

/**
 * ES: Carpeta de la base local. Por defecto, fuera de la carpeta del proyecto: el proyecto está en OneDrive y
 *     un sincronizador puede bloquear los archivos que Postgres reescribe (y subiría datos de prueba a la nube).
 *     Windows: %LOCALAPPDATA%\cafe-lafontaine\reservas-pglite · Mac/Linux: ~/.local/share/cafe-lafontaine/…
 * EN: Local database folder. By default, outside the project folder: the project lives in OneDrive and a sync
 *     client can lock the files Postgres rewrites (and would upload test data to the cloud).
 *     Windows: %LOCALAPPDATA%\cafe-lafontaine\reservas-pglite · Mac/Linux: ~/.local/share/cafe-lafontaine/…
 */
export function carpetaLocal(): string {
  const elegida = process.env.RESERVAS_PGLITE_DIR?.trim();
  if (elegida) return path.resolve(elegida);
  const base = process.env.LOCALAPPDATA || path.join(os.homedir(), ".local", "share");
  return path.join(base, "cafe-lafontaine", "reservas-pglite");
}

type Eleccion = { tipo: "neon"; url: string } | { tipo: "local" } | { tipo: "error"; problema: "sin-url" | "url-invalida" };

/**
 * ES: Decide qué base usar. Acepta la dirección aunque se haya pegado con comillas o dentro de un
 *     comando `psql '…'` (pasa a menudo al copiarla de Neon).
 * EN: Decides which database to use. Accepts the address even if it was pasted with quotes or inside a
 *     `psql '…'` command (it often happens when copying it from Neon).
 */
function elegir(): Eleccion {
  const valor = process.env.DATABASE_URL?.trim();
  if (valor) {
    const url = valor.match(/postgres(?:ql)?:\/\/[^\s'"]+/)?.[0];
    return url ? { tipo: "neon", url } : { tipo: "error", problema: "url-invalida" };
  }
  // ES: Vercel no tiene disco donde guardar una base local: allí hace falta Neon.
  // EN: Vercel has no disk to keep a local database: Neon is needed there.
  return process.env.VERCEL ? { tipo: "error", problema: "sin-url" } : { tipo: "local" };
}

function conNeon(url: string): BaseDeDatos {
  // ES: Driver por HTTP: cada consulta es una petición, ideal para funciones de Vercel que se apagan solas.
  // EN: HTTP driver: each query is one request, ideal for Vercel functions that shut down on their own.
  const sql = neon(url);
  console.info("[reservas] base de datos: Neon");
  return {
    motor: "neon",
    consultar: async <T>(texto: string, valores: Valor[] = []) => (await sql.query(texto, valores)) as T[],
    transaccion: async (consultas) =>
      (await sql.transaction((txn) => consultas.map((c) => txn.query(c.texto, c.valores ?? [])), {
        isolationLevel: "ReadCommitted",
      })) as Fila[][],
  };
}

function procesoVivo(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    // ES: EPERM = existe pero es de otro usuario. · EN: EPERM = it exists but belongs to another user.
    return (error as NodeJS.ErrnoException).code === "EPERM";
  }
}

/**
 * ES: Dos servidores a la vez sobre la misma carpeta la estropean (p. ej. `npm run dev` y `npm start`). El primero
 *     deja su número de proceso en <carpeta>.pid; el segundo se para con un mensaje claro. Si el .pid es de un
 *     proceso que ya no existe, se ignora.
 * EN: Two servers at once on the same folder corrupt it (e.g. `npm run dev` and `npm start`). The first one leaves
 *     its process number in <folder>.pid; the second one stops with a clear message. If the .pid belongs to a
 *     process that no longer exists, it is ignored.
 */
function reservarCarpeta(carpeta: string): void {
  const cerrojo = `${carpeta}.pid`;
  let otro = 0;
  try {
    otro = Number(readFileSync(cerrojo, "utf8").trim()) || 0;
  } catch {
    // ES: No hay cerrojo: nadie la está usando. · EN: No lock file: nobody is using it.
  }
  if (otro && otro !== process.pid && procesoVivo(otro)) {
    throw new Error(
      `La base local ${carpeta} ya la usa otro servidor (proceso ${otro}). Ciérralo antes de abrir este. · ` +
        `The local database ${carpeta} is already used by another server (process ${otro}). Close it first.`,
    );
  }
  writeFileSync(cerrojo, String(process.pid));
  process.once("exit", () => {
    try {
      if (readFileSync(cerrojo, "utf8").trim() === String(process.pid)) unlinkSync(cerrojo);
    } catch {
      // ES: Ya no estaba. · EN: It was already gone.
    }
  });
}

async function conPGlite(): Promise<BaseDeDatos> {
  // ES: Import dinámico: PGlite solo se carga si de verdad se usa (nunca en Vercel).
  // EN: Dynamic import: PGlite only loads when it is really used (never on Vercel).
  const { PGlite } = await import("@electric-sql/pglite");
  const carpeta = carpetaLocal();
  mkdirSync(carpeta, { recursive: true });
  reservarCarpeta(carpeta);
  const db = await PGlite.create(carpeta);
  console.info(`[reservas] base de datos: PGlite en ${carpeta}`);
  return {
    motor: "pglite",
    consultar: async <T>(texto: string, valores: Valor[] = []) => (await db.query<T>(texto, valores)).rows,
    // ES: PGlite atiende de una en una, así que la transacción ya es exclusiva. · EN: PGlite serves one at a time, so the transaction is already exclusive.
    transaccion: (consultas) =>
      db.transaction(async (tx) => {
        const resultados: Fila[][] = [];
        for (const c of consultas) resultados.push((await tx.query<Fila>(c.texto, c.valores ?? [])).rows);
        return resultados;
      }),
  };
}

// ES: Una sola conexión por proceso, guardada en globalThis: Next puede cargar este módulo más de una vez
//     (páginas y acciones, recarga en caliente) y dos PGlite sobre la misma carpeta la estropearían.
// EN: A single connection per process, kept on globalThis: Next may load this module more than once (pages
//     and actions, hot reload) and two PGlite instances on the same folder would corrupt it.
const enProceso = globalThis as typeof globalThis & { __reservasBD?: Promise<BaseDeDatos> };

/**
 * ES: La base de datos lista para consultar. Lanza BaseSinConfigurar si falta configurarla.
 *     Las tablas las crea esquema.ts (usa `baseLista()` de allí, no esta función).
 * EN: The database ready to query. Throws BaseSinConfigurar if it still needs setting up.
 *     Tables are created by esquema.ts (use `baseLista()` from there, not this function).
 */
export function conectar(): Promise<BaseDeDatos> {
  const eleccion = elegir();
  if (eleccion.tipo === "error") return Promise.reject(new BaseSinConfigurar(eleccion.problema));
  if (!enProceso.__reservasBD) {
    enProceso.__reservasBD = eleccion.tipo === "neon" ? Promise.resolve(conNeon(eleccion.url)) : conPGlite();
    // ES: Si falla al abrir, el próximo intento vuelve a probar en vez de quedarse con el error.
    // EN: If opening fails, the next attempt tries again instead of keeping the error.
    enProceso.__reservasBD.catch(() => (enProceso.__reservasBD = undefined));
  }
  return enProceso.__reservasBD;
}

/** ES: Qué base se usaría ahora, sin conectarse (para el panel). · EN: Which database would be used now, without connecting (for the panel). */
export function motorElegido(): "neon" | "pglite" | null {
  const eleccion = elegir();
  return eleccion.tipo === "neon" ? "neon" : eleccion.tipo === "local" ? "pglite" : null;
}
