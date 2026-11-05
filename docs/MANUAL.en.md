# User manual · Café LaFontaine (demo website)

[Español](MANUAL.md) · **English**

This manual has two parts:

- **Part A, for anyone** (the owner, an employee): how to open the site and how to change prices, hours, photos or texts without knowing how to code.
- **Part B, for developers**: how the code is organized, how each section is built and how to add or change pieces without breaking anything.

> Golden rule: almost everything that changes day to day lives in **one file**, `src/data/cafe.config.ts`. The design does not need to be touched.

---

## Contents

- [Part A · Everyday use](#part-a--everyday-use)
  - [A1. What is in this folder](#a1-what-is-in-this-folder)
  - [A2. Open the site on your computer](#a2-open-the-site-on-your-computer)
  - [A3. Which part of the page comes from which file](#a3-which-part-of-the-page-comes-from-which-file)
  - [A4. Step-by-step tasks](#a4-step-by-step-tasks)
  - [A5. Publish online (Vercel)](#a5-publish-online-vercel)
  - [A6. Common problems](#a6-common-problems)
- [Part B · For developers](#part-b--for-developers)
  - [B1. The three pieces: engine, data and skin](#b1-the-three-pieces-engine-data-and-skin)
  - [B2. Folder structure](#b2-folder-structure)
  - [B3. Anatomy of a section](#b3-anatomy-of-a-section)
  - [B4. CSS: order, variables and names](#b4-css-order-variables-and-names)
  - [B5. What the engine provides](#b5-what-the-engine-provides)
  - [B6. Adding a new section](#b6-adding-a-new-section)
  - [B7. Motion by tier](#b7-motion-by-tier)
  - [B8. Comment rules](#b8-comment-rules)
  - [B9. Before delivering](#b9-before-delivering)
  - [B10. Glossary](#b10-glossary)

---

## Part A · Everyday use

### A1. What is in this folder

```text
cafe-lafontaine/
├── README.md / README.en.md     Presentation of the site (what it is, screenshots, tiers)
├── CLAUDE.md                    Notes for Claude Code (coding assistant)
├── docs/                        Documentation
│   ├── MANUAL.en.md             ← this manual
│   ├── DISEÑO.md                Why the site looks like this (colors, fonts, details from the shop)
│   ├── INFO-EXTRAIDA.md         Where each fact comes from and what to confirm with the owner
│   ├── fotos.json               Photo list with size and author
│   ├── capturas/                README images
│   └── fuentes/                 Source material (photo of the counter menu)
├── public/
│   ├── img/                     The site's photos             ← change them here
│   └── marca/icono.svg          The browser tab icon
└── src/
    ├── data/cafe.config.ts      THE DATA: menu, prices, hours, contact…  ← change it here
    ├── estilo/                  The design (this café's "skin")
    │   ├── ajustes/             Colors, design texts and fonts           ← can be changed
    │   ├── comun/               Pieces shared by several sections
    │   └── secciones/           One folder per section, in page order
    ├── motor/                   The engine shared by every café site     ← DO NOT EDIT
    └── app/                     Next.js startup                          ← DO NOT EDIT
```

Every file states on its **first line** whether it can be touched:

| Label | Meaning |
|---|---|
| `[EDITABLE]` | Safe to change: data, texts, colors, photos. |
| `[CON CUIDADO · EDIT WITH CARE]` | Design. Can be changed knowing a bit of React and CSS. A mistake breaks the look, not the data. |
| `[NO TOCAR · DO NOT EDIT]` | Engine. Same on every café site; if it must change, it changes in the template. |

### A2. Open the site on your computer

1. Install [Node.js](https://nodejs.org) (version 20 or later).
2. Open a terminal in this folder (in VS Code: **Terminal → New Terminal**).
3. The first time:
   ```bash
   npm install
   ```
4. Every time you want to see it:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000). While it runs, every change you save shows up right away.
6. To stop it: in the terminal, `Ctrl + C`.

### A3. Which part of the page comes from which file

```text
 PAGE (top to bottom)                    DATA it shows                     DESIGN (folder in src/estilo/secciones)
 ┌────────────────────────────────┐
 │ Header (dark bar)              │ ←  marca.nombre                    01-cabecera
 ├────────────────────────────────┤
 │ Hero: mural and photo          │ ←  marca, portada, horario         02-portada
 │ Coffee bins "Au comptoir"      │ ←  (design texts: SILOS)           03-mostrador
 │ Dish of the day                │ ←  the item with destacado: true   04-plato-del-dia
 │ Menu: the three boards         │ ←  carta, notaPrecios              05-carta
 │ Story (burlap sack)            │ ←  historia                        06-historia
 │ Gallery "l'expo"               │ ←  galeria                         07-galeria
 │ Reviews "le livre d'or"        │ ←  resenas                         08-opiniones
 │ Promotions (if any)            │ ←  promos                          09-promos
 │ Booking (armchairs)            │ ←  contacto.whatsapp, horario      10-reserva
 │ Nous trouver (hours and map)   │ ←  horario, contacto, servicios    11-visita
 ├────────────────────────────────┤
 │ Footer                         │ ←  marca, contacto, demo           12-pie
 └────────────────────────────────┘
   Order bag (panel)                 ←  carta, contacto.whatsapp       13-pedido
   Floating WhatsApp button          ←  contacto.whatsapp              14-whatsapp
```

The data lives in `src/data/cafe.config.ts`; the design's own texts (headings, bin labels, the mural sentence) in `src/estilo/ajustes/textos.ts`.

### A4. Step-by-step tasks

> Before you start: open `src/data/cafe.config.ts` in VS Code. Use **Ctrl + F** to find what you want to change. Keep the quotes `"…"` and the commas `,` at the end of each line. Multi-language texts look like this: `{ fr: "…", en: "…", es: "…" }`.

#### Change a price

1. Find the item (for example `tacos-birria`).
2. Change the `precio` number. Write it with a **dot** and no symbol: `12.75` shows as *$12.75*.
   ```ts
   { id: "tacos-birria", nombre: { fr: "Tacos birria", … }, precio: 13.25 },
   ```
3. Save. If every taco but one costs the same, the board shows that price in the box ("TACOS $13.25") and the different one is handwritten: it's automatic.

#### Add or remove an item

- **Add**: copy a similar item's line, paste it below and change the `id` (unique, no spaces or accents), the name and the price:
  ```ts
  { id: "tacos-camaron", nombre: { fr: "Tacos crevettes", en: "Shrimp tacos", es: "Tacos de camarón" }, precio: 13.5 },
  ```
- **Remove**: delete the item's whole line (with its comma).
- **Vegetarian**: add `vegetariano: true`. **No price** (shows "At the counter" and can't be ordered): remove `precio`.
- **With a photo** on the menu: add `foto: FOTOS.name` (photos are declared at the top of the file, in `FOTOS`).

#### Items with sizes (S, M, L)

Write one item per size, **in a row**, with the same name and " · " before the size. The board joins them into one line with one button per size:

```ts
{ id: "latte-petit", nombre: { fr: "Latté · petit", en: "Latte · small", es: "Latte · pequeño" }, precio: 4.6 },
{ id: "latte-moyen", nombre: { fr: "Latté · moyen", en: "Latte · medium", es: "Latte · mediano" }, precio: 5.2 },
```

#### Change the dish of the day

1. Remove `destacado: true` from the current item (the guiso) and add it to the new one.
2. If the new dish is not a guiso, change the drawing's legend (1 protein, 2 rice…) in `src/estilo/ajustes/textos.ts` → `PLATO`.

#### Change the opening hours

In `horario.franjas`, one line per open day (`0` = Sunday, `1` = Monday … `6` = Saturday), 24-hour times:

```ts
{ dia: 0, abre: "09:00", cierra: "15:00" },   // open on Sundays
```

- **Closed day**: delete its line (today Sunday has no line).
- **Two shifts on one day**: two lines with the same `dia`.
- They update on their own: the "Ouvert/Fermé" label, the poster, the order and booking times.

#### Change a photo

- **Same photo, new version**: put the new file in `public/img/` with **the same name**. If its size changes, update `ancho` and `alto` in `FOTOS` (right-click the file → Properties → Details).
- **New photo**: copy it to `public/img/` (preferably `.jpg`, 1600 px wide at most), add it to `FOTOS` with its alt text in the three languages and use it where you want (`portada`, `galeria`, an item's `foto`).
- The **real site** needs the café's own photos: almost all of the demo's are customer photos from Google Maps.

#### Change texts

| Which text | Where |
|---|---|
| Name, tagline, description, story, menu items | `src/data/cafe.config.ts` |
| Mural sentence, bin labels, board titles, design headings | `src/estilo/ajustes/textos.ts` |
| Shared buttons ("Ajouter", "Réserver une table"…) | The engine (`src/motor/textos.ts`, **DO NOT EDIT**): if needed, change it in the template for every site |

#### WhatsApp, orders and bookings

- The number goes in `contacto.whatsapp`, **digits only, with the country code** (`15145273030`).
- **No WhatsApp** (delete the line): ordering, booking and the floating button disappear.
- **Turn off bookings only**: at the end of the file, `funciones: { reserva: false }`.
- The site charges nothing: it opens WhatsApp with the order already written and the café confirms it.

#### Add a promotion or an exhibition opening

In `promos` (at the end of the file):

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

The "À l'affiche" section appears on its own (premium tier). With an empty list (`promos: []`) it hides.

#### Update the Google rating

In `resenas`: `nota` (with a dot: `4.8`), `total` (number of reviews) and `temas` (what comes up most on Google Maps). Do it every few months.

#### Change a color

Open `src/estilo/ajustes/colores.css`: each color has a name (`--tasse`, `--creme`…) and a line saying where it shows. Change **only the value** (`#9c1d26`). If it is a text or background color, check it still reads well at [webaim.org/resources/contrastchecker](https://webaim.org/resources/contrastchecker/) (minimum 4.5:1).

#### Change the tier

In `cafe.config.ts`: `gama: "basica"`, `"estandar"` or `"premium"`. Sections hide or appear on their own. Also move the demo folder to `demos/<tier>/` (see `cafe v1/LEEME.md`).

| Includes | Basic | Standard | Premium |
|---|:-:|:-:|:-:|
| Hero, bins, dish of the day, menu, hours, map | ✓ | ✓ | ✓ |
| Story, gallery, reviews, floating WhatsApp, scroll animations | – | ✓ | ✓ |
| Menu tabs and photos, ordering, booking, languages, promotions, extra animations | – | – | ✓ |

#### Go from demo to the real site

1. Confirm with the owner everything listed as pending (`docs/INFO-EXTRAIDA.md`).
2. In `cafe.config.ts`: `demo: false` (removes the notice and lets Google index it) and add `seo: { url: "https://cafe-domain.com" },`.

### A5. Publish online (Vercel)

1. Push this folder to a GitHub repository (`main` branch).
2. On [vercel.com](https://vercel.com): **Add New → Project** → import the repository → **Deploy**. Nothing to configure.
3. Every time you push a change to `main`, Vercel publishes the new version on its own.

### A6. Common problems

| What happens | Usual cause | What to do |
|---|---|---|
| The page is blank or shows a red error | A missing comma or quote in `cafe.config.ts` | In the terminal: `npx tsc --noEmit`; it tells you the file and line |
| A section doesn't show | The tier doesn't include it or data is missing (gallery with fewer than 3 photos, ordering without WhatsApp or prices, empty promotions) | Check `gama`, `funciones` and that section's data |
| A photo doesn't show | The path doesn't start with `/img/` or the file isn't in `public/img/` | Check the exact name (lowercase, no spaces) |
| A photo looks stretched or cropped | `ancho`/`alto` are not the real size | Use the file's real size |
| WhatsApp doesn't open or opens another number | The number has spaces, `+` or lacks the country code | Digits only: `15145273030` |
| The map is empty | No internet or blocked by the browser | It's Google's map: it needs a connection |
| `npm run build` fails for memory (Windows) | Little free memory | Close programs and retry; or `set NODE_OPTIONS=--max-old-space-size=4096` first |
| I changed a color and not everything changed | Some details (black frames, shadows) have a fixed color in their section's `.css` | Search for the value in `src/estilo/secciones/` |

---

## Part B · For developers

### B1. The three pieces: engine, data and skin

```text
 src/data/cafe.config.ts ──► src/motor/ (tiers, languages, hours, cart, WhatsApp, SEO) ──► src/estilo/ (the skin)
        DATA                          ENGINE (same on every site)                              DESIGN (unique per café)
```

- **Data** (`src/data/cafe.config.ts`, type `CafeConfig` from `src/motor/tipos.ts`): the only thing that changes between cafés, together with the skin. Nothing made up.
- **Engine** (`src/motor/`, `src/app/`, `next.config.js`): **not touched** per café. It decides which sections show (`gamas.ts`), translates, computes live hours, runs the cart and builds the WhatsApp messages.
- **Skin** (`src/estilo/`): this café's design. Contract with the engine (`src/estilo/index.ts`): it exports `Pagina`, `fuentes` and `colorNavegador`, and `src/estilo/estilo.css` exists.

Stack: Next.js 15 (App Router), React 19, strict TypeScript, framer-motion. No backend or database.

### B2. Folder structure

```text
src/estilo/
├── index.ts                     [NO TOCAR]     Contract: exports Pagina, fuentes, colorNavegador
├── Pagina.tsx                   [CON CUIDADO]  Section order + page map in the comment
├── estilo.css                   [CON CUIDADO]  Index: imports every sheet in order (loaded by layout.tsx)
├── ajustes/                     What gets adjusted without touching components
│   ├── colores.css              [EDITABLE]     Palette (--creme, --tasse…) with "shows in" for each color
│   ├── textos.ts                [EDITABLE]     Design copy (fr/en/es), MURAL, SILOS, TABLEROS, PLATO
│   └── fuentes.ts               [CON CUIDADO]  Josefin Sans, Libre Caslon Text, Kalam (next/font)
├── comun/                       Pieces used by several sections
│   ├── base.css                 Reset, base font, focus, .sr, .piel
│   ├── piezas.css               Buttons, labels, label card, add button, forms, duct
│   ├── piezas.tsx               <Imagen>, <BotonAnadir>
│   ├── animacion.tsx            useAnimar(), <Aparece>
│   ├── datos.ts                 numero(), rellenar(), platoDestacado()
│   └── dibujos.tsx              <Medallon>, <Flecha>
└── secciones/                   One folder per section, numbered in page order
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

Rule: **everything for a section lives in its folder** (component, styles, drawings and its own logic). Whatever two or more sections use goes to `comun/`. What gets adjusted without touching components goes to `ajustes/`.

### B3. Anatomy of a section

Take `secciones/02-portada/`:

```text
02-portada/
├── Portada.tsx    1. File header: level, what it is (ES/EN), a SKETCH of how it looks and "Where to change"
│                  2. Imports: engine (@/motor), ajustes, comun, the folder's drawings
│                  3. Component: reads data with useMotor(); every JSX block carries a marker
│                     {/* ▸ Lamps … */} saying what it draws
├── portada.css    1. Header: class index and "Typical changes"
│                  2. ── Name ── blocks in visual order (mobile first)
│                  3. @media blocks for wider screens
│                  4. Premium animations at the end, behind [data-anim="completa"]
└── dibujos.tsx    The section's decorative SVGs (aria-hidden), with a sketch and coordinates
```

How to find something you see on screen:

1. See which section it is in (table in [A3](#a3-which-part-of-the-page-comes-from-which-file) or the map in `Pagina.tsx`).
2. Open that folder's `.tsx`: the opening sketch points at each part and its class.
3. Find the class in the `.css` of the same folder (or in `comun/piezas.css` if it is a shared piece).

### B4. CSS: order, variables and names

- **Load order** (`estilo.css`): `ajustes/colores.css` → `comun/base.css` → `comun/piezas.css` → `secciones/01…14`. When two rules with the same specificity clash, the later one wins.
- **Mobile first**: rules without `@media` are for 360 px; `@media (min-width: …)` blocks widen. Breakpoints used: 420, 640, 768, 900, 960, 1024, 1100 and 1280 px.
- **Colors**: always variables from `ajustes/colores.css` (`var(--tasse)`). The few fixed values (black frame `#17100e`, shadows) are commented in their section.
- **Fonts**: `var(--f-josefin)`, `var(--f-caslon)`, `var(--f-caslon-it)`, `var(--f-kalam)` (from `ajustes/fuentes.ts`).
- **Class names** (BEM style `block__element--variant`):
  - the **section block** is named after the section: `.portada`, `.carta`, `.galeria`, `.reserva`…
  - the **shop's objects** are named after the real object: `.lampara`, `.mural`, `.silo`, `.tablero`, `.cuadro`, `.sello`, `.libro`, `.poster`, `.bolsa`.
  - `--variant` for versions (`.boton--taza`, `.lampara--2`); `data-…` attributes for states (`[data-hoy="true"]`, `[data-hecho="true"]`).
- **No horizontal scroll**: `.piel` has `overflow-x: clip` (it keeps the sticky header working). Still, check 360 px after each change.

### B5. What the engine provides

Everything is imported from `@/motor`:

| For | Use |
|---|---|
| Data, tier, language, translation | `useMotor()` → `cafe`, `secciones`, `funciones`, `idioma`, `idiomas`, `cambiarIdioma`, `tx(text)`, `t(key)`, `precio(n)`, `hora("17:00")`, `locale` |
| Open now? | `useEstadoHorario()` (null until the browser knows the time) · `fraseEstado()` · `semana()` |
| Cart | `useCarrito()` → `lineas`, `cantidad`, `total`, `anadir(id)`, `quitar(id)`, `abrir()`, `cerrar()` |
| Order and booking | `usePedido()`, `useReserva()` → `datos`, `cambiar()`, `horas`, `errores`, `enviar()` (opens WhatsApp) |
| Links | `urlMapaIncrustado()`, `urlComoLlegar()`, `urlFicha()`, `urlTelefono()`, `whatsappUrl()` |

- `tx()` is for **café** texts (from `cafe.config.ts` or `ajustes/textos.ts`); `t()` for the engine's **interface** texts ("Ajouter", "Fermé"…).
- `secciones.x` = the tier includes it **and** there is data; `funciones.x` = only what the tier includes.

### B6. Adding a new section

1. Create the folder in its place, for example `secciones/09-agenda/` (renumber the following ones if needed so folder order still matches page order).
2. `Agenda.tsx`: copy another section's comment header and adapt it (level, what it is ES/EN, sketch, "Where to change"). Read data with `useMotor()`; new design texts go in `ajustes/textos.ts` (`COPY`).
3. `agenda.css`: header with the class index; `.agenda` block and its objects; mobile first.
4. Add `@import "./secciones/09-agenda/agenda.css";` to `estilo.css`, in its place.
5. Add `<Agenda />` to `Pagina.tsx` (with its condition if it depends on the tier: `{secciones.x && <Agenda />}`) and a row in the comment's map.
6. If it needs new data, `CafeConfig` must grow in the **engine**: that is done in the template, not in a demo.
7. Check: `npx tsc --noEmit`, 360 px and 1280 px, and the three tiers.

### B7. Motion by tier

| Tier | `data-anim` (on `.piel`) | What moves |
|---|---|---|
| Basic | `ninguna` | Nothing (only state changes, like opening the bag) |
| Standard | `scroll` | Blocks wrapped in `<Aparece>` rise and fade in on scroll |
| Premium | `completa` | Also: the mural gets painted, the landscape draws itself, the lamps switch on and sway, the dish appears part by part, frames swing, the bag counter jumps, the fountain pulses |

- CSS animations are written like this, at the end of their section's `.css`:
  ```css
  @media (prefers-reduced-motion: no-preference) {
    [data-anim="completa"] .lampara { animation: vaiven 7s ease-in-out infinite alternate; }
  }
  ```
- framer-motion animations respect "reduce motion" thanks to `<MotionConfig reducedMotion="user">` in `Pagina.tsx`.
- Animate only `transform`/`opacity` (and `clip-path`/`stroke-dashoffset` on drawings): don't animate sizes or margins.

### B8. Comment rules

Every new or changed file follows these rules, so someone else can "see" the code:

1. **First line = level**: `[EDITABLE]`, `[CON CUIDADO · EDIT WITH CARE]` or `[NO TOCAR · DO NOT EDIT]`, with the section number and name.
2. **Bilingual**: every comment in Spanish (`ES:`) and English (`EN:`). Short lines can go together: `/* ES: … · EN: … */`.
3. **Sketch**: every section component draws in ASCII how it looks (desktop and, if different, mobile) and points at each part with `←` and its class.
4. **"Dónde cambiar · Where to change"**: a list of "I want to change X → file → field".
5. **JSX markers**: `{/* ▸ What this block draws */}` before every visible block.
6. **Class index** at the top of each `.css` and **titled blocks** `/* ── Name ── */`.
7. **"Se ve en · Shows in"** in the data (`cafe.config.ts`), colors and texts: where each value appears.
8. Comment the **why** of anything non-obvious (a `paint-order`, a negative margin), not what the code already says.

### B9. Before delivering

```bash
npx tsc --noEmit     # no type errors
npm run build        # production build (on Windows it may fail for memory: retry)
```

- Look at the page at **360–375 px** and **1280 px**: no horizontal scroll, nothing cut off.
- Test an order without opening WhatsApp: in the browser console
  `window.__abiertas = []; window.open = (u) => { window.__abiertas.push(u); return null; };`
  add items, send and read `decodeURIComponent(window.__abiertas[0].split("text=")[1])`.
- Switch `gama` to `basica` and `estandar` and check everything still holds; go back to the chosen tier.
- Turn on "reduce motion" in the system and check nothing moves.

### B10. Glossary

Code names are in Spanish. Equivalents:

| In the code | What it is |
|---|---|
| `cafe`, `marca`, `contacto` | café data, brand, contact |
| `horario`, `franjas`, `dia` | opening hours, slots, day (0 = Sunday) |
| `carta`, `categoria`, `plato` | menu, category, item |
| `precio`, `suplemento`, `destacado` | price, add-on, featured item (dish of the day) |
| `historia`, `hitos` | story, milestones |
| `galeria`, `resenas`, `promos` | gallery, reviews, promotions |
| `gama`, `funciones`, `secciones` | tier, enabled features, visible sections |
| `tx()`, `t()` | translates café text / interface text |
| `Cabecera`, `Portada`, `Mostrador` | header, hero, counter strip |
| `PlatoDelDia`, `Carta`, `Pizarra`, `Grupo`, `Fila` | dish of the day, menu, board, group, row |
| `Historia`, `Galeria`, `Cuadro`, `Cartela` | story, gallery, hung frame, label card |
| `Opiniones`, `Libro`, `Promos`, `Reserva`, `Visita`, `Pie` | reviews, guestbook, promotions, booking, visit, footer |
| `Pedido`, `Bolsa`, `Ticket` | order, kraft bag, ticket |
| `Aparece`, `useAnimar` | fade-in block, motion level |
| `ajustes`, `comun`, `dibujos` | settings, shared pieces, SVG drawings |
