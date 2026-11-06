"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · 02 Portada / Hero · «le mur»
 *
 * ES: La pared crema del fondo del café, con las lámparas de campana colgando, el nombre en el serif del logotipo,
 *     la frase del mural "TOUT D'ABORD UN CAFÉ" en letras huecas y su paisaje a línea (volcán, colinas, cafetales).
 *     El estado en vivo va en una etiqueta salmón y la foto del salón cuelga como una obra, con su cartela.
 * EN: The café's cream back wall, with the dome lamps hanging, the name in the logo's serif, the mural's
 *     "TOUT D'ABORD UN CAFÉ" in outlined letters and its line landscape (volcano, hills, coffee rows). The live
 *     status sits on a salmon label and the room photo hangs like an artwork, with its label card.
 *
 *   Escritorio · Desktop (≥ 1024 px)
 *   ┌──────────────────────────────────────────────────────────────────────────────────┐
 *   │     ┃                      ┃                                   ┃                  │ ← lámparas · lamps
 *   │    ◖█◗                    ◖█◗                                 ◖█◗                 │
 *   │  PERLE CACHÉE · CAFÉ DE QUARTIER                                                   │ ← lema · tagline
 *   │  Café                                                    ┌──────────────────┐    │
 *   │  LaFontaine                       ← nombre (h1)          │                  │    │
 *   │  ╔╦╗╔═╗ ╦ ╦╔╦╗  ...  TOUT D'ABORD ← mural (huecas)       │   foto (obra)    │    │
 *   │                      UN CAFÉ                             │                  │    │
 *   │  /\    /‾\_/\   ⌒⌒⌒⌒            ← paisaje · landscape     └──────────────────┘    │
 *   │  La murale du café…              ← nota · note            ┌ LA SALLE ─────────┐   │
 *   │  Café de quartier face au parc…  ← descripción            │ 3535, avenue…     │   │ ← cartela
 *   │  [Ouvert maintenant · Ferme à 17 h]  ← estado · status    └───────────────────┘   │
 *   │  ( VOIR LE MENU )  ( RÉSERVER UNE TABLE )                                           │
 *   └──────────────────────────────────────────────────────────────────────────────────┘
 *   Móvil · Mobile: una sola columna; la foto enmarcada va al final · one column; the framed photo goes last.
 *
 * Dónde cambiar · Where to change:
 *   Nombre, lema y descripción ...... src/data/cafe.config.ts → marca
 *   Foto enmarcada y su autor ....... src/data/cafe.config.ts → portada
 *   Frase del mural y su nota ....... src/estilo/ajustes/textos.ts → MURAL, COPY.muralNota, COPY.obraTitulo
 *   Botones ......................... abajo, en <div className="portada__botones">
 *   Tamaños, posiciones, columnas ... portada.css (esta carpeta · this folder)
 *   Lámparas y paisaje (dibujo) ..... dibujos.tsx (esta carpeta · this folder)
 */
import { fraseEstado, useEstadoHorario, useMotor } from "@/motor";
import { COPY, MURAL } from "@/estilo/ajustes/textos";
import { Flecha } from "@/estilo/comun/dibujos";
import { Imagen } from "@/estilo/comun/piezas";
import { Lampara, Paisaje } from "./dibujos";

