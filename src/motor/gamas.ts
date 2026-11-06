/**
 * [NO TOCAR · DO NOT EDIT] Motor / Engine
 *
 * ES: Gamas: qué incluye cada nivel que se vende al cliente. La piel nunca decide esto por su cuenta:
 *     pregunta a seccionesDe() qué pintar, así cambiar de gama es cambiar una línea de cafe.config.ts.
 * EN: Tiers: what each level sold to the client includes. The skin never decides this on its own:
 *     it asks seccionesDe() what to draw, so switching tiers means changing one line in cafe.config.ts.
 */
import type { CafeConfig, Funciones, Gama } from "./tipos";

const NADA: Funciones = {
  historia: false,
  galeria: false,
  resenas: false,
  whatsappFlotante: false,
  animaciones: false,
  cartaPestanas: false,
  cartaFotos: false,
  pedido: false,
  reserva: false,
  idiomas: false,
  promos: false,
  animacionesAvanzadas: false,
};

export const GAMAS: Record<Gama, Funciones> = {
  // ES: Básica: portada, carta en lista, horario, mapa y contacto. Una página, animación mínima.
  // EN: Basic: hero, list menu, hours, map and contact. One page, minimal motion.
  basica: NADA,
  // ES: Estándar: + historia, galería, opiniones, botón flotante de WhatsApp y animaciones al hacer scroll.
  // EN: Standard: + story, gallery, reviews, floating WhatsApp button and scroll animations.
  estandar: { ...NADA, historia: true, galeria: true, resenas: true, whatsappFlotante: true, animaciones: true },
  // ES: Premium: todo, incluidos pedidos y reservas por WhatsApp, idiomas y promociones.
  // EN: Premium: everything, including WhatsApp orders and bookings, languages and promotions.
  premium: {
    historia: true,
    galeria: true,
    resenas: true,
    whatsappFlotante: true,
    animaciones: true,
    cartaPestanas: true,
    cartaFotos: true,
    pedido: true,
    reserva: true,
    idiomas: true,
    promos: true,
    animacionesAvanzadas: true,
  },
};

/**
 * ES: Funciones activas: las de la gama más los cambios sueltos de `funciones` en cafe.config.ts.
 * EN: Active features: the tier's ones plus any one-off changes from `funciones` in cafe.config.ts.
 */
export function funcionesDe(cafe: CafeConfig): Funciones {
  return { ...GAMAS[cafe.gama], ...cafe.funciones };
}

export type Seccion = "portada" | "carta" | "historia" | "galeria" | "resenas" | "promos" | "pedido" | "reserva" | "visita";
export type Secciones = Record<Seccion, boolean>;

/**
 * ES: Secciones que la piel debe pintar: la gama las incluye y hay datos para llenarlas.
 *     Una sección sin datos se oculta sola (por ejemplo, promos vacías o una galería de menos de 3 fotos).
 * EN: Sections the skin must draw: the tier includes them and there is data to fill them.
 *     A section without data hides itself (e.g. empty promos or a gallery with fewer than 3 photos).
 */
export function seccionesDe(cafe: CafeConfig, f: Funciones = funcionesDe(cafe)): Secciones {
  const hayWhatsapp = Boolean(cafe.contacto.whatsapp);
  const hayPrecios = cafe.carta.some((c) => c.platos.some((p) => typeof p.precio === "number" && !p.suplemento));
  return {
    portada: true,
    carta: cafe.carta.some((c) => c.platos.length > 0),
    historia: f.historia && Boolean(cafe.historia?.parrafos.length),
    galeria: f.galeria && (cafe.galeria?.length ?? 0) >= 3,
    resenas: f.resenas && Boolean(cafe.resenas),
    promos: f.promos && (cafe.promos?.length ?? 0) > 0,
    pedido: f.pedido && hayWhatsapp && hayPrecios,
    // ES: Esta demo solo reserva en línea (/reserver): sin bloque `reservas` no hay sección ni botones.
    // EN: This demo only books online (/reserver): without a `reservas` block there is no section nor buttons.
    reserva: f.reserva && Boolean(cafe.reservas),
    visita: true,
  };
}
