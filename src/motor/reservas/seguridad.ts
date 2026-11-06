/**
 * [NO TOCAR · DO NOT EDIT] Motor / Engine · Reservas
 *
 * ES: Todo lo secreto de las reservas, solo en el servidor:
 *       - Sesión del panel: cookie firmada (HMAC-SHA256) con su caducidad, HttpOnly (el JavaScript de la
 *         página no la ve), SameSite=Strict y limitada a /reserver/gestion. La firma sale de RESERVAS_CLAVE,
 *         así que cambiar la contraseña cierra todas las sesiones.
 *       - Contraseña: se compara en tiempo constante (no se puede adivinar letra a letra midiendo tiempos).
 *       - Código de la reserva ("7KQ-3XA") y secreto del enlace para anular (solo se guarda su huella).
 *       - Huella de la conexión del visitante (nunca se guarda la IP tal cual).
 * EN: Everything secret about bookings, server only:
 *       - Panel session: signed cookie (HMAC-SHA256) with an expiry, HttpOnly (the page's JavaScript cannot
 *         see it), SameSite=Strict and limited to /reserver/gestion. The signature comes from RESERVAS_CLAVE,
 *         so changing the password signs every session out.
 *       - Password: compared in constant time (it cannot be guessed letter by letter by timing it).
 *       - Booking code ("7KQ-3XA") and the cancel link secret (only its fingerprint is stored).
 *       - Visitor connection fingerprint (the IP is never stored as is).
 */
import "server-only";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";

const COOKIE = "lafontaine_panel";
const RUTA_PANEL = "/reserver/gestion";
/** ES: La sesión dura 12 horas (un día de trabajo). · EN: The session lasts 12 hours (a working day). */
const DURACION_S = 12 * 60 * 60;
/** ES: Largo mínimo de RESERVAS_CLAVE. · EN: Minimum RESERVAS_CLAVE length. */
export const CLAVE_MINIMA = 8;

const sha256 = (texto: string) => createHash("sha256").update(texto).digest();
const clave = () => process.env.RESERVAS_CLAVE ?? "";

/** ES: ¿Hay contraseña del panel configurada (y es lo bastante larga)? · EN: Is a panel password set (and long enough)? */
export function claveLista(): boolean {
  return clave().length >= CLAVE_MINIMA;
}

export function claveCorrecta(intento: string): boolean {
  // ES: Se comparan huellas del mismo largo para que el tiempo no dependa de la contraseña.
  // EN: Same-length fingerprints are compared so the time does not depend on the password.
  return claveLista() && timingSafeEqual(sha256(intento), sha256(clave()));
}

function firmar(datos: string): string {
  return createHmac("sha256", sha256(`panel:${clave()}`)).update(datos).digest("base64url");
}

export async function abrirSesion(): Promise<void> {
  const vence = String(Math.floor(Date.now() / 1000) + DURACION_S);
  (await cookies()).set(COOKIE, `${vence}.${firmar(vence)}`, {
    httpOnly: true,
    // ES: En tu ordenador (http://localhost) no hay HTTPS; en Vercel sí. · EN: No HTTPS on localhost; Vercel has it.
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: RUTA_PANEL,
    maxAge: DURACION_S,
  });
}

export async function cerrarSesion(): Promise<void> {
  (await cookies()).delete({ name: COOKIE, path: RUTA_PANEL });
}

/** ES: ¿La cookie del panel es auténtica y no ha caducado? · EN: Is the panel cookie genuine and not expired? */
export async function sesionValida(): Promise<boolean> {
  if (!claveLista()) return false;
  const valor = (await cookies()).get(COOKIE)?.value ?? "";
  const [vence, firma] = valor.split(".");
  if (!vence || !firma || Number(vence) * 1000 < Date.now()) return false;
  const esperada = Buffer.from(firmar(vence));
  const recibida = Buffer.from(firma);
  return esperada.length === recibida.length && timingSafeEqual(esperada, recibida);
}

/** ES: IP del visitante (en Vercel, la pone su red y no se puede falsear). · EN: Visitor IP (on Vercel, set by its network and not spoofable). */
export async function ipDelVisitante(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
}

/** ES: Huella irreversible de un dato (IP, teléfono…) para contar sin guardarlo. · EN: Irreversible fingerprint of a value (IP, phone…) to count it without storing it. */
export function huella(texto: string): string {
  return createHash("sha256").update(`lafontaine\0${clave()}\0${texto}`).digest("hex").slice(0, 32);
}

// ES: Sin 0/O ni 1/I/L, para que el código se pueda dictar por teléfono.
// EN: No 0/O nor 1/I/L, so the code can be read out over the phone.
const ALFABETO = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/** ES: Código corto de la reserva: "7KQ-3XA". · EN: Short booking code: "7KQ-3XA". */
export function nuevoCodigo(): string {
  const letras = [...randomBytes(6)].map((b) => ALFABETO[b % ALFABETO.length]).join("");
  return `${letras.slice(0, 3)}-${letras.slice(3)}`;
}

/** ES: ¿Tiene forma de código? · EN: Does it look like a code? */
export function esCodigo(texto: unknown): texto is string {
  return typeof texto === "string" && /^[2-9A-HJ-NP-Z]{3}-[2-9A-HJ-NP-Z]{3}$/.test(texto);
}

/** ES: Secreto del enlace para anular (192 bits). · EN: Cancel link secret (192 bits). */
export function nuevoToken(): string {
  return randomBytes(24).toString("base64url");
}

export function esToken(texto: unknown): texto is string {
  return typeof texto === "string" && /^[A-Za-z0-9_-]{32}$/.test(texto);
}

/** ES: Lo que se guarda del secreto: su huella SHA-256. · EN: What is stored of the secret: its SHA-256 fingerprint. */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
