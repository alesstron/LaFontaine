"use client";

/**
 * [NO TOCAR · DO NOT EDIT] Motor / Engine
 *
 * ES: Proveedor del motor: reparte a toda la piel los datos del café, la gama, el idioma elegido,
 *     el carrito y los formularios de pedido y reserva. La piel solo llama a estos hooks; la lógica
 *     vive aquí una sola vez para todas las cafeterías.
 * EN: Engine provider: hands the café data, tier, chosen language, cart and the order and booking
 *     forms to the whole skin. The skin only calls these hooks; the logic lives here once for every café.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { funcionesDe, seccionesDe, type Secciones } from "./gamas";
import { ahoraEn, estadoHorario, fechaHoyEn, horasDeRecogida, horasParaReserva, type EstadoHorario } from "./horario";
import {
  UI,
  formatoFecha,
  formatoHora,
  formatoPrecio,
  localeDe,
  nombreDia,
  rellenar,
  traducir,
  type ClaveUI,
  type Variables,
} from "./textos";
import type { CafeConfig, DiaSemana, Funciones, Idioma, Plato, Texto } from "./tipos";
import { abrirWhatsApp, sanitize, whatsappUrl } from "./whatsapp";

/* ------------------------------------------------------------------ */
/* ES: Motor: datos, gama e idioma · EN: Engine: data, tier, language  */
/* ------------------------------------------------------------------ */

export interface ValorMotor {
  cafe: CafeConfig;
  funciones: Funciones;
  secciones: Secciones;
  idioma: Idioma;
  /** ES: Idiomas disponibles (solo el base si la gama no incluye el selector). · EN: Available languages (only the base one if the tier has no switcher). */
  idiomas: Idioma[];
  cambiarIdioma: (idioma: Idioma) => void;
  /** ES: Texto del café (carta, historia…) en el idioma actual. · EN: Café text (menu, story…) in the current language. */
  tx: (texto?: Texto) => string;
  /** ES: Texto de la interfaz en el idioma actual, con {variables}. · EN: Interface text in the current language, with {variables}. */
  t: (clave: ClaveUI, vars?: Variables) => string;
  /** ES: Precio con símbolo; con suplemento=true lleva "+" delante. · EN: Price with symbol; suplemento=true adds a leading "+". */
  precio: (valor: number, suplemento?: boolean) => string;
  hora: (hhmm: string) => string;
  dia: (dia: DiaSemana, estilo?: "long" | "short") => string;
  /** ES: Locale de Intl ("fr-CA") por si la piel formatea algo más. · EN: Intl locale ("fr-CA") in case the skin formats anything else. */
  locale: string;
}

const ContextoMotor = createContext<ValorMotor | null>(null);
const CLAVE_IDIOMA = "cafe:idioma";

/** ES: Error por campo de formulario (undefined = correcto). · EN: Error per form field (undefined = valid). */
type Errores<Campo extends string> = Partial<Record<Campo, string>>;

