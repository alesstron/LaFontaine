"use client";

/**
 * [NO TOCAR · DO NOT EDIT] Motor / Engine · Reservas
 *
 * ES: Hooks de las tres páginas de reservas. Llevan el estado y hablan con el servidor; la piel
 *     (src/estilo/paginas/) solo pinta lo que devuelven.
 *       useReservaEnLinea()  → /reserver           personas, día, hora, datos y confirmación
 *       useAnularReserva()   → /reserver/anular    lee el enlace del cliente y anula
 *       usePanelReservas()   → /reserver/gestion   entrar, semana de reservas, anular, restaurar, añadir
 * EN: Hooks for the three booking pages. They hold the state and talk to the server; the skin
 *     (src/estilo/paginas/) only draws what they return.
 *       useReservaEnLinea()  → /reserver           people, day, time, details and confirmation
 *       useAnularReserva()   → /reserver/anular    reads the guest's link and cancels
 *       usePanelReservas()   → /reserver/gestion   sign in, week of bookings, cancel, restore, add
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMotor } from "../proveedor";
import { anularReserva, consultarDisponibilidad, crearReserva, verReservaParaAnular } from "./acciones";
import { horasDelDia, minutosHasta, relojDelCafe, sumarDias, ventanaDeDias } from "./disponibilidad";
import {
  anularDesdePanel,
  crearReservaTelefono,
  entrar,
  estadoBaseDeDatos,
  listarReservas,
  restaurarReserva,
  salir,
} from "./gestion";
import type {
  Disponibilidad,
  EntradaReserva,
  ErroresReserva,
  EstadoBaseDeDatos,
  MotivoFallo,
  ReservaConfirmada,
  ReservaPanel,
  ReservaPublica,
  Respuesta,
  Turno,
} from "./tipos";
import { validarContacto } from "./validar";

/* ------------------------------------------------------------------ */
/* ES: Reservar · EN: Book                                              */
/* ------------------------------------------------------------------ */

/** ES: libre = hay alguna hora con sitio · completo = ninguna · cerrado = no abre o ya no quedan horas. */
/** EN: libre = some time has room · completo = none · cerrado = closed or no times left. */
export type EstadoDia = "libre" | "completo" | "cerrado";

export interface TurnoCalendario extends Turno {
  /** ES: ¿Caben las personas elegidas? · EN: Do the chosen people fit? */
  cabe: boolean;
}

export interface DiaCalendario {
  fecha: string;
  estado: EstadoDia;
  turnos: TurnoCalendario[];
}

export interface ContactoReserva {
  nombre: string;
  telefono: string;
  nota: string;
  /** ES: Campo trampa: la piel lo pinta invisible. · EN: Trap field: the skin draws it invisible. */
  web: string;
}

const CONTACTO_VACIO: ContactoReserva = { nombre: "", telefono: "", nota: "", web: "" };
// ES: Al volver a la pestaña tras este tiempo, se recargan las plazas. · EN: When coming back to the tab after this long, seats reload.
const RECARGA_AL_VOLVER_MS = 2 * 60_000;

