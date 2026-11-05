/**
 * [NO TOCAR · DO NOT EDIT] Motor / Engine
 *
 * ES: Tipos del motor. Todo lo que cambia de una cafetería a otra se describe con CafeConfig y vive en
 *     src/data/cafe.config.ts. La piel (src/estilo/) solo lee estos datos: nunca los inventa.
 * EN: Engine types. Everything that changes from one café to another is described by CafeConfig and lives
 *     in src/data/cafe.config.ts. The skin (src/estilo/) only reads this data: it never makes it up.
 */

/** ES: Idiomas que el motor sabe mostrar. · EN: Languages the engine can display. */
export type Idioma = "es" | "en" | "fr";

/**
 * ES: Texto en un idioma ("Hola") o en varios ({ fr: "Bonjour", en: "Hello" }). Si falta uno, se usa el idioma base.
 * EN: Text in one language ("Hi") or several ({ fr: "Bonjour", en: "Hello" }). A missing one falls back to the base language.
 */
export type Texto = string | Partial<Record<Idioma, string>>;

/** ES: Gama contratada (tabla en gamas.ts). · EN: Purchased tier (table in gamas.ts). */
export type Gama = "basica" | "estandar" | "premium";

/** ES: Días: 0 = domingo … 6 = sábado. · EN: Days: 0 = Sunday … 6 = Saturday. */
export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Foto {
  /** ES: Ruta dentro de /public, p. ej. "/img/fachada.jpg". · EN: Path inside /public, e.g. "/img/facade.jpg". */
  src: string;
  /** ES: Descripción para lectores de pantalla. · EN: Description for screen readers. */
  alt: Texto;
  /** ES: Medidas reales en píxeles (ver docs/fotos.json). · EN: Real size in pixels (see docs/fotos.json). */
  ancho: number;
  alto: number;
  /** ES: Autor de la foto, para el crédito visible. · EN: Photo author, for the visible credit. */
  autor?: string;
}

export interface Plato {
  /** ES: Identificador único en toda la carta (lo usa el carrito). · EN: Unique id across the menu (used by the cart). */
  id: string;
  nombre: Texto;
  descripcion?: Texto;
  /**
   * ES: Precio en la moneda del café. Sin precio, el plato se muestra pero no se puede pedir.
   * EN: Price in the café's currency. Without a price the item is shown but cannot be ordered.
   */
  precio?: number;
  /** ES: true = se suma a otro plato ("+4,50 $"). · EN: true = an add-on to another item ("+$4.50"). */
  suplemento?: boolean;
  vegetariano?: boolean;
  /** ES: Etiquetas cortas: "Signature", "Nouveau"… · EN: Short labels: "Signature", "New"… */
  etiquetas?: Texto[];
  destacado?: boolean;
  foto?: Foto;
}

export interface Categoria {
  id: string;
  nombre: Texto;
  nota?: Texto;
  platos: Plato[];
}

/**
 * ES: Franja de apertura en hora local del café ("HH:MM"). Si cierra antes de abrir, cierra pasada la medianoche.
 * EN: Opening slot in the café's local time ("HH:MM"). If it closes before it opens, it closes after midnight.
 */
export interface Franja {
  dia: DiaSemana;
  abre: string;
  cierra: string;
}

export interface Resenas {
  /** ES: Nota media (p. ej. 4.6) y total de opiniones. · EN: Average rating (e.g. 4.6) and total reviews. */
  nota: number;
  total: number;
  /** ES: De dónde salen: "Google", "TripAdvisor"… · EN: Where they come from: "Google", "TripAdvisor"… */
  fuente: string;
  url?: string;
  /** ES: Temas más mencionados y cuántas veces (filtros de Google Maps). · EN: Most mentioned topics and how often (Google Maps filters). */
  temas?: { nombre: Texto; menciones: number }[];
  /**
   * ES: Frases destacadas. Con autor = cita literal aprobada por el dueño. Sin autor = resumen de varias
   *     opiniones (nunca inventar citas con nombre).
   * EN: Highlighted lines. With an author = a verbatim quote approved by the owner. Without an author = a
   *     summary of several reviews (never invent named quotes).
   */
  destacadas?: { texto: Texto; autor?: string }[];
}

export interface Promo {
  id: string;
  titulo: Texto;
  descripcion?: Texto;
  /** ES: Cuándo: "Tous les jeudis"… · EN: When: "Every Thursday"… */
  cuando?: Texto;
  foto?: Foto;
}

export interface Hito {
  /** ES: Año o momento: "2010", "Aujourd'hui"… · EN: Year or moment: "2010", "Today"… */
  anio: Texto;
  titulo?: Texto;
  texto: Texto;
}

