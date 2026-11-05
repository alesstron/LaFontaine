"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · 07 Galería / Gallery · «l'expo»
 *
 * ES: El café expone arte, así que las fotos se cuelgan como en una exposición: barra de colgar, cordón en V, marco
 *     negro con paspartú blanco y cartela numerada con la descripción y el autor. En el móvil la pared se recorre de
 *     lado (sin mover la página); en premium los cuadros se balancean al pasar el ratón. Sale en estándar y premium
 *     con 3 fotos o más.
 * EN: The café exhibits art, so the photos hang as in an exhibition: hanging rail, V cord, black frame with a white
 *     mat and a numbered label card with the description and the author. On mobile the wall scrolls sideways
 *     (without moving the page); on premium the frames swing on hover. Shows on standard and premium with 3+ photos.
 *
 *   Escritorio · Desktop (≥ 768 px: 3 por fila · 3 per row; ≥ 1280 px: 4)
 *   ════════════════════╤═════════════════════╤═════════════════════╤════════  ← barra · rail (.cuadro::before)
 *          ╱╲                    ╱╲                    ╱╲                     ← cordón · cord (.cuadro__cordon)
 *   ┌───────────────┐    ┌───────────────┐    ┌───────────────┐
 *   │ ┌───────────┐ │    │ ┌───────────┐ │    │ ┌───────────┐ │               ← marco + paspartú · frame + mat
 *   │ │   foto    │ │    │ │   foto    │ │    │ │   foto    │ │
 *   │ └───────────┘ │    │ └───────────┘ │    │ └───────────┘ │
 *   └───────────────┘    └───────────────┘    └───────────────┘
 *   ┌ N° 01 ────────┐    ┌ N° 02 ────────┐    ┌ N° 03 ────────┐               ← cartela (comun/piezas.css)
 *   │ Tasse rouge…  │    │ Déjeuner…     │    │ Un barista…   │
 *   │ Photo : …     │    │ Photo : …     │    │ Photo : …     │
 *
 * Dónde cambiar · Where to change:
 *   Qué fotos y en qué orden ......... src/data/cafe.config.ts → galeria (la descripción de la cartela = alt)
 *   Antetítulo, frase y nota ......... src/estilo/ajustes/textos.ts → COPY.expoAntetitulo / expoTexto / expoNota
 *   Cuántas por fila, recorte, marco . galeria.css (esta carpeta · this folder)
 */
import { useMotor } from "@/motor";
import { COPY } from "@/estilo/ajustes/textos";
import { Aparece } from "@/estilo/comun/animacion";
import { Imagen } from "@/estilo/comun/piezas";

export function Galeria() {
  const { cafe, tx, t } = useMotor();
  return (
    <section id="expo" className="galeria" aria-labelledby="titulo-galeria">
      {/* ▸ Antetítulo, título y frase · Overline, heading and sentence */}
      <Aparece className="galeria__cabecera">
        <p className="antetitulo">{tx(COPY.expoAntetitulo)}</p>
        <h2 id="titulo-galeria" className="titulo-seccion">
          {t("galeria")}
        </h2>
        <p className="galeria__texto">{tx(COPY.expoTexto)}</p>
      </Aparece>

      {/* ▸ La pared de cuadros (tabIndex: se puede recorrer con el teclado en el móvil) · The wall of frames (keyboard-scrollable on mobile) */}
      <ul className="galeria__muro" tabIndex={0} aria-label={t("galeria")}>
        {cafe.galeria!.map((f, i) => (
          <li key={f.src} className="cuadro" data-forma={f.alto > f.ancho ? "vertical" : "horizontal"}>
            <figure>
              {/* ES: Cordón en V desde la barra hasta el marco. · EN: V cord from the rail to the frame. */}
              <svg className="cuadro__cordon" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
                <path d="M4 30 L50 1 L96 30" />
              </svg>
              <div className="cuadro__marco">
                <div className="cuadro__paspartu">
                  <Imagen foto={f} sizes="(max-width: 767px) 72vw, (max-width: 1279px) 30vw, 22vw" />
                </div>
              </div>
              {/* ES: Cartela: número, descripción (el alt de la foto) y autor (o el café si es suya). · EN: Label card: number, description (the photo's alt) and author (or the café if it is theirs). */}
              <figcaption className="cartela">
                <span className="cartela__numero">
                  {tx(COPY.numero)} {String(i + 1).padStart(2, "0")}
                </span>
                <span className="cartela__titulo">{tx(f.alt)}</span>
                <span className="cartela__autor">{t("fotoDe", { autor: f.autor ?? cafe.marca.nombre })}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <p className="galeria__nota">{tx(COPY.expoNota)}</p>
    </section>
  );
}
