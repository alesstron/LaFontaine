/**
 * [EDITABLE] Textos de la piel / Skin texts
 *
 * ES: Frases propias del diseño de Café LaFontaine (rótulos, etiquetas, cartelas) en francés, inglés y español, y
 *     cómo se reparten las categorías de la carta entre las tres pizarras. Se pueden reescribir libremente
 *     respetando comillas y comas. Los DATOS del café (carta, precios, horario, historia…) no van aquí: están en
 *     src/data/cafe.config.ts. Cada bloque dice en qué sección de la página se ve (y su carpeta).
 * EN: Café LaFontaine's design copy (headings, labels, label cards) in French, English and Spanish, and how the menu
 *     categories are shared out between the three boards. Rewrite freely, keeping quotes and commas. The café's
 *     DATA (menu, prices, hours, story…) does not live here: it is in src/data/cafe.config.ts. Each block says
 *     which page section shows it (and its folder).
 *
 *   Formato · Format:  clave: { fr: "…", en: "…", es: "…" }
 *   Si falta un idioma se usa el francés · A missing language falls back to French.
 */
import type { Texto } from "@/motor";

/**
 * ES: La frase del mural, tal como está pintada en la pared (en francés en todos los idiomas: es una obra).
 *     Se ve en: portada, letras huecas grandes (secciones/02-portada).
 * EN: The mural's sentence, exactly as painted on the wall (French in every language: it is an artwork).
 *     Shows in: hero, big outlined letters (secciones/02-portada).
 */
export const MURAL = ["Tout d'abord", "un café"] as const;

/**
 * ES: Etiquetas de los silos de café en grano del mostrador (foto del interior). null = silo sin etiqueta.
 *     Se ve en: franja "Au comptoir" bajo la portada (secciones/03-mostrador).
 * EN: Labels on the counter's coffee bean bins (interior photo). null = bin without a label.
 *     Shows in: the "Au comptoir" strip under the hero (secciones/03-mostrador).
 */
export const SILOS: (string | null)[] = ["Grain d'Or", "Mélange maison", null, "Espresso Guatemala"];

/**
 * ES: Las tres pizarras de la carta y las categorías (ids de cafe.config.ts) que lleva cada una, de arriba abajo.
 *     Una categoría que no esté en ninguna sale al final de la última. `tinta` = color del título.
 *     Se ve en: la carta (secciones/05-carta).
 * EN: The menu's three boards and the categories (ids from cafe.config.ts) each one carries, top to bottom.
 *     A category missing from every board shows at the end of the last one. `tinta` = title color.
 *     Shows in: the menu (secciones/05-carta).
 *
 *     ┌─ À BOIRE ─┐ ┌─ MENU LATINO ─┐ ┌─ À MANGER ─┐
 *     │ cafe-the  │ │ tacos …       │ │ bagels …   │
 *     └───────────┘ └───────────────┘ └────────────┘
 */
export const TABLEROS: { id: string; titulo: Texto; tinta: "ardoise" | "bordeaux" | "plafond"; categorias: string[] }[] = [
  { id: "boire", titulo: { fr: "À boire", en: "To drink", es: "Para beber" }, tinta: "ardoise", categorias: ["cafe-the"] },
  {
    id: "latino",
    titulo: { fr: "Menu latino", en: "Latin menu", es: "Menú latino" },
    tinta: "bordeaux",
    categorias: ["tacos", "burritos", "quesadillas", "dejeuner", "pupusas", "repas-du-jour", "vitrine"],
  },
  {
    id: "manger",
    titulo: { fr: "À manger", en: "To eat", es: "Para comer" },
    tinta: "plafond",
    categorias: ["bagels", "soupes", "salades", "panini", "extras"],
  },
];

/**
 * ES: Leyenda del plato del día dibujado: el guiso visto desde arriba (1 proteína, 2 arroz, 3 frijoles,
 *     4 guacamole, 5 tortillas, 6 bebida). Si el plato destacado de la carta cambia, cambia también esta leyenda.
 *     Se ve en: "Le plat du jour" (secciones/04-plato-del-dia).
 * EN: Legend of the drawn dish of the day: the guiso seen from above (1 protein, 2 rice, 3 beans, 4 guacamole,
 *     5 tortillas, 6 drink). If the menu's featured dish changes, change this legend too.
 *     Shows in: "Le plat du jour" (secciones/04-plato-del-dia).
 */
