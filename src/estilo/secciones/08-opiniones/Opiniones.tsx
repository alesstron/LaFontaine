"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · 08 Opiniones / Reviews · «le livre d'or»
 *
 * ES: El libro de visitas de una exposición, abierto sobre la mesa oscura. Página izquierda: la nota, el total y los
 *     temas que más se repiten en Google. Página derecha: resúmenes escritos a mano, firmados como "resumen de las
 *     opiniones" (no son citas con nombre). Cinta granate de marcapáginas. Sale en estándar y premium.
 * EN: An exhibition guestbook, open on the dark table. Left page: the rating, the total and the topics that come up
 *     most on Google. Right page: handwritten summaries, signed as "summary of reviews" (they are not named
 *     quotes). Maroon ribbon bookmark. Shows on standard and premium.
 *
 *   Escritorio · Desktop (≥ 900 px)
 *   ████████████████████████████████████████████████████████████  ← mesa oscura · dark table (.opiniones)
 *   █  ┌────────────────────────┬─────────────────────────┐▌  █      ▌ cinta · ribbon
 *   █  │ AVIS                   │  Un accueil chaleureux… │   █
 *   █  │ Le livre d'or          │  — Résumé des avis      │   █  ← notas a mano · handwritten notes
 *   █  │ 4,8 ☆☆☆☆☆             │  Une cuisine mexicaine… │   █
 *   █  │ 104 avis Google        │  — Résumé des avis      │   █
 *   █  │ CE QUI REVIENT LE PLUS │  …                      │   █
 *   █  │ cuisine mexicaine  7 m.│  LIRE LES AVIS ↗        │   █
 *   █  └────────────────────────┴─────────────────────────┘   █  ← renglones y lomo · ruled lines and spine
 *   Móvil · Mobile: una sola página, la derecha debajo · a single page, the right one below.
 *
 * Dónde cambiar · Where to change:
 *   Nota, total, temas, resúmenes, enlace .. src/data/cafe.config.ts → resenas
 *   Título del libro, subtítulo, enlace ...... src/estilo/ajustes/textos.ts → COPY.libroTitulo / libroTemas / verOpiniones
 *   Colores de tinta, renglones, cinta ....... opiniones.css (esta carpeta · this folder)
 *   Estrellas ................................ dibujos.tsx (esta carpeta · this folder)
 */
import { motion } from "framer-motion";
import { useMotor } from "@/motor";
import { COPY } from "@/estilo/ajustes/textos";
import { Aparece, useAnimar } from "@/estilo/comun/animacion";
import { numero, rellenar } from "@/estilo/comun/datos";
import { Flecha } from "@/estilo/comun/dibujos";
import { EstrellaNota } from "./dibujos";

export function Opiniones() {
  const { cafe, locale, tx, t } = useMotor();
  const { scroll } = useAnimar();
  const r = cafe.resenas!;
  const nota = numero(r.nota, locale);
  return (
    <section id="avis" className="opiniones" aria-labelledby="titulo-opiniones">
      <Aparece className="libro">
        {/* ▸ Cinta granate de marcapáginas · Maroon ribbon bookmark */}
        <span className="libro__cinta" aria-hidden="true" />

        {/* ▸ Página izquierda: nota, total y temas · Left page: rating, total and topics */}
        <div className="libro__pagina libro__pagina--izq">
          <p className="antetitulo">{t("resenas")}</p>
          <h2 id="titulo-opiniones" className="titulo-seccion">
            {tx(COPY.libroTitulo)}
          </h2>
          <p className="libro__nota" aria-label={rellenar(tx(COPY.estrellas), { nota })}>
            <span className="libro__cifra" aria-hidden="true">
              {nota}
            </span>
            <span className="libro__estrellas" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <EstrellaNota key={i} parte={r.nota - i} />
              ))}
            </span>
          </p>
          <p className="libro__total">{t("resenasTotal", { total: r.total.toLocaleString(locale), fuente: r.fuente })}</p>
          {r.temas && r.temas.length > 0 && (
            <>
              <h3 className="libro__subtitulo">{tx(COPY.libroTemas)}</h3>
              <ul className="libro__temas">
                {r.temas.map((tema, i) => (
                  <li key={i}>
                    <span className="libro__tema">{tx(tema.nombre)}</span>
                    <span className="libro__menciones">{t("menciones", { n: tema.menciones })}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* ▸ Página derecha: resúmenes a mano (aparecen uno a uno con animación) · Right page: handwritten summaries */}
        <div className="libro__pagina libro__pagina--der">
          {r.destacadas?.map((d, i) => (
            <motion.blockquote
              key={i}
              className="nota-mano"
              initial={scroll ? { opacity: 0, y: 10 } : false}
              whileInView={scroll ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.25, duration: 0.5 }}
            >
              <p>{tx(d.texto)}</p>
              {/* ES: Sin autor = resumen de varias opiniones (nunca una cita inventada). · EN: No author = a summary of several reviews (never a made-up quote). */}
              <footer>— {d.autor ?? t("resenasResumen", { fuente: r.fuente })}</footer>
            </motion.blockquote>
          ))}
          {r.url && (
            <a className="libro__enlace" href={r.url} target="_blank" rel="noopener noreferrer">
              {tx(COPY.verOpiniones)}
              <Flecha className="icono" />
            </a>
          )}
        </div>
      </Aparece>
    </section>
  );
}