export function useReservaEnLinea() {
  const { cafe, idioma } = useMotor();
  const maxPersonas = cafe.reservas?.maxPersonas ?? 1;
  const [disponibilidad, setDisponibilidad] = useState<Disponibilidad | null>(null);
  const [cargando, setCargando] = useState(true);
  const [aviso, setAviso] = useState<MotivoFallo | null>(null);
  const [personas, setPersonas] = useState(Math.min(2, maxPersonas));
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [contacto, setContacto] = useState<ContactoReserva>(CONTACTO_VACIO);
  const [errores, setErrores] = useState<ErroresReserva>({});
  const [enviando, setEnviando] = useState(false);
  const [confirmada, setConfirmada] = useState<ReservaConfirmada | null>(null);
  const cargadaEn = useRef(0);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const r = await consultarDisponibilidad();
      if (r.ok) {
        setDisponibilidad(r.disponibilidad);
        cargadaEn.current = Date.now();
        setAviso((a) => (a === "sin-bd" || a === "bd-caida" ? null : a));
      } else setAviso(r.motivo);
    } catch {
      // ES: Sin red o el servidor no contesta. · EN: No network or the server does not answer.
      setAviso("bd-caida");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargar();
    const alVolver = () => {
      if (document.visibilityState === "visible" && Date.now() - cargadaEn.current > RECARGA_AL_VOLVER_MS) void cargar();
    };
    document.addEventListener("visibilitychange", alVolver);
    return () => document.removeEventListener("visibilitychange", alVolver);
  }, [cargar]);

  const dias = useMemo<DiaCalendario[]>(
    () =>
      (disponibilidad?.dias ?? []).map((d) => {
        const turnos = d.turnos.map((t) => ({ ...t, cabe: t.libres >= personas }));
        const estado: EstadoDia = !turnos.length ? "cerrado" : turnos.some((t) => t.cabe) ? "libre" : "completo";
        return { fecha: d.fecha, estado, turnos };
      }),
    [disponibilidad, personas],
  );

  // ES: Lo elegido solo cuenta mientras siga cabiendo (si suben las personas o se llena, se suelta solo).
  // EN: The choice only counts while it still fits (if people go up or it fills, it lets go by itself).
  const dia = dias.find((d) => d.fecha === fecha && d.estado === "libre") ?? null;
  const turno = dia?.turnos.find((t) => t.hora === hora && t.cabe) ?? null;
  const fechaElegida = dia ? fecha : "";
  const horaElegida = turno ? hora : "";

  const quitarError = (...campos: (keyof ErroresReserva)[]) =>
    setErrores((e) => {
      const siguiente = { ...e };
      for (const c of campos) delete siguiente[c];
      return siguiente;
    });

  const enviar = async (): Promise<boolean> => {
    if (enviando) return false;
    const faltan: ErroresReserva = { ...validarContacto(contacto).errores };
    if (!fechaElegida) faltan.fecha = "requerido";
    else if (!horaElegida) faltan.hora = "requerido";
    setErrores(faltan);
    if (Object.keys(faltan).length) return false;
    setAviso(null);
    setEnviando(true);
    try {
      const entrada: EntradaReserva = { fecha: fechaElegida, hora: horaElegida, personas, ...contacto, idioma };
      const r = await crearReserva(entrada);
      if (r.ok) {
        setConfirmada(r.reserva);
        return true;
      }
      setAviso(r.motivo);
      setErrores(r.errores ?? {});
      // ES: Si el turno se llenó mientras tanto, se recargan las plazas. · EN: If the slot filled meanwhile, seats reload.
      if (r.motivo === "completo" || r.errores?.fecha || r.errores?.hora) void cargar();
      return false;
    } catch {
      setAviso("bd-caida");
      return false;
    } finally {
      setEnviando(false);
    }
  };

  return {
    /** ES: Primera carga de plazas en curso. · EN: First seats load in progress. */
    cargando: cargando && !disponibilidad,
    /** ES: Por qué algo no salió (null = todo bien). · EN: Why something did not work (null = all good). */
    aviso,
    personas,
    maxPersonas,
    cambiarPersonas: (n: number) => setPersonas(Math.min(maxPersonas, Math.max(1, Math.round(n)))),
    /** ES: Hoy en el café ("" hasta cargar). · EN: Today at the café ("" until loaded). */
    hoy: disponibilidad?.hoy ?? "",
    /** ES: Días de la ventana con su estado para las personas elegidas. · EN: Window days with their state for the chosen people. */
    dias,
    fecha: fechaElegida,
    elegirFecha: (f: string) => {
      setFecha(f);
      setHora("");
      quitarError("fecha", "hora");
    },
    /** ES: Horas del día elegido. · EN: Times of the chosen day. */
    turnos: dia?.turnos ?? [],
    hora: horaElegida,
    elegirHora: (h: string) => {
      setHora(h);
      quitarError("hora");
    },
    contacto,
    cambiar: (campo: keyof ContactoReserva, valor: string) => {
      setContacto((c) => ({ ...c, [campo]: valor }));
      if (campo !== "web") quitarError(campo);
    },
    /** ES: Errores por campo (códigos de tipos.ts). · EN: Errors per field (codes from tipos.ts). */
    errores,
    enviando,
    enviar,
    /** ES: La reserva hecha (null hasta confirmar). · EN: The booking made (null until confirmed). */
    confirmada,
    /** ES: Enlace para anular: solo se muestra esta vez. · EN: Cancel link: it is only shown this once. */
    enlaceAnular:
      confirmada && typeof window !== "undefined"
        ? `${window.location.origin}/reserver/anular#c=${confirmada.codigo}&t=${confirmada.token}`
        : "",
    /** ES: Empezar otra reserva (guarda nombre y teléfono). · EN: Start another booking (keeps name and phone). */
    otraReserva: () => {
      setConfirmada(null);
      setFecha("");
      setHora("");
      setContacto((c) => ({ ...CONTACTO_VACIO, nombre: c.nombre, telefono: c.telefono }));
      setErrores({});
      setAviso(null);
      void cargar();
    },
    recargar: cargar,
  };
}