export function MotorProvider({ cafe, children }: { cafe: CafeConfig; children: React.ReactNode }) {
  const funciones = useMemo(() => funcionesDe(cafe), [cafe]);
  const secciones = useMemo(() => seccionesDe(cafe, funciones), [cafe, funciones]);
  const idiomas = useMemo<Idioma[]>(
    () => (funciones.idiomas && cafe.idiomas.length > 1 ? cafe.idiomas : [cafe.idiomaBase]),
    [cafe, funciones],
  );
  const [idioma, setIdioma] = useState<Idioma>(cafe.idiomaBase);

  // ES: Recupera el idioma elegido en una visita anterior (si el navegador deja guardar datos).
  // EN: Restores the language chosen on a previous visit (if the browser allows storing data).
  useEffect(() => {
    try {
      const guardado = localStorage.getItem(CLAVE_IDIOMA) as Idioma | null;
      if (guardado && idiomas.includes(guardado)) setIdioma(guardado);
    } catch {
      // ES: Modo privado o almacenamiento bloqueado: se queda el idioma base.
      // EN: Private mode or blocked storage: the base language stays.
    }
  }, [idiomas]);

  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);

  const cambiarIdioma = useCallback(
    (nuevo: Idioma) => {
      if (!idiomas.includes(nuevo)) return;
      setIdioma(nuevo);
      try {
        localStorage.setItem(CLAVE_IDIOMA, nuevo);
      } catch {
        // ES: Sin almacenamiento el cambio dura hasta recargar la página.
        // EN: Without storage the change lasts until the page reloads.
      }
    },
    [idiomas],
  );

  const valor = useMemo<ValorMotor>(() => {
    const { region, moneda, idiomaBase } = cafe;
    return {
      cafe,
      funciones,
      secciones,
      idioma,
      idiomas,
      cambiarIdioma,
      tx: (texto) => traducir(texto, idioma, idiomaBase),
      t: (clave, vars) => rellenar(UI[idioma][clave], vars),
      precio: (v, suplemento) => (suplemento ? "+" : "") + formatoPrecio(v, idioma, region, moneda),
      hora: (h) => formatoHora(h, idioma, region),
      dia: (d, estilo) => nombreDia(d, idioma, region, estilo),
      locale: localeDe(idioma, region),
    };
  }, [cafe, funciones, secciones, idioma, idiomas, cambiarIdioma]);

  return (
    <ContextoMotor.Provider value={valor}>
      <CarritoProvider cafe={cafe}>{children}</CarritoProvider>
    </ContextoMotor.Provider>
  );
}

export function useMotor(): ValorMotor {
  const valor = useContext(ContextoMotor);
  if (!valor) throw new Error("useMotor() solo funciona dentro de <MotorProvider> (lo pone layout.tsx).");
  return valor;
}

/* ------------------------------------------------------------------ */
/* ES: Horario en vivo · EN: Live opening hours                         */
/* ------------------------------------------------------------------ */

/**
 * ES: ¿Abierto o cerrado ahora?, y qué día es hoy en el café. Se actualiza cada minuto.
 *     Devuelve null en el servidor y en el primer pintado (la hora real solo se conoce en el navegador).
 * EN: Open or closed right now, and which day it is at the café. Updates every minute.
 *     Returns null on the server and on first paint (the real time is only known in the browser).
 */
export function useEstadoHorario(): { estado: EstadoHorario; hoy: DiaSemana } | null {
  const { cafe } = useMotor();
  const [valor, setValor] = useState<{ estado: EstadoHorario; hoy: DiaSemana } | null>(null);
  useEffect(() => {
    const { franjas, zonaHoraria } = cafe.horario;
    const calcular = () => setValor({ estado: estadoHorario(franjas, zonaHoraria), hoy: ahoraEn(zonaHoraria).dia });
    calcular();
    const id = window.setInterval(calcular, 60_000);
    return () => window.clearInterval(id);
  }, [cafe]);
  return valor;
}

/* ------------------------------------------------------------------ */
/* ES: Carrito · EN: Cart                                               */
/* ------------------------------------------------------------------ */

export interface LineaPedido {
  plato: Plato;
  cantidad: number;
  subtotal: number;
}

export interface ValorCarrito {
  lineas: LineaPedido[];
  /** ES: Número de artículos (suma de cantidades). · EN: Number of items (sum of quantities). */
  cantidad: number;
  total: number;
  cantidadDe: (id: string) => number;
  anadir: (id: string) => void;
  quitar: (id: string) => void;
  vaciar: () => void;
  /** ES: Si el panel del pedido está abierto. · EN: Whether the order panel is open. */
  abierto: boolean;
  abrir: () => void;
  cerrar: () => void;
}

const ContextoCarrito = createContext<ValorCarrito | null>(null);
const MAX_POR_PLATO = 20;

