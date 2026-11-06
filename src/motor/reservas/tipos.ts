/**
 * [NO TOCAR · DO NOT EDIT] Motor / Engine · Reservas
 *
 * ES: Tipos que comparten el servidor (acciones) y la pantalla (hooks y piel) de las reservas en línea.
 *     El servidor nunca devuelve frases: devuelve códigos (MotivoFallo, ErrorCampo) y la piel los
 *     traduce con sus textos (src/estilo/ajustes/textos.ts).
 * EN: Types shared by the server (actions) and the screen (hooks and skin) of online bookings.
 *     The server never returns sentences: it returns codes (MotivoFallo, ErrorCampo) and the skin
 *     translates them with its own texts (src/estilo/ajustes/textos.ts).
 */
import type { Idioma } from "../tipos";

/** ES: Una hora de un día y las plazas que quedan. · EN: One time of a day and the seats left. */
export interface Turno {
  /** ES/EN: "08:30", hora local del café · café local time */
  hora: string;
  libres: number;
}

/** ES: Un día de la ventana de reservas; sin turnos = cerrado o ya sin horas. · EN: One day of the booking window; no slots = closed or no times left. */
export interface DiaReservable {
  /** ES/EN: "2026-11-14" */
  fecha: string;
  turnos: Turno[];
}

export interface Disponibilidad {
  /** ES: Hoy en la zona del café. · EN: Today in the café's time zone. */
  hoy: string;
  dias: DiaReservable[];
  plazasPorTurno: number;
  maxPersonas: number;
}

/**
 * ES: Por qué no salió una operación.
 *     sin-bd = falta configurar la base de datos · bd-caida = no responde · completo = el turno se llenó
 *     limite = demasiadas reservas seguidas · datos = algún campo no vale (ver `errores`)
 *     no-encontrada = código o enlace incorrecto · pasada = ya no se puede anular · sesion = panel sin entrar
 *     clave = contraseña incorrecta · bloqueado = demasiados intentos · sin-clave = falta RESERVAS_CLAVE
 * EN: Why an operation did not go through.
 *     sin-bd = database not set up · bd-caida = not answering · completo = the slot filled up
 *     limite = too many bookings in a row · datos = some field is not valid (see `errores`)
 *     no-encontrada = wrong code or link · pasada = can no longer be cancelled · sesion = panel not signed in
 *     clave = wrong password · bloqueado = too many attempts · sin-clave = RESERVAS_CLAVE missing
 */
export type MotivoFallo =
  | "sin-bd"
  | "bd-caida"
  | "completo"
  | "limite"
  | "datos"
  | "no-encontrada"
  | "pasada"
  | "sesion"
  | "clave"
  | "bloqueado"
  | "sin-clave"
  | "error";

export type CampoReserva = "fecha" | "hora" | "personas" | "nombre" | "telefono" | "nota";

/**
 * ES: Error de un campo: requerido · invalido · largo (demasiado texto) · fuera (fuera de la ventana de días
 *     o del máximo de personas) · cerrado (ese día no abre) · pasada (esa hora ya pasó) · antelacion (demasiado pronto).
 * EN: Field error: requerido (required) · invalido (invalid) · largo (too long) · fuera (outside the day
 *     window or the people limit) · cerrado (closed that day) · pasada (that time is past) · antelacion (too soon).
 */
export type ErrorCampo = "requerido" | "invalido" | "largo" | "fuera" | "cerrado" | "pasada" | "antelacion";
export type ErroresReserva = Partial<Record<CampoReserva, ErrorCampo>>;

/** ES: Respuesta de toda acción: ok con sus datos, o el motivo del fallo. · EN: Every action's answer: ok with its data, or the failure reason. */
export type Respuesta<T extends object = object> =
  | ({ ok: true } & T)
  | { ok: false; motivo: MotivoFallo; errores?: ErroresReserva };

/** ES: Lo que manda la pantalla al reservar. · EN: What the screen sends when booking. */
export interface EntradaReserva {
  fecha: string;
  hora: string;
  personas: number;
  nombre: string;
  telefono: string;
  nota: string;
  idioma: Idioma;
  /** ES: Campo trampa invisible: si llega relleno, es un robot. · EN: Invisible trap field: if it arrives filled in, it is a bot. */
  web?: string;
  /** ES: Solo el panel: guardar aunque el turno esté lleno. · EN: Panel only: save even if the slot is full. */
  forzar?: boolean;
}

export interface ReservaConfirmada {
  codigo: string;
  /** ES: Secreto del enlace para anular (solo lo ve el cliente una vez). · EN: Secret of the cancel link (the guest sees it only once). */
  token: string;
  fecha: string;
  hora: string;
  personas: number;
  nombre: string;
}

/** ES: Lo que ve el cliente en la página de anular. · EN: What the guest sees on the cancel page. */
export interface ReservaPublica {
  codigo: string;
  fecha: string;
  hora: string;
  personas: number;
  nombre: string;
  estado: EstadoReserva;
  /** ES: Confirmada y todavía en el futuro. · EN: Confirmed and still in the future. */
  anulable: boolean;
}

export type EstadoReserva = "confirmada" | "anulada";

/** ES: Una reserva tal como la ve el café en su panel. · EN: A booking as the café sees it in its panel. */
export interface ReservaPanel {
  id: number;
  codigo: string;
  fecha: string;
  hora: string;
  personas: number;
  nombre: string;
  telefono: string;
  nota: string;
  idioma: Idioma;
  origen: "web" | "telefono";
  estado: EstadoReserva;
  /** ES/EN: ISO 8601 */
  creada: string;
  anuladaPor: "cliente" | "cafe" | null;
}

/**
 * ES: Estado de la base de datos para el panel. motor: neon (Vercel) o pglite (tu ordenador).
 *     problema: sin-url (falta DATABASE_URL) · url-invalida (no empieza por postgresql://) · conexion (no responde).
 * EN: Database status for the panel. motor: neon (Vercel) or pglite (your computer).
 *     problema: sin-url (DATABASE_URL missing) · url-invalida (does not start with postgresql://) · conexion (not answering).
 */
export interface EstadoBaseDeDatos {
  motor: "neon" | "pglite" | null;
  conectada: boolean;
  problema?: "sin-url" | "url-invalida" | "conexion";
  /** ES: Mensaje técnico del error, para buscarlo en docs/RESERVAS.md. · EN: Technical error message, to look up in docs/RESERVAS.en.md. */
  detalle?: string;
  /** ES: Reservas guardadas (todas las fechas). · EN: Stored bookings (every date). */
  total?: number;
  /** ES: Carpeta de la base local (solo PGlite). · EN: Local database folder (PGlite only). */
  ubicacion?: string;
}
