"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · 04 Plato del día / Dish of the day · «le plat du jour»
 *
 * ES: La mesa de laminado color madera con su canto negro (como en las fotos de los platos) y, encima, el guiso visto
 *     desde arriba con sus partes numeradas y una leyenda escrita a mano. Al lado, la tarjeta con nombre, descripción,
 *     precio a mano y "Ajouter". Lee el plato marcado `destacado: true` en la carta; si no hay ninguno, no sale.
 * EN: The wood-look laminate table with its black edge (as in the dish photos) and, on it, the guiso seen from above
 *     with its parts numbered and a handwritten legend. Next to it, the card with name, description, handwritten
 *     price and "Add". Reads the menu item marked `destacado: true`; if there is none, the section does not show.
 *
 *   Escritorio · Desktop (≥ 1024 px)
 *   ════════════════════════════════════════════════════════════════  ← canto negro · black edge
 *   │     ①  ┌──────────────┐    ⑥ ☕                                  │
 *   │       ╱  proteína  ④ guaca ╲            ┌──────────────────────┐ │
 *   │      │  ② arroz   ③ frijoles│  ⑤ ◐◐     │ CHAQUE JOUR, UN PLAT │ │
 *   │       ╲                    ╱   tortillas│ Guiso, repas du jour │ │ ← tarjeta · card
 *   │         └──────────────┘                │ Une protéine…        │ │
 *   │  ① une protéine  ② riz  ③ haricots     │ [17,00 $] ( AJOUTER )│ │
 *   │  ④ guacamole  ⑤ tortillas  ⑥ soda…     └──────────────────────┘ │ ← leyenda · legend
 *   ════════════════════════════════════════════════════════════════
 *   Móvil · Mobile: plato, leyenda y tarjeta, uno debajo de otro · dish, legend and card stacked.
 *
 * Dónde cambiar · Where to change:
 *   Qué plato es (nombre, descripción, precio) .. src/data/cafe.config.ts → el plato con destacado: true
 *   La leyenda (1–6) ............................ src/estilo/ajustes/textos.ts → PLATO
 *   Antetítulo .................................. src/estilo/ajustes/textos.ts → COPY.platoAntetitulo
 *   El dibujo (formas, colores, números) ........ dibujos.tsx (esta carpeta · this folder)
 *   Fondo de madera, tarjeta, columnas .......... plato-del-dia.css (esta carpeta · this folder)
 */
import { useMotor } from "@/motor";
import { COPY, PLATO } from "@/estilo/ajustes/textos";
import { Aparece, useAnimar } from "@/estilo/comun/animacion";
import { platoDestacado } from "@/estilo/comun/datos";
import { BotonAnadir } from "@/estilo/comun/piezas";
import { DibujoPlato } from "./dibujos";

// ES: Orden de la leyenda = números del dibujo (1 proteína … 6 bebida). · EN: Legend order = the drawing's numbers (1 protein … 6 drink).
const PARTES = [PLATO.proteina, PLATO.arroz, PLATO.frijoles, PLATO.guacamole, PLATO.tortillas, PLATO.bebida];

export function PlatoDelDia() {
  const { cafe, secciones, tx, precio } = useMotor();
  const { extra } = useAnimar();
  const plato = platoDestacado(cafe);
  if (!plato) return null;
  const sePuedePedir = secciones.pedido && typeof plato.precio === "number";

  return (
    <section id="plat-du-jour" className="plato-del-dia" aria-labelledby="titulo-plato">
      <div className="plato-del-dia__contenido">
        {/* ▸ El plato dibujado + la leyenda escrita a mano · The drawn dish + the handwritten legend */}
        <div className="plato-del-dia__dibujo">
          <DibujoPlato animar={extra} className="plato-del-dia__plato" />
          <ol className="plato-del-dia__partes">
            {PARTES.map((parte, i) => (
              <li key={i}>
                <span className="plato-del-dia__numero" aria-hidden="true">
                  {i + 1}
                </span>
                {tx(parte)}
              </li>
            ))}
          </ol>
        </div>

        {/* ▸ La tarjeta: antetítulo, nombre, descripción, precio a mano y Ajouter · The card */}
        <Aparece className="plato-del-dia__tarjeta">
          <p className="antetitulo">{tx(COPY.platoAntetitulo)}</p>
          <h2 id="titulo-plato" className="plato-del-dia__titulo">
            {tx(plato.nombre)}
          </h2>
          {plato.descripcion && <p className="plato-del-dia__descripcion">{tx(plato.descripcion)}</p>}
          <div className="plato-del-dia__pie">
            {typeof plato.precio === "number" && <span className="precio-mano precio-mano--grande">{precio(plato.precio)}</span>}
            {sePuedePedir && <BotonAnadir plato={plato} variante="texto" />}
          </div>
        </Aparece>
      </div>
    </section>
  );
}
