"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · 11 Visita / Visit · «nous trouver»
 *
 * ES: El horario en un póster enmarcado con bandas oscuras arriba y abajo (el formato del póster de la barra, sin su
 *     dibujo): arriba el estado en vivo, abajo los días cerrados; hoy va marcado con la etiqueta salmón. Al lado, el
 *     mapa enmarcado, la dirección, los servicios, los botones y la fuente del parque La Fontaine a línea.
 *     Sale en todas las gamas.
 * EN: The opening hours on a framed poster with dark bands top and bottom (the bar poster's format, without its
 *     drawing): the live status on top, closed days at the bottom; today is marked with the salmon label. Next to
 *     it, the framed map, the address, the services, the buttons and the Parc La Fontaine fountain in line.
 *     Shows on every tier.
 *
 *   Escritorio · Desktop (≥ 960 px)
 *   FACE AU PARC LA FONTAINE…            ← referencia (cafe.config.ts → contacto.referencia)
 *   Nous trouver
 *   ┏━━━━━━━━━━━━━━━━━━━━━━┓   ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
 *   ┃ ● OUVERT MAINTENANT   ┃   ┃                                  ┃
 *   ┃  Heures d'ouverture   ┃   ┃        mapa de Google            ┃  ← iframe sin API key
 *   ┃ [LUNDI     8 h–17 h]  ┃   ┃                                  ┃
 *   ┃  MARDI     8 h–15 h   ┃   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
 *   ┃  …                    ┃   Café LaFontaine · 3535, avenue Papineau…
 *   ┃  DIMANCHE     FERMÉ   ┃   [Sur place] [À emporter] [Réservations]   ← servicios
 *   ┃  Ferme à 17 h         ┃   ( ITINÉRAIRE ) ( APPELER ) ( FACEBOOK ↗ )
 *   ┃ FERMÉ : DIMANCHE      ┃   VOIR SUR GOOGLE MAPS ↗
 *   ┗━━━━━━━━━━━━━━━━━━━━━━━┛   ~~~ fuente del parque ~~~ Parc La Fontaine
 *   Móvil · Mobile: póster arriba, mapa y datos debajo.
 *
 * Dónde cambiar · Where to change:
 *   Horario .................. src/data/cafe.config.ts → horario.franjas
 *   Dirección, teléfono, mapa  src/data/cafe.config.ts → contacto (lat, lng, mapsUrl, redes.facebook)
 *   Servicios ................ src/data/cafe.config.ts → servicios
 *   Pie del dibujo ........... src/estilo/ajustes/textos.ts → COPY.parque
 *   Póster, mapa, columnas ... visita.css (esta carpeta) · la fuente (dibujo): dibujos.tsx
 */
import { fraseEstado, semana, urlComoLlegar, urlFicha, urlMapaIncrustado, urlTelefono, useEstadoHorario, useMotor } from "@/motor";
import { COPY } from "@/estilo/ajustes/textos";
import { Aparece } from "@/estilo/comun/animacion";
import { Flecha } from "@/estilo/comun/dibujos";
import { Fuente } from "./dibujos";

