"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · 05 Carta / Menu · «les tableaux»
 *
 * ES: Las tres pizarras blancas del mostrador (À boire, Menu latino, À manger) con sus listones oscuros y tornillos.
 *     Como en el menú real: mayúsculas espaciadas, filete hasta el precio, grupos del menú latino en cajas con el
 *     precio común ("TACOS 12,75 $") y el precio que cambia escrito a mano. Los tamaños (P, M, G) son botones.
 *     En escritorio se ven las tres juntas; en el móvil (premium) se eligen con pestañas.
 * EN: The counter's three white boards (À boire, Menu latino, À manger) with their dark strips and screws. As on the
 *     real menu: spaced capitals, a rule up to the price, Latin menu groups in boxes with the shared price
 *     ("TACOS $12.75") and the differing price handwritten. Sizes (S, M, L) are buttons. On desktop the three show
 *     side by side; on mobile (premium) tabs pick one.
 *
 *   Escritorio · Desktop (≥ 1024 px)
 *   ┌⊖───────────────⊖┐ ┌⊖────────────────⊖┐ ┌⊖────────────────⊖┐   ← .tablero__liston + <Tornillo>
 *   │ À BOIRE   (taza) │ │ ┌MENU LATINO┐ (hoja)│ │À MANGER ✦ (bagels)│ ← .tablero__titulo + <DibujoTablero>
 *   │ CAFÉ ET THÉ      │ │ ┌TACOS──12,75 $┐ │ │ BAGELS           │   ← <Grupo> (.grupo / .grupo--caja)
 *   │ ESPRESSO ── (S)(D)│ │ POULET CH. [10$](+)│ FROMAGE… ── 5,50 (+)│ ← <FilaCarta> (.fila)
 *   │ LATTÉ ─ (P)(M)(G) │ │ BIRRIA        (+)│ │ …                │
 *   │ …                │ │ …                │ │                  │
 *   │    [polaroid]    │ │ [pol.] [pol.]    │ │   [polaroid]     │   ← fotos (premium)
 *   └⊖───────────────⊖┘ └⊖────────────────⊖┘ └⊖────────────────⊖┘
 *                       Prix du menu affiché au comptoir.                ← nota · note
 *
 *   Móvil premium · Mobile premium:  ( À BOIRE | MENU LATINO | À MANGER )  ← pestañas · tabs (una pizarra a la vez)
 *   Móvil básica/estándar · Mobile basic/standard: las tres pizarras una debajo de otra.
 *
 * Dónde cambiar · Where to change:
 *   Platos, precios, categorías, fotos ...... src/data/cafe.config.ts → carta
 *   Qué categoría va en qué pizarra ......... src/estilo/ajustes/textos.ts → TABLEROS
 *   Títulos de las pizarras ................. src/estilo/ajustes/textos.ts → TABLEROS[…].titulo
 *   Tamaños (P, M, G), precio común, nombre corto .. organizar.ts (esta carpeta · this folder)
 *   Aspecto de pizarras, filas, polaroids ... carta.css (esta carpeta · this folder)
 *   Tornillos y dibujos de fondo ............ dibujos.tsx (esta carpeta · this folder)
 */
import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useMotor, type Categoria, type Plato } from "@/motor";
import { COPY } from "@/estilo/ajustes/textos";
import { Aparece } from "@/estilo/comun/animacion";
import { BotonAnadir, Imagen } from "@/estilo/comun/piezas";
import { DibujoTablero, Estrella, Tornillo } from "./dibujos";
import { agruparPlatos, precioComun, quitaCategoria, repartirTableros, type Fila, type Tablero } from "./organizar";