function CarritoProvider({ cafe, children }: { cafe: CafeConfig; children: React.ReactNode }) {
  const [items, setItems] = useState<Record<string, number>>({});
  const [abierto, setAbierto] = useState(false);
  // ES: Solo se pueden pedir los platos con precio. · EN: Only items with a price can be ordered.
  const platos = useMemo(
    () => new Map(cafe.carta.flatMap((c) => c.platos).filter((p) => typeof p.precio === "number").map((p) => [p.id, p])),
    [cafe],
  );

  const valor = useMemo<ValorCarrito>(() => {
    const lineas = Object.entries(items).flatMap(([id, cantidad]) => {
      const plato = platos.get(id);
      // ES: Se calcula en céntimos para evitar errores de redondeo (11,80 × 3 = 35,40 exactos).
      // EN: Computed in cents to avoid rounding errors (11.80 × 3 = exactly 35.40).
      return plato && cantidad > 0 ? [{ plato, cantidad, subtotal: Math.round(cantidad * (plato.precio ?? 0) * 100) / 100 }] : [];
    });
    const cambiar = (id: string, delta: number) =>
      setItems((prev) => {
        if (!platos.has(id)) return prev;
        const n = Math.min(MAX_POR_PLATO, Math.max(0, (prev[id] ?? 0) + delta));
        const siguiente = { ...prev };
        if (n === 0) delete siguiente[id];
        else siguiente[id] = n;
        return siguiente;
      });
    return {
      lineas,
      cantidad: lineas.reduce((s, l) => s + l.cantidad, 0),
      total: Math.round(lineas.reduce((s, l) => s + l.subtotal, 0) * 100) / 100,
      cantidadDe: (id) => items[id] ?? 0,
      anadir: (id) => cambiar(id, 1),
      quitar: (id) => cambiar(id, -1),
      vaciar: () => setItems({}),
      abierto,
      abrir: () => setAbierto(true),
      cerrar: () => setAbierto(false),
    };
  }, [items, platos, abierto]);

  return <ContextoCarrito.Provider value={valor}>{children}</ContextoCarrito.Provider>;
}

export function useCarrito(): ValorCarrito {
  const valor = useContext(ContextoCarrito);
  if (!valor) throw new Error("useCarrito() solo funciona dentro de <MotorProvider>.");
  return valor;
}

/* ------------------------------------------------------------------ */
/* ES: Pedido para recoger · EN: Pickup order (WhatsApp)                */
/* ------------------------------------------------------------------ */

export interface DatosPedido {
  nombre: string;
  /** ES: "HH:MM" o "" para "lo antes posible". · EN: "HH:MM" or "" for "as soon as possible". */
  hora: string;
  nota: string;
}

export function usePedido() {
  const { cafe, t, tx, precio, hora } = useMotor();
  const carrito = useCarrito();
  const [datos, setDatos] = useState<DatosPedido>({ nombre: "", hora: "", nota: "" });
  const [intentado, setIntentado] = useState(false);
  const [horas, setHoras] = useState<string[]>([]);

  // ES: Horas de recogida de hoy: dependen de la hora real, así que se calculan en el navegador.
  // EN: Today's pickup times depend on the real time, so they are computed in the browser.
  useEffect(() => {
    const calcular = () => setHoras(horasDeRecogida(cafe.horario.franjas, cafe.horario.zonaHoraria));
    calcular();
    const id = window.setInterval(calcular, 60_000);
    return () => window.clearInterval(id);
  }, [cafe]);

  const errores: Errores<"nombre"> = { nombre: sanitize(datos.nombre) ? undefined : t("campoObligatorio") };
  const valido = !errores.nombre && carrito.lineas.length > 0;

  /** ES: El mensaje tal como llegará al WhatsApp del café. · EN: The message exactly as it reaches the café's WhatsApp. */
  const mensaje = () => {
    const lineas = [t("pedidoSaludo", { cafe: cafe.marca.nombre }), ""];
    for (const l of carrito.lineas) lineas.push(`• ${l.cantidad} × ${tx(l.plato.nombre)} — ${precio(l.subtotal)}`);
    lineas.push(
      "",
      t("pedidoTotal", { total: precio(carrito.total) }),
      t("pedidoNombre", { nombre: sanitize(datos.nombre, 60) }),
      t("pedidoHora", { hora: datos.hora ? hora(datos.hora) : t("loAntesPosible") }),
    );
    const nota = sanitize(datos.nota, 300);
    if (nota) lineas.push(t("pedidoNota", { nota }));
    return lineas.join("\n");
  };

  /** ES: Abre WhatsApp con el pedido; false (y errores) si falta algo. · EN: Opens WhatsApp with the order; false (and errors) if something is missing. */
  const enviar = () => {
    setIntentado(true);
    if (!valido || !cafe.contacto.whatsapp) return false;
    abrirWhatsApp(whatsappUrl(cafe.contacto.whatsapp, mensaje()));
    return true;
  };

  return {
    datos,
    cambiar: <K extends keyof DatosPedido>(campo: K, valor: DatosPedido[K]) => setDatos((d) => ({ ...d, [campo]: valor })),
    /** ES: Horas de recogida de hoy ("HH:MM"); vacío si ya no abre. · EN: Today's pickup times ("HH:MM"); empty if it no longer opens. */
    horas,
    /** ES: Errores por campo, tras intentar enviar. · EN: Errors per field, after trying to send. */
    errores: intentado ? errores : ({} as Errores<"nombre">),
    valido,
    mensaje,
    enviar,
  };
}