/* ------------------------------------------------------------------ */
/* ES: Anular desde el enlace · EN: Cancel from the link                */
/* ------------------------------------------------------------------ */

export type EstadoAnular = "leyendo" | "lista" | "anulando" | "anulada" | "fallo";

export function useAnularReserva() {
  const [estado, setEstado] = useState<EstadoAnular>("leyendo");
  const [reserva, setReserva] = useState<ReservaPublica | null>(null);
  const [motivo, setMotivo] = useState<MotivoFallo | null>(null);
  const enlace = useRef({ codigo: "", token: "" });

  // ES: El código y el secreto van tras "#" en el enlace: el navegador no los manda al servidor al abrir la
  //     página (no quedan en registros), solo en la consulta.
  // EN: The code and secret go after "#" in the link: the browser does not send them to the server when
  //     opening the page (they stay out of logs), only in the query.
  useEffect(() => {
    const p = new URLSearchParams(window.location.hash.slice(1));
    enlace.current = { codigo: p.get("c") ?? "", token: p.get("t") ?? "" };
    verReservaParaAnular(enlace.current.codigo, enlace.current.token)
      .then((r) => {
        if (r.ok) {
          setReserva(r.reserva);
          setEstado(r.reserva.estado === "anulada" ? "anulada" : "lista");
        } else {
          setMotivo(r.motivo);
          setEstado("fallo");
        }
      })
      .catch(() => {
        setMotivo("bd-caida");
        setEstado("fallo");
      });
  }, []);

  const anular = async () => {
    setEstado("anulando");
    setMotivo(null);
    try {
      const r = await anularReserva(enlace.current.codigo, enlace.current.token);
      if (r.ok) {
        setReserva(r.reserva);
        setEstado("anulada");
      } else {
        setMotivo(r.motivo);
        setEstado(r.motivo === "no-encontrada" ? "fallo" : "lista");
      }
    } catch {
      setMotivo("bd-caida");
      setEstado("lista");
    }
  };

  return { estado, reserva, motivo, anular };
}

/* ------------------------------------------------------------------ */
/* ES: Panel del café · EN: Café panel                                  */
/* ------------------------------------------------------------------ */

export interface TurnoPanel {
  hora: string;
  /** ES: Personas confirmadas en esa hora. · EN: Confirmed people at that time. */
  ocupadas: number;
  reservas: ReservaPanel[];
}

export interface DiaPanel {
  fecha: string;
  turnos: TurnoPanel[];
  confirmadas: number;
  personas: number;
}

interface Semana {
  hoy: string;
  desde: string;
  dias: number;
  reservas: ReservaPanel[];
  plazasPorTurno: number;
}

const DIAS_PANEL = 7;
const REFRESCO_PANEL_MS = 2 * 60_000;

/**
 * ES: `entradoAlCargar` lo calcula el servidor (cookie válida) al abrir /reserver/gestion.
 * EN: `entradoAlCargar` is worked out by the server (valid cookie) when /reserver/gestion opens.
 */
