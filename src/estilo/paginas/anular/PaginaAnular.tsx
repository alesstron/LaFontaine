"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · Página para anular / Cancel page (/reserver/anular)
 *
 * ES: La página del enlace que recibe el cliente al reservar. Enseña su reserva en una tarjeta de papel y, si todavía
 *     no ha pasado la hora, el botón rojo taza para anularla (nada se anula solo por abrir el enlace). La lógica es
 *     del motor: useAnularReserva() lee el código y el secreto que van tras "#" en el enlace.
 * EN: The page of the link the guest gets when booking. It shows their booking on a paper card and, if the time has
 *     not passed yet, the red-cup button to cancel it (nothing is cancelled just by opening the link). The logic
 *     belongs to the engine: useAnularReserva() reads the code and secret that follow "#" in the link.
 *
 *   ┌──────────────────────────────────────┐
 *   │ VOTRE RÉSERVATION                    │ ← .antetitulo
 *   │ Annuler une réservation              │ ← .titulo-seccion (o «Réservation annulée»)
 *   │ ┌ CODE ............... 7KQ-3XA ┐     │ ← .ficha (paginas/marco.css)
 *   │ │ NOM ................. Marie  │     │
 *   │ │ DATE ..... mer. 12 novembre  │     │
 *   │ └──────────────────────────────┘     │
 *   │ Vous ne pourrez pas venir ? …        │ ← .pagina-anular__texto
 *   │ ( ANNULER LA RÉSERVATION ) ( GARDER )│ ← .pagina-anular__acciones
 *   └──────────────────────────────────────┘ ← .pagina-anular__tarjeta
 *
 * Dónde cambiar · Where to change:
 *   Textos ............. src/estilo/ajustes/textos.ts → COPY, grupo «Anular»
 *   Tarjeta ............ anular.css (esta carpeta · this folder)
 */
import { formatoFecha, useAnularReserva, useMotor } from "@/motor";
import { COPY } from "@/estilo/ajustes/textos";
import { Marco } from "../Marco";
import { ConTelefono, textoMotivo, textoPersonas } from "../mensajes";

export function PaginaAnular() {
  const m = useMotor();
  const { cafe, idioma, t, tx } = m;
  const a = useAnularReserva();
  const r = a.reserva;
  const anulada = a.estado === "anulada";

  return (
    <Marco clase="pagina-anular">
      <article className="pagina-anular__tarjeta" aria-labelledby="titulo-anular" aria-busy={a.estado === "leyendo"}>
        <p className="antetitulo">{tx(COPY.anularAntetitulo)}</p>
        <h1 id="titulo-anular" className="titulo-seccion">
          {anulada ? tx(COPY.anuladaTitulo) : t("anularReserva")}
        </h1>

        {/* ▸ Buscando la reserva · Looking up the booking */}
        {a.estado === "leyendo" && (
          <p className="pagina-anular__texto" role="status">
            {tx(COPY.leyendo)}
          </p>
        )}

        {/* ▸ La ficha de la reserva · The booking's card */}
        {r && (
          <dl className="ficha" data-anulada={anulada}>
            <div>
              <dt>{tx(COPY.codigoReserva)}</dt>
              <dd>{r.codigo}</dd>
            </div>
            <div>
              <dt>{t("nombre")}</dt>
              <dd>{r.nombre}</dd>
            </div>
            <div>
              <dt>{t("fecha")}</dt>
              <dd>{formatoFecha(r.fecha, idioma, cafe.region)}</dd>
            </div>
            <div>
              <dt>{t("hora")}</dt>
              <dd>{m.hora(r.hora)}</dd>
            </div>
            <div>
              <dt>{t("personas")}</dt>
              <dd>{textoPersonas(r.personas, m)}</dd>
            </div>
          </dl>
        )}

        {/* ▸ Lo que no salió · What did not work */}
        {a.motivo && (
          <p className="aviso pagina-anular__aviso" role="alert">
            <ConTelefono texto={textoMotivo(a.motivo, m, true)} telefono={cafe.contacto.telefono} />
          </p>
        )}

        {/* ▸ Anular o guardar · Cancel or keep */}
        {r && !anulada && r.anulable && (
          <>
            <p className="pagina-anular__texto">{tx(COPY.anularPregunta)}</p>
            <div className="pagina-anular__acciones">
              <button type="button" className="boton boton--taza" onClick={() => void a.anular()} disabled={a.estado === "anulando"}>
                {a.estado === "anulando" ? tx(COPY.anulando) : tx(COPY.anularBoton)}
              </button>
              <a className="boton boton--linea" href="/">
                {tx(COPY.mantener)}
              </a>
            </div>
          </>
        )}

        {/* ▸ Ya pasó la hora · The time has passed */}
        {r && !anulada && !r.anulable && !a.motivo && (
          <p className="aviso pagina-anular__aviso" role="status">
            {tx(COPY.motivoPasada)}
          </p>
        )}

        {/* ▸ Anulada: gracias y otra reserva · Cancelled: thanks and another booking */}
        {anulada && <p className="pagina-anular__texto">{tx(COPY.anuladaTexto)}</p>}
        {(anulada || a.estado === "fallo") && (
          <div className="pagina-anular__acciones">
            <a className="boton boton--taza" href="/reserver">
              {tx(COPY.nuevaReserva)}
            </a>
            <a className="boton boton--linea" href="/">
              {tx(COPY.volverWeb)}
            </a>
          </div>
        )}
      </article>
    </Marco>
  );
}
