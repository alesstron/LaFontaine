/**
 * [NO TOCAR · DO NOT EDIT] Motor / Engine
 *
 * ES: Puerta de entrada del motor para la piel: todo lo que una cafetería necesita se importa de "@/motor".
 *     La piel (src/estilo/) se rediseña para cada café; esta carpeta es igual en todos.
 * EN: The engine's entry point for the skin: everything a café needs is imported from "@/motor".
 *     The skin (src/estilo/) is redesigned for each café; this folder is the same for all of them.
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
export { NOMBRE_IDIOMA, formatoPrecio, formatoHora, nombreDia, traducir, type ClaveUI } from "./textos";
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
