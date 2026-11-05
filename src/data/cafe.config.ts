/**
 * [EDITABLE] Datos del café / Café data
 *
 * ES: Datos de Café LaFontaine (Montréal). Es el archivo que se edita para cambiar textos, precios, horario,
 *     contacto y fotos; el diseño no hace falta tocarlo. Fuentes de cada dato en docs/INFO-EXTRAIDA.md.
 *     Por confirmar con el dueño antes de publicar:
 *       - WhatsApp: se usa el teléfono público del local; no sabemos si tiene WhatsApp.
 *       - Precios: los del menú del mostrador fotografiado en junio de 2025 (pueden haber cambiado).
 *       - Relación con Café Grain d'Or (su Facebook enlaza esa web; la carta lleva su logotipo).
 *       - Empanadas: salen en las opiniones pero no en el menú; aquí van sin precio.
 *       - Fotos: casi todas son de clientes en Google Maps; la web real necesita fotos propias.
 * EN: Café LaFontaine (Montréal) data. This is the file to edit to change texts, prices, hours, contact
 *     and photos; the design does not need to be touched. Where each fact comes from: docs/INFO-EXTRAIDA.md.
 *     To confirm with the owner before going live:
 *       - WhatsApp: the shop's public phone is used; we don't know if it has WhatsApp.
 *       - Prices: from the counter menu photographed in June 2025 (they may have changed).
 *       - Link with Café Grain d'Or (their Facebook links to that website; the menu carries its logo).
 *       - Empanadas: mentioned in reviews but not on the menu; listed here without a price.
 *       - Photos: most are customer photos from Google Maps; the real site needs the café's own photos.
 *
 * ES: Textos con varios idiomas: { fr: "…", en: "…", es: "…" }. Respeta comillas y comas al editar.
 *     Tamaños: platos seguidos con el mismo nombre y " · " (Latté · petit / Latté · moyen) salen en una sola
 *     línea con un botón por tamaño. Escribe el nombre igual en todos para que se agrupen.
 * EN: Multi-language texts: { fr: "…", en: "…", es: "…" }. Keep quotes and commas intact when editing.
 *     Sizes: consecutive items with the same name and " · " (Latté · petit / Latté · moyen) show on one line
 *     with one button per size. Write the name the same way in all of them so they group together.
 *
 *   Bloque · Block   Se ve en · Shows in                                         Carpeta · Folder (src/estilo/secciones)
 *   ──────────────   ─────────────────────────────────────────────────────────   ─────────────────────────────────────
 *   gama, funciones  qué secciones salen · which sections show                   (todas · all, ver Pagina.tsx)
 *   marca            nombre, lema, descripción, icono de la pestaña              01-cabecera, 02-portada, 12-pie
 *   contacto         dirección, mapa, teléfono, Facebook, WhatsApp               11-visita, 12-pie, 13-pedido, 10-reserva
 *   horario          etiqueta Ouvert/Fermé, póster de horario, horas a elegir    02-portada, 11-visita, 13-pedido, 10-reserva
 *   servicios        etiquetas salmón junto a la dirección                       11-visita
 *   portada          la foto enmarcada (y la vista previa al compartir)          02-portada
 *   carta            las tres pizarras; el plato `destacado` es el del día       05-carta, 04-plato-del-dia, 13-pedido
 *   notaPrecios      la nota bajo las pizarras                                   05-carta
 *   historia         etiqueta cosida y sellos                                    06-historia
 *   galeria          los cuadros de la exposición                                07-galeria
 *   resenas          el libro de oro                                             08-opiniones
 *   promos           carteles de promociones (solo premium)                      09-promos
 */
import type { CafeConfig, Foto } from "@/motor/tipos";

