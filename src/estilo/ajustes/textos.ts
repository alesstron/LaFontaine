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
  // ES: Antetítulo y frase de la tarjeta de la portada; su botón abre /reserver en una pestaña nueva.
  //     El antetítulo también encabeza la página de reserva.
  // EN: Overline and sentence of the home card; its button opens /reserver in a new tab.
  //     The overline also heads the booking page.
  sillonesAntetitulo: { fr: "Prenez un fauteuil", en: "Grab an armchair", es: "Toma asiento" },
  sillonesTexto: {
    fr: "Choisissez le jour et l'heure : s'il reste de la place, la table est à vous tout de suite.",
    en: "Pick the day and the time: if there is room, the table is yours right away.",
    es: "Elige el día y la hora: si queda sitio, la mesa es tuya al momento.",
  },
  verPlazas: { fr: "Voir les places libres", en: "See the free seats", es: "Ver las plazas libres" },
  nuevaPestana: { fr: "(s'ouvre dans un nouvel onglet)", en: "(opens in a new tab)", es: "(se abre en una pestaña nueva)" },

  // ── Páginas de reservas · Booking pages (paginas/Marco.tsx) ───────────────────────────
  // ES: Lo común a /reserver, /reserver/anular y /reserver/gestion. {telefono} = contacto.telefono.
  // EN: Shared by /reserver, /reserver/anular and /reserver/gestion. {telefono} = contacto.telefono.
  volverWeb: { fr: "Retour au site", en: "Back to the website", es: "Volver a la web" },
  demoReserva: {
    fr: "Maquette de démonstration : les réservations faites ici servent d'essai.",
    en: "Demo mock-up: bookings made here are for testing.",
    es: "Maqueta de demostración: las reservas hechas aquí son de prueba.",
  },
  llamarAl: {
    fr: "Vous pouvez aussi appeler le café au {telefono}.",
    en: "You can also call the café at {telefono}.",
    es: "También puedes llamar al café al {telefono}.",
  },
  sinJs: {
    fr: "Cette page a besoin de JavaScript pour afficher les places libres.",
    en: "This page needs JavaScript to show the free seats.",
    es: "Esta página necesita JavaScript para mostrar las plazas libres.",
  },

  // ── Página de reserva · Booking page (paginas/reserva) ────────────────────────────────
  // ES: Frase de entrada, los cuatro pasos, el resumen «Votre table» y el botón. {max} = reservas.maxPersonas.
  //     Si cambias los 30 días de `privacidad`, cambia también DIAS_GUARDADAS en src/motor/reservas/esquema.ts.
  // EN: Intro sentence, the four steps, the «Votre table» summary and the button. {max} = reservas.maxPersonas.
  //     If you change the 30 days in `privacidad`, also change DIAS_GUARDADAS in src/motor/reservas/esquema.ts.
  reservaIntro: {
    fr: "Dites-nous combien vous serez, le jour et l'heure. S'il reste de la place, c'est confirmé tout de suite.",
    en: "Tell us how many of you are coming, the day and the time. If there is room, it is confirmed right away.",
    es: "Dinos cuántas personas vienen, el día y la hora. Si queda sitio, se confirma al momento.",
  },
  pasoPersonas: { fr: "Combien de personnes ?", en: "How many people?", es: "¿Cuántas personas?" },
  grupoGrande: {
    fr: "Plus de {max} personnes ? Appelez le café au {telefono}.",
    en: "More than {max} people? Call the café at {telefono}.",
    es: "¿Más de {max} personas? Llama al café al {telefono}.",
  },
  menos: { fr: "Une personne de moins", en: "One guest fewer", es: "Una persona menos" },
  mas: { fr: "Une personne de plus", en: "One more guest", es: "Una persona más" },
  pasoDia: { fr: "Quel jour ?", en: "Which day?", es: "¿Qué día?" },
  diaCerrado: { fr: "fermé", en: "closed", es: "cerrado" },
  diaCompleto: { fr: "complet", en: "full", es: "completo" },
  cargandoPlazas: { fr: "On regarde les places libres…", en: "Checking the free seats…", es: "Mirando las plazas libres…" },
  reintentar: { fr: "Réessayer", en: "Try again", es: "Reintentar" },
  pasoHora: { fr: "À quelle heure ?", en: "What time?", es: "¿A qué hora?" },
  eligeDia: { fr: "Choisissez d'abord un jour.", en: "Pick a day first.", es: "Elige primero un día." },
  quedan: { fr: "plus que {n}", en: "{n} left", es: "quedan {n}" },
  pasoDatos: { fr: "À quel nom ?", en: "Under what name?", es: "¿A nombre de quién?" },
  telefono: { fr: "Téléphone", en: "Phone", es: "Teléfono" },
  telefonoAyuda: {
    fr: "Seulement pour vous joindre au sujet de la réservation.",
    en: "Only to reach you about the booking.",
    es: "Solo para avisarte sobre la reserva.",
  },
  notaReserva: { fr: "Allergies, occasion spéciale…", en: "Allergies, special occasion…", es: "Alergias, ocasión especial…" },
  resumenTitulo: { fr: "Votre table", en: "Your table", es: "Tu mesa" },
  unaPersona: { fr: "1 personne", en: "1 person", es: "1 persona" },
  variasPersonas: { fr: "{n} personnes", en: "{n} people", es: "{n} personas" },
  reservarMesa: { fr: "Réserver la table", en: "Book the table", es: "Reservar la mesa" },
  enviando: { fr: "Un instant…", en: "One moment…", es: "Un momento…" },
  privacidad: {
    fr: "Vos coordonnées servent seulement à cette réservation ; elles sont effacées 30 jours après la date.",
    en: "Your details are only used for this booking; they are deleted 30 days after the date.",
    es: "Tus datos solo se usan para esta reserva; se borran 30 días después de la fecha.",
  },
  // ES: Confirmación: el cartelito «Réservé» que se pone en la mesa. · EN: Confirmation: the little «Réservé» card set on the table.
  reservado: { fr: "Réservé", en: "Reserved", es: "Reservado" },
  // ES: \u00a0 = espacio que no se parte (el signo nunca queda solo al principio de una línea).
  // EN: \u00a0 = non-breaking space (the sign never ends up alone at the start of a line).
  confirmadaTitulo: { fr: "À bientôt, {nombre}\u00a0!", en: "See you soon, {nombre}!", es: "¡Hasta pronto, {nombre}!" },
  confirmadaTexto: { fr: "Votre table est réservée. Votre code\u00a0:", en: "Your table is booked. Your code:", es: "Tu mesa está reservada. Tu código:" },
  enlaceAnularTexto: {
    fr: "Un empêchement ? Ce lien permet d'annuler. Gardez-le : il ne s'affiche qu'une fois.",
    en: "Can't make it? This link cancels the booking. Keep it: it is only shown once.",
    es: "¿Un imprevisto? Este enlace anula la reserva. Guárdalo: solo se muestra esta vez.",
  },
  enlaceAnular: { fr: "Lien pour annuler", en: "Link to cancel", es: "Enlace para anular" },
  copiarEnlace: { fr: "Copier le lien", en: "Copy the link", es: "Copiar el enlace" },
  copiado: { fr: "Lien copié", en: "Link copied", es: "Enlace copiado" },
  otraReserva: { fr: "Faire une autre réservation", en: "Make another booking", es: "Hacer otra reserva" },

  // ── Avisos · Notices (paginas/mensajes.ts) ────────────────────────────────────────────
  // ES: Errores de cada campo y motivos por los que algo no salió (códigos de src/motor/reservas/tipos.ts).
  //     {horas} = reservas.antelacionMin en horas · {max} = reservas.maxPersonas.
  // EN: Per-field errors and reasons why something did not work (codes from src/motor/reservas/tipos.ts).
  //     {horas} = reservas.antelacionMin in hours · {max} = reservas.maxPersonas.
  errorTelefono: { fr: "Numéro à vérifier (7 à 15 chiffres).", en: "Please check the number (7 to 15 digits).", es: "Revisa el número (de 7 a 15 cifras)." },
  errorLargo: { fr: "Trop long.", en: "Too long.", es: "Demasiado largo." },
  errorFecha: { fr: "Cette date n'est pas disponible.", en: "This date is not available.", es: "Esta fecha no está disponible." },
  errorCerrado: { fr: "Le café est fermé ce jour-là.", en: "The café is closed that day.", es: "El café cierra ese día." },
  errorHora: { fr: "Cette heure n'est pas disponible.", en: "This time is not available.", es: "Esta hora no está disponible." },
  errorPasada: { fr: "Cette heure est déjà passée.", en: "This time has already passed.", es: "Esa hora ya pasó." },
  errorAntelacion: {
    fr: "Trop tôt : réservez au moins {horas} à l'avance.",
    en: "Too soon: book at least {horas} ahead.",
    es: "Demasiado pronto: reserva con {horas} de antelación como mínimo.",
  },
  errorPersonas: { fr: "Entre 1 et {max} personnes.", en: "Between 1 and {max} people.", es: "Entre 1 y {max} personas." },
  motivoSinBd: {
    fr: "Les réservations en ligne ne sont pas encore ouvertes.",
    en: "Online booking is not open yet.",
    es: "Las reservas en línea todavía no están abiertas.",
  },
  motivoBdCaida: {
    fr: "Le système de réservation ne répond pas. Réessayez dans un instant.",
    en: "The booking system is not answering. Try again in a moment.",
    es: "El sistema de reservas no responde. Vuelve a intentarlo en un momento.",
  },
  motivoCompleto: {
    fr: "Ce créneau vient d'être complété. Choisissez une autre heure.",
    en: "That time slot just filled up. Please choose another time.",
    es: "Ese turno se acaba de llenar. Elige otra hora.",
  },
  motivoLimite: { fr: "Trop de réservations d'un coup.", en: "Too many bookings at once.", es: "Demasiadas reservas seguidas." },
  motivoDatos: { fr: "Vérifiez les champs en rouge.", en: "Please check the fields in red.", es: "Revisa los campos en rojo." },
  motivoError: { fr: "Quelque chose n'a pas fonctionné. Réessayez.", en: "Something went wrong. Please try again.", es: "Algo no ha funcionado. Vuelve a intentarlo." },
  motivoNoEncontrada: {
    fr: "Réservation introuvable : vérifiez que le lien est complet.",
    en: "Booking not found: check that the link is complete.",
    es: "No encontramos la reserva: revisa que el enlace esté completo.",
  },
  motivoPasada: {
    fr: "L'heure de cette réservation est passée : elle ne peut plus être annulée.",
    en: "This booking's time has passed: it can no longer be cancelled.",
    es: "La hora de esta reserva ya pasó: ya no se puede anular.",
  },
  motivoSesion: { fr: "Votre session a expiré. Entrez de nouveau.", en: "Your session has expired. Please sign in again.", es: "Tu sesión ha caducado. Vuelve a entrar." },
  motivoClave: { fr: "Mot de passe incorrect.", en: "Wrong password.", es: "Contraseña incorrecta." },
  motivoBloqueado: {
    fr: "Trop d'essais. Réessayez dans 15 minutes.",
    en: "Too many attempts. Try again in 15 minutes.",
    es: "Demasiados intentos. Vuelve a intentarlo en 15 minutos.",
  },
  motivoSinClave: {
    fr: "Le mot de passe du panneau n'est pas configuré (variable RESERVAS_CLAVE, voir docs/RESERVAS.md).",
    en: "The panel password is not set (RESERVAS_CLAVE variable, see docs/RESERVAS.en.md).",
    es: "La contraseña del panel no está configurada (variable RESERVAS_CLAVE, ver docs/RESERVAS.md).",
  },

  // ── Anular · Cancel page (paginas/anular) ─────────────────────────────────────────────
  // ES: Lo que ve el cliente al abrir su enlace para anular. · EN: What the guest sees when opening their cancel link.
  anularAntetitulo: { fr: "Votre réservation", en: "Your booking", es: "Tu reserva" },
  codigoReserva: { fr: "Code", en: "Code", es: "Código" },
  leyendo: { fr: "On cherche votre réservation…", en: "Looking up your booking…", es: "Buscando tu reserva…" },
  anularPregunta: {
    fr: "Vous ne pourrez pas venir ? Annulez pour libérer la place.",
    en: "Can't come? Cancel to free up the seat.",
    es: "¿No puedes venir? Anula para liberar la plaza.",
  },
  anularBoton: { fr: "Annuler la réservation", en: "Cancel the booking", es: "Anular la reserva" },
  anulando: { fr: "Annulation…", en: "Cancelling…", es: "Anulando…" },
  mantener: { fr: "Garder ma réservation", en: "Keep my booking", es: "Mantener mi reserva" },
  anuladaTitulo: { fr: "Réservation annulée", en: "Booking cancelled", es: "Reserva anulada" },
  anuladaTexto: {
    fr: "La place est libérée. Merci d'avoir prévenu !",
    en: "The seat is free again. Thank you for letting us know!",
    es: "La plaza queda libre. ¡Gracias por avisar!",
  },
  nuevaReserva: { fr: "Réserver une autre table", en: "Book another table", es: "Reservar otra mesa" },

  // ── Panel del café · Café panel (paginas/gestion) ─────────────────────────────────────
  // ES: Entrar, estado de la base de datos, la semana de reservas y el formulario para apuntar las del teléfono.
  // EN: Sign in, database status, the week of bookings and the form to record phone bookings.
  panelAntetitulo: { fr: "Espace du café", en: "Café area", es: "Zona del café" },
  clave: { fr: "Mot de passe", en: "Password", es: "Contraseña" },
  entrar: { fr: "Entrer", en: "Sign in", es: "Entrar" },
  entrando: { fr: "Vérification…", en: "Checking…", es: "Comprobando…" },
  salir: { fr: "Quitter", en: "Sign out", es: "Salir" },
  baseTitulo: { fr: "Base de données\u00a0:", en: "Database:", es: "Base de datos:" },
  baseConectada: { fr: "connectée", en: "connected", es: "conectada" },
  baseSinConectar: { fr: "pas connectée", en: "not connected", es: "sin conectar" },
  motorNeon: { fr: "Neon, en ligne", en: "Neon, online", es: "Neon, en línea" },
  motorLocal: { fr: "PGlite, sur cet ordinateur", en: "PGlite, on this computer", es: "PGlite, en este ordenador" },
  baseTotal: { fr: "Réservations enregistrées : {n}", en: "Stored bookings: {n}", es: "Reservas guardadas: {n}" },
  baseCarpeta: { fr: "Dossier : {ruta}", en: "Folder: {ruta}", es: "Carpeta: {ruta}" },
  problemaSinUrl: {
    fr: "Il manque la variable DATABASE_URL dans Vercel (docs/RESERVAS.md, étape 2).",
    en: "The DATABASE_URL variable is missing in Vercel (docs/RESERVAS.en.md, step 2).",
    es: "Falta la variable DATABASE_URL en Vercel (docs/RESERVAS.md, paso 2).",
  },
  problemaUrl: {
    fr: "DATABASE_URL ne contient pas d'adresse postgresql:// : recopiez-la depuis Neon.",
    en: "DATABASE_URL has no postgresql:// address: copy it again from Neon.",
    es: "DATABASE_URL no contiene una dirección postgresql://: vuelve a copiarla de Neon.",
  },
  problemaConexion: {
    fr: "La base ne répond pas. Vérifiez DATABASE_URL ou réessayez dans une minute.",
    en: "The database is not answering. Check DATABASE_URL or try again in a minute.",
    es: "La base no responde. Revisa DATABASE_URL o vuelve a intentarlo en un minuto.",
  },
  semanaDel: { fr: "Du {desde} au {hasta}", en: "{desde} to {hasta}", es: "Del {desde} al {hasta}" },
  semanaAnterior: { fr: "Semaine précédente", en: "Previous week", es: "Semana anterior" },
  semanaSiguiente: { fr: "Semaine suivante", en: "Next week", es: "Semana siguiente" },
  actualizar: { fr: "Actualiser", en: "Refresh", es: "Actualizar" },
  anadirReserva: { fr: "Ajouter une réservation", en: "Add a booking", es: "Añadir una reserva" },
  anadirAyuda: { fr: "Prise par téléphone ou au comptoir.", en: "Taken by phone or at the counter.", es: "Tomada por teléfono o en la barra." },
  forzarPlazas: { fr: "Même si le créneau est complet", en: "Even if the slot is full", es: "Aunque el turno esté lleno" },
  guardar: { fr: "Enregistrer", en: "Save", es: "Guardar" },
  reservaAnadida: { fr: "Réservation ajoutée : {codigo}", en: "Booking added: {codigo}", es: "Reserva añadida: {codigo}" },
  eligeFecha: { fr: "Choisissez d'abord la date", en: "Pick a date first", es: "Elige primero la fecha" },
  sinHoras: { fr: "Fermé ce jour-là", en: "Closed that day", es: "Cerrado ese día" },
  sinReservas: { fr: "Aucune réservation", en: "No bookings", es: "Sin reservas" },
  unaReserva: { fr: "1 réservation", en: "1 booking", es: "1 reserva" },
  variasReservas: { fr: "{n} réservations", en: "{n} bookings", es: "{n} reservas" },
  plazasTurno: { fr: "{ocupadas} / {total} places", en: "{ocupadas} / {total} seats", es: "{ocupadas} / {total} plazas" },
  origenWeb: { fr: "en ligne", en: "online", es: "en línea" },
  origenTelefono: { fr: "téléphone", en: "phone", es: "teléfono" },
  anulada: { fr: "Annulée", en: "Cancelled", es: "Anulada" },
  anuladaPorCliente: { fr: "par le client", en: "by the guest", es: "por el cliente" },
  anuladaPorCafe: { fr: "par le café", en: "by the café", es: "por el café" },
  anularCorto: { fr: "Annuler", en: "Cancel", es: "Anular" },
  restaurar: { fr: "Rétablir", en: "Restore", es: "Restaurar" },

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
