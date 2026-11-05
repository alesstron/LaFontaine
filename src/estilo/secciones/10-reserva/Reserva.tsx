"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · 10 Reserva / Booking · «prenez un fauteuil»
 *
 * ES: El rincón de los sillones de cuero coñac y la mesa baja negra del salón, sobre el suelo de hormigón. El
 *     formulario es la tarjeta de reserva que se deja en la mesa; al enviarlo se abre WhatsApp con la petición
 *     escrita (el café la confirma). Solo sale en premium y si hay WhatsApp en cafe.config.ts.
 * EN: The corner with the cognac leather armchairs and the room's low black table, on the concrete floor. The form is
 *     the reservation card left on the table; sending it opens WhatsApp with the request written (the café confirms
 *     it). Only shows on premium and if cafe.config.ts has a WhatsApp number.
 *
 *   Escritorio · Desktop (≥ 900 px)
 *   ┌──────────────────────────────────────────────────────────────────┐
 *   │                    ┌──────────────────────┐                      │
 *   │                    │ PRENEZ UN FAUTEUIL   │ ← tarjeta · card      │
 *   │                    │ Réserver une table   │                      │
 *   │                    │ NOM [____________]   │                      │
 *   │                    │ PERSONNES ( − 2 + )  │                      │
 *   │                    │ DATE [__] HEURE [__] │                      │
 *   │                    │ NOTE [____________]  │                      │
 *   │   ▟▀▙              │ ( DEMANDER LA RÉS. ) │              ▟▀▙     │ ← sillones · armchairs
 *   │   █▄▄▄╲            └──────────────────────┘            ╱▄▄▄█     │
 *   │   ╱   ╲                ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀                ╱   ╲     │ ← mesa baja · low table
 *   │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ ← suelo · floor (--sol)
 *   └──────────────────────────────────────────────────────────────────┘
 *   Móvil · Mobile: la tarjeta ocupa el ancho; sillones y mesa, pequeños, abajo.
 *
 * Dónde cambiar · Where to change:
 *   Quitar o poner las reservas ...... src/data/cafe.config.ts → funciones: { reserva: false } / contacto.whatsapp
 *   Horas que se pueden elegir ....... salen del horario (cafe.config.ts → horario), cada 30 min
 *   Antetítulo y textos del formulario src/estilo/ajustes/textos.ts → COPY.sillonesAntetitulo, menos, mas…
 *   Mensaje de WhatsApp .............. lo arma el motor (src/motor/proveedor.tsx → useReserva), no se toca aquí
 *   Escena, tarjeta, tamaños ......... reserva.css (esta carpeta) · campos: comun/piezas.css (.campo)
 *   Sillones y mesa (dibujo) ......... dibujos.tsx (esta carpeta · this folder)
 */
import { useReserva, useMotor } from "@/motor";
import { COPY } from "@/estilo/ajustes/textos";
import { Aparece } from "@/estilo/comun/animacion";
import { MesaBaja, Sillon } from "./dibujos";

export function Reserva() {
  const { t, tx, hora } = useMotor();
  // ES: Estado del formulario, validación y envío a WhatsApp (motor). · EN: Form state, validation and WhatsApp sending (engine).
  const r = useReserva();
  return (
    <section id="reserver" className="reserva" aria-labelledby="titulo-reserva">
      {/* ▸ La escena: sillón, mesa baja, sillón (decorativa) · The scene: armchair, low table, armchair (decorative) */}
      <div className="reserva__escena" aria-hidden="true">
        <Sillon className="reserva__sillon reserva__sillon--izq" />
        <MesaBaja className="reserva__mesa" />
        <Sillon espejo className="reserva__sillon reserva__sillon--der" />
      </div>

      {/* ▸ La tarjeta de reserva con el formulario · The reservation card with the form */}
      <Aparece className="reserva__tarjeta">
        <p className="antetitulo">{tx(COPY.sillonesAntetitulo)}</p>
        <h2 id="titulo-reserva" className="titulo-seccion">
          {t("reservar")}
        </h2>
        <form
          className="formulario"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            r.enviar();
          }}
        >
          {/* ▸ Nombre · Name */}
          <label className="campo">
            <span>{t("nombre")}</span>
            <input
              value={r.datos.nombre}
              onChange={(e) => r.cambiar("nombre", e.target.value)}
              maxLength={60}
              autoComplete="name"
              aria-invalid={Boolean(r.errores.nombre)}
              aria-describedby={r.errores.nombre ? "error-reserva-nombre" : undefined}
            />
            {r.errores.nombre && (
              <small id="error-reserva-nombre" className="campo__error">
                {r.errores.nombre}
              </small>
            )}
          </label>

          {/* ▸ Personas ( − 2 + ), de 1 a 20 · Guests ( − 2 + ), 1 to 20 */}
          <div className="campo">
            <span id="etiqueta-personas">{t("personas")}</span>
            <div className="contador" role="group" aria-labelledby="etiqueta-personas">
              <button type="button" aria-label={tx(COPY.menos)} onClick={() => r.cambiar("personas", Math.max(1, r.datos.personas - 1))} disabled={r.datos.personas <= 1}>
                −
              </button>
              <output aria-live="polite">{r.datos.personas}</output>
              <button type="button" aria-label={tx(COPY.mas)} onClick={() => r.cambiar("personas", Math.min(20, r.datos.personas + 1))} disabled={r.datos.personas >= 20}>
                +
              </button>
            </div>
          </div>

          {/* ▸ Fecha y hora (las horas dependen del día elegido) · Date and time (times depend on the chosen day) */}
          <div className="formulario__par">
            <label className="campo">
              <span>{t("fecha")}</span>
              <input
                type="date"
                min={r.hoy || undefined}
                value={r.datos.fecha}
                onChange={(e) => r.cambiar("fecha", e.target.value)}
                aria-invalid={Boolean(r.errores.fecha)}
                aria-describedby={r.errores.fecha ? "error-reserva-fecha" : undefined}
              />
              {r.errores.fecha && (
                <small id="error-reserva-fecha" className="campo__error">
                  {r.errores.fecha}
                </small>
              )}
            </label>
            <label className="campo">
              <span>{t("hora")}</span>
              <select
                value={r.datos.hora}
                onChange={(e) => r.cambiar("hora", e.target.value)}
                disabled={!r.datos.fecha || r.horas.length === 0}
                aria-invalid={Boolean(r.errores.hora)}
                aria-describedby={r.errores.hora ? "error-reserva-hora" : undefined}
              >
                {/* ES: Sin fecha: "elige la fecha"; día cerrado: "cerrado ese día". · EN: No date: "pick a date"; closed day: "closed that day". */}
                <option value="">{!r.datos.fecha ? tx(COPY.eligeFecha) : r.horas.length === 0 ? tx(COPY.sinHoras) : "—"}</option>
                {r.horas.map((h) => (
                  <option key={h} value={h}>
                    {hora(h)}
                  </option>
                ))}
              </select>
              {r.errores.hora && (
                <small id="error-reserva-hora" className="campo__error">
                  {r.errores.hora}
                </small>
              )}
            </label>
          </div>

          {/* ▸ Nota opcional · Optional note */}
          <label className="campo">
            <span>{t("nota")}</span>
            <textarea value={r.datos.nota} onChange={(e) => r.cambiar("nota", e.target.value)} maxLength={300} rows={2} />
          </label>

          <button type="submit" className="boton boton--taza boton--ancho">
            {t("enviarReserva")}
          </button>
          <p className="formulario__ayuda">{t("reservaAyuda")}</p>
        </form>
      </Aparece>
    </section>
  );
}