export function Carta() {
  const { cafe, funciones, tx, t } = useMotor();
  const tableros = useMemo(() => repartirTableros(cafe.carta), [cafe.carta]);
  // ES: Pizarra elegida en las pestañas del móvil. · EN: Board picked in the mobile tabs.
  const [activo, setActivo] = useState(tableros[0]?.id ?? "");
  const pestanasRef = useRef<(HTMLButtonElement | null)[]>([]);
  const conPestanas = funciones.cartaPestanas && tableros.length > 1;

  // ES: Flechas izquierda/derecha para moverse entre pestañas (patrón ARIA). · EN: Left/right arrows to move between tabs (ARIA pattern).
  const alTeclear = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const siguiente = (i + (e.key === "ArrowRight" ? 1 : -1) + tableros.length) % tableros.length;
    setActivo(tableros[siguiente].id);
    pestanasRef.current[siguiente]?.focus();
  };

  return (
    <section id="carta" className="carta" aria-labelledby="titulo-carta">
      {/* ▸ Antetítulo y título · Overline and heading */}
      <Aparece className="carta__cabecera">
        <p className="antetitulo">{tx(COPY.cartaAntetitulo)}</p>
        <h2 id="titulo-carta" className="titulo-seccion">
          {t("carta")}
        </h2>
      </Aparece>

      {/* ▸ Pestañas (solo premium; el CSS las oculta desde 1024 px) · Tabs (premium only; CSS hides them from 1024 px) */}
      {conPestanas && (
        <div className="carta__pestanas" role="tablist" aria-label={t("carta")}>
          {tableros.map((tb, i) => (
            <button
              key={tb.id}
              ref={(el) => {
                pestanasRef.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`pestana-${tb.id}`}
              aria-controls={`tablero-${tb.id}`}
              aria-selected={tb.id === activo}
              tabIndex={tb.id === activo ? 0 : -1}
              className={`pestana pestana--${tb.tinta}`}
              onClick={() => setActivo(tb.id)}
              onKeyDown={(e) => alTeclear(e, i)}
            >
              {tx(tb.titulo)}
            </button>
          ))}
        </div>
      )}

      {/* ▸ Las pizarras · The boards */}
      <div className="carta__tableros" data-pestanas={conPestanas}>
        {tableros.map((tb, i) => (
          <Pizarra key={tb.id} tablero={tb} indice={i} oculto={conPestanas && tb.id !== activo} conPestanas={conPestanas} />
        ))}
      </div>

      {/* ▸ Nota de precios (cafe.config.ts → notaPrecios) · Price note */}
      {cafe.notaPrecios && <p className="carta__nota">{tx(cafe.notaPrecios)}</p>}
    </section>
  );
}

/**
 * ES: Una pizarra: listón con tornillos, papel con dibujo de fondo, título, grupos y (premium) polaroids, y otro
 *     listón abajo. `oculto` = no es la pestaña elegida (el CSS la esconde solo en el móvil).
 * EN: One board: strip with screws, paper with a background doodle, title, groups and (premium) polaroids, and
 *     another strip at the bottom. `oculto` = not the chosen tab (CSS hides it on mobile only).
 */
