# CLAUDE.md · Demo de Café LaFontaine

Web demo de Café LaFontaine (3535, avenue Papineau, Montréal), creada con el comando `/cafe` a partir de la plantilla de cafeterías. Repositorio: https://github.com/alesstron/LaFontaine

- **Manual**: `docs/MANUAL.md` (y `docs/MANUAL.en.md`). Parte A para el dueño (tareas paso a paso), parte B para programadores (estructura, API del motor, cómo añadir una sección, reservas en B11). Si cambias la estructura o una regla, actualízalo.
- **Reservas en línea**: `docs/RESERVAS.md` (y `.en.md`): cómo funcionan, puesta en marcha en Neon + Vercel, lista de pruebas, problemas frecuentes.
- **Datos**: `src/data/cafe.config.ts`. Fuentes y pendientes en `docs/INFO-EXTRAIDA.md`.
- **Piel**: `src/estilo/`, propia de Café LaFontaine ("Le mur"). Ficha de estilo en `docs/DISEÑO.md`: cualquier cambio visual la sigue.
  - `ajustes/`: colores (`colores.css`), rótulos, tableros, plato del día y textos de las páginas de reservas (`textos.ts`), tipografías (`fuentes.ts`).
  - `comun/`: piezas de varias secciones o páginas (base, botones, formularios, animación por gama, foto, botón de añadir, dibujos como el medallón y los sillones).
  - `secciones/NN-rol/`: una carpeta por sección, numerada en el orden de la página, con su `Componente.tsx`, su `rol.css` y, si los tiene, sus `dibujos.tsx` y su lógica (`.ts`).
  - `paginas/`: las páginas que no son el inicio (`/reserver`, `/reserver/anular`, `/reserver/gestion`): `Marco.tsx` común, `mensajes.tsx` y una carpeta por página. Solo reutilizan de `secciones/` la cabecera (`modo="pagina"`) y el pie.
  - `estilo.css` solo importa las hojas en orden; `Pagina.tsx` monta las secciones y tiene el mapa de la página.
- **Motor**: `src/motor/`, `src/app/` y `next.config.js` vienen de la plantilla, **ampliados solo en esta demo** con las reservas en línea:
  - `src/motor/reservas/` (base de datos, esquema, validación, seguridad, acciones de servidor y hooks) y `src/app/reserver/**` (tres rutas);
  - añadidos en `tipos.ts` (`ReservasConfig`), `gamas.ts` (la sección de reserva depende del bloque `reservas`), `seo.ts` (`metadataDePagina`), `textos.ts` (dos claves) e `index.ts` (hooks y tipos);
  - `next.config.js`: `serverExternalPackages` y `outputFileTracingExcludes` para PGlite, y `X-Robots-Tag` en el panel y en anular.
  - **No copies el motor de la plantilla encima de esta demo**: se perderían las reservas. Un cambio general se hace en la plantilla y se pasa aquí a mano.
- Gama actual: premium, con pedido por WhatsApp y reservas en línea. Para enseñar otra gama basta con cambiar `gama` (y mover la carpeta, ver `cafe v1/LEEME.md`).
- Es una maqueta: `demo: true` (aviso visible y `noindex`). WhatsApp, precios, empanadas, la relación con Café Grain d'Or y las plazas de las reservas están por confirmar con el dueño.

## Reservas: lo que hay que saber
- **Variables**: `DATABASE_URL` (Neon; obligatoria en Vercel), `RESERVAS_CLAVE` (contraseña del panel; en Vercel, sin ella no se aceptan reservas) y `RESERVAS_PGLITE_DIR` (opcional, solo en local). Modelo en `.env.example`; los valores, en Vercel o en `.env.local` (ignorado por git). Nunca escribas la contraseña ni la dirección de Neon en el código, en los docs ni en el chat.
- **En local**, sin `DATABASE_URL` se usa PGlite en `%LOCALAPPDATA%\cafe-lafontaine\reservas-pglite` (fuera de OneDrive). Un solo servidor a la vez sobre esa carpeta (`npm run dev` o `npm start`, no los dos).
- **Acciones de servidor**: cada función exportada de un archivo `"use server"` (`acciones.ts`, `gestion.ts`) es pública: valida todo y, en las del panel, comprueba la sesión. Las auxiliares van en archivos sin `"use server"` (`operaciones.ts`). Lo de servidor lleva `import "server-only"` y nunca se exporta desde `@/motor`.
- **SQL**: castea siempre (`$3::date`, `SUM(...)::int`, `fecha::text`) para que Neon y PGlite devuelvan lo mismo. Las plazas se comprueban con el cerrojo del turno en su propia sentencia y el `INSERT … WHERE` después (ver `operaciones.ts`). Columnas nuevas: `ALTER TABLE … ADD COLUMN IF NOT EXISTS` en `esquema.ts`.
- **Textos**: el servidor devuelve códigos; las frases están en `src/estilo/ajustes/textos.ts` (fr/en/es) y se eligen en `src/estilo/paginas/mensajes.tsx`.
- Si tocas las reservas, pasa la lista de pruebas de `docs/RESERVAS.md` (apartado 4).

## Convenciones
- **Comentarios bilingües**: todo comentario va en español (`ES:`) y en inglés (`EN:`), o como `español · English` en las líneas cortas.
- **Cabecera de cada archivo**: primera línea con su nivel (`[EDITABLE]`, `[CON CUIDADO · EDIT WITH CARE]` o `[NO TOCAR · DO NOT EDIT]`) y la sección (`02 · PORTADA`). En los componentes, un boceto ASCII de la sección con `←` hacia las clases y una lista "Dónde cambiar · Where to change".
- **Marcadores en el JSX**: `{/* ▸ Nombre · Name */}` antes de cada bloque visible, con el mismo nombre que el boceto.
- **CSS**: índice de clases y "Cambios típicos" arriba; bloques titulados `/* ── Nombre · Name ── */`; las animaciones de la sección van en su propia hoja, dentro de `@media (prefers-reduced-motion: no-preference)` y `[data-anim="completa"]`.
- **"Se ve en · Shows in"** en datos, colores y textos: dónde aparece cada valor en la página.
- Comentar el porqué, no lo obvio. Nada de emojis en el código.
- Clases BEM: el bloque es el rol de la sección (`.portada`, `.carta`) o de la página (`.pagina-reserva`, `.pagina-gestion`); dentro, objetos reales del local (`.mural`, `.silo`, `.tablero`, `.chevalet`, `.libreta`). Identificadores en español.
- Mobile-first, cero scroll horizontal a 360 px.
- README en español (`README.md`) e inglés (`README.en.md`), y lo mismo con el manual y la guía de reservas: mantener las dos versiones iguales.
- `npx tsc --noEmit` antes de dar algo por terminado.

```bash
npm run dev    # http://localhost:3000
npm run build
```