/** ES: Funciones que una gama activa o desactiva. · EN: Features a tier turns on or off. */
export interface Funciones {
  historia: boolean;
  galeria: boolean;
  resenas: boolean;
  /** ES: Botón flotante de WhatsApp. · EN: Floating WhatsApp button. */
  whatsappFlotante: boolean;
  /** ES: Animaciones al hacer scroll. · EN: Scroll animations. */
  animaciones: boolean;
  /** ES: Carta en pestañas por categoría. · EN: Menu split into tabs by category. */
  cartaPestanas: boolean;
  /** ES: Fotos de los platos en la carta. · EN: Dish photos inside the menu. */
  cartaFotos: boolean;
  /** ES: Pedido para recoger por WhatsApp (sin pasarela de pago). · EN: Pickup order via WhatsApp (no payment gateway). */
  pedido: boolean;
  /** ES: Reserva de mesa por WhatsApp. · EN: Table booking via WhatsApp. */
  reserva: boolean;
  /** ES: Selector de idioma. · EN: Language switcher. */
  idiomas: boolean;
  promos: boolean;
  /** ES: Animaciones de lujo (entradas, efectos al pasar el ratón, bucles). · EN: Premium animations (entrances, hover effects, loops). */
  animacionesAvanzadas: boolean;
}

export interface CafeConfig {
  gama: Gama;
  /**
   * ES: true = maqueta para enseñar al dueño: aviso visible y la página no se indexa en Google.
   * EN: true = mock-up to show the owner: visible notice and the page is not indexed by Google.
   */
  demo: boolean;
  /** ES: Tipo de negocio para Google (schema.org). · EN: Business type for Google (schema.org). */
  tipo: "CafeOrCoffeeShop" | "Restaurant" | "FastFoodRestaurant" | "Bakery" | "IceCreamShop";
  idiomaBase: Idioma;
  /**
   * ES: Idiomas con textos escritos. El selector solo aparece si la gama lo incluye y hay más de uno.
   * EN: Languages with written texts. The switcher only shows if the tier includes it and there is more than one.
   */
  idiomas: Idioma[];
  /** ES: País para formatear precios y horas: "CA", "ES"… · EN: Country used to format prices and times: "CA", "ES"… */
  region: string;
  /** ES: Código de moneda ISO: "CAD", "EUR"… · EN: ISO currency code: "CAD", "EUR"… */
  moneda: string;
  marca: {
    nombre: string;
    eslogan: Texto;
    /** ES: Una o dos frases (portada, Google, redes). · EN: One or two sentences (hero, Google, social). */
    descripcion: Texto;
    desde?: number;
    /** ES: Icono de la pestaña del navegador, en /public. · EN: Browser tab icon, in /public. */
    icono?: string;
  };
  contacto: {
    direccion: string;
    ciudad: string;
    codigoPostal?: string;
    provincia?: string;
    /** ES: Código de país ISO: "CA", "ES"… · EN: ISO country code: "CA", "ES"… */
    pais: string;
    lat: number;
    lng: number;
    /** ES: Teléfono tal como se muestra. · EN: Phone number as displayed. */
    telefono?: string;
    /**
     * ES: WhatsApp en formato internacional, solo dígitos ("14388369706"). Sin él no hay pedidos ni reservas.
     * EN: WhatsApp in international format, digits only ("14388369706"). Without it there are no orders or bookings.
     */
    whatsapp?: string;
    email?: string;
    /** ES: Cómo llegar en una línea. · EN: How to get there, in one line. */
    referencia?: Texto;
    redes?: { facebook?: string; instagram?: string; tiktok?: string };
    /** ES: Enlace a la ficha de Google Maps. · EN: Link to the Google Maps listing. */
    mapsUrl?: string;
  };
  horario: {
    /**
     * ES: Zona horaria IANA: "America/Toronto" (sirve para Montreal), "Europe/Madrid", "America/Caracas"…
     * EN: IANA time zone: "America/Toronto" (also Montreal), "Europe/Madrid", "America/Caracas"…
     */
    zonaHoraria: string;
    franjas: Franja[];
  };
  /** ES: Servicios en frases cortas. · EN: Services as short phrases. */
  servicios?: Texto[];
  /** ES: Foto principal (y vista previa al compartir el enlace). · EN: Main photo (and preview when sharing the link). */
  portada?: Foto;
  carta: Categoria[];
  /** ES: Nota bajo la carta: "Prix avant taxes"… · EN: Note under the menu: "Prices before tax"… */
  notaPrecios?: Texto;
  historia?: { titulo?: Texto; parrafos: Texto[]; hitos?: Hito[] };
  galeria?: Foto[];
  resenas?: Resenas;
  promos?: Promo[];
  /** ES: Cambios sueltos sobre la gama (p. ej. quitar reservas). · EN: One-off changes to the tier (e.g. turn off bookings). */
  funciones?: Partial<Funciones>;
  /** ES: Dominio final cuando lo haya. · EN: Final domain once there is one. */
  seo?: { url?: string };
}