export function usePanelReservas(entradoAlCargar: boolean) {
  const { cafe } = useMotor();
  const [entrado, setEntrado] = useState(entradoAlCargar);
  const [entrando, setEntrando] = useState(false);
  const [falloEntrar, setFalloEntrar] = useState<MotivoFallo | null>(null);
  const [base, setBase] = useState<EstadoBaseDeDatos | null>(null);
  const [semana, setSemana] = useState<Semana | null>(null);
  // ES: "" = la semana que empieza hoy. · EN: "" = the week starting today.
  const [desde, setDesde] = useState("");
  const [cargando, setCargando] = useState(false);
  const [aviso, setAviso] = useState<MotivoFallo | null>(null);
  const [enCurso, setEnCurso] = useState<number | null>(null);

  const fuera = () => {
    setEntrado(false);
    setSemana(null);
    setBase(null);
  };

  const cargar = useCallback(async (inicio: string, silencioso = false) => {
    if (!silencioso) setCargando(true);
    try {
      const estado = await estadoBaseDeDatos();
      if (!estado.ok) {
        if (estado.motivo === "sesion") fuera();
        return;
      }
      setBase(estado.estado);
      if (!estado.estado.conectada) return;
      const lista = await listarReservas(inicio, DIAS_PANEL);
      if (lista.ok) {
        const { hoy, desde: d, dias, reservas, plazasPorTurno } = lista;
        setSemana({ hoy, desde: d, dias, reservas, plazasPorTurno });
      } else if (lista.motivo === "sesion") fuera();
      else setAviso(lista.motivo);
    } catch {
      setAviso("bd-caida");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (!entrado) return;
    void cargar(desde);
    // ES: Refresco cada 2 minutos con la pestaña a la vista: llegan las reservas nuevas sin recargar.
    // EN: Refresh every 2 minutes while the tab is visible: new bookings show up without reloading.
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") void cargar(desde, true);
    }, REFRESCO_PANEL_MS);
    return () => window.clearInterval(id);
  }, [entrado, desde, cargar]);

  const dias = useMemo<DiaPanel[]>(() => {
    if (!semana) return [];
    return ventanaDeDias(semana.desde, semana.dias).map((fecha) => {
      const delDia = semana.reservas.filter((r) => r.fecha === fecha);
      const turnos = [...new Set(delDia.map((r) => r.hora))].sort().map((hora) => {
        const reservas = delDia.filter((r) => r.hora === hora);
        const ocupadas = reservas.filter((r) => r.estado === "confirmada").reduce((s, r) => s + r.personas, 0);
        return { hora, reservas, ocupadas };
      });
      const confirmadas = delDia.filter((r) => r.estado === "confirmada");
      return { fecha, turnos, confirmadas: confirmadas.length, personas: confirmadas.reduce((s, r) => s + r.personas, 0) };
    });
  }, [semana]);

  const operar = async (id: number, accion: (id: number) => Promise<Respuesta>) => {
    setEnCurso(id);
    setAviso(null);
    try {
      const r = await accion(id);
      if (!r.ok) {
        if (r.motivo === "sesion") return fuera();
        setAviso(r.motivo);
      }
      await cargar(desde, true);
    } catch {
      setAviso("bd-caida");
    } finally {
      setEnCurso(null);
    }
  };

  const hoy = semana?.hoy ?? "";

  return {
    entrado,
    entrando,
    /** ES: Por qué no se pudo entrar (clave, bloqueado, sin-clave…). · EN: Why signing in failed (clave, bloqueado, sin-clave…). */
    falloEntrar,
    entrar: async (clave: string) => {
      setEntrando(true);
      setFalloEntrar(null);
      try {
        const r = await entrar(clave);
        if (r.ok) setEntrado(true);
        else setFalloEntrar(r.motivo);
      } catch {
        setFalloEntrar("bd-caida");
      } finally {
        setEntrando(false);
      }
    },
    salir: async () => {
      try {
        await salir();
      } finally {
        fuera();
      }
    },
    /** ES: Estado de la base de datos (null hasta cargar). · EN: Database status (null until loaded). */
    base,
    cargando,
    aviso,
    hoy,
    /** ES: Primer día de la semana mostrada. · EN: First day of the week shown. */
    desde: semana?.desde ?? "",
    plazasPorTurno: semana?.plazasPorTurno ?? cafe.reservas?.plazasPorTurno ?? 0,
    /** ES: Los 7 días mostrados, con sus horas y reservas. · EN: The 7 days shown, with their times and bookings. */
    dias,
    semanaAnterior: () => semana && setDesde(sumarDias(semana.desde, -DIAS_PANEL)),
    semanaSiguiente: () => semana && setDesde(sumarDias(semana.desde, DIAS_PANEL)),
    irAHoy: () => setDesde(""),
    recargar: () => cargar(desde),
    /** ES: Id de la reserva que se está anulando o restaurando. · EN: Id of the booking being cancelled or restored. */
    enCurso,
    anular: (id: number) => operar(id, anularDesdePanel),
    restaurar: (id: number) => operar(id, restaurarReserva),
    /**
     * ES: Apunta una reserva hecha por teléfono; devuelve la respuesta para mostrar errores en el formulario.
     * EN: Records a phone booking; returns the answer to show errors in the form.
     */
    anadir: async (entrada: Omit<EntradaReserva, "web">) => {
      const r = await crearReservaTelefono(entrada);
      if (r.ok) await cargar(desde, true);
      else if (r.motivo === "sesion") fuera();
      return r;
    },
    /** ES: Horas posibles para apuntar una reserva ese día (las que no han pasado). · EN: Possible times to record a booking that day (not yet past). */
    horasTelefono: (fecha: string): string[] => {
      const conf = cafe.reservas;
      if (!conf || !fecha) return [];
      const reloj = relojDelCafe(cafe.horario.zonaHoraria);
      return horasDelDia(cafe, conf, fecha).filter((h) => minutosHasta(fecha, h, reloj) >= 0);
    },
  };
}

/** ES: Lo que devuelve usePanelReservas (para tipar las piezas del panel). · EN: What usePanelReservas returns (to type the panel pieces). */
export type ValorPanel = ReturnType<typeof usePanelReservas>;
