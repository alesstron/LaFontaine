# Ficha de estilo: Café LaFontaine

## Concepto
**"Le mur"**: la web es la pared del fondo del café, la que se ve al entrar. Pintura crema, el mural a línea
"TOUT D'ABORD UN CAFÉ" con su volcán y sus cafetales, las tres pizarras del menú atornilladas con listones de
madera oscura, los silos de latón con café en grano y etiquetas salmón escritas a mano, los sillones de cuero coñac
y las paredes convertidas en sala de exposiciones (el café expone arte y recibe músicos).

Tono: "Perle cachée", "café de quartier" (su Facebook), con orgullo ("We are not a simple neighborhood café ;)",
respuesta del dueño). Montreal y Latinoamérica a la vez: menú en francés con pupusas, chilaquiles y guiso del día.

## Lo que se vio en las fotos
| Elemento real | Foto | Cómo pasa a la web |
|---|---|---|
| Pared crema con mural a línea: "TOUT D'ABORD UN CAFÉ" en letras huecas, volcán, colinas y cafetales | interieur-mur (Maroi Ajina) | Portada: la frase en letras huecas (SVG con trazo) y el paisaje dibujado a línea, que se traza solo en premium |
| Lámparas colgantes de campana, techo oscuro con conductos | interieur-mur, menú | Cabecera "le plafond" y lámparas que cuelgan sobre la portada y se encienden |
| Tres pizarras blancas atornilladas, listones oscuros, mayúsculas espaciadas, "À BOIRE" azul noche, "MENU LATINO" granate, grupos en cajas con filete, dibujos a línea | menú (Sophie Asmar) | La carta entera: tres tableros con tornillos; en el móvil premium, pestañas con los tres títulos |
| Precios corregidos a mano sobre etiqueta blanca ("12.75$", "→10$", "17$") | menú | Etiqueta a mano (Kalam) cuando un plato cambia el precio común del grupo, y en el plato del día |
| Silos de café en grano: frente de latón acolchado, pomo cromado, etiqueta salmón a mano ("Grain d'Or", "Mélange maison", "Espresso Guatemala") | interieur-mur (recorte) | Franja "Au comptoir" con los silos dibujados en CSS; la etiqueta salmón es el motivo de estado (abierto/cerrado), contador del pedido y día de hoy |
| Mesas de laminado color madera con canto negro, platos blancos | fotos de platos | Plato del día: la mesa con vetas y el plato visto desde arriba con sus partes dibujadas |
| Sillones de cuero coñac, mesa baja negra, suelo de hormigón rosado | interieur-mur | Reserva "Prenez un fauteuil": dos sillones y la tarjeta de reserva sobre la mesa |
| Saco de yute junto a la barra | interieur-mur | Historia: textura de yute, etiqueta de papel cosida y sellos de tinta para los hitos |
| Bolsa de papel kraft sobre los silos | interieur-mur (recorte) | Panel del pedido: bolsa kraft con borde dentado y etiqueta salmón |
| Cuadros enmarcados (póster en marco negro), exposiciones de arte (opiniones) | interieur-mur, opiniones | Galería "L'expo": marcos negros con paspartú colgados de una barra con cordones y cartela de museo |
| Póster con bandas negras arriba y abajo ("More espresso / Less depresso") | interieur-mur | Horario en un póster enmarcado: banda superior con el estado en vivo, banda inferior con el día cerrado (no se copia el dibujo) |
| Taza roja, taza blanca acanalada | tasse-rouge, latte-art | Rojo taza para el botón principal y "Ajouter" |
| Logotipo redondo "CAFÉ LA FONTAINE" en serif, taza con vapor y granos, marrón sobre crema | Facebook | Medallón con el nombre en círculo (favicon incluido); no se copia el dibujo exacto |
| Libro de visitas de una exposición | (concepto) | Opiniones "Le livre d'or": libro abierto con temas y resúmenes escritos a mano |

## Paleta (medida con paleta.mjs; contraste con contraste.mjs)
| Nombre | Hex | Medido en | Uso |
|---|---|---|---|
| crème du mur | `#F7E1C7` | pared (luz `#F8DBBC`, sombra `#F6E7D2`) | Fondo principal |
| papier | `#FBF6EE` | tableros del menú (foto subexpuesta y cálida: tono corregido) | Pizarras, tarjetas |
| plafond | `#2B1A16` | techo `#311815`, listones `#231918` | Texto, cabecera, pie |
| encre | `#6B5A4E` | trazo del mural | Dibujos a línea, texto secundario |
| bordeaux | `#7A3B37` | "MENU LATINO" (`#4B2726` en sombra) | Títulos del menú y de grupos |
| ardoise | `#272A38` | "À BOIRE" (`#181A23` en sombra) | Título "À boire" |
| tasse rouge | `#9C1D26` | taza roja | Botón principal, añadir |
| cognac | `#B06038` (texto `#975330`) | sillones | Reserva, detalles grandes |
| laiton | `#D2AD7C` (`#A47B55` en sombra) | tapa de los silos con luz | Silos, lema del pie |
| étiquette | `#EDB197` | etiquetas de los silos (`#E2A58E`–`#F6BCA2`) | Etiquetas a mano |
| table | `#CA8041` | laminado de las mesas | Fondo del plato del día |
| jute | `#B98C62` (hilo `#8D5A3E`) | saco de yute | Fondo de la historia |
| kraft | `#C49A6C` | bolsa de papel | Panel del pedido |
| sol | `#DDA789` | suelo de hormigón | Suelo bajo los sillones |

