"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · Panel del café / Café panel (/reserver/gestion)
 *
 * ES: El panel donde el café ve y gestiona sus reservas, con contraseña. Sin sesión, la tarjeta para entrar
 *     (Entrar.tsx). Con sesión: el estado de la base de datos, la semana de reservas (siete días desde hoy, con
 *     flechas para cambiar de semana), el formulario para apuntar las del teléfono (NuevaReserva.tsx) y un día por
 *     página de libreta (ListaDia.tsx). Se refresca solo cada 2 minutos. La lógica es del motor: usePanelReservas().
 * EN: The password-protected panel where the café sees and manages its bookings. Without a session, the sign-in card
 *     (Entrar.tsx). With one: the database status, the week of bookings (seven days from today, with arrows to change
 *     week), the form to record phone bookings (NuevaReserva.tsx) and one day per notebook page (ListaDia.tsx). It
 *     refreshes by itself every 2 minutes. The logic belongs to the engine: usePanelReservas().
 *
 *   ESPACE DU CAFÉ
 *   Réservations · gestion                                              ( QUITTER )   ← .gestion__cabeza
 *   Base de données : [connectée] · PGlite, sur cet ordinateur · Réservations : 12    ← .gestion__estado
 *   ( ‹ ) Du mer. 4 nov. au mar. 10 nov. ( › ) ( AUJOURD'HUI ) ( ACTUALISER ) ( + AJOUTER )  ← .gestion__barra
 *   ┌ formulario del teléfono (al pulsar «Ajouter») ┐                                  ← NuevaReserva.tsx
 *   ┌ Mercredi 4 novembre … ┐  ┌ Jeudi 5 novembre … ┐  …                             ← ListaDia.tsx (.libreta)
 *
 * Dónde cambiar · Where to change:
 *   Contraseña ............... variable RESERVAS_CLAVE (ver docs/RESERVAS.md)
 *   Plazas por turno ......... src/data/cafe.config.ts → reservas.plazasPorTurno
 *   Textos ................... src/estilo/ajustes/textos.ts → COPY, grupo «Panel del café»
 *   Aspecto .................. gestion.css (esta carpeta · this folder)
 */
import { useState } from "react";
import { usePanelReservas, useMotor, type EstadoBaseDeDatos, type ValorPanel } from "@/motor";
import { COPY } from "@/estilo/ajustes/textos";
import { rellenar } from "@/estilo/comun/datos";
import { Marco } from "../Marco";
import { textoMotivo } from "../mensajes";
import { Entrar } from "./Entrar";
import { ListaDia } from "./ListaDia";
import { NuevaReserva } from "./NuevaReserva";

/**
 * ES: `entrado` y `claveLista` los calcula el servidor (src/app/reserver/gestion/page.tsx).
 * EN: `entrado` and `claveLista` are worked out by the server (src/app/reserver/gestion/page.tsx).
 */
export function PaginaGestion({ entrado, claveLista }: { entrado: boolean; claveLista: boolean }) {
  const panel = usePanelReservas(entrado);
  return (
    <Marco clase="pagina-gestion">
      {panel.entrado ? <Panel panel={panel} /> : <Entrar panel={panel} claveLista={claveLista} />}
    </Marco>
  );
}

function Panel({ panel }: { panel: ValorPanel }) {
  const m = useMotor();
  const { locale, t, tx } = m;
  const [anadiendo, setAnadiendo] = useState(false);
  const corta = new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
  const fechaCorta = (iso: string) => corta.format(new Date(`${iso}T00:00:00Z`));
  const hasta = panel.dias.length ? panel.dias[panel.dias.length - 1].fecha : "";

  return (
    <div className="gestion">
      {/* ▸ Título y «Quitter» · Title and «Sign out» */}
      <header className="gestion__cabeza">
        <div>
          <p className="antetitulo">{tx(COPY.panelAntetitulo)}</p>
          <h1 className="titulo-seccion">{t("panelReservas")}</h1>
        </div>
        <button type="button" className="boton boton--linea" onClick={() => void panel.salir()}>
          {tx(COPY.salir)}
        </button>
      </header>

      {/* ▸ Estado de la base de datos · Database status */}
      {panel.base && <EstadoBase base={panel.base} />}

      {panel.base?.conectada && (
        <>
          {/* ▸ Semana: flechas, hoy, actualizar y añadir · Week: arrows, today, refresh and add */}
          <div className="gestion__barra">
            <div className="gestion__semana">
              <button type="button" className="gestion__flecha" onClick={panel.semanaAnterior} aria-label={tx(COPY.semanaAnterior)}>
                ‹
              </button>
              <p className="gestion__rango" aria-live="polite">
                {panel.desde && hasta ? rellenar(tx(COPY.semanaDel), { desde: fechaCorta(panel.desde), hasta: fechaCorta(hasta) }) : ""}
              </p>
              <button type="button" className="gestion__flecha" onClick={panel.semanaSiguiente} aria-label={tx(COPY.semanaSiguiente)}>
                ›
              </button>
            </div>
            <div className="gestion__botones">
              <button type="button" className="boton boton--linea" onClick={panel.irAHoy} disabled={panel.desde === panel.hoy}>
                {t("hoy")}
              </button>
              <button type="button" className="boton boton--linea" onClick={() => void panel.recargar()} disabled={panel.cargando}>
                {tx(COPY.actualizar)}
              </button>
              <button type="button" className="boton boton--taza" onClick={() => setAnadiendo(true)} aria-expanded={anadiendo}>
                + {tx(COPY.anadirReserva)}
              </button>
            </div>
          </div>

          {/* ▸ Formulario del teléfono · Phone form */}
          {anadiendo && <NuevaReserva panel={panel} cerrar={() => setAnadiendo(false)} />}

          {/* ▸ Aviso de lo que no salió · Notice of what did not work */}
          {panel.aviso && (
            <p className="aviso" role="alert">
              {textoMotivo(panel.aviso, m)}
            </p>
          )}

          {/* ▸ La libreta: un día por página · The notebook: one day per page */}
          <div className="libreta" aria-busy={panel.cargando}>
            {panel.dias.map((dia) => (
              <ListaDia
                key={dia.fecha}
                dia={dia}
                hoy={panel.hoy}
                plazas={panel.plazasPorTurno}
                enCurso={panel.enCurso}
                anular={(id) => void panel.anular(id)}
                restaurar={(id) => void panel.restaurar(id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/** ES: Una línea con el estado de la base y, si falla, qué hacer. · EN: One line with the database status and, if it fails, what to do. */
function EstadoBase({ base }: { base: EstadoBaseDeDatos }) {
  const { tx } = useMotor();
  const motor = base.motor === "neon" ? tx(COPY.motorNeon) : base.motor === "pglite" ? tx(COPY.motorLocal) : "";
  const problema =
    base.problema === "sin-url"
      ? tx(COPY.problemaSinUrl)
      : base.problema === "url-invalida"
        ? tx(COPY.problemaUrl)
        : base.problema === "conexion"
          ? tx(COPY.problemaConexion)
          : "";
  return (
    <div className="gestion__estado" data-ok={base.conectada}>
      <p>
        {tx(COPY.baseTitulo)} <strong className="gestion__etiqueta">{base.conectada ? tx(COPY.baseConectada) : tx(COPY.baseSinConectar)}</strong>
        {motor && ` · ${motor}`}
        {base.conectada && typeof base.total === "number" && ` · ${rellenar(tx(COPY.baseTotal), { n: base.total })}`}
      </p>
      {base.ubicacion && <p className="gestion__carpeta">{rellenar(tx(COPY.baseCarpeta), { ruta: base.ubicacion })}</p>}
      {problema && <p className="aviso">{problema}</p>}
      {base.detalle && <p className="gestion__detalle">{base.detalle}</p>}
    </div>
  );
}