// ES: Fotos de public/img con sus medidas reales (docs/fotos.json). Sin autor = foto del propio café en Google Maps.
// EN: Photos in public/img with their real size (docs/fotos.json). No author = the café's own photo on Google Maps.
const FOTOS = {
  interieur: {
    src: "/img/interieur-mur.jpg",
    alt: {
      fr: "La salle du café : fauteuils en cuir cognac, mur crème avec la murale « Tout d'abord un café » et le comptoir avec ses silos à grains",
      en: "The café's room: cognac leather armchairs, cream wall with the “Tout d'abord un café” mural and the counter with its coffee bean bins",
      es: "El salón del café: sillones de cuero coñac, pared crema con el mural «Tout d'abord un café» y la barra con sus silos de café en grano",
    },
    ancho: 1600,
    alto: 1200,
    autor: "Maroi Ajina",
  },
  latte: {
    src: "/img/latte-art.jpg",
    alt: { fr: "Un barista verse le lait dans une tasse blanche, latte art en spirale", en: "A barista pours milk into a white cup, swirl latte art", es: "Un barista vierte la leche en una taza blanca, latte art en espiral" },
    ancho: 900,
    alto: 1600,
    autor: "Ruslana Arama",
  },
  tasseRouge: {
    src: "/img/tasse-rouge.jpg",
    alt: { fr: "Tasse rouge avec une rosette de latte art sur une table en bois", en: "Red cup with rosetta latte art on a wooden table", es: "Taza roja con una roseta de latte art sobre una mesa de madera" },
    ancho: 1205,
    alto: 1600,
    autor: "Gianluca Diarcangelo",
  },
  dejeunerLatino: {
    src: "/img/dejeuner-latino.jpg",
    alt: {
      fr: "Déjeuner latino : œufs à la sauce tomate, plantain frit, haricots noirs à la crème, fruits et tortillas de maïs",
      en: "Latin breakfast: eggs in tomato sauce, fried plantain, black beans with cream, fruit and corn tortillas",
      es: "Desayuno latino: huevos en salsa de tomate, plátano frito, frijoles negros con crema, fruta y tortillas de maíz",
    },
    ancho: 1600,
    alto: 901,
    autor: "Eddy Davila",
  },
  assiettes: {
    src: "/img/assiettes-latines.jpg",
    alt: { fr: "Vue du dessus : burrito, chilaquiles verts et tacos al pastor", en: "Top view: burrito, green chilaquiles and tacos al pastor", es: "Vista cenital: burrito, chilaquiles verdes y tacos al pastor" },
    ancho: 1600,
    alto: 1280,
  },
  tacos: {
    src: "/img/tacos-pastor.jpg",
    alt: { fr: "Quatre tacos al pastor à l'ananas, oignon, coriandre et lime", en: "Four tacos al pastor with pineapple, onion, cilantro and lime", es: "Cuatro tacos al pastor con piña, cebolla, cilantro y limón" },
    ancho: 1600,
    alto: 1280,
  },
  chilaquiles: {
    src: "/img/chilaquiles.jpg",
    alt: { fr: "Chilaquiles verts à la crème, fromage, oignon et coriandre", en: "Green chilaquiles with cream, cheese, onion and cilantro", es: "Chilaquiles verdes con crema, queso, cebolla y cilantro" },
    ancho: 720,
    alto: 640,
  },
  burrito: {
    src: "/img/burrito.jpg",
    alt: { fr: "Burrito coupé en deux : riz, haricots, chou et viande effilochée", en: "Burrito cut in half: rice, beans, cabbage and pulled meat", es: "Burrito partido por la mitad: arroz, frijoles, col y carne deshebrada" },
    ancho: 1600,
    alto: 1280,
  },
  bagel: {
    src: "/img/bagel-dejeuner.jpg",
    alt: {
      fr: "Bagel au sésame garni de jambon, œuf, cheddar, avocat, tomate et laitue",
      en: "Sesame bagel with ham, egg, cheddar, avocado, tomato and lettuce",
      es: "Bagel de sésamo con jamón, huevo, cheddar, aguacate, tomate y lechuga",
    },
    ancho: 1600,
    alto: 1280,
  },
} satisfies Record<string, Foto>;

