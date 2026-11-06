"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · Página de reserva / Booking page (/reserver) · «le coin des fauteuils»
 *
 * ES: La página que abren los botones «Réserver» de la web, en una pestaña nueva. Es el rincón de los sillones a
 *     tamaño de página: a la izquierda, el carnet de reservas del café con tres pasos (personas, día, hora); a la
 *     derecha, la tarjeta «Votre table» con el resumen, los datos (paso 4) y el botón rojo taza. Abajo, el suelo de
 *     hormigón con los dos sillones y la mesa baja. Al confirmar, carnet y tarjeta se cambian por el cartelito
 *     «Réservé» (Confirmacion.tsx). La lógica (plazas, validación, envío) es del motor: useReservaEnLinea().
 * EN: The page the website's «Réserver» buttons open, in a new tab. It is the armchair corner at page size: on the
 *     left, the café's booking notebook with three steps (people, day, time); on the right, the «Votre table» card
 *     with the summary, the details (step 4) and the red-cup button. At the bottom, the concrete floor with the two
 *     armchairs and the low table. Once confirmed, notebook and card are replaced by the «Réservé» card
 *     (Confirmacion.tsx). The logic (seats, validation, sending) belongs to the engine: useReservaEnLinea().
 *
 *   Escritorio · Desktop (≥ 900 px)
 *   ┌──────────────────────────────────────────────────────────────────────────┐
 *   │ PRENEZ UN FAUTEUIL · Réserver une table · frase                          │ ← .pagina-reserva__cabeza
 *   │ ┌ carnet ─────────────────────────────┐  ┌ ticket ────────────────────┐ │
 *   │ │ [1] COMBIEN DE PERSONNES ? ( − 2 + ) │  │ Votre table                │ │ ← .carnet · .ticket
 *   │ │ [2] QUEL JOUR ?  novembre 2026       │  │ PERSONNES ...... 2 pers.   │ │ ← .ficha
 *   │ │      L  M  M  J  V  S  D             │  │ DATE ........... mer. 12   │ │
 *   │ │      4  5  6  7  ·  …                │  │ [4] À QUEL NOM ?           │ │ ← Calendario.tsx
 *   │ │ [3] À QUELLE HEURE ?                 │  │ NOM [______] TÉL. [_____]  │ │
 *   │ │      (8 h)(8 h 30)(9 h)…             │  │ ( RÉSERVER LA TABLE )      │ │ ← Turnos.tsx · .boton--taza
 *   │ └──────────────────────────────────────┘  └────────────────────────────┘ │
 *   │      ▟▀▙              ▀▀▀▀▀▀▀▀▀▀▀              ▟▀▙                       │ ← .pagina-reserva__escena
 *   │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ ← suelo · floor (--sol)
 *   └──────────────────────────────────────────────────────────────────────────┘
 *   Móvil · Mobile: una columna: el carnet (1 · 2 · 3) y debajo el ticket (4 y el botón).
 *
 * Dónde cambiar · Where to change:
 *   Plazas, máximo de personas, días ..... src/data/cafe.config.ts → reservas
 *   Horas que salen ...................... src/data/cafe.config.ts → horario (cada `paso` min, hasta 1 h antes de cerrar)
 *   Textos de los pasos y del botón ...... src/estilo/ajustes/textos.ts → COPY, grupo «Página de reserva»
 *   Mensajes de error .................... src/estilo/ajustes/textos.ts → COPY.error…, COPY.motivo… (paginas/mensajes.tsx)
 *   Calendario · horas · confirmación .... Calendario.tsx · Turnos.tsx · Confirmacion.tsx (esta carpeta)
 *   Columnas, colores, suelo ............. reserva-pagina.css (esta carpeta · this folder)
 */
import { useEffect, useRef, type FormEvent } from "react";
import { LIMITES_RESERVA, formatoFecha, useMotor, useReservaEnLinea, type CampoReserva } from "@/motor";
import { COPY } from "@/estilo/ajustes/textos";
import { rellenar } from "@/estilo/comun/datos";
import { MesaBaja, Sillon } from "@/estilo/comun/dibujos";
import { Marco } from "../Marco";
import { ConTelefono, textoError, textoMotivo, textoPersonas } from "../mensajes";
import { Calendario } from "./Calendario";
import { Confirmacion } from "./Confirmacion";
import { Turnos } from "./Turnos";

