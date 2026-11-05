# Manual de uso · Café LaFontaine (web demo)

**Español** · [English](MANUAL.en.md)

Este manual tiene dos partes:

- **Parte A, para cualquiera** (el dueño, un empleado): cómo abrir la web y cómo cambiar precios, horario, fotos o textos sin saber programar.
- **Parte B, para programadores**: cómo está organizado el código, cómo está hecha cada sección y cómo añadir o cambiar piezas sin romper nada.

> Regla de oro: casi todo lo que cambia en el día a día está en **un solo archivo**, `src/data/cafe.config.ts`. El diseño no hace falta tocarlo.

---

## Índice

- [Parte A · Uso diario](#parte-a--uso-diario)
  - [A1. Qué hay en esta carpeta](#a1-qué-hay-en-esta-carpeta)
  - [A2. Abrir la web en tu ordenador](#a2-abrir-la-web-en-tu-ordenador)
  - [A3. Qué parte de la página sale de qué archivo](#a3-qué-parte-de-la-página-sale-de-qué-archivo)
  - [A4. Tareas paso a paso](#a4-tareas-paso-a-paso)
  - [A5. Publicar en internet (Vercel)](#a5-publicar-en-internet-vercel)
  - [A6. Problemas frecuentes](#a6-problemas-frecuentes)
- [Parte B · Para programadores](#parte-b--para-programadores)
  - [B1. Las tres piezas: motor, datos y piel](#b1-las-tres-piezas-motor-datos-y-piel)
  - [B2. Estructura de carpetas](#b2-estructura-de-carpetas)
  - [B3. Anatomía de una sección](#b3-anatomía-de-una-sección)
  - [B4. CSS: orden, variables y nombres](#b4-css-orden-variables-y-nombres)
  - [B5. Lo que da el motor](#b5-lo-que-da-el-motor)
  - [B6. Añadir una sección nueva](#b6-añadir-una-sección-nueva)
  - [B7. Animaciones por gama](#b7-animaciones-por-gama)
  - [B8. Reglas de los comentarios](#b8-reglas-de-los-comentarios)
  - [B9. Antes de entregar](#b9-antes-de-entregar)
  - [B10. Glosario](#b10-glosario)

---

## Parte A · Uso diario

### A1. Qué hay en esta carpeta

```text
cafe-lafontaine/
├── README.md / README.en.md     Presentación de la web (qué es, capturas, gamas)
├── CLAUDE.md                    Notas para Claude Code (asistente de programación)
├── docs/                        Documentación
│   ├── MANUAL.md                ← este manual
│   ├── DISEÑO.md                Por qué la web se ve así (colores, letras, detalles del local)
│   ├── INFO-EXTRAIDA.md         De dónde sale cada dato y qué falta confirmar con el dueño
│   ├── fotos.json               Lista de fotos con su tamaño y autor
│   ├── capturas/                Imágenes del README
│   └── fuentes/                 Material de origen (foto del menú del mostrador)
├── public/
│   ├── img/                     Las fotos de la web            ← se cambian aquí
│   └── marca/icono.svg          El icono de la pestaña del navegador
└── src/
    ├── data/cafe.config.ts      LOS DATOS: carta, precios, horario, contacto…  ← se cambia aquí
    ├── estilo/                  El diseño (la "piel" de este café)
    │   ├── ajustes/             Colores, textos del diseño y letras            ← se puede cambiar
    │   ├── comun/               Piezas que comparten varias secciones
    │   └── secciones/           Una carpeta por sección, en el orden de la página
    ├── motor/                   El motor común a todas las webs de cafés       ← NO TOCAR
    └── app/                     Arranque de Next.js                            ← NO TOCAR
```

Cada archivo dice en su **primera línea** si se puede tocar:

| Etiqueta | Qué significa |
|---|---|
| `[EDITABLE]` | Se cambia sin miedo: datos, textos, colores, fotos. |
| `[CON CUIDADO · EDIT WITH CARE]` | Diseño. Se puede cambiar sabiendo un poco de React y CSS. Un error rompe el aspecto, no los datos. |
| `[NO TOCAR · DO NOT EDIT]` | Motor. Es igual en todas las webs de cafés; si hay que cambiarlo, se cambia en la plantilla. |

### A2. Abrir la web en tu ordenador

1. Instala [Node.js](https://nodejs.org) (versión 20 o más).
2. Abre una terminal en esta carpeta (en VS Code: menú **Terminal → Nueva terminal**).
3. La primera vez:
   ```bash
   npm install
   ```
4. Cada vez que quieras verla:
   ```bash
   npm run dev
   ```
5. Abre [http://localhost:3000](http://localhost:3000). Mientras esté abierta, cada cambio que guardes se ve al momento.
6. Para pararla: en la terminal, `Ctrl + C`.

### A3. Qué parte de la página sale de qué archivo

```text
 PÁGINA (de arriba abajo)                DATOS que muestra                 DISEÑO (carpeta en src/estilo/secciones)
 ┌────────────────────────────────┐
 │ Cabecera (barra oscura)        │ ←  marca.nombre                    01-cabecera
 ├────────────────────────────────┤
 │ Portada: mural y foto          │ ←  marca, portada, horario         02-portada
 │ Silos de café "Au comptoir"    │ ←  (textos del diseño: SILOS)      03-mostrador
 │ Plato del día                  │ ←  el plato con destacado: true    04-plato-del-dia
 │ Carta: las tres pizarras       │ ←  carta, notaPrecios              05-carta
 │ Historia (saco de yute)        │ ←  historia                        06-historia
 │ Galería "l'expo"               │ ←  galeria                         07-galeria
 │ Opiniones "le livre d'or"      │ ←  resenas                         08-opiniones
 │ Promociones (si hay)           │ ←  promos                          09-promos
 │ Reserva (sillones)             │ ←  contacto.whatsapp, horario      10-reserva
 │ Nous trouver (horario y mapa)  │ ←  horario, contacto, servicios    11-visita
 ├────────────────────────────────┤
 │ Pie                            │ ←  marca, contacto, demo           12-pie
 └────────────────────────────────┘
   Bolsa del pedido (panel)          ←  carta, contacto.whatsapp       13-pedido
   Botón flotante de WhatsApp        ←  contacto.whatsapp              14-whatsapp
```

Los datos están en `src/data/cafe.config.ts`; los textos propios del diseño (rótulos, etiquetas de los silos, la frase del mural) en `src/estilo/ajustes/textos.ts`.

### A4. Tareas paso a paso

> Antes de empezar: abre `src/data/cafe.config.ts` en VS Code. Con **Ctrl + F** buscas lo que quieres cambiar. Respeta las comillas `"…"` y las comas `,` al final de cada línea. Los textos en varios idiomas van así: `{ fr: "…", en: "…", es: "…" }`.

#### Cambiar un precio

1. Busca el plato (por ejemplo `tacos-birria`).
2. Cambia el número de `precio`. Se escribe con **punto** y sin símbolo: `12.75` se ve como *12,75 $*.
   ```ts
   { id: "tacos-birria", nombre: { fr: "Tacos birria", … }, precio: 13.25 },
   ```
3. Guarda. Si todos los tacos menos uno cuestan lo mismo, la pizarra pone ese precio en la caja ("TACOS 13,25 $") y el que cambia sale escrito a mano: es automático.

#### Añadir o quitar un plato

- **Añadir**: copia la línea de un plato parecido, pégala debajo y cambia el `id` (único, sin espacios ni tildes), el nombre y el precio:
  ```ts
  { id: "tacos-camaron", nombre: { fr: "Tacos crevettes", en: "Shrimp tacos", es: "Tacos de camarón" }, precio: 13.5 },
  ```
- **Quitar**: borra la línea entera del plato (con su coma).
- **Vegetariano**: añade `vegetariano: true`. **Sin precio** (se ve "Au comptoir" y no se puede pedir): quita `precio`.
- **Con foto** en la carta: añade `foto: FOTOS.nombre` (las fotos se declaran arriba del archivo, en `FOTOS`).

#### Platos con tamaños (P, M, G)

Escribe un plato por tamaño, **seguidos**, con el mismo nombre y " · " antes del tamaño. La pizarra los junta en una línea con un botón por tamaño:

```ts
{ id: "latte-petit", nombre: { fr: "Latté · petit", en: "Latte · small", es: "Latte · pequeño" }, precio: 4.6 },
{ id: "latte-moyen", nombre: { fr: "Latté · moyen", en: "Latte · medium", es: "Latte · mediano" }, precio: 5.2 },
```

#### Cambiar el plato del día

1. Quita `destacado: true` del plato actual (el guiso) y pónselo al nuevo.
2. Si el plato nuevo no es un guiso, cambia la leyenda del dibujo (1 proteína, 2 arroz…) en `src/estilo/ajustes/textos.ts` → `PLATO`.

#### Cambiar el horario

En `horario.franjas`, una línea por día abierto (`0` = domingo, `1` = lunes … `6` = sábado), horas de 24 h:

```ts
{ dia: 0, abre: "09:00", cierra: "15:00" },   // abrir los domingos
```

- **Día cerrado**: borra su línea (hoy el domingo no tiene línea).
- **Dos turnos el mismo día**: dos líneas con el mismo `dia`.
- Se actualizan solos: la etiqueta "Ouvert/Fermé", el póster, las horas del pedido y de la reserva.

#### Cambiar una foto

- **Misma foto, otra versión**: pon el archivo nuevo en `public/img/` con **el mismo nombre**. Si sus medidas cambian, actualiza `ancho` y `alto` en `FOTOS` (clic derecho en el archivo → Propiedades → Detalles).
- **Foto nueva**: cópiala a `public/img/` (mejor `.jpg`, 1600 px de ancho como mucho), añádela a `FOTOS` con su texto alternativo en los tres idiomas y úsala donde quieras (`portada`, `galeria`, la `foto` de un plato).
- Para la **web real** hacen falta fotos propias: casi todas las de la demo son de clientes en Google Maps.

#### Cambiar textos

| Qué texto | Dónde |
|---|---|
| Nombre, lema, descripción, historia, platos | `src/data/cafe.config.ts` |
| Frase del mural, etiquetas de los silos, títulos de las pizarras, rótulos del diseño | `src/estilo/ajustes/textos.ts` |
| Botones comunes ("Ajouter", "Réserver une table"…) | El motor (`src/motor/textos.ts`, **NO TOCAR**): si hace falta, se cambia en la plantilla para todas las webs |

#### WhatsApp, pedidos y reservas

- El número va en `contacto.whatsapp`, **solo dígitos con el prefijo del país** (`15145273030`).
- **Sin WhatsApp** (borra la línea): desaparecen el pedido, la reserva y el botón flotante.
- **Quitar solo las reservas**: al final del archivo, `funciones: { reserva: false }`.
- La web no cobra nada: abre WhatsApp con el pedido ya escrito y el café lo confirma.

#### Añadir una promoción o un vernissage

En `promos` (al final del archivo):

```ts
promos: [
  {
    id: "vernissage-noviembre",
    titulo: { fr: "Vernissage", en: "Exhibition opening", es: "Inauguración" },
    cuando: { fr: "Jeudi 20 novembre, 18 h", en: "Thursday November 20, 6 p.m.", es: "Jueves 20 de noviembre, 18:00" },
    descripcion: { fr: "Photos de …", en: "Photos by …", es: "Fotos de …" },
  },
],
```

Aparece sola la sección "À l'affiche" (gama premium). Con la lista vacía (`promos: []`) se oculta.

#### Actualizar la nota de Google

En `resenas`: `nota` (con punto: `4.8`), `total` (número de opiniones) y `temas` (lo que más se repite en Google Maps). Hazlo cada pocos meses.

#### Cambiar un color

Abre `src/estilo/ajustes/colores.css`: cada color tiene un nombre (`--tasse`, `--creme`…) y una línea que dice dónde se ve. Cambia **solo el valor** (`#9c1d26`). Si es un color de texto o de fondo, comprueba que se sigue leyendo bien en [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker/) (mínimo 4,5:1).

#### Cambiar la gama

En `cafe.config.ts`: `gama: "basica"`, `"estandar"` o `"premium"`. Las secciones se ocultan o aparecen solas. Además, mueve la carpeta de la demo a `demos/<gama>/` (ver `cafe v1/LEEME.md`).

| Incluye | Básica | Estándar | Premium |
|---|:-:|:-:|:-:|
| Portada, silos, plato del día, carta, horario, mapa | ✓ | ✓ | ✓ |
| Historia, galería, opiniones, WhatsApp flotante, animaciones al bajar | – | ✓ | ✓ |
| Pestañas y fotos en la carta, pedido, reserva, idiomas, promociones, animaciones extra | – | – | ✓ |

#### Pasar de demo a web real

1. Confirma con el dueño todo lo de "Por confirmar" (`docs/INFO-EXTRAIDA.md`).
2. En `cafe.config.ts`: `demo: false` (quita el aviso y deja que Google la indexe) y añade `seo: { url: "https://dominio-del-cafe.com" },`.

### A5. Publicar en internet (Vercel)

1. Sube esta carpeta a un repositorio de GitHub (rama `main`).
2. En [vercel.com](https://vercel.com): **Add New → Project** → importa el repositorio → **Deploy**. No hace falta configurar nada.
3. Cada vez que subas un cambio a `main`, Vercel publica la versión nueva sola.

### A6. Problemas frecuentes

| Qué pasa | Por qué suele ser | Qué hacer |
|---|---|---|
| La página sale en blanco o con un error rojo | Falta una coma o unas comillas en `cafe.config.ts` | En la terminal: `npx tsc --noEmit`; te dice el archivo y la línea |
| No sale una sección | La gama no la incluye o faltan datos (galería con menos de 3 fotos, pedido sin WhatsApp o sin precios, promociones vacías) | Revisa `gama`, `funciones` y los datos de esa sección |
| Una foto no se ve | La ruta no empieza por `/img/` o el archivo no está en `public/img/` | Revisa el nombre exacto (minúsculas, sin espacios) |
| Una foto se ve deformada o recortada | `ancho`/`alto` no son los reales | Pon las medidas reales del archivo |
| WhatsApp no se abre o abre otro número | El número tiene espacios, `+` o le falta el prefijo | Solo dígitos: `15145273030` |
| El mapa sale vacío | Sin internet o bloqueado por el navegador | Es el mapa de Google: necesita conexión |
| `npm run build` falla por memoria (Windows) | Poca memoria libre | Cierra programas y repite; o `set NODE_OPTIONS=--max-old-space-size=4096` antes |
| Cambié un color y no cambia todo | Algunos detalles (marcos negros, sombras) tienen el color fijo en el `.css` de su sección | Busca el valor en `src/estilo/secciones/` |

---

## Parte B · Para programadores

### B1. Las tres piezas: motor, datos y piel

```text
 src/data/cafe.config.ts ──► src/motor/ (gamas, idiomas, horario, carrito, WhatsApp, SEO) ──► src/estilo/ (la piel)
        DATOS                          MOTOR (igual en todas las webs)                          DISEÑO (único por café)
```

- **Datos** (`src/data/cafe.config.ts`, tipo `CafeConfig` de `src/motor/tipos.ts`): lo único que cambia entre cafeterías junto con la piel. Nada inventado.
- **Motor** (`src/motor/`, `src/app/`, `next.config.js`): **no se toca** por café. Decide qué secciones salen (`gamas.ts`), traduce, calcula el horario en vivo, lleva el carrito y arma los mensajes de WhatsApp.
- **Piel** (`src/estilo/`): el diseño de este café. Contrato con el motor (`src/estilo/index.ts`): exporta `Pagina`, `fuentes` y `colorNavegador`, y existe `src/estilo/estilo.css`.

Tecnología: Next.js 15 (App Router), React 19, TypeScript estricto, framer-motion. Sin backend ni base de datos.

### B2. Estructura de carpetas

```text
src/estilo/
├── index.ts                     [NO TOCAR]     Contrato: exporta Pagina, fuentes, colorNavegador
├── Pagina.tsx                   [CON CUIDADO]  Orden de las secciones + mapa de la página en el comentario
├── estilo.css                   [CON CUIDADO]  Índice: importa todas las hojas en orden (lo carga layout.tsx)
├── ajustes/                     Lo que se ajusta sin tocar componentes
│   ├── colores.css              [EDITABLE]     Paleta (--creme, --tasse…) con "se ve en" de cada color
│   ├── textos.ts                [EDITABLE]     Frases del diseño (fr/en/es), MURAL, SILOS, TABLEROS, PLATO
│   └── fuentes.ts               [CON CUIDADO]  Josefin Sans, Libre Caslon Text, Kalam (next/font)
├── comun/                       Piezas de varias secciones
│   ├── base.css                 Reset, letra base, foco, .sr, .piel
│   ├── piezas.css               Botones, etiquetas, cartela, botón de añadir, formularios, conducto
│   ├── piezas.tsx               <Imagen>, <BotonAnadir>
│   ├── animacion.tsx            useAnimar(), <Aparece>
│   ├── datos.ts                 numero(), rellenar(), platoDestacado()
│   └── dibujos.tsx              <Medallon>, <Flecha>
└── secciones/                   Una carpeta por sección, numerada en el orden de la página
    ├── 01-cabecera/             Cabecera.tsx · cabecera.css · dibujos.tsx (Bolsa)
    ├── 02-portada/              Portada.tsx · portada.css · dibujos.tsx (Lampara, Paisaje)
    ├── 03-mostrador/            Mostrador.tsx · mostrador.css
    ├── 04-plato-del-dia/        PlatoDelDia.tsx · plato-del-dia.css · dibujos.tsx (DibujoPlato)
    ├── 05-carta/                Carta.tsx · carta.css · organizar.ts · dibujos.tsx (Tornillo, DibujoTablero, Estrella)
    ├── 06-historia/             Historia.tsx · historia.css · dibujos.tsx (SelloRedondo)
    ├── 07-galeria/              Galeria.tsx · galeria.css
    ├── 08-opiniones/            Opiniones.tsx · opiniones.css · dibujos.tsx (EstrellaNota)
    ├── 09-promos/               Promos.tsx · promos.css
    ├── 10-reserva/              Reserva.tsx · reserva.css · dibujos.tsx (Sillon, MesaBaja)
    ├── 11-visita/               Visita.tsx · visita.css · dibujos.tsx (Fuente)
    ├── 12-pie/                  Pie.tsx · pie.css
    ├── 13-pedido/               Pedido.tsx · pedido.css
    └── 14-whatsapp/             WhatsappFlotante.tsx · whatsapp.css · dibujos.tsx (IconoMensaje)
```

Regla: **todo lo de una sección está en su carpeta** (componente, estilos, dibujos y lógica propia). Lo que usan dos o más secciones va a `comun/`. Lo que se ajusta sin tocar componentes, a `ajustes/`.

### B3. Anatomía de una sección

Tomemos `secciones/02-portada/`:

```text
02-portada/
├── Portada.tsx    1. Cabecera del archivo: nivel, qué es (ES/EN), BOCETO de cómo se ve y "Dónde cambiar"
│                  2. Imports: motor (@/motor), ajustes, comun, dibujos de la carpeta
│                  3. Componente: lee datos con useMotor(); cada bloque JSX lleva un marcador
│                     {/* ▸ Lámparas … */} que dice qué dibuja
├── portada.css    1. Cabecera: índice de clases y "Cambios típicos"
│                  2. Bloques ── Nombre ── en el orden visual (móvil primero)
│                  3. @media para pantallas más anchas
│                  4. Animaciones de premium al final, detrás de [data-anim="completa"]
└── dibujos.tsx    SVG decorativos de la sección (aria-hidden), con boceto y coordenadas
```

Cómo encontrar algo que ves en pantalla:

1. Mira en qué sección está (tabla de [A3](#a3-qué-parte-de-la-página-sale-de-qué-archivo) o el mapa de `Pagina.tsx`).
2. Abre el `.tsx` de esa carpeta: el boceto del principio señala cada parte y su clase.
3. Busca la clase en el `.css` de la misma carpeta (o en `comun/piezas.css` si es una pieza común).

### B4. CSS: orden, variables y nombres

- **Orden de carga** (`estilo.css`): `ajustes/colores.css` → `comun/base.css` → `comun/piezas.css` → `secciones/01…14`. Si dos reglas chocan con la misma especificidad, gana la que se carga después.
- **Móvil primero**: las reglas sin `@media` son para 360 px; los `@media (min-width: …)` ensanchan. Puntos usados: 420, 640, 768, 900, 960, 1024, 1100 y 1280 px.
- **Colores**: siempre con variables de `ajustes/colores.css` (`var(--tasse)`). Los pocos valores fijos (marco negro `#17100e`, sombras) están comentados en su sección.
- **Letras**: `var(--f-josefin)`, `var(--f-caslon)`, `var(--f-caslon-it)`, `var(--f-kalam)` (de `ajustes/fuentes.ts`).
- **Nombres de clase** (estilo BEM `bloque__elemento--variante`):
  - el **bloque de la sección** se llama como la sección: `.portada`, `.carta`, `.galeria`, `.reserva`…
  - los **objetos del local** se llaman como el objeto real: `.lampara`, `.mural`, `.silo`, `.tablero`, `.cuadro`, `.sello`, `.libro`, `.poster`, `.bolsa`.
  - `--variante` para versiones (`.boton--taza`, `.lampara--2`); atributos `data-…` para estados (`[data-hoy="true"]`, `[data-hecho="true"]`).
- **Sin scroll horizontal**: `.piel` tiene `overflow-x: clip` (no rompe la cabecera fija). Aun así, comprueba 360 px tras cada cambio.

### B5. Lo que da el motor

Todo se importa de `@/motor`:

| Para qué | Qué usar |
|---|---|
| Datos, gama, idioma, traducir | `useMotor()` → `cafe`, `secciones`, `funciones`, `idioma`, `idiomas`, `cambiarIdioma`, `tx(texto)`, `t(clave)`, `precio(n)`, `hora("17:00")`, `locale` |
| ¿Abierto ahora? | `useEstadoHorario()` (null hasta que el navegador sabe la hora) · `fraseEstado()` · `semana()` |
| Carrito | `useCarrito()` → `lineas`, `cantidad`, `total`, `anadir(id)`, `quitar(id)`, `abrir()`, `cerrar()` |
| Pedido y reserva | `usePedido()`, `useReserva()` → `datos`, `cambiar()`, `horas`, `errores`, `enviar()` (abre WhatsApp) |
| Enlaces | `urlMapaIncrustado()`, `urlComoLlegar()`, `urlFicha()`, `urlTelefono()`, `whatsappUrl()` |

- `tx()` es para textos **del café** (de `cafe.config.ts` o `ajustes/textos.ts`); `t()` para textos **de la interfaz** del motor ("Ajouter", "Fermé"…).
- `secciones.x` = la gama la incluye **y** hay datos; `funciones.x` = solo lo que incluye la gama.

### B6. Añadir una sección nueva

1. Crea la carpeta en su sitio, por ejemplo `secciones/09-agenda/` (si hace falta, renumera las siguientes para que el orden de carpetas siga siendo el de la página).
2. `Agenda.tsx`: copia la cabecera de comentario de otra sección y cámbiala (nivel, qué es ES/EN, boceto, "Dónde cambiar"). Lee los datos con `useMotor()`; los textos nuevos del diseño van a `ajustes/textos.ts` (`COPY`).
3. `agenda.css`: cabecera con el índice de clases; bloque `.agenda` y sus objetos; móvil primero.
4. Añade `@import "./secciones/09-agenda/agenda.css";` en `estilo.css`, en su sitio.
5. Añade `<Agenda />` en `Pagina.tsx` (con su condición si depende de la gama: `{secciones.x && <Agenda />}`) y una fila en el mapa del comentario.
6. Si necesita datos nuevos, hay que ampliar `CafeConfig` en el **motor**: eso se hace en la plantilla, no en una demo.
7. Comprueba: `npx tsc --noEmit`, 360 px y 1280 px, y las tres gamas.

### B7. Animaciones por gama

| Gama | `data-anim` (en `.piel`) | Qué se mueve |
|---|---|---|
| Básica | `ninguna` | Nada (solo cambios de estado, como abrir la bolsa) |
| Estándar | `scroll` | Los bloques envueltos en `<Aparece>` suben y aparecen al bajar |
| Premium | `completa` | Además: el mural se pinta, el paisaje se dibuja, las lámparas se encienden y se balancean, el plato aparece parte a parte, los cuadros se mecen, el contador de la bolsa salta, la fuente late |

- Las animaciones de CSS se escriben así, al final del `.css` de su sección:
  ```css
  @media (prefers-reduced-motion: no-preference) {
    [data-anim="completa"] .lampara { animation: vaiven 7s ease-in-out infinite alternate; }
  }
  ```
- Las de framer-motion respetan "reducir movimiento" gracias a `<MotionConfig reducedMotion="user">` en `Pagina.tsx`.
- Anima solo `transform`/`opacity` (y `clip-path`/`stroke-dashoffset` en los dibujos): no muevas tamaños ni márgenes.

### B8. Reglas de los comentarios

Todo archivo nuevo o cambiado sigue estas reglas, para que otra persona vea el código "con los ojos":

1. **Primera línea = nivel**: `[EDITABLE]`, `[CON CUIDADO · EDIT WITH CARE]` o `[NO TOCAR · DO NOT EDIT]`, con el número y nombre de la sección.
2. **Bilingüe**: cada comentario en español (`ES:`) e inglés (`EN:`). Las líneas cortas pueden ir juntas: `/* ES: … · EN: … */`.
3. **Boceto**: cada componente de sección dibuja en ASCII cómo se ve (escritorio y, si cambia, móvil) y señala cada parte con `←` y su clase.
4. **"Dónde cambiar · Where to change"**: lista de "quiero cambiar X → archivo → campo".
5. **Marcadores en el JSX**: `{/* ▸ Qué dibuja este bloque · What this block draws */}` antes de cada bloque visible.
6. **Índice de clases** al principio de cada `.css` y **bloques** con título `/* ── Nombre · Name ── */`.
7. **"Se ve en · Shows in"** en los datos (`cafe.config.ts`), colores y textos: dónde aparece cada valor.
8. Comenta el **porqué** de lo que no es evidente (un `paint-order`, un margen negativo), no lo que ya dice el código.

### B9. Antes de entregar

```bash
npx tsc --noEmit     # tipos sin errores
npm run build        # compilación de producción (en Windows puede fallar por memoria: repetir)
```

- Mira la página a **360–375 px** y a **1280 px**: sin scroll horizontal, nada cortado.
- Prueba un pedido sin abrir WhatsApp: en la consola del navegador
  `window.__abiertas = []; window.open = (u) => { window.__abiertas.push(u); return null; };`
  añade platos, envía y lee `decodeURIComponent(window.__abiertas[0].split("text=")[1])`.
- Cambia `gama` a `basica` y `estandar` y comprueba que todo sigue bien; vuelve a la gama elegida.
- Activa "reducir movimiento" en el sistema y comprueba que no se mueve nada.

### B10. Glosario

Los nombres del código están en español. Equivalencias:

| En el código | Qué es | English |
|---|---|---|
| `cafe`, `marca`, `contacto` | Datos del café, su marca, su contacto | café data, brand, contact |
| `horario`, `franjas`, `dia` | Horario, tramos de apertura, día (0 = domingo) | opening hours, slots, day (0 = Sunday) |
| `carta`, `categoria`, `plato` | Menú, categoría, plato | menu, category, item |
| `precio`, `suplemento`, `destacado` | Precio, extra que se suma, plato del día | price, add-on, featured item |
| `historia`, `hitos` | Historia, momentos clave | story, milestones |
| `galeria`, `resenas`, `promos` | Galería, opiniones, promociones | gallery, reviews, promotions |
| `gama`, `funciones`, `secciones` | Nivel contratado, piezas activas, secciones visibles | tier, enabled features, visible sections |
| `tx()`, `t()` | Traduce un texto del café / de la interfaz | translates café text / UI text |
| `Cabecera`, `Portada`, `Mostrador` | Barra de arriba, primera pantalla, franja de los silos | header, hero, counter strip |
| `PlatoDelDia`, `Carta`, `Pizarra`, `Grupo`, `Fila` | Plato del día, carta, pizarra, categoría, línea | dish of the day, menu, board, group, row |
| `Historia`, `Galeria`, `Cuadro`, `Cartela` | Historia, galería, cuadro colgado, cartela de museo | story, gallery, hung frame, label card |
| `Opiniones`, `Libro`, `Promos`, `Reserva`, `Visita`, `Pie` | Opiniones, libro de oro, promociones, reserva, cómo llegar, pie | reviews, guestbook, promotions, booking, visit, footer |
| `Pedido`, `Bolsa`, `Ticket` | Pedido, bolsa kraft, ticket | order, kraft bag, ticket |
| `Aparece`, `useAnimar` | Bloque que aparece al bajar, nivel de animación | fade-in block, motion level |
| `ajustes`, `comun`, `dibujos` | Ajustes, piezas comunes, dibujos SVG | settings, shared pieces, SVG drawings |
