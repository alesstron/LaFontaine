"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · Panel del café · Un día / Café panel · One day
 *
 * ES: Una página de la libreta de reservas: el día, cuántas reservas y personas tiene, y sus horas. Cada hora lleva
 *     su ocupación («4 / 12 places» y una barra que se pone roja al llenarse) y debajo sus reservas, con el teléfono
 *     para llamar, la nota, el origen (en línea o teléfono), el código y el botón para anular o restaurar.
 * EN: One page of the booking notebook: the day, how many bookings and people it has, and its times. Each time shows
 *     its occupancy («4 / 12 places» and a bar that turns red when full) and its bookings below, with the phone to
 *     call, the note, the source (online or phone), the code and the button to cancel or restore.
 *
 *   Mercredi 4 novembre 2026  [Aujourd'hui]          2 réservations · 6 personnes   ← .libreta__cabeza
 *   ────────────────────────────────────────────────────────────────────────────
 *   8 h 30   4 / 12 places  ▮▮▮▮▯▯▯▯▯▯▯▯                                          ← .libreta__hora · .libreta__barra
 *     Marie · 2 personnes                                         ( ANNULER )    ← .apunte
 *     514 555 0101 · en ligne · 7KQ-3XA
 *     Anniversaire                                                               ← .apunte__nota
 *
 * Dónde cambiar · Where to change:
 *   Textos ............... src/estilo/ajustes/textos.ts → COPY, grupo «Panel del café»
 *   Aspecto .............. gestion.css (esta carpeta · this folder)
 */
import { formatoFecha, urlTelefono, useMotor, type DiaPanel, type ReservaPanel } from "@/motor";
import { COPY } from "@/estilo/ajustes/textos";
import { rellenar } from "@/estilo/comun/datos";
import { textoPersonas, textoReservas } from "../mensajes";

interface Acciones {
  enCurso: number | null;
  anular: (id: number) => void;
  restaurar: (id: number) => void;
}

export function ListaDia({ dia, hoy, plazas, ...acciones }: { dia: DiaPanel; hoy: string; plazas: number } & Acciones) {
  const m = useMotor();
  const { cafe, idioma, t, tx } = m;
  return (
    <section className="libreta__dia" aria-labelledby={`dia-${dia.fecha}`} data-vacio={dia.turnos.length === 0}>
      {/* ▸ Cabeza del día · Day head */}
      <header className="libreta__cabeza">
        <h2 id={`dia-${dia.fecha}`} className="libreta__fecha">
          {formatoFecha(dia.fecha, idioma, cafe.region)}
          {dia.fecha === hoy && <span className="libreta__hoy">{t("hoy")}</span>}
        </h2>
        <p className="libreta__resumen">
          {dia.confirmadas ? `${textoReservas(dia.confirmadas, m)} · ${textoPersonas(dia.personas, m)}` : tx(COPY.sinReservas)}
        </p>
      </header>

      {/* ▸ Las horas con sus reservas · The times with their bookings */}
      {dia.turnos.length > 0 && (
        <ol className="libreta__turnos">
          {dia.turnos.map((turno) => (
            <li key={turno.hora} className="libreta__turno">
              <p className="libreta__hora">
                <span className="libreta__reloj">{m.hora(turno.hora)}</span>
                <span>{rellenar(tx(COPY.plazasTurno), { ocupadas: turno.ocupadas, total: plazas })}</span>
                <span className="libreta__barra" data-lleno={turno.ocupadas >= plazas} aria-hidden="true">
                  <span style={{ inlineSize: `${Math.min(100, (turno.ocupadas / Math.max(1, plazas)) * 100)}%` }} />
                </span>
              </p>
              <ul className="libreta__apuntes">
                {turno.reservas.map((r) => (
                  <Apunte key={r.id} reserva={r} {...acciones} />
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

/** ES: Una reserva apuntada en la libreta. · EN: One booking written in the notebook. */
function Apunte({ reserva: r, enCurso, anular, restaurar }: { reserva: ReservaPanel } & Acciones) {
  const m = useMotor();
  const { tx } = m;
  const anulada = r.estado === "anulada";
  const accion = anulada ? tx(COPY.restaurar) : tx(COPY.anularCorto);
  const porQuien = r.anuladaPor === "cliente" ? tx(COPY.anuladaPorCliente) : r.anuladaPor === "cafe" ? tx(COPY.anuladaPorCafe) : "";
  return (
    <li className="apunte" data-estado={r.estado}>
      <div className="apunte__texto">
        <p className="apunte__nombre">
          {r.nombre} <span className="apunte__personas">· {textoPersonas(r.personas, m)}</span>
        </p>
        <p className="apunte__detalle">
          <a href={urlTelefono(r.telefono)}>{r.telefono}</a> · {r.origen === "web" ? tx(COPY.origenWeb) : tx(COPY.origenTelefono)} ·{" "}
          <span className="apunte__codigo">{r.codigo}</span>
        </p>
        {r.nota && <p className="apunte__nota">{r.nota}</p>}
        {anulada && (
          <p className="apunte__anulada">
            {tx(COPY.anulada)} {porQuien}
          </p>
        )}
      </div>
      <button
        type="button"
        className="boton boton--linea apunte__accion"
        disabled={enCurso === r.id}
        onClick={() => (anulada ? restaurar(r.id) : anular(r.id))}
        aria-label={`${accion}, ${r.nombre}, ${m.hora(r.hora)}`}
      >
        {accion}
      </button>
    </li>
  );
}
