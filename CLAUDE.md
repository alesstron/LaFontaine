# CLAUDE.md · Demo de Café LaFontaine

Web demo de Café LaFontaine (3535, avenue Papineau, Montréal), creada con el comando `/cafe` a partir de la plantilla de cafeterías. Repositorio: https://github.com/alesstron/LaFontaine

- **Manual**: `docs/MANUAL.md` (y `docs/MANUAL.en.md`). Parte A para el dueño (tareas paso a paso), parte B para programadores (estructura, API del motor, cómo añadir una sección). Si cambias la estructura o una regla, actualízalo.
- **Datos**: `src/data/cafe.config.ts`. Fuentes y pendientes en `docs/INFO-EXTRAIDA.md`.
- **Piel**: `src/estilo/`, propia de Café LaFontaine ("Le mur"). Ficha de estilo en `docs/DISEÑO.md`: cualquier cambio visual la sigue.
  - `ajustes/`: colores (`colores.css`), rótulos, tableros y plato del día (`textos.ts`), tipografías (`fuentes.ts`).
  - `comun/`: piezas de varias secciones (base, botones, formularios, animación por gama, foto, botón de añadir).
  - `secciones/NN-rol/`: una carpeta por sección, numerada en el orden de la página, con su `Componente.tsx`, su `rol.css` y, si los tiene, sus `dibujos.tsx` y su lógica (`.ts`).
  - `estilo.css` solo importa las hojas en orden; `Pagina.tsx` monta las secciones y tiene el mapa de la página.
- **Motor**: `src/motor/`, `src/app/` y `next.config.js` vienen de la plantilla. Si hace falta cambiar el motor, se cambia en la plantilla y se copia a las demos.
- Gama actual: premium, con pedido y reserva por WhatsApp. Para enseñar otra gama basta con cambiar `gama` (y mover la carpeta, ver `cafe v1/LEEME.md`).
- Es una maqueta: `demo: true` (aviso visible y `noindex`). WhatsApp, precios, empanadas y la relación con Café Grain d'Or están por confirmar con el dueño.

## Convenciones
- **Comentarios bilingües**: todo comentario va en español (`ES:`) y en inglés (`EN:`), o como `español · English` en las líneas cortas.
- **Cabecera de cada archivo**: primera línea con su nivel (`[EDITABLE]`, `[CON CUIDADO · EDIT WITH CARE]` o `[NO TOCAR · DO NOT EDIT]`) y la sección (`02 · PORTADA`). En los componentes, un boceto ASCII de la sección con `←` hacia las clases y una lista "Dónde cambiar · Where to change".
- **Marcadores en el JSX**: `{/* ▸ Nombre · Name */}` antes de cada bloque visible, con el mismo nombre que el boceto.
- **CSS**: índice de clases y "Cambios típicos" arriba; bloques titulados `/* ── Nombre · Name ── */`; las animaciones de la sección van en su propia hoja, dentro de `@media (prefers-reduced-motion: no-preference)` y `[data-anim="completa"]`.
- **"Se ve en · Shows in"** en datos, colores y textos: dónde aparece cada valor en la página.
- Comentar el porqué, no lo obvio. Nada de emojis en el código.
- Clases BEM: el bloque es el rol de la sección (`.portada`, `.carta`); dentro, objetos reales del local (`.mural`, `.silo`, `.tablero`). Identificadores en español.
- Mobile-first, cero scroll horizontal a 360 px.
- README en español (`README.md`) e inglés (`README.en.md`), y lo mismo con el manual: mantener las dos versiones iguales.
- `npx tsc --noEmit` antes de dar algo por terminado.

```bash
npm run dev    # http://localhost:3000
npm run build
```
