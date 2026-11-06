"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · Páginas de reservas · Marco común / Booking pages · Shared frame
 *
 * ES: Lo que comparten las tres páginas que no son el inicio (/reserver, /reserver/anular, /reserver/gestion): la
 *     cabecera en modo «página» (marca → inicio, e idiomas), el enlace «← Retour au site», el aviso de demo, el
 *     contenido de cada página y el pie de siempre. Como Pagina.tsx, pone data-anim según la gama y respeta
 *     «reducir movimiento». Las páginas solo reutilizan de secciones/ la cabecera y el pie.
 * EN: What the three non-home pages share (/reserver, /reserver/anular, /reserver/gestion): the header in «page»
 *     mode (brand → home, and languages), the «← Retour au site» link, the demo notice, each page's content and the
 *     usual footer. Like Pagina.tsx, it sets data-anim by tier and respects «reduce motion». Pages only reuse the
 *     header and the footer from secciones/.
 *
 *   ┌──────────────────────────────────────────────────────────────┐
 *   │ (◯) Café LaFontaine                             (FR EN ES)    │ ← Cabecera modo="pagina" (secciones/01-cabecera)
 *   └══════════════════════════════════════════════════════════════┘
 *   │ ← RETOUR AU SITE          [Maquette de démonstration : …]     │ ← .marco__barra: .marco__volver · .marco__demo
 *   │                                                               │
 *   │   contenido de la página · page content                       │ ← children, dentro de <main class="marco …">
 *   │                                                               │
 *   ├──────────────────────────────────────────────────────────────┤
 *   │ pie · footer                                                  │ ← Pie (secciones/12-pie)
 *   └──────────────────────────────────────────────────────────────┘
 *
 * Dónde cambiar · Where to change:
 *   Texto del enlace y del aviso ..... src/estilo/ajustes/textos.ts → COPY.volverWeb, COPY.demoReserva
 *   Aviso de demo (quitarlo) ......... src/data/cafe.config.ts → demo: false
 *   Aspecto de la barra .............. marco.css (esta carpeta · this folder)
 *   Cabecera y pie ................... secciones/01-cabecera (modo="pagina") y secciones/12-pie
 */
import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { useMotor } from "@/motor";
import { COPY } from "@/estilo/ajustes/textos";
import { useAnimar } from "@/estilo/comun/animacion";
import { Cabecera } from "@/estilo/secciones/01-cabecera/Cabecera";
import { Pie } from "@/estilo/secciones/12-pie/Pie";

/** ES: `clase` = el bloque CSS de la página (pagina-reserva, pagina-anular, pagina-gestion). · EN: `clase` = the page's CSS block. */
export function Marco({ clase, children }: { clase: string; children: ReactNode }) {
  const { cafe, tx } = useMotor();
  const { scroll, extra } = useAnimar();
  return (
    // ES: reducedMotion="user": framer-motion respeta "reducir movimiento" del sistema. · EN: framer-motion respects the system's "reduce motion".
    <MotionConfig reducedMotion="user">
      <div className="piel" data-anim={extra ? "completa" : scroll ? "scroll" : "ninguna"}>
        <Cabecera modo="pagina" />
        <main id="contenido" className={`marco ${clase}`}>
          {/* ▸ Volver a la web y aviso de demo · Back to the site and demo notice */}
          <div className="marco__barra">
            <a className="marco__volver" href="/">
              <span aria-hidden="true">←</span> {tx(COPY.volverWeb)}
            </a>
            {cafe.demo && <p className="marco__demo">{tx(COPY.demoReserva)}</p>}
          </div>
          {children}
        </main>
        <Pie />
      </div>
    </MotionConfig>
  );
}