export function PaginaReserva() {
  const m = useMotor();
  const { cafe, idioma, t, tx } = m;
  const r = useReservaEnLinea();
  const telefono = cafe.contacto.telefono;
  const formulario = useRef<HTMLFormElement>(null);
  // ES: Tras un envío con errores, el foco va al primer campo que falla (cuando React ya lo ha pintado).
  // EN: After a submit with errors, focus goes to the first failing field (once React has drawn it).
  const enfocarError = useRef(false);

  useEffect(() => {
    if (!enfocarError.current) return;
    enfocarError.current = false;
    formulario.current
      ?.querySelector<HTMLElement>('[aria-invalid="true"], fieldset[data-error="true"] input:not(:disabled)')
      ?.focus();
  }, [r.errores]);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    enfocarError.current = true;
    await r.enviar();
  };

  // ES: Mensaje bajo un campo, enlazado con aria-describedby. · EN: Message under a field, linked through aria-describedby.
  const error = (campo: CampoReserva) => {
    const codigo = r.errores[campo];
    return codigo ? (
      <small id={`error-${campo}`} className="campo__error">
        {textoError(campo, codigo, m)}
      </small>
    ) : null;
  };
  const describe = (campo: CampoReserva, ...otros: string[]) =>
    [...otros, r.errores[campo] ? `error-${campo}` : ""].filter(Boolean).join(" ") || undefined;

  // ES: Sin base de datos (o sin respuesta) antes de cargar nada: no hay calendario que enseñar.
  // EN: No database (or no answer) before anything loaded: there is no calendar to show.
  const sinServicio = !r.cargando && r.dias.length === 0 && (r.aviso === "sin-bd" || r.aviso === "bd-caida" || r.aviso === "error");

  return (
    <Marco clase="pagina-reserva">
      {/* ▸ Cabeza: antetítulo, título y frase · Head: overline, title and sentence */}
      <header className="pagina-reserva__cabeza">
        <p className="antetitulo">{tx(COPY.sillonesAntetitulo)}</p>
        <h1 className="titulo-seccion">{t("reservar")}</h1>
        {!r.confirmada && <p className="pagina-reserva__intro">{tx(COPY.reservaIntro)}</p>}
      </header>

      {r.confirmada ? (
        // ▸ Confirmada: el cartelito «Réservé» · Confirmed: the «Réservé» card
        <Confirmacion reserva={r.confirmada} enlace={r.enlaceAnular} otra={r.otraReserva} />
      ) : sinServicio && r.aviso ? (
        // ▸ Sin servicio: aviso con el teléfono y «Réessayer» · No service: notice with the phone and «Try again»
        <div className="pagina-reserva__sin-servicio">
          <p className="aviso" role="alert">
            <ConTelefono texto={textoMotivo(r.aviso, m, true)} telefono={telefono} />
          </p>
          {r.aviso !== "sin-bd" && (
            <button type="button" className="boton boton--linea" onClick={() => void r.recargar()}>
              {tx(COPY.reintentar)}
            </button>
          )}
        </div>
      ) : (
        <form ref={formulario} className="pagina-reserva__formulario" noValidate onSubmit={enviar} aria-busy={r.enviando}>
          {/* ▸ El carnet: pasos 1, 2 y 3 · The notebook: steps 1, 2 and 3 */}
          <div className="carnet">
            {/* ▸ 1 · Personas ( − 2 + ) · People */}
            <fieldset className="carnet__paso">
              <legend className="carnet__titulo">
                <span className="carnet__numero" aria-hidden="true">1</span>
                {tx(COPY.pasoPersonas)}
              </legend>
              <div className="contador">
                <button type="button" aria-label={tx(COPY.menos)} onClick={() => r.cambiarPersonas(r.personas - 1)} disabled={r.personas <= 1}>
                  −
                </button>
                <output aria-live="polite">{r.personas}</output>
                <button type="button" aria-label={tx(COPY.mas)} onClick={() => r.cambiarPersonas(r.personas + 1)} disabled={r.personas >= r.maxPersonas}>
                  +
                </button>
              </div>
              {telefono && (
                <p className="carnet__nota">
                  <ConTelefono texto={rellenar(tx(COPY.grupoGrande), { max: r.maxPersonas, telefono })} telefono={telefono} />
                </p>
              )}
            </fieldset>

            {/* ▸ 2 · Día (calendario) · Day (calendar) */}
            <fieldset className="carnet__paso" data-error={Boolean(r.errores.fecha)} aria-describedby={describe("fecha")}>
              <legend className="carnet__titulo">
                <span className="carnet__numero" aria-hidden="true">2</span>
                {tx(COPY.pasoDia)}
              </legend>
              {r.cargando ? (
                <p className="carnet__vacio" role="status">
                  {tx(COPY.cargandoPlazas)}
                </p>
              ) : (
                <Calendario dias={r.dias} hoy={r.hoy} fecha={r.fecha} elegir={r.elegirFecha} />
              )}
              {error("fecha")}
            </fieldset>

            {/* ▸ 3 · Hora (cápsulas) · Time (capsules) */}
            <fieldset className="carnet__paso" data-error={Boolean(r.errores.hora)} aria-describedby={describe("hora")}>
              <legend className="carnet__titulo">
                <span className="carnet__numero" aria-hidden="true">3</span>
                {tx(COPY.pasoHora)}
              </legend>
              {r.fecha ? <Turnos turnos={r.turnos} hora={r.hora} elegir={r.elegirHora} /> : <p className="carnet__vacio">{tx(COPY.eligeDia)}</p>}
              {error("hora")}
            </fieldset>
          </div>

          {/* ▸ El ticket «Votre table»: resumen, paso 4 y botón · The «Votre table» card: summary, step 4 and button */}
          <div className="ticket">
            <h2 className="ticket__titulo">{tx(COPY.resumenTitulo)}</h2>
            <dl className="ficha">
              <div>
                <dt>{t("personas")}</dt>
                <dd>{textoPersonas(r.personas, m)}</dd>
              </div>
              <div>
                <dt>{t("fecha")}</dt>
                <dd>{r.fecha ? formatoFecha(r.fecha, idioma, cafe.region) : "—"}</dd>
              </div>
              <div>
                <dt>{t("hora")}</dt>
                <dd>{r.hora ? m.hora(r.hora) : "—"}</dd>
              </div>
            </dl>

            {/* ▸ 4 · Nombre, teléfono y nota · Name, phone and note */}
            <fieldset className="ticket__datos">
              <legend className="carnet__titulo">
                <span className="carnet__numero" aria-hidden="true">4</span>
                {tx(COPY.pasoDatos)}
              </legend>
              <label className="campo">
                <span>{t("nombre")}</span>
                <input
                  value={r.contacto.nombre}
                  onChange={(e) => r.cambiar("nombre", e.target.value)}
                  maxLength={LIMITES_RESERVA.nombre}
                  autoComplete="name"
                  required
                  aria-invalid={Boolean(r.errores.nombre)}
                  aria-describedby={describe("nombre")}
                />
                {error("nombre")}
              </label>
              <label className="campo">
                <span>{tx(COPY.telefono)}</span>
                <input
                  type="tel"
                  inputMode="tel"
                  value={r.contacto.telefono}
                  onChange={(e) => r.cambiar("telefono", e.target.value)}
                  maxLength={LIMITES_RESERVA.telefono}
                  autoComplete="tel"
                  required
                  aria-invalid={Boolean(r.errores.telefono)}
                  aria-describedby={describe("telefono", "ayuda-telefono")}
                />
                <small id="ayuda-telefono" className="campo__ayuda">
                  {tx(COPY.telefonoAyuda)}
                </small>
                {error("telefono")}
              </label>
              <label className="campo">
                <span>{t("nota")}</span>
                <textarea
                  value={r.contacto.nota}
                  onChange={(e) => r.cambiar("nota", e.target.value)}
                  maxLength={LIMITES_RESERVA.nota}
                  rows={2}
                  placeholder={tx(COPY.notaReserva)}
                  aria-invalid={Boolean(r.errores.nota)}
                  aria-describedby={describe("nota")}
                />
                {error("nota")}
              </label>
              {/* ▸ Campo trampa: fuera de la pantalla; solo un robot lo rellena · Trap field: off-screen; only a bot fills it in */}
              <div className="ticket__trampa" aria-hidden="true">
                <label>
                  Ne pas remplir
                  <input tabIndex={-1} autoComplete="off" name="hp_sitio" value={r.contacto.web} onChange={(e) => r.cambiar("web", e.target.value)} />
                </label>
              </div>
            </fieldset>

            {/* ▸ Aviso de lo que no salió · Notice of what did not work */}
            {r.aviso && (
              <p className="aviso ticket__aviso" role="alert">
                <ConTelefono texto={textoMotivo(r.aviso, m, r.aviso !== "datos" && r.aviso !== "completo")} telefono={telefono} />
              </p>
            )}

            <button type="submit" className="boton boton--taza boton--ancho" disabled={r.enviando || r.cargando}>
              {r.enviando ? tx(COPY.enviando) : tx(COPY.reservarMesa)}
            </button>
            <p className="formulario__ayuda">{tx(COPY.privacidad)}</p>
          </div>
        </form>
      )}

      {/* ▸ Sin JavaScript no hay calendario: se ofrece el teléfono · Without JavaScript there is no calendar: the phone is offered */}
      <noscript>
        <p className="aviso pagina-reserva__sin-js">
          {tx(COPY.sinJs)} {telefono && rellenar(tx(COPY.llamarAl), { telefono })}
        </p>
      </noscript>

      {/* ▸ El suelo con los sillones y la mesa baja (decorativo) · The floor with the armchairs and the low table (decorative) */}
      <div className="pagina-reserva__escena" aria-hidden="true">
        <Sillon className="pagina-reserva__sillon pagina-reserva__sillon--izq" />
        <MesaBaja className="pagina-reserva__mesa" />
        <Sillon espejo className="pagina-reserva__sillon pagina-reserva__sillon--der" />
      </div>
    </Marco>
  );
}