export const cafe: CafeConfig = {
  // ── Gama y ajustes generales · Tier and general settings ───────────────────────────
  // Se ve en · Shows in: toda la página (qué secciones salen y en qué idioma) · the whole page (sections, language)
  // ES: Cómo cambiarlo: gama = "basica" | "estandar" | "premium" (qué secciones salen; ver README).
  //     Si cambias la gama, mueve también la carpeta a demos/<gama>/ (ver cafe v1/LEEME.md).
  // EN: How to change it: gama = "basica" | "estandar" | "premium" (which sections show; see README).
  //     If you change the tier, also move the folder to demos/<tier>/ (see cafe v1/LEEME.md).
  gama: "premium",
  // ES: true mientras sea una maqueta (aviso visible, fuera de Google). false en la web real.
  // EN: true while it is a mock-up (visible notice, hidden from Google). false on the real site.
  demo: true,
  tipo: "CafeOrCoffeeShop",
  // ES: Cómo cambiarlo: idioma por defecto e idiomas con textos ("fr", "en", "es").
  // EN: How to change it: default language and languages with texts ("fr", "en", "es").
  idiomaBase: "fr",
  idiomas: ["fr", "en", "es"],
  // ES: País y moneda para formatear precios y horas. · EN: Country and currency for prices and times.
  region: "CA",
  moneda: "CAD",

  // ── Marca · Brand ──────────────────────────────────────────────────────────────────
  // Se ve en · Shows in: cabecera, portada (lema · nombre · descripción), pie y resultados de Google · header, hero, footer
  // ES: Cómo cambiarlo: nombre, lema y descripción (Google también usa la descripción). El lema sale de la
  //     presentación de su Facebook ("Perle cachée", "Café de quartier").
  // EN: How to change it: name, tagline and description (Google also uses the description). The tagline comes
  //     from their Facebook bio ("Perle cachée", "Café de quartier").
  marca: {
    nombre: "Café LaFontaine",
    eslogan: {
      fr: "Perle cachée · Café de quartier",
      en: "A hidden gem · Neighbourhood café",
      es: "Una joya escondida · Café de barrio",
    },
    descripcion: {
      fr: "Café de quartier face au parc La Fontaine : espresso, bagels, cuisine latino (tacos, pupusas, chilaquiles) et un repas du jour différent chaque jour. Des expositions d'art aux murs.",
      en: "Neighbourhood café across from Parc La Fontaine: espresso, bagels, Latin food (tacos, pupusas, chilaquiles) and a different meal of the day every day. Art exhibitions on the walls.",
      es: "Café de barrio frente al parque La Fontaine: espresso, bagels, cocina latina (tacos, pupusas, chilaquiles) y un plato del día distinto cada día. Exposiciones de arte en las paredes.",
    },
    // ES: Icono de la pestaña (medallón con el nombre). · EN: Browser tab icon (medallion with the name).
    icono: "/marca/icono.svg",
  },

  // ── Contacto y ubicación · Contact and location ────────────────────────────────────
  // Se ve en · Shows in: "Nous trouver" (dirección, mapa, botones), pie, cartela de la portada; WhatsApp = pedido y reserva
  // ES: Cómo cambiarlo: dirección, teléfono y WhatsApp. lat/lng salen de la URL de Google Maps (!3d…!4d…).
  // EN: How to change it: address, phone and WhatsApp. lat/lng come from the Google Maps URL (!3d…!4d…).
  contacto: {
    direccion: "3535, avenue Papineau, local 9",
    ciudad: "Montréal",
    codigoPostal: "H2K 4J9",
    provincia: "QC",
    pais: "CA",
    lat: 45.5293363,
    lng: -73.566255,
    telefono: "+1 514-527-3030",
    // ES: POR CONFIRMAR: teléfono público del local; falta saber si tiene WhatsApp. Solo dígitos, con prefijo.
    //     Sin WhatsApp, borra esta línea: el pedido y la reserva se ocultan solos.
    // EN: TO CONFIRM: the shop's public phone; we don't know if it has WhatsApp. Digits only, with country code.
    //     Without WhatsApp, delete this line: ordering and booking hide themselves.
    whatsapp: "15145273030",
    referencia: {
      fr: "Face au parc La Fontaine, sur l'avenue Papineau",
      en: "Across from Parc La Fontaine, on avenue Papineau",
      es: "Frente al parque La Fontaine, en la avenida Papineau",
    },
    redes: { facebook: "https://www.facebook.com/cafelafontaine/" },
    mapsUrl: "https://maps.app.goo.gl/aNQLVSCfXRUV3i4M6",
  },

  // ── Horario · Opening hours ────────────────────────────────────────────────────────
  // Se ve en · Shows in: etiqueta "Ouvert/Fermé" de la portada, póster de "Nous trouver", horas del pedido y la reserva
  // ES: Cómo cambiarlo: una línea por día (0 = domingo … 6 = sábado), horas "HH:MM" de 24 h.
  //     Día cerrado = quita su línea (el domingo está cerrado). Dos turnos el mismo día = dos líneas.
  // EN: How to change it: one line per day (0 = Sunday … 6 = Saturday), 24-hour "HH:MM" times.
  //     Closed day = remove its line (Sunday is closed). Two shifts on one day = two lines.
  horario: {
    zonaHoraria: "America/Toronto",
    franjas: [
      { dia: 1, abre: "08:00", cierra: "17:00" },
      { dia: 2, abre: "08:00", cierra: "15:00" },
      { dia: 3, abre: "08:00", cierra: "15:00" },
      { dia: 4, abre: "08:00", cierra: "17:00" },
      { dia: 5, abre: "08:00", cierra: "17:00" },
      { dia: 6, abre: "09:00", cierra: "17:00" },
    ],
  },

  // Se ve en · Shows in: etiquetas salmón de "Nous trouver" · salmon labels in "Nous trouver"
  // ES: Cómo cambiarlo: servicios junto a la dirección, en frases cortas.
  // EN: How to change it: services shown next to the address, as short phrases.
  servicios: [
    { fr: "Sur place", en: "Dine-in", es: "Para tomar aquí" },
    { fr: "À emporter", en: "Takeout", es: "Para llevar" },
    { fr: "Réservations", en: "Reservations", es: "Reservas" },
    { fr: "Expositions d'art", en: "Art exhibitions", es: "Exposiciones de arte" },
  ],

  // Se ve en · Shows in: la foto enmarcada de la portada · the hero's framed photo
  // ES: Foto principal y vista previa al compartir el enlace. · EN: Main photo and link preview when sharing.
  portada: FOTOS.interieur,

  // ── Carta · Menu ───────────────────────────────────────────────────────────────────
  // Se ve en · Shows in: las tres pizarras de la carta, el plato del día (el `destacado`) y la bolsa del pedido
  // ES: Cómo cambiarlo: categorías → platos, en el orden del menú del mostrador (À boire, Menu latino,
  //     À manger). Precio con punto decimal (12.75 = 12,75 $). Sin `precio`, el plato se muestra pero no se
  //     puede pedir. Cada `id` es único y sin espacios. Una categoría nueva sale en la pizarra "À manger"
  //     salvo que la añadas a otra pizarra en src/estilo/ajustes/textos.ts (TABLEROS).
  // EN: How to change it: categories → items, in the order of the counter menu (À boire, Menu latino,
  //     À manger). Price with a decimal point (12.75 = $12.75). Without `precio` the item is shown but cannot
  //     be ordered. Every `id` is unique, with no spaces. A new category shows on the "À manger" board unless
  //     you add it to another board in src/estilo/ajustes/textos.ts (TABLEROS).
  carta: [
    {
      id: "cafe-the",
      nombre: { fr: "Café et thé", en: "Coffee & tea", es: "Café y té" },
      platos: [
        { id: "espresso-simple", nombre: { fr: "Espresso · simple", en: "Espresso · single", es: "Espresso · sencillo" }, precio: 3.5 },
        { id: "espresso-double", nombre: { fr: "Espresso · double", en: "Espresso · double", es: "Espresso · doble" }, precio: 4.5 },
        { id: "latte-petit", nombre: { fr: "Latté · petit", en: "Latte · small", es: "Latte · pequeño" }, precio: 4.6, foto: FOTOS.latte },
        { id: "latte-moyen", nombre: { fr: "Latté · moyen", en: "Latte · medium", es: "Latte · mediano" }, precio: 5.2 },
        { id: "latte-grand", nombre: { fr: "Latté · grand", en: "Latte · large", es: "Latte · grande" }, precio: 5.7 },
        { id: "cappuccino-petit", nombre: { fr: "Cappuccino · petit", en: "Cappuccino · small", es: "Cappuccino · pequeño" }, precio: 4.6 },
        { id: "cappuccino-moyen", nombre: { fr: "Cappuccino · moyen", en: "Cappuccino · medium", es: "Cappuccino · mediano" }, precio: 5.2 },
        { id: "cappuccino-grand", nombre: { fr: "Cappuccino · grand", en: "Cappuccino · large", es: "Cappuccino · grande" }, precio: 5.7 },
        { id: "filtre-petit", nombre: { fr: "Filtre · petit", en: "Filter coffee · small", es: "Café de filtro · pequeño" }, precio: 2.3 },
        { id: "filtre-moyen", nombre: { fr: "Filtre · moyen", en: "Filter coffee · medium", es: "Café de filtro · mediano" }, precio: 2.8 },
        { id: "filtre-grand", nombre: { fr: "Filtre · grand", en: "Filter coffee · large", es: "Café de filtro · grande" }, precio: 3.2 },
        { id: "cafe-de-olla", nombre: "Café de olla", precio: 3 },
        { id: "cortado", nombre: "Cortado", precio: 4.5 },
        { id: "macchiato", nombre: "Macchiato", precio: 4.5 },
        { id: "mokaccino", nombre: "Mokaccino", precio: 5.85 },
        { id: "flat-white", nombre: "Flat white", precio: 5 },
        { id: "americano", nombre: "Americano", precio: 4.5 },
        { id: "latte-glace", nombre: { fr: "Latté glacé", en: "Iced latte", es: "Latte frío" }, precio: 7.1 },
        { id: "americano-glace", nombre: { fr: "Americano glacé", en: "Iced americano", es: "Americano frío" }, precio: 5.5 },
        { id: "moka-glace", nombre: { fr: "Moka glacé", en: "Iced mocha", es: "Moka frío" }, precio: 8.1 },
        { id: "the-du-jour", nombre: { fr: "Thé du jour", en: "Tea of the day", es: "Té del día" }, precio: 3 },
        { id: "the-glace", nombre: { fr: "Thé glacé", en: "Iced tea", es: "Té frío" }, precio: 4 },
        { id: "matcha", nombre: "Matcha", precio: 6 },
        { id: "chocolat-chaud", nombre: { fr: "Chocolat chaud", en: "Hot chocolate", es: "Chocolate caliente" }, precio: 5 },
      ],
    },
    {
      id: "tacos",
      nombre: "Tacos",
      platos: [
        // ES: POR CONFIRMAR: en el menú hay una corrección a mano "→ 10 $" junto a poulet chipotle.
        // EN: TO CONFIRM: the menu has a handwritten "→ $10" next to chicken chipotle.
        { id: "tacos-poulet-chipotle", nombre: { fr: "Tacos poulet chipotle", en: "Chicken chipotle tacos", es: "Tacos de pollo al chipotle" }, precio: 10 },
        { id: "tacos-birria", nombre: { fr: "Tacos birria", en: "Birria tacos", es: "Tacos de birria" }, precio: 12.75 },
        { id: "tacos-pastor", nombre: { fr: "Tacos pastor", en: "Tacos al pastor", es: "Tacos al pastor" }, precio: 12.75, foto: FOTOS.tacos },
        {
          id: "tacos-pastor-vegane",
          nombre: { fr: "Tacos pastor végane", en: "Vegan tacos al pastor", es: "Tacos al pastor veganos" },
          precio: 12.75,
          vegetariano: true,
        },
      ],
    },
    {
      id: "burritos",
      nombre: "Burritos",
      platos: [
        { id: "burrito-poulet-chipotle", nombre: { fr: "Burrito poulet chipotle", en: "Chicken chipotle burrito", es: "Burrito de pollo al chipotle" }, precio: 12.75 },
        { id: "burrito-birria", nombre: { fr: "Burrito birria", en: "Birria burrito", es: "Burrito de birria" }, precio: 12.75 },
        { id: "burrito-pastor", nombre: { fr: "Burrito pastor", en: "Burrito al pastor", es: "Burrito al pastor" }, precio: 12.75 },
      ],
    },
    {
      id: "quesadillas",
      nombre: "Quesadillas",
      platos: [
        { id: "quesadilla-poulet-chipotle", nombre: { fr: "Quesadilla poulet chipotle", en: "Chicken chipotle quesadilla", es: "Quesadilla de pollo al chipotle" }, precio: 12 },
        { id: "quesadilla-birria", nombre: { fr: "Quesadilla birria", en: "Birria quesadilla", es: "Quesadilla de birria" }, precio: 12 },
        { id: "quesadilla-pastor", nombre: { fr: "Quesadilla pastor", en: "Quesadilla al pastor", es: "Quesadilla al pastor" }, precio: 12 },
      ],
    },
    {
      id: "dejeuner",
      nombre: { fr: "Déjeuner", en: "Breakfast", es: "Desayuno" },
      platos: [
        { id: "bon-matin", nombre: "Bon matin", precio: 15 },
        { id: "rancheros", nombre: "Huevos rancheros", precio: 15 },
        { id: "chilaquiles", nombre: "Chilaquiles", precio: 15, foto: FOTOS.chilaquiles },
      ],
    },
    {
      id: "pupusas",
      nombre: "Pupusas",
      platos: [
        { id: "pupusa-revueltas", nombre: { fr: "Pupusa chicharrón revueltas", en: "Chicharrón revueltas pupusa", es: "Pupusa revuelta de chicharrón" }, precio: 5 },
        {
          id: "pupusa-haricots-fromage",
          nombre: { fr: "Pupusa haricots et fromage", en: "Bean and cheese pupusa", es: "Pupusa de frijol con queso" },
          precio: 5,
          vegetariano: true,
        },
        {
          id: "pupusa-fromage-loroco",
          nombre: { fr: "Pupusa fromage et loroco", en: "Cheese and loroco pupusa", es: "Pupusa de queso con loroco" },
          precio: 5,
          vegetariano: true,
        },
      ],
    },
    {
      id: "repas-du-jour",
      nombre: { fr: "Guiso, repas du jour", en: "Guiso, meal of the day", es: "Guiso, plato del día" },
      platos: [
        {
          id: "guiso",
          nombre: { fr: "Guiso, repas du jour", en: "Guiso, meal of the day", es: "Guiso, plato del día" },
          descripcion: {
            fr: "Une protéine accompagnée de riz, haricots, guacamole et tortillas, avec un soda, un café filtre ou un thé. Version végétarienne disponible.",
            en: "A protein with rice, beans, guacamole and tortillas, served with a soda, a filter coffee or a tea. Vegetarian version available.",
            es: "Una proteína con arroz, frijoles, guacamole y tortillas, con un refresco, un café de filtro o un té. Versión vegetariana disponible.",
          },
          precio: 17,
          destacado: true,
        },
      ],
    },
    {
      // ES: POR CONFIRMAR: las empanadas salen en 6 opiniones pero no en el menú; sin precio no se pueden pedir.
      // EN: TO CONFIRM: empanadas show up in 6 reviews but not on the menu; without a price they cannot be ordered.
      id: "vitrine",
      nombre: { fr: "En vitrine", en: "In the display case", es: "En la vitrina" },
      nota: { fr: "Demandez au comptoir.", en: "Ask at the counter.", es: "Pregunta en el mostrador." },
      platos: [{ id: "empanadas", nombre: "Empanadas" }],
    },
    {
      id: "bagels",
      nombre: "Bagels",
      platos: [
        { id: "bagel-fromage-creme", nombre: { fr: "Bagel fromage à la crème", en: "Cream cheese bagel", es: "Bagel de queso crema" }, precio: 5.5, vegetariano: true },
        { id: "bagel-saumon", nombre: { fr: "Bagel saumon fumé", en: "Smoked salmon bagel", es: "Bagel de salmón ahumado" }, precio: 11.5 },
        { id: "bagel-jambon-fromage", nombre: { fr: "Bagel jambon fromage", en: "Ham and cheese bagel", es: "Bagel de jamón y queso" }, precio: 6.5 },
        { id: "bagel-blt", nombre: { fr: "Bagel BLT", en: "BLT bagel", es: "Bagel BLT" }, precio: 6.5 },
        // ES: POR CONFIRMAR: la foto es un bagel del café (jamón, huevo, cheddar, aguacate); falta saber si es este.
        // EN: TO CONFIRM: the photo is one of the café's bagels (ham, egg, cheddar, avocado); we don't know if it is this one.
        { id: "bagel-dejeuner", nombre: { fr: "Bagel déjeuner", en: "Breakfast bagel", es: "Bagel de desayuno" }, precio: 7.5, foto: FOTOS.bagel },
      ],
    },
    {
      id: "soupes",
      nombre: { fr: "Soupes", en: "Soups", es: "Sopas" },
      platos: [
        { id: "soupe-azteca", nombre: { fr: "Soupe azteca", en: "Sopa azteca", es: "Sopa azteca" }, precio: 9 },
        // ES: POR CONFIRMAR: el menú dice "6/10"; entendemos tazón pequeño y grande.
        // EN: TO CONFIRM: the menu says "6/10"; we read it as small and large bowl.
        { id: "soupe-poulet-petite", nombre: { fr: "Soupe au poulet · petite", en: "Chicken soup · small", es: "Sopa de pollo · pequeña" }, precio: 6 },
        { id: "soupe-poulet-grande", nombre: { fr: "Soupe au poulet · grande", en: "Chicken soup · large", es: "Sopa de pollo · grande" }, precio: 10 },
        { id: "soupe-du-jour", nombre: { fr: "Soupe du jour", en: "Soup of the day", es: "Sopa del día" }, precio: 7.5 },
      ],
    },
    {
      id: "salades",
      nombre: { fr: "Salades", en: "Salads", es: "Ensaladas" },
      platos: [
        { id: "salade-poulet", nombre: { fr: "Salade verte repas, poulet", en: "Green salad meal, chicken", es: "Ensalada verde completa, pollo" }, precio: 14 },
        { id: "petite-salade", nombre: { fr: "Petite salade verte", en: "Small green salad", es: "Ensalada verde pequeña" }, precio: 7, vegetariano: true },
      ],
    },
    {
      id: "panini",
      nombre: "Panini",
      platos: [
        { id: "panini-poulet", nombre: { fr: "Panini poulet", en: "Chicken panini", es: "Panini de pollo" }, precio: 12 },
        { id: "panini-pastor", nombre: { fr: "Panini pastor", en: "Panini al pastor", es: "Panini al pastor" }, precio: 14 },
        { id: "panini-jambon", nombre: { fr: "Panini jambon", en: "Ham panini", es: "Panini de jamón" }, precio: 12 },
        { id: "panini-thon", nombre: { fr: "Panini thon", en: "Tuna panini", es: "Panini de atún" }, precio: 12 },
        { id: "panini-italien", nombre: { fr: "Panini italien", en: "Italian panini", es: "Panini italiano" }, precio: 14 },
      ],
    },
    {
      id: "extras",
      nombre: "Extras",
      platos: [
        { id: "extra-bacon", nombre: { fr: "Extra bacon", en: "Extra bacon", es: "Extra de bacon" }, precio: 1.5, suplemento: true },
        { id: "extra-fromage", nombre: { fr: "Extra fromage", en: "Extra cheese", es: "Extra de queso" }, precio: 1.5, suplemento: true },
        { id: "extra-avocat", nombre: { fr: "Extra avocat", en: "Extra avocado", es: "Extra de aguacate" }, precio: 1.5, suplemento: true },
        { id: "extra-guacamole", nombre: { fr: "Extra guacamole", en: "Extra guacamole", es: "Extra de guacamole" }, precio: 2, suplemento: true },
      ],
    },
  ],
  // Se ve en · Shows in: debajo de las tres pizarras · under the three boards
  // ES: Cómo cambiarlo: nota bajo la carta. · EN: How to change it: note under the menu.
  notaPrecios: {
    fr: "Prix du menu affiché au comptoir.",
    en: "Prices from the menu posted at the counter.",
    es: "Precios del menú del mostrador.",
  },

  // ── Historia · Story ───────────────────────────────────────────────────────────────
  // Se ve en · Shows in: "le sac de jute": párrafos en la etiqueta cosida, hitos en los sellos (estándar y premium)
  // ES: Cómo cambiarlo: párrafos y momentos clave (hitos). POR CONFIRMAR con el dueño: la relación con
  //     Café Grain d'Or y el año de apertura en Papineau (ninguna fuente lo da, por eso no hay año).
  // EN: How to change it: paragraphs and key moments (hitos). TO CONFIRM with the owner: the link with
  //     Café Grain d'Or and the year it opened on Papineau (no source gives it, hence no year).
  historia: {
    titulo: { fr: "Une perle cachée face au parc", en: "A hidden gem across from the park", es: "Una joya escondida frente al parque" },
    parrafos: [
      {
        fr: "Café LaFontaine, c'est le café de quartier du 3535, avenue Papineau, juste en face du parc La Fontaine. On y vient pour un espresso, un bagel ou une assiette latino : tacos, pupusas, chilaquiles et un guiso différent chaque jour.",
        en: "Café LaFontaine is the neighbourhood café at 3535 avenue Papineau, right across from Parc La Fontaine. People come for an espresso, a bagel or a Latin plate: tacos, pupusas, chilaquiles and a different guiso every day.",
        es: "Café LaFontaine es el café de barrio del 3535 de la avenida Papineau, justo frente al parque La Fontaine. Se viene por un espresso, un bagel o un plato latino: tacos, pupusas, chilaquiles y un guiso distinto cada día.",
      },
      {
        fr: "Ses grains viennent de Café Grain d'Or, l'entreprise familiale de la rue Beaubien fondée en 1998 autour du café équitable du Guatemala. Grain d'Or, mélange maison, espresso Guatemala : ils attendent dans les silos dorés du comptoir.",
        en: "Its beans come from Café Grain d'Or, the family business on rue Beaubien founded in 1998 around fair-trade coffee from Guatemala. Grain d'Or, house blend, Guatemala espresso: they wait in the golden bins on the counter.",
        es: "Sus granos vienen de Café Grain d'Or, la empresa familiar de la calle Beaubien fundada en 1998 en torno al café de comercio justo de Guatemala. Grain d'Or, mezcla de la casa, espresso Guatemala: esperan en los silos dorados de la barra.",
      },
      {
        fr: "Les murs servent aussi de galerie : le café accueille des expositions d'art et des musiciens invités.",
        en: "The walls double as a gallery: the café hosts art exhibitions and guest musicians.",
        es: "Las paredes también son galería: el café acoge exposiciones de arte y músicos invitados.",
      },
    ],
    hitos: [
      {
        anio: "1998",
        titulo: "Café Grain d'Or",
        texto: {
          fr: "Naissance de l'entreprise familiale de café équitable guatémaltèque.",
          en: "The family business for fair-trade Guatemalan coffee is born.",
          es: "Nace la empresa familiar de café guatemalteco de comercio justo.",
        },
      },
      {
        anio: { fr: "Avenue Papineau", en: "Avenue Papineau", es: "Avenida Papineau" },
        titulo: "Café LaFontaine",
        texto: {
          fr: "Un café de quartier ouvre face au parc La Fontaine.",
          en: "A neighbourhood café opens across from Parc La Fontaine.",
          es: "Abre un café de barrio frente al parque La Fontaine.",
        },
      },
      {
        anio: { fr: "Aujourd'hui", en: "Today", es: "Hoy" },
        texto: {
          fr: "Un guiso différent chaque jour, de l'art aux murs et des musiciens invités.",
          en: "A different guiso every day, art on the walls and guest musicians.",
          es: "Un guiso distinto cada día, arte en las paredes y músicos invitados.",
        },
      },
    ],
  },

  // ── Galería · Gallery ──────────────────────────────────────────────────────────────
  // Se ve en · Shows in: "l'expo", un cuadro con cartela por foto (el alt es la descripción de la cartela)
  // ES: Cómo cambiarlo: fotos en el orden en que se cuelgan (mínimo 3). La del interior ya está en la portada.
  // EN: How to change it: photos in the order they are hung (at least 3). The interior one is already in the hero.
  galeria: [FOTOS.tasseRouge, FOTOS.dejeunerLatino, FOTOS.latte, FOTOS.assiettes, FOTOS.tacos, FOTOS.burrito, FOTOS.bagel],

  // ── Opiniones · Reviews ────────────────────────────────────────────────────────────
  // Se ve en · Shows in: "le livre d'or": nota y temas en la página izquierda, resúmenes a mano en la derecha
  // ES: Cómo cambiarlo: nota, total y temas de Google Maps (actualízalos cada pocos meses). Las frases sin
  //     autor son resúmenes de varias opiniones, no citas.
  // EN: How to change it: rating, total and topics from Google Maps (update them every few months). Lines
  //     without an author are summaries of several reviews, not quotes.
  resenas: {
    nota: 4.8,
    total: 104,
    fuente: "Google",
    url: "https://maps.app.goo.gl/aNQLVSCfXRUV3i4M6",
    temas: [
      { nombre: { fr: "cuisine mexicaine", en: "Mexican food", es: "comida mexicana" }, menciones: 7 },
      { nombre: "empanadas", menciones: 6 },
      { nombre: { fr: "art", en: "art", es: "arte" }, menciones: 5 },
      { nombre: "pupusas", menciones: 3 },
      { nombre: "chilaquiles", menciones: 3 },
      { nombre: "tacos al pastor", menciones: 2 },
      { nombre: "huevos rancheros", menciones: 2 },
    ],
    destacadas: [
      { texto: { fr: "Un accueil chaleureux, avec le sourire.", en: "A warm welcome, with a smile.", es: "Una atención cálida, con una sonrisa." } },
      {
        texto: {
          fr: "Une cuisine mexicaine fraîche et généreuse, avec un plat différent chaque jour.",
          en: "Fresh, generous Mexican food, with a different dish every day.",
          es: "Comida mexicana fresca y generosa, con un plato distinto cada día.",
        },
      },
      {
        texto: {
          fr: "Du bon café torréfié par le propriétaire, et de l'art aux murs.",
          en: "Good coffee roasted by the owner, and art on the walls.",
          es: "Buen café tostado por el dueño, y arte en las paredes.",
        },
      },
    ],
  },

  // ── Promociones · Promotions ───────────────────────────────────────────────────────
  // Se ve en · Shows in: "À l'affiche", un cartel por promoción (solo premium; oculta mientras la lista esté vacía)
  // ES: Cómo cambiarlo: no conocemos promociones; la sección se oculta sola mientras la lista esté vacía.
  //     Ejemplo: { id: "vernissage", titulo: { fr: "Vernissage" }, cuando: { fr: "Jeudi 18 h" } }
  // EN: How to change it: we don't know of any promotions; the section hides itself while the list is empty.
  //     Example: { id: "vernissage", titulo: { fr: "Vernissage" }, cuando: { fr: "Thursday 6 pm" } }
  promos: [],
};