Contrastes: plafond sobre crème 13,1:1 · plafond sobre papier 15,5:1 · tasse rouge sobre papier 7,5:1 · papier sobre
tasse rouge 7,5:1 · bordeaux sobre papier 7,8:1 · ardoise sobre papier 13,2:1 · plafond sobre étiquette 9,0:1 · encre
sobre crème 5,2:1 · plafond sobre table 5,3:1 · plafond sobre jute 5,5:1 · plafond sobre kraft 6,5:1 · plafond sobre sol
7,9:1 · crème sobre bordeaux 6,6:1 · laiton sobre plafond 7,9:1.

Los tonos derivados (`--creme-luz`, `--creme-sombra`, `--plafond-2`, `--trait`, `--tasse-fonce`, `--chrome`) y dónde se
ve cada color están en `src/estilo/ajustes/colores.css`.

## Tipografía
- **Josefin Sans** 400–700 en mayúsculas espaciadas: la letra de las pizarras y del mural (geometría tipo Glacial
  Indifference). En letras huecas para "TOUT D'ABORD UN CAFÉ".
- **Libre Caslon Text** 400/700 e itálica: el serif del logotipo. Nombre del café, títulos y texto corrido (17–18 px).
- **Kalam** 400/700: el rotulador de las etiquetas salmón, los precios corregidos a mano y el libro de visitas.

## Composición por sección
1. **Le plafond (cabecera)**: banda oscura con conducto; medallón, nombre, enlaces, idiomas FR/EN/ES y bolsa del pedido.
2. **Le mur (portada)**: lámparas colgantes; nombre en serif, lema en mayúsculas espaciadas, la frase hueca y el paisaje
   a línea; estado en vivo en etiqueta salmón; botones; la foto del salón colgada como obra con su cartela.
3. **Au comptoir**: estante con los silos de latón y sus etiquetas.
4. **Le plat du jour**: mesa de laminado con canto negro; plato visto desde arriba (proteína, arroz, frijoles,
   guacamole, tortillas y la bebida) con sus partes numeradas y leyenda a mano; tarjeta con nombre, descripción,
   precio a mano y "Ajouter".
5. **Les tableaux (carta)**: tres pizarras con listones y tornillos; grupos en cajas con filete; tamaños como botones;
   fotos de platos como polaroids sujetas con cinta (premium); pestañas en el móvil (premium).
6. **Le sac de jute (historia)**: yute, etiqueta de papel cosida con los párrafos, hitos como sellos de tinta.
7. **L'expo (galería)**: barra de colgar, cordones, marcos negros con paspartú y cartela numerada.
8. **Le livre d'or (opiniones)**: libro abierto con cinta granate; nota, temas y resúmenes escritos a mano.
9. **À l'affiche (promos)**: carteles de exposición (solo si hay promociones en los datos).
10. **Prenez un fauteuil (reserva)**: suelo, dos sillones coñac, mesa negra y la tarjeta de reserva.
11. **Nous trouver**: póster enmarcado con el horario y el estado en vivo, mapa enmarcado, dirección, "face au parc
    La Fontaine" con la fuente del parque dibujada a línea.
12. **Pie**: techo oscuro, medallón, créditos de fotos y aviso de demo.
13. **Le sac kraft (pedido)**: panel lateral (abajo en el móvil) con forma de bolsa kraft.

## Movimiento
- Básica: nada se mueve salvo cambios de estado.
- Estándar: apariciones suaves al bajar.
- Premium: el mural se dibuja solo (letras y paisaje), las lámparas se encienden y se balancean, las partes del plato
  aparecen una a una, los marcos se balancean al pasar el ratón, la bolsa salta al añadir un plato y las notas del
  libro de oro se escriben. Todo respeta "reducir movimiento" (MotionConfig + media query).

## Lo que no se repite en otras cafeterías
Mural hueco + paisaje a línea, silos de latón, tres pizarras atornilladas, plato del día sobre laminado, yute con sellos,
expo con cartelas, libro de oro, sillones, bolsa kraft. Kahwa (fachada, pizarra azul, papel de cuadros, bandeja, pegatinas,
neón, cinta) no se repite aquí. Ver `~/.claude/skills/cafe/estilos/registro.md`.