export function Portada() {
  const { cafe, secciones, tx, t } = useMotor();
  return (
    <section id="inicio" className="portada" aria-labelledby="nombre-cafe">
      {/* ▸ Las tres lámparas colgando del techo (la del medio se oculta en el móvil) · The three lamps (the middle one hides on mobile) */}
      <div className="portada__lamparas" aria-hidden="true">
        <Lampara className="lampara lampara--1" />
        <Lampara className="lampara lampara--2" />
        <Lampara className="lampara lampara--3" />
      </div>

      <div className="portada__contenido">
        {/* ▸ Columna de texto · Text column */}
        <div className="portada__texto">
          <p className="portada__lema">{tx(cafe.marca.eslogan)}</p>
          <h1 id="nombre-cafe" className="portada__nombre">
            {cafe.marca.nombre}
          </h1>

          {/* ▸ El mural: frase en letras huecas + paisaje + nota · The mural: outlined sentence + landscape + note */}
          <figure className="mural">
            <p className="mural__frase" lang="fr">
              <span>{MURAL[0]}</span> <span>{MURAL[1]}</span>
            </p>
            <Paisaje className="mural__paisaje" />
            <figcaption className="mural__nota">{tx(COPY.muralNota)}</figcaption>
          </figure>

          <p className="portada__descripcion">{tx(cafe.marca.descripcion)}</p>
          <Estado />

          {/* ▸ Botones: menú y, si hay reservas, reservar en /reserver (pestaña nueva); si no, cómo llegar
                Buttons: menu and, with booking, book at /reserver (new tab); otherwise, directions */}
          <div className="portada__botones">
            {secciones.carta && (
              <a className="boton boton--taza" href="#carta">
                {t("verCarta")}
              </a>
            )}
            {secciones.reserva ? (
              <a className="boton boton--linea" href="/reserver" target="_blank" rel="noopener">
                {t("reservar")}
                <span className="sr"> {tx(COPY.nuevaPestana)}</span>
                <Flecha className="icono" />
              </a>
            ) : (
              <a className="boton boton--linea" href="#visite">
                {t("visita")}
              </a>
            )}
          </div>
        </div>

        {/* ▸ Columna de la foto enmarcada · Framed-photo column */}
        {cafe.portada && <Obra />}
      </div>
    </section>
  );
}

/**
 * ES: [Ouvert maintenant · Ferme à 17 h] Abierto o cerrado ahora (hora de Montréal), en etiqueta salmón. Hasta que
 *     el navegador conoce la hora (primer pintado) deja un espacio en blanco del mismo alto.
 * EN: [Ouvert maintenant · Ferme à 17 h] Open or closed now (Montréal time), on a salmon label. Until the browser
 *     knows the time (first paint) it leaves a blank space of the same height.
 */
function Estado() {
  const { cafe, idioma, t } = useMotor();
  const vivo = useEstadoHorario();
  return (
    <p className="etiqueta-estado" data-abierto={vivo ? String(vivo.estado.abierto) : undefined}>
      {vivo ? (
        <>
          <strong>{vivo.estado.abierto ? t("abiertoAhora") : t("cerradoAhora")}</strong>
          <span> · {fraseEstado(vivo.estado, idioma, cafe.region)}</span>
        </>
      ) : (
        " "
      )}
    </p>
  );
}

/**
 * ES: La foto del salón enmarcada como una obra: marco negro, paspartú blanco y cartela (título, dirección, autor).
 * EN: The room photo framed like an artwork: black frame, white mat and label card (title, address, author).
 *
 *   ┌───────────────┐  ← .obra__marco (negro · black)
 *   │ ┌───────────┐ │  ← .obra__paspartu (blanco · white)
 *   │ │   foto    │ │
 *   │ └───────────┘ │
 *   └───────────────┘
 *   ┌ LA SALLE ─────┐  ← .cartela (comun/piezas.css)
 */
function Obra() {
  const { cafe, tx, t } = useMotor();
  const foto = cafe.portada!;
  return (
    <figure className="obra">
      <div className="obra__marco">
        <div className="obra__paspartu">
          <Imagen foto={foto} sizes="(max-width: 1023px) 88vw, 42vw" prioridad />
        </div>
      </div>
      <figcaption className="cartela">
        <span className="cartela__titulo">{tx(COPY.obraTitulo)}</span>
        <span className="cartela__detalle">
          {cafe.contacto.direccion}, {cafe.contacto.ciudad}
        </span>
        {foto.autor && <span className="cartela__autor">{t("fotoDe", { autor: foto.autor })}</span>}
      </figcaption>
    </figure>
  );
}