export const PLATO = {
  proteina: { fr: "une protéine", en: "a protein", es: "una proteína" },
  arroz: { fr: "riz", en: "rice", es: "arroz" },
  frijoles: { fr: "haricots", en: "beans", es: "frijoles" },
  guacamole: { fr: "guacamole", en: "guacamole", es: "guacamole" },
  tortillas: { fr: "tortillas", en: "tortillas", es: "tortillas" },
  bebida: { fr: "soda, café filtre ou thé", en: "soda, filter coffee or tea", es: "refresco, café de filtro o té" },
} satisfies Record<string, Texto>;

/**
 * ES: Resto de frases de la piel, agrupadas por la sección donde se ven.
 * EN: The rest of the skin's copy, grouped by the section that shows it.
 */
export const COPY = {
  // ── 01 Cabecera · Header (secciones/01-cabecera) ──────────────────────────────────────
  // ES: Enlaces del menú de navegación y textos para lectores de pantalla.
  // EN: Navigation links and screen-reader texts.
  navAria: { fr: "Sections du site", en: "Site sections", es: "Secciones de la web" },
  navPlato: { fr: "Plat du jour", en: "Dish of the day", es: "Plato del día" },
  navExpo: { fr: "L'expo", en: "Exhibition", es: "La expo" },
  navReserva: { fr: "Réserver", en: "Book", es: "Reservar" },
  abrirMenu: { fr: "Ouvrir la navigation", en: "Open navigation", es: "Abrir la navegación" },
  cerrarMenu: { fr: "Fermer la navigation", en: "Close navigation", es: "Cerrar la navegación" },
  articulos: { fr: "article(s) dans la commande", en: "item(s) in the order", es: "artículo(s) en el pedido" },

  // ── 02 Portada · Hero (secciones/02-portada) ──────────────────────────────────────────
  // ES: Nota bajo el paisaje del mural y título de la cartela de la foto enmarcada.
  // EN: Note under the mural landscape and title of the framed photo's label card.
  muralNota: {
    fr: "La murale du café, à côté du comptoir",
    en: "“First things first, a coffee”: the mural by the counter",
    es: "«Antes que nada, un café»: el mural junto a la barra",
  },
  obraTitulo: { fr: "La salle", en: "The room", es: "El salón" },

  // ── 03 Mostrador · Counter (secciones/03-mostrador) ───────────────────────────────────
  // ES: Antetítulo y frase al lado de los silos. · EN: Overline and sentence next to the bins.
  comptoirAntetitulo: { fr: "Au comptoir", en: "At the counter", es: "En la barra" },
  comptoirTexto: {
    fr: "Les grains de la maison attendent dans les silos dorés, à côté de la machine.",
    en: "The house beans wait in the golden bins, next to the machine.",
    es: "Los granos de la casa esperan en los silos dorados, junto a la máquina.",
  },

  // ── 04 Plato del día · Dish of the day (secciones/04-plato-del-dia) ───────────────────
  // ES: Antetítulo de la tarjeta (sale de las opiniones: "un plato distinto cada día").
  // EN: Card overline (from the reviews: "a different dish every day").
  platoAntetitulo: { fr: "Chaque jour, un plat différent", en: "A different dish every day", es: "Cada día, un plato distinto" },

  // ── 05 Carta · Menu (secciones/05-carta) ──────────────────────────────────────────────
  // ES: Antetítulo, marca de vegetariano, texto de platos sin precio y nombre del grupo de tamaños.
  // EN: Overline, vegetarian tag, text for items without a price and size-group name.
  cartaAntetitulo: { fr: "Tel qu'affiché au comptoir", en: "As posted at the counter", es: "Tal como está en la barra" },
  vegCorto: { fr: "Vég.", en: "Veg.", es: "Veg." },
  sinPrecio: { fr: "Au comptoir", en: "At the counter", es: "En la barra" },
  tamanos: { fr: "Formats", en: "Sizes", es: "Tamaños" },

  // ── 07 Galería · Gallery (secciones/07-galeria) ───────────────────────────────────────
  // ES: Antetítulo, frase, nota de créditos y "N°" de las cartelas.
  // EN: Overline, sentence, credits note and the label cards' "No.".
  expoAntetitulo: { fr: "L'expo", en: "The exhibition", es: "La exposición" },
  expoTexto: {
    fr: "Le café expose de l'art et reçoit des musiciens ; ici, on accroche ce qui passe sur les tables.",
    en: "The café exhibits art and hosts musicians; here, we hang what lands on the tables.",
    es: "El café expone arte y recibe músicos; aquí colgamos lo que llega a las mesas.",
  },
  expoNota: {
    fr: "Photos de clients et du café publiées sur Google Maps.",
    en: "Customer and café photos posted on Google Maps.",
    es: "Fotos de clientes y del café publicadas en Google Maps.",
  },
  numero: { fr: "N°", en: "No.", es: "N.º" },

  // ── 08 Opiniones · Reviews (secciones/08-opiniones) ───────────────────────────────────
  // ES: Título del libro, subtítulo de los temas, enlace y texto de las estrellas para lectores de pantalla.
  // EN: Book title, topics subtitle, link and screen-reader text for the stars.
  libroTitulo: { fr: "Le livre d'or", en: "The guestbook", es: "El libro de visitas" },
  libroTemas: { fr: "Ce qui revient le plus", en: "What comes up most", es: "Lo que más se repite" },
  verOpiniones: { fr: "Lire les avis sur Google", en: "Read the reviews on Google", es: "Leer las opiniones en Google" },
  estrellas: { fr: "{nota} étoiles sur 5", en: "{nota} stars out of 5", es: "{nota} estrellas de 5" },

  // ── 10 Reserva · Booking (secciones/10-reserva) ───────────────────────────────────────
  // ES: Antetítulo y textos del formulario. · EN: Overline and form texts.
  sillonesAntetitulo: { fr: "Prenez un fauteuil", en: "Grab an armchair", es: "Toma asiento" },
  menos: { fr: "Une personne de moins", en: "One guest fewer", es: "Una persona menos" },
  mas: { fr: "Une personne de plus", en: "One more guest", es: "Una persona más" },
  eligeFecha: { fr: "Choisissez d'abord la date", en: "Pick a date first", es: "Elige primero la fecha" },
  sinHoras: { fr: "Fermé ce jour-là", en: "Closed that day", es: "Cerrado ese día" },

  // ── 11 Visita · Visit (secciones/11-visita) y 12 Pie · Footer (secciones/12-pie) ─────
  // ES: Pie del dibujo de la fuente y nombre del enlace a Facebook.
  // EN: Caption of the fountain drawing and the Facebook link's name.
  parque: { fr: "Parc La Fontaine", en: "Parc La Fontaine", es: "Parque La Fontaine" },
  facebook: { fr: "Facebook", en: "Facebook", es: "Facebook" },

  // ── 13 Pedido · Order (secciones/13-pedido) ───────────────────────────────────────────
  // ES: Etiqueta salmón de la bolsa kraft ("Pour emporter · Pour : Alex").
  // EN: The kraft bag's salmon label ("Pour emporter · Pour: Alex").
  bolsaEtiqueta: { fr: "Pour emporter", en: "To go", es: "Para llevar" },
  bolsaPara: { fr: "Pour : {nombre}", en: "For: {nombre}", es: "Para: {nombre}" },

  // ── 12 Pie · Footer (secciones/12-pie) ────────────────────────────────────────────────
  // ES: Crédito de las fotos. · EN: Photo credit.
  creditos: {
    fr: "Photos : clients et café sur Google Maps (crédit sur chaque photo).",
    en: "Photos: customers and the café on Google Maps (credit on each photo).",
    es: "Fotos: clientes y el café en Google Maps (crédito en cada foto).",
  },
} satisfies Record<string, Texto>;
