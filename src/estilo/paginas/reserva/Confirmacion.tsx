"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · Página de reserva · Confirmación / Booking page · Confirmation
 *
 * ES: Lo que se ve al confirmar: el cartelito «Réservé» que el café pone en la mesa, con el nombre, el día, la hora y
 *     el código en una etiqueta salmón; debajo, el enlace para anular (solo se muestra esta vez) con su botón de
 *     copiar, y los botones para hacer otra reserva o volver a la web. Al aparecer, el foco va al título para que los
 *     lectores de pantalla lo anuncien.
 * EN: What shows once confirmed: the little «Réservé» card the café sets on the table, with the name, day, time and
 *     the code on a salmon label; below, the cancel link (only shown this once) with its copy button, and the buttons
 *     to make another booking or go back to the site. When it appears, focus moves to the heading so screen readers
 *     announce it.
 *
 *   ┌─────────────────────────────────────┐
 *   │ ═════════ R É S E R V É ═════════   │ ← .chevalet__rotulo (granate · maroon)
 *   │        À bientôt, Marie !           │ ← .chevalet__titulo
 *   │ 2 personnes · mercredi 12 nov. · 9 h│ ← .chevalet__detalle
 *   │ Votre code : [7KQ-3XA]              │ ← .chevalet__etiqueta (salmón, a mano · salmon, handwritten)
 *   └─────────────────────────────────────┘ ← .chevalet__carton
 *   ┌ Un empêchement ? Ce lien… ──────────┐
 *   │ [https://…/reserver/anular#…] (COPIER)│ ← .chevalet__enlace
 *   └─────────────────────────────────────┘
 *   ( FAIRE UNE AUTRE RÉSERVATION ) ( RETOUR AU SITE )   ← .chevalet__acciones
 *
 * Dónde cambiar · Where to change:
 *   Textos ............... src/estilo/ajustes/textos.ts → COPY.reservado, confirmadaTitulo, enlaceAnularTexto…
 *   Aspecto del cartel ... reserva-pagina.css → .chevalet… (esta carpeta · this folder)
 */
import { useEffect, useRef, useState } from "react";
import { formatoFecha, useMotor, type ReservaConfirmada } from "@/motor";
import { COPY } from "@/estilo/ajustes/textos";
import { rellenar } from "@/estilo/comun/datos";
import { textoPersonas } from "../mensajes";

export function Confirmacion({ reserva, enlace, otra }: { reserva: ReservaConfirmada; enlace: string; otra: () => void }) {
  const m = useMotor();
  const { cafe, idioma, tx } = m;
  const titulo = useRef<HTMLHeadingElement>(null);
  const campo = useRef<HTMLInputElement>(null);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => titulo.current?.focus(), []);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(enlace);
      setCopiado(true);
    } catch {
      // ES: Sin permiso para el portapapeles: se deja el enlace seleccionado para copiarlo a mano.
      // EN: No clipboard permission: the link is left selected to copy it by hand.
      campo.current?.select();
    }
  };

  return (
    <section className="chevalet" aria-labelledby="titulo-confirmada">
      {/* ▸ El cartelito «Réservé» · The «Réservé» card */}
      <div className="chevalet__carton">
        <p className="chevalet__rotulo" aria-hidden="true">
          {tx(COPY.reservado)}
        </p>
        <h2 id="titulo-confirmada" ref={titulo} tabIndex={-1} className="chevalet__titulo">
          {rellenar(tx(COPY.confirmadaTitulo), { nombre: reserva.nombre })}
        </h2>
        <p className="chevalet__detalle">
          {textoPersonas(reserva.personas, m)} · {formatoFecha(reserva.fecha, idioma, cafe.region)} · {m.hora(reserva.hora)}
        </p>
        <p className="chevalet__codigo">
          {tx(COPY.confirmadaTexto)} <strong className="chevalet__etiqueta">{reserva.codigo}</strong>
        </p>
      </div>

      {/* ▸ Enlace para anular (solo se ve esta vez) · Cancel link (only shown this once) */}
      <div className="chevalet__enlace">
        <p>{tx(COPY.enlaceAnularTexto)}</p>
        <label className="campo">
          <span>{tx(COPY.enlaceAnular)}</span>
          <input ref={campo} readOnly value={enlace} onFocus={(e) => e.currentTarget.select()} />
        </label>
        <button type="button" className="boton boton--linea" onClick={copiar}>
          {copiado ? tx(COPY.copiado) : tx(COPY.copiarEnlace)}
        </button>
        <span className="sr" aria-live="polite">
          {copiado ? tx(COPY.copiado) : ""}
        </span>
      </div>

      {/* ▸ Otra reserva o volver · Another booking or back */}
      <div className="chevalet__acciones">
        <button type="button" className="boton boton--taza" onClick={otra}>
          {tx(COPY.otraReserva)}
        </button>
        <a className="boton boton--linea" href="/">
          {tx(COPY.volverWeb)}
        </a>
      </div>
    </section>
  );
}