/* ------------------------------------------------------------------ */
/* ES: Reserva de mesa · EN: Table booking (WhatsApp)                   */
/* ------------------------------------------------------------------ */

export interface DatosReserva {
  nombre: string;
  personas: number;
  /** ES/EN: "2026-11-14" */
  fecha: string;
  /** ES/EN: "19:30" */
  hora: string;
  nota: string;
}

export function useReserva() {
  const { cafe, t, hora, idioma } = useMotor();
  const [datos, setDatos] = useState<DatosReserva>({ nombre: "", personas: 2, fecha: "", hora: "", nota: "" });
  const [intentado, setIntentado] = useState(false);
  const [hoy, setHoy] = useState("");

  // ES: "Hoy" en la zona del café: es el mínimo del calendario.
  // EN: "Today" in the café's time zone: the calendar's minimum date.
  useEffect(() => setHoy(fechaHoyEn(cafe.horario.zonaHoraria)), [cafe]);

  const horas = useMemo(() => (datos.fecha ? horasParaReserva(cafe.horario.franjas, datos.fecha) : []), [cafe, datos.fecha]);
  const errores: Errores<"nombre" | "fecha" | "hora"> = {
    nombre: sanitize(datos.nombre) ? undefined : t("campoObligatorio"),
    fecha: datos.fecha && (!hoy || datos.fecha >= hoy) ? undefined : t("campoObligatorio"),
    hora: datos.hora && horas.includes(datos.hora) ? undefined : t("campoObligatorio"),
  };
  const valido = !errores.nombre && !errores.fecha && !errores.hora;

  const mensaje = () => {
    const lineas = [
      t("reservaSaludo", { cafe: cafe.marca.nombre }),
      "",
      t("reservaDetalle", {
        personas: datos.personas,
        fecha: datos.fecha ? formatoFecha(datos.fecha, idioma, cafe.region) : "",
        hora: datos.hora ? hora(datos.hora) : "",
      }),
      t("reservaNombre", { nombre: sanitize(datos.nombre, 60) }),
    ];
    const nota = sanitize(datos.nota, 300);
    if (nota) lineas.push(t("pedidoNota", { nota }));
    return lineas.join("\n");
  };

  const enviar = () => {
    setIntentado(true);
    if (!valido || !cafe.contacto.whatsapp) return false;
    abrirWhatsApp(whatsappUrl(cafe.contacto.whatsapp, mensaje()));
    return true;
  };

  return {
    datos,
    cambiar: <K extends keyof DatosReserva>(campo: K, valor: DatosReserva[K]) =>
      setDatos((d) => ({ ...d, [campo]: valor, ...(campo === "fecha" ? { hora: "" } : {}) })),
    /** ES: Fecha mínima del calendario ("" hasta cargar). · EN: Calendar minimum date ("" until loaded). */
    hoy,
    /** ES: Horas posibles para la fecha elegida. · EN: Available times for the chosen date. */
    horas,
    errores: intentado ? errores : ({} as Errores<"nombre" | "fecha" | "hora">),
    valido,
    mensaje,
    enviar,
  };
}
