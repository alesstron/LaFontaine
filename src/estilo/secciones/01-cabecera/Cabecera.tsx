"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · 01 Cabecera / Header · «le plafond»
 *
 * ES: La barra fija de arriba: el techo oscuro del café con su conducto a la vista. Medallón y nombre, enlaces a
 *     las secciones que existen en esta gama, idiomas FR · EN · ES y la bolsa kraft del pedido con su etiqueta.
 * EN: The sticky top bar: the café's dark ceiling with its exposed duct. Medallion and name, links to the sections
 *     present in this tier, FR · EN · ES languages and the kraft order bag with its label.
 *
 *   Escritorio · Desktop (≥ 1100 px)
 *   ┌──────────────────────────────────────────────────────────────────────────────────────────┐
 *   │ (◯) Café LaFontaine    MENU · PLAT DU JOUR · NOTRE HISTOIRE · …    (FR EN ES)   [▤ 2]   │
 *   └════════╪═══════════════╪═══════════ conducto (comun/piezas.css) ═══╪═════════════════════┘
 *      marca                  nav (enlaces)                               idiomas      bolsa+contador
 *
 *   Móvil · Mobile (< 1100 px)                        Panel abierto · Open panel (☰)
 *   ┌──────────────────────────────────┐              ┌──────────────────────────────────┐
 *   │ (◯) Café LaFontaine   [▤ 2]  ☰  │              │ MENU                             │
 *   └══════════════════════════════════┘              │ PLAT DU JOUR …                   │
 *                                                     │ (FR EN ES)   ← solo < 640 px     │
 *                                                     └──────────────────────────────────┘
 *
 * Dónde cambiar · Where to change:
 *   Nombre ............................. src/data/cafe.config.ts → marca.nombre
 *   Textos de los enlaces .............. src/estilo/ajustes/textos.ts → COPY.nav… (o el motor: t("carta"), …)
 *   Qué enlaces salen .................. el array `enlaces` de abajo (cada uno solo si su sección existe)
 *   Colores, alturas, cuándo sale el ☰ . cabecera.css (esta carpeta · this folder)
 *   Icono de la bolsa .................. dibujos.tsx (esta carpeta) · medallón: comun/dibujos.tsx
 */
import { useEffect, useState } from "react";
import { NOMBRE_IDIOMA, useCarrito, useMotor } from "@/motor";
import { COPY } from "@/estilo/ajustes/textos";
import { platoDestacado } from "@/estilo/comun/datos";
import { Medallon } from "@/estilo/comun/dibujos";
import { Bolsa } from "./dibujos";

