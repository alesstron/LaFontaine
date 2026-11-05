"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · 09 Promociones / Promotions · «à l'affiche»
 *
 * ES: Cada promoción (o vernissage, concierto…) es un cartel de exposición pegado a la pared, con la fecha en una
 *     etiqueta salmón. Solo sale en premium y si hay promociones en cafe.config.ts (ahora no hay ninguna, así que
 *     esta sección está oculta; el ejemplo de cómo añadir una está en ese archivo).
 * EN: Each promotion (or opening, concert…) is an exhibition poster on the wall, with the date on a salmon label.
 *     Only shows on premium and if cafe.config.ts has promotions (there are none now, so this section is hidden;
 *     the example of how to add one is in that file).
 *
 *   ┌━━━━━━━━━━━━━━┐ ┌━━━━━━━━━━━━━━┐ ┌━━━━━━━━━━━━━━┐   ← banda oscura arriba · dark top band
 *   │ [foto]       │ │ [foto]       │ │              │
 *   │ VERNISSAGE   │ │ …            │ │ …            │   ← título · title
 *   │ [Jeudi 18 h] │ │              │ │              │   ← cuándo (etiqueta salmón) · when
 *   │ descripción  │ │              │ │              │
 *   └──────────────┘ └──────────────┘ └──────────────┘   (3 por fila desde 768 px · 3 per row from 768 px)
 *
 * Dónde cambiar · Where to change:
 *   Las promociones ...... src/data/cafe.config.ts → promos
 *   Aspecto del cartel ... promos.css (esta carpeta · this folder)
 */
import { useMotor } from "@/motor";
import { Aparece } from "@/estilo/comun/animacion";
import { Imagen } from "@/estilo/comun/piezas";

export function Promos() {
  const { cafe, tx, t } = useMotor();
  return (
    <section id="affiche" className="promos" aria-labelledby="titulo-promos">
      <Aparece className="promos__cabecera">
        <h2 id="titulo-promos" className="titulo-seccion">
          {t("promos")}
        </h2>
      </Aparece>
      <ul className="promos__lista">
        {cafe.promos!.map((p) => (
          <li key={p.id} className="promos__cartel">
            {p.foto && <Imagen foto={p.foto} sizes="(max-width: 767px) 90vw, 30vw" />}
            <h3>{tx(p.titulo)}</h3>
            {p.cuando && <p className="promos__cuando">{tx(p.cuando)}</p>}
            {p.descripcion && <p>{tx(p.descripcion)}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
