"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · 03 Mostrador / Counter · «au comptoir»
 *
 * ES: Franja bajo la portada con los silos de café en grano del mostrador: frente de latón acolchado, pomo cromado y
 *     etiqueta salmón escrita a mano. Los silos se dibujan solo con CSS (mostrador.css), sin imágenes.
 * EN: Strip under the hero with the counter's coffee bean bins: quilted brass front, chrome knob and handwritten
 *     salmon label. The bins are drawn with CSS only (mostrador.css), no images.
 *
 *   Escritorio · Desktop (≥ 1024 px)                     Móvil · Mobile
 *   ┌─────────────────────────────────────────────────┐  ┌───────────────────────────┐
 *   │ AU COMPTOIR          ▄▄▄▄  ▄▄▄▄  ▄▄▄▄  ▄▄▄▄      │  │ AU COMPTOIR               │
 *   │ Les grains de la     █GD█  █MM█  █  █  █EG█  ← etiquetas · labels           │
 *   │ maison attendent…    ▒◉▒▒  ▒◉▒▒  ▒◉▒▒  ▒◉▒▒  ← latón y pomo · brass & knob  │
 *   │ ════════════════════════════════════════════ ← estante · shelf             │
 *   └─────────────────────────────────────────────────┘  └───────────────────────────┘
 *
 *   Un silo · One bin:  .silo__tapa (tapa negra con borde de latón)
 *                       .silo__ventana (cristal oscuro) > .silo__etiqueta (salmón, a mano)
 *                       .silo__frente (latón acolchado) > .silo__pomo (cromo)
 *
 * Dónde cambiar · Where to change:
 *   Nombres de las etiquetas / cuántos silos .. src/estilo/ajustes/textos.ts → SILOS (null = sin etiqueta)
 *   Antetítulo y frase ........................ src/estilo/ajustes/textos.ts → COPY.comptoirAntetitulo / comptoirTexto
 *   Colores del latón, tamaños, estante ....... mostrador.css (esta carpeta · this folder)
 */
import { useMotor } from "@/motor";
import { COPY, SILOS } from "@/estilo/ajustes/textos";
import { Aparece } from "@/estilo/comun/animacion";

export function Mostrador() {
  const { tx } = useMotor();
  return (
    <section className="mostrador" aria-labelledby="titulo-mostrador">
      {/* ▸ Antetítulo y frase · Overline and sentence */}
      <Aparece className="mostrador__texto">
        <h2 id="titulo-mostrador" className="antetitulo">
          {tx(COPY.comptoirAntetitulo)}
        </h2>
        <p>{tx(COPY.comptoirTexto)}</p>
      </Aparece>

      {/* ▸ Los silos sobre el estante · The bins on the shelf */}
      <div className="mostrador__estante">
        <ul className="silos">
          {SILOS.map((etiqueta, i) => (
            <li key={i} className="silo" aria-hidden={etiqueta ? undefined : true}>
              <span className="silo__tapa" aria-hidden="true" />
              <span className="silo__ventana">{etiqueta && <span className="silo__etiqueta">{etiqueta}</span>}</span>
              <span className="silo__frente" aria-hidden="true">
                <span className="silo__pomo" />
              </span>
            </li>
          ))}
        </ul>
        <div className="mostrador__tabla" aria-hidden="true" />
      </div>
    </section>
  );
}