export function Visita() {
  const { cafe, idioma, tx, t } = useMotor();
  // ES: Estado en vivo (null hasta que el navegador sabe la hora). · EN: Live status (null until the browser knows the time).
  const vivo = useEstadoHorario();
  const { contacto } = cafe;
  // ES: Los 7 días desde el lunes, con sus horas ya escritas en el idioma. · EN: The 7 days from Monday, with their hours already written in the language.
  const dias = semana(cafe.horario.franjas, idioma, cafe.region);
  const cerrados = dias.filter((d) => d.cerrado).map((d) => d.nombre);
  // ES: En francés va espacio antes de los dos puntos. · EN: French puts a space before the colon.
  const dosPuntos = idioma === "fr" ? " : " : ": ";

  return (
    <section id="visite" className="visita" aria-labelledby="titulo-visita">
      {/* ▸ Referencia y título · Reference and heading */}
      <Aparece className="visita__cabecera">
        {contacto.referencia && <p className="antetitulo">{tx(contacto.referencia)}</p>}
        <h2 id="titulo-visita" className="titulo-seccion">
          {t("visita")}
        </h2>
      </Aparece>

      <div className="visita__rejilla">
        {/* ▸ El póster del horario · The opening-hours poster */}
        <figure className="poster">
          <div className="poster__marco">
            {/* ES: Banda de arriba: estado en vivo (punto salmón si está abierto). · EN: Top band: live status (salmon dot if open). */}
            <p className="poster__banda" data-abierto={vivo ? String(vivo.estado.abierto) : undefined}>
              {vivo ? (vivo.estado.abierto ? t("abiertoAhora") : t("cerradoAhora")) : t("horario")}
            </p>
            <div className="poster__cuerpo">
              <h3 className="poster__titulo">{t("horario")}</h3>
              <ul className="poster__dias">
                {dias.map((d) => (
                  <li key={d.dia} data-hoy={vivo?.hoy === d.dia} data-cerrado={d.cerrado}>
                    <span className="poster__dia">
                      {d.nombre}
                      {vivo?.hoy === d.dia && <span className="sr"> ({t("hoy")})</span>}
                    </span>
                    <span>{d.horas}</span>
                  </li>
                ))}
              </ul>
              {vivo && <p className="poster__frase">{fraseEstado(vivo.estado, idioma, cafe.region)}</p>}
            </div>
            {/* ES: Banda de abajo: los días cerrados. · EN: Bottom band: the closed days. */}
            {cerrados.length > 0 && (
              <p className="poster__banda poster__banda--abajo">
                {t("cerrado")}
                {dosPuntos}
                {cerrados.join(", ")}
              </p>
            )}
          </div>
        </figure>

        <div className="visita__lugar">
          {/* ▸ Mapa enmarcado (Google, sin API key) · Framed map (Google, no API key) */}
          <div className="visita__mapa">
            <iframe title={`${t("visita")} · ${cafe.marca.nombre}`} src={urlMapaIncrustado(cafe, idioma)} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>

          {/* ▸ Dirección y teléfono · Address and phone */}
          <address className="visita__direccion">
            <strong>{cafe.marca.nombre}</strong>
            <span>{contacto.direccion}</span>
            <span>
              {contacto.codigoPostal} {contacto.ciudad}
              {contacto.provincia ? ` (${contacto.provincia})` : ""}
            </span>
            {contacto.telefono && <a href={urlTelefono(contacto.telefono)}>{contacto.telefono}</a>}
          </address>

          {/* ▸ Servicios en etiquetas salmón · Services on salmon labels */}
          {cafe.servicios && cafe.servicios.length > 0 && (
            <ul className="servicios" aria-label={t("servicios")}>
              {cafe.servicios.map((s, i) => (
                <li key={i}>{tx(s)}</li>
              ))}
            </ul>
          )}

          {/* ▸ Botones: itinerario, llamar, Facebook · Buttons: directions, call, Facebook */}
          <div className="visita__botones">
            <a className="boton boton--taza" href={urlComoLlegar(cafe)} target="_blank" rel="noopener noreferrer">
              {t("comoLlegar")}
            </a>
            {contacto.telefono && (
              <a className="boton boton--linea" href={urlTelefono(contacto.telefono)}>
                {t("llamar")}
              </a>
            )}
            {contacto.redes?.facebook && (
              <a className="boton boton--linea" href={contacto.redes.facebook} target="_blank" rel="noopener noreferrer">
                {tx(COPY.facebook)}
                <Flecha className="icono" />
              </a>
            )}
          </div>
          <a className="visita__ficha" href={urlFicha(cafe)} target="_blank" rel="noopener noreferrer">
            {t("verEnMaps")}
            <Flecha className="icono" />
          </a>

          {/* ▸ La fuente del parque La Fontaine, a línea · The Parc La Fontaine fountain, in line */}
          <figure className="visita__parque">
            <Fuente className="fuente" />
            <figcaption>{tx(COPY.parque)}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