function Pizarra({ tablero, indice, oculto, conPestanas }: { tablero: Tablero; indice: number; oculto: boolean; conPestanas: boolean }) {
  const { funciones, tx } = useMotor();
  // ES: Platos con foto de esta pizarra (solo si la gama tiene fotos en la carta). · EN: This board's items with a photo (only if the tier has menu photos).
  const fotos = funciones.cartaFotos ? tablero.grupos.flatMap((g) => g.platos).filter((p): p is Plato & { foto: NonNullable<Plato["foto"]> } => Boolean(p.foto)) : [];
  return (
    <article
      id={`tablero-${tablero.id}`}
      className={`tablero tablero--${tablero.id} tinta--${tablero.tinta}`}
      data-oculto={oculto}
      role={conPestanas ? "tabpanel" : undefined}
      aria-labelledby={conPestanas ? `pestana-${tablero.id}` : `titulo-tablero-${tablero.id}`}
      tabIndex={conPestanas ? 0 : undefined}
    >
      {/* ▸ Listón de arriba con dos tornillos · Top strip with two screws */}
      <div className="tablero__liston" aria-hidden="true">
        <Tornillo giro={20 + indice * 35} />
        <Tornillo giro={-30 + indice * 50} />
      </div>

      <div className="tablero__papel">
        <DibujoTablero id={tablero.id} className="tablero__dibujo" />
        <h3 id={`titulo-tablero-${tablero.id}`} className="tablero__titulo">
          <span>{tx(tablero.titulo)}</span>
          {tablero.id === "manger" && <Estrella className="tablero__estrella" />}
        </h3>

        {/* ▸ Grupos de la pizarra (el menú latino, en cajas) · The board's groups (the Latin menu, in boxes) */}
        {tablero.grupos.map((g) => (
          <Grupo key={g.id} categoria={g} enCaja={tablero.id === "latino"} />
        ))}

        {/* ▸ Polaroids de los platos con foto, al fondo de la pizarra (premium) · Polaroids of items with a photo (premium) */}
        {fotos.length > 0 && (
          <ul className="polaroids">
            {fotos.map((p, i) => (
              <li key={p.id} className="polaroid" style={{ rotate: `${i % 2 ? 2.5 : -2}deg` }}>
                <Imagen foto={p.foto} sizes="(max-width: 640px) 40vw, 160px" />
                <span className="polaroid__pie">{tx(p.nombre).split(" · ")[0]}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ▸ Listón de abajo · Bottom strip */}
      <div className="tablero__liston tablero__liston--abajo" aria-hidden="true">
        <Tornillo giro={60 + indice * 20} />
        <Tornillo giro={-10 + indice * 40} />
      </div>
    </article>
  );
}

/**
 * ES: Un grupo (una categoría): título con el precio común si lo hay y sus filas. Si el grupo tiene un solo plato
 *     con precio, se pinta como la caja del menú real: "GUISO, REPAS DU JOUR 17 $" y debajo la descripción.
 * EN: One group (a category): title with the shared price if any, and its rows. If the group has a single priced
 *     item, it is drawn like the real menu's box: "GUISO, REPAS DU JOUR $17" with the description below.
 */
function Grupo({ categoria, enCaja }: { categoria: Categoria; enCaja: boolean }) {
  const { secciones, tx, precio } = useMotor();
  const filas = agruparPlatos(categoria.platos, tx);
  const unico = categoria.platos.length === 1 && typeof categoria.platos[0].precio === "number" ? categoria.platos[0] : null;
  const comun = unico ? (unico.precio as number) : precioComun(categoria.platos);
  const corto = quitaCategoria(
    filas.map((f) => (f.tipo === "plato" ? tx(f.plato.nombre) : f.base)),
    tx(categoria.nombre),
  );
  const idTitulo = `grupo-${categoria.id}`;
  return (
    <section className={`grupo ${enCaja ? "grupo--caja" : ""}`} aria-labelledby={idTitulo}>
      <h4 id={idTitulo} className="grupo__titulo">
        <span>{tx(categoria.nombre)}</span>
        {comun !== null && <span className="grupo__precio">{precio(comun)}</span>}
      </h4>
      {categoria.nota && <p className="grupo__nota">{tx(categoria.nota)}</p>}
      {unico ? (
        <div className="fila fila--unica">
          {unico.descripcion && <p className="fila__descripcion">{tx(unico.descripcion)}</p>}
          {secciones.pedido && <BotonAnadir plato={unico} />}
        </div>
      ) : (
        <ul className="grupo__lista">
          {filas.map((f) => (
            <FilaCarta key={f.tipo === "plato" ? f.plato.id : f.opciones[0].plato.id} fila={f} comun={comun} corto={corto} />
          ))}
        </ul>
      )}
    </section>
  );
}

/**
 * ES: Una línea de la pizarra.
 *       Plato suelto ·  NOMBRE [VÉG.] ──────── 5,50 $ (+)        (sin precio: "Au comptoir")
 *       Con precio común y otro precio · NOMBRE ──── [10,00 $] (+)   (etiqueta escrita a mano)
 *       Con tamaños ·   LATTÉ ─────── (P 4,60 $) (M 5,20 $) (G 5,70 $)   (cada tamaño es un botón)
 * EN: One board line (single item / differing price on a handwritten sticker / sizes as buttons).
 */
function FilaCarta({ fila, comun, corto }: { fila: Fila; comun: number | null; corto: (nombre: string) => string }) {
  const { secciones, tx, t, precio } = useMotor();

  if (fila.tipo === "tamanos") {
    return (
      <li className="fila fila--tamanos">
        <span className="fila__linea">
          <span className="fila__nombre">{corto(fila.base)}</span>
          <span className="fila__filete" aria-hidden="true" />
          <span className="tamanos" role="group" aria-label={`${fila.base} · ${tx(COPY.tamanos)}`}>
            {fila.opciones.map((o) =>
              secciones.pedido && typeof o.plato.precio === "number" ? (
                <BotonAnadir key={o.plato.id} plato={o.plato} variante="tamano">
                  <b>{o.letra}</b> {precio(o.plato.precio)}
                </BotonAnadir>
              ) : (
                <span key={o.plato.id} className="tamano" title={o.tamano}>
                  <b>{o.letra}</b> {typeof o.plato.precio === "number" ? precio(o.plato.precio) : ""}
                </span>
              ),
            )}
          </span>
        </span>
      </li>
    );
  }

  const p = fila.plato;
  const tienePrecio = typeof p.precio === "number";
  const distinto = tienePrecio && comun !== null && p.precio !== comun;
  return (
    <li className="fila">
      <span className="fila__linea">
        <span className="fila__nombre">
          {corto(tx(p.nombre))}
          {p.vegetariano && (
            <abbr className="fila__veg" title={t("vegetariano")}>
              {tx(COPY.vegCorto)}
            </abbr>
          )}
        </span>
        <span className="fila__filete" aria-hidden="true" />
        {/* ES: Precio normal, precio a mano (si cambia el común) o "Au comptoir" (sin precio). · EN: Normal price, handwritten price (if it differs) or "At the counter" (no price). */}
        {tienePrecio && comun === null && <span className="fila__precio">{precio(p.precio as number, p.suplemento)}</span>}
        {distinto && <span className="precio-mano">{precio(p.precio as number)}</span>}
        {!tienePrecio && <span className="fila__sin-precio">{tx(COPY.sinPrecio)}</span>}
        {secciones.pedido && tienePrecio && <BotonAnadir plato={p} />}
      </span>
      {p.descripcion && <span className="fila__descripcion">{tx(p.descripcion)}</span>}
    </li>
  );
}