export function Cabecera() {
  const { cafe, secciones, idioma, idiomas, cambiarIdioma, t, tx } = useMotor();
  const carrito = useCarrito();
  // ES: ¿Está abierto el panel del móvil? · EN: Is the mobile panel open?
  const [abierto, setAbierto] = useState(false);

  // ES: Escape cierra el panel del móvil. · EN: Escape closes the mobile panel.
  useEffect(() => {
    if (!abierto) return;
    const alPulsar = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    window.addEventListener("keydown", alPulsar);
    return () => window.removeEventListener("keydown", alPulsar);
  }, [abierto]);

  // ES: Enlaces de la navegación: cada uno solo si su sección sale en esta gama (href = id de la sección).
  // EN: Navigation links: each one only if its section shows in this tier (href = the section's id).
  const enlaces = [
    secciones.carta && { href: "#carta", texto: t("carta") },
    platoDestacado(cafe) && { href: "#plat-du-jour", texto: tx(COPY.navPlato) },
    secciones.historia && { href: "#histoire", texto: t("historia") },
    secciones.galeria && { href: "#expo", texto: tx(COPY.navExpo) },
    secciones.reserva && { href: "#reserver", texto: tx(COPY.navReserva) },
    { href: "#visite", texto: t("visita") },
  ].filter((e): e is { href: string; texto: string } => Boolean(e));

  // ES: La misma lista sirve para la barra (escritorio) y para el panel (móvil).
  // EN: The same list is used in the bar (desktop) and in the panel (mobile).
  const lista = (
    <ul>
      {enlaces.map((e) => (
        <li key={e.href}>
          <a href={e.href} onClick={() => setAbierto(false)}>
            {e.texto}
          </a>
        </li>
      ))}
    </ul>
  );

  // ES: Botones de idioma: en la barra desde 640 px y dentro del panel en el móvil (CSS: .idiomas--barra / --panel).
  // EN: Language buttons: in the bar from 640 px and inside the panel on mobile (CSS: .idiomas--barra / --panel).
  const botonesIdioma = (clase: string) =>
    idiomas.length > 1 && (
      <div className={`idiomas ${clase}`} role="group" aria-label={t("idioma")}>
        {idiomas.map((i) => (
          <button key={i} type="button" lang={i} aria-pressed={i === idioma} title={NOMBRE_IDIOMA[i]} onClick={() => cambiarIdioma(i)}>
            {i.toUpperCase()}
          </button>
        ))}
      </div>
    );

  return (
    <header className="cabecera">
      <div className="cabecera__barra">
        {/* ▸ Marca: medallón + nombre (vuelve arriba) · Brand: medallion + name (back to top) */}
        <a href="#inicio" className="cabecera__marca">
          <Medallon nombre={cafe.marca.nombre} className="cabecera__medallon" />
          <span className="cabecera__nombre">{cafe.marca.nombre}</span>
        </a>

        {/* ▸ Enlaces de escritorio (≥ 1100 px) · Desktop links (≥ 1100 px) */}
        <nav className="cabecera__nav" aria-label={tx(COPY.navAria)}>
          {lista}
        </nav>

        <div className="cabecera__acciones">
          {/* ▸ FR · EN · ES (≥ 640 px) */}
          {botonesIdioma("idiomas--barra")}

          {/* ▸ Bolsa del pedido con contador (solo con pedido en la gama) · Order bag with counter (only if the tier has ordering) */}
          {secciones.pedido && (
            <button type="button" className="cabecera__bolsa" onClick={carrito.abrir} aria-label={`${t("verPedido")} (${carrito.cantidad})`}>
              <Bolsa className="cabecera__bolsa-icono" />
              {/* ES: key = cantidad: el número "salta" cada vez que cambia (CSS premium). · EN: key = quantity: the number "jumps" every time it changes (premium CSS). */}
              <span key={carrito.cantidad} className="cabecera__contador" data-lleno={carrito.cantidad > 0}>
                {carrito.cantidad}
              </span>
            </button>
          )}

          {/* ▸ ☰ del móvil (< 1100 px) · Mobile ☰ (< 1100 px) */}
          <button
            type="button"
            className="cabecera__menu"
            aria-expanded={abierto}
            aria-controls="navegacion-movil"
            aria-label={tx(abierto ? COPY.cerrarMenu : COPY.abrirMenu)}
            onClick={() => setAbierto((v) => !v)}
          >
            <span aria-hidden="true" className="cabecera__hamburguesa" data-abierto={abierto} />
          </button>
        </div>
      </div>

      {/* ▸ Panel del móvil: enlaces + idiomas · Mobile panel: links + languages */}
      <div id="navegacion-movil" className="cabecera__movil" hidden={!abierto}>
        <nav aria-label={tx(COPY.navAria)}>{lista}</nav>
        {botonesIdioma("idiomas--panel")}
      </div>

      {/* ▸ Aviso invisible para lectores de pantalla cuando cambia el pedido · Invisible screen-reader notice when the order changes */}
      {secciones.pedido && (
        <span className="sr" aria-live="polite">
          {carrito.cantidad > 0 ? `${carrito.cantidad} ${tx(COPY.articulos)}` : ""}
        </span>
      )}

      {/* ▸ El conducto del techo · The ceiling duct */}
      <div className="conducto" aria-hidden="true" />
    </header>
  );
}
