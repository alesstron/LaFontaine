"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · Animación por gama / Motion by tier
 *
 * ES: Cuánto se mueve la página depende de la gama (src/data/cafe.config.ts → gama):
 * EN: How much the page moves depends on the tier (src/data/cafe.config.ts → gama):
 *
 *   Gama · Tier   scroll   extra   Qué pasa · What happens
 *   ───────────   ──────   ─────   ───────────────────────────────────────────────────────────────
 *   básica        no       no      Nada se mueve · Nothing moves
 *   estándar      sí       no      Los bloques aparecen al bajar (<Aparece>) · Blocks fade in on scroll
 *   premium       sí       sí      + mural, lámparas, plato, cuadros, bolsa (CSS de cada sección)
 *
 * ES: Las animaciones de CSS de premium se activan con data-anim="completa" en la raíz (Pagina.tsx) y se apagan
 *     solas con "reducir movimiento" del sistema. Para que algo nuevo aparezca al bajar, envuélvelo en <Aparece>.
 * EN: Premium CSS animations switch on with data-anim="completa" on the root (Pagina.tsx) and turn off by themselves
 *     with the system's "reduce motion". To make something new fade in on scroll, wrap it in <Aparece>.
 */
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useMotor } from "@/motor";

/** ES: { scroll, extra } según la gama (tabla de arriba). · EN: { scroll, extra } by tier (table above). */
export function useAnimar() {
  const { funciones } = useMotor();
  return { scroll: funciones.animaciones, extra: funciones.animacionesAvanzadas };
}

/**
 * ES: Bloque que aparece suave (sube 18 px y se hace visible) al entrar en pantalla, si la gama lo incluye.
 *     Sin animación en la gama, es un <div> normal.
 * EN: Block that fades in (rises 18 px and becomes visible) when it enters the screen, if the tier includes it.
 *     Without animation in the tier, it is a plain <div>.
 *
 *   Uso · Usage:  <Aparece className="mi-bloque" retraso={0.2}> … </Aparece>
 */
export function Aparece({ children, className, retraso = 0 }: { children: ReactNode; className?: string; retraso?: number }) {
  const { scroll } = useAnimar();
  if (!scroll) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: retraso }}
    >
      {children}
    </motion.div>
  );
}
