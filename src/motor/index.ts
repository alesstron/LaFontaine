/**
 * [NO TOCAR · DO NOT EDIT] Motor / Engine
 *
 * ES: Puerta de entrada del motor para la piel: todo lo que una cafetería necesita se importa de "@/motor".
 *     La piel (src/estilo/) se rediseña para cada café; esta carpeta viene de la plantilla, más las
 *     reservas en línea propias de esta demo (src/motor/reservas/, ver docs/RESERVAS.md).
 * EN: The engine's entry point for the skin: everything a café needs is imported from "@/motor".
 *     The skin (src/estilo/) is redesigned for each café; this folder comes from the template, plus the
 *     online bookings specific to this demo (src/motor/reservas/, see docs/RESERVAS.en.md).
 */
export * from "./tipos";
export { GAMAS, funcionesDe, seccionesDe, type Seccion, type Secciones } from "./gamas";
export {
  estadoHorario,
  fraseEstado,
  semana,
  semanaAgrupada,
  horasDeRecogida,
  horasParaReserva,
  fechaHoyEn,
  type EstadoHorario,
  type DiaHorario,
  type GrupoHorario,
} from "./horario";
export { NOMBRE_IDIOMA, formatoPrecio, formatoHora, formatoFecha, nombreDia, traducir, type ClaveUI } from "./textos";
export { sanitize, whatsappUrl, abrirWhatsApp, urlTelefono } from "./whatsapp";
export { urlMapaIncrustado, urlComoLlegar, urlFicha } from "./mapa";
export {
  MotorProvider,
  useMotor,
  useCarrito,
  useEstadoHorario,
  usePedido,
  useReserva,
  type ValorMotor,
  type ValorCarrito,
  type LineaPedido,
  type DatosPedido,
  type DatosReserva,
} from "./proveedor";

// ES: Reservas en línea (solo en esta demo): hooks de las páginas /reserver, /reserver/anular y /reserver/gestion.
//     La parte de servidor (base de datos, acciones, sesión) no se exporta aquí: la piel nunca la importa.
// EN: Online bookings (this demo only): hooks for the /reserver, /reserver/anular and /reserver/gestion pages.
//     The server side (database, actions, session) is not exported here: the skin never imports it.
export {
  useReservaEnLinea,
  useAnularReserva,
  usePanelReservas,
  type EstadoDia,
  type DiaCalendario,
  type TurnoCalendario,
  type ContactoReserva,
  type EstadoAnular,
  type DiaPanel,
  type TurnoPanel,
  type ValorPanel,
} from "./reservas/cliente";
export { LIMITES as LIMITES_RESERVA } from "./reservas/validar";
export { sumarDias, diasEntre } from "./reservas/disponibilidad";
export type {
  CampoReserva,
  ErrorCampo,
  ErroresReserva,
  EntradaReserva,
  EstadoBaseDeDatos,
  EstadoReserva,
  MotivoFallo,
  ReservaConfirmada,
  ReservaPanel,
  ReservaPublica,
} from "./reservas/tipos";
