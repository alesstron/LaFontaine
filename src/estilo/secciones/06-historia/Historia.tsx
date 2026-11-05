"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · 06 Historia / Story · «le sac de jute»
 *
 * ES: El saco de yute que hay junto a la barra. Los párrafos van en una etiqueta de papel cosida al saco y los hitos
 *     son sellos de tinta, como los de los sacos de café. Un sello redondo lleva el nombre, la ciudad y la calle.
 *     Sale en las gamas estándar y premium, si hay historia en los datos.
 * EN: The burlap sack next to the counter. The paragraphs sit on a paper label sewn onto the sack and the milestones
 *     are ink stamps, like those on coffee sacks. A round stamp carries the name, the city and the street.
 *     Shows on the standard and premium tiers, if the data has a story.
 *
 *   Escritorio · Desktop (≥ 1024 px)
 *   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ← yute · burlap
 *   ░ ┌┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┐ ░░░░░░░░   ◯ CAFÉ LAFONTAINE   ░  ← sello redondo · round stamp
 *   ░ ┆ NOTRE HISTOIRE         ┆ ░░░░░░░░   ◯   Papineau        ░
 *   ░ ┆ Une perle cachée…      ┆ ░░░░░░░░   ◯   MONTRÉAL        ░
 *   ░ ┆ párrafo · paragraph    ┆ ░░░░░░  ╔═════════════════╗    ░  ← sellos de los hitos · milestone stamps
 *   ░ ┆ párrafo · paragraph    ┆ ░░░░░░  ║ 1998            ║    ░
 *   ░ └┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┘ ░░░░░░  ║ Café Grain d'Or ║    ░
 *   ░   ↑ etiqueta cosida · sewn label     ╚═════════════════╝    ░
 *   Móvil · Mobile: etiqueta arriba, sellos debajo · label on top, stamps below.
 *
 * Dónde cambiar · Where to change:
 *   Título, párrafos e hitos ........ src/data/cafe.config.ts → historia
 *   Texto del sello redondo ......... sale de marca.nombre, contacto.ciudad y la calle de contacto.direccion
 *   Textura del yute, sellos ........ historia.css (esta carpeta · this folder)
 *   Dibujo del sello redondo ........ dibujos.tsx (esta carpeta · this folder)
 */
import { useMotor } from "@/motor";
import { Aparece } from "@/estilo/comun/animacion";
import { SelloRedondo } from "./dibujos";

// ES: Inclinación de cada sello (se repite cada 4). · EN: Tilt of each stamp (repeats every 4).
const GIROS = [-2.5, 1.8, -1.2, 2.2];

export function Historia() {
  const { cafe, tx, t } = useMotor();
  const h = cafe.historia!;
  // ES: "3535, avenue Papineau, local 9" → "Papineau" para el centro del sello. · EN: "3535, avenue Papineau, local 9" → "Papineau" for the stamp's centre.
  const calle = cafe.contacto.direccion.split(",")[1]?.trim().split(" ").pop() ?? cafe.contacto.ciudad;
  return (
    <section id="histoire" className="historia" aria-labelledby="titulo-historia">
      <div className="historia__contenido">
        {/* ▸ La etiqueta de papel cosida, con el título y los párrafos · The sewn paper label, with title and paragraphs */}
        <Aparece className="historia__etiqueta">
          <p className="antetitulo">{t("historia")}</p>
          <h2 id="titulo-historia" className="titulo-seccion">
            {h.titulo ? tx(h.titulo) : t("historia")}
          </h2>
          {h.parrafos.map((p, i) => (
            <p key={i}>{tx(p)}</p>
          ))}
        </Aparece>

        {/* ▸ Los sellos: el redondo y uno por hito · The stamps: the round one and one per milestone */}
        <div className="historia__sellos">
          <SelloRedondo className="sello-redondo" arriba={cafe.marca.nombre} abajo={cafe.contacto.ciudad} centro={calle} />
          {h.hitos && h.hitos.length > 0 && (
            <ol className="sellos">
              {h.hitos.map((hito, i) => (
                <li key={i} className="sello" style={{ rotate: `${GIROS[i % GIROS.length]}deg` }}>
                  <span className="sello__anio">{tx(hito.anio)}</span>
                  {hito.titulo && <span className="sello__titulo">{tx(hito.titulo)}</span>}
                  <span className="sello__texto">{tx(hito.texto)}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}
