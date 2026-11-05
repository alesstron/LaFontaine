"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · 12 Pie / Footer
 *
 * ES: El techo oscuro otra vez, con el medallón, la dirección, el teléfono, Facebook, el crédito de las fotos y el
 *     aviso de demo (mientras `demo` sea true en cafe.config.ts). Sale en todas las gamas.
 * EN: The dark ceiling again, with the medallion, address, phone, Facebook, the photo credit and the demo notice
 *     (while `demo` is true in cafe.config.ts). Shows on every tier.
 *
 *   ══════╪══════════╪══════════ conducto ═══════╪══════════════════════
 *   (◯) Café LaFontaine                         3535, avenue Papineau…
 *       PERLE CACHÉE · CAFÉ DE QUARTIER          H2K 4J9 Montréal
 *                                                +1 514-527-3030
 *                                                Facebook ↗
 *   ──────────────────────────────────────────────────────────────────
 *   Photos : clients et café sur Google Maps…    ← crédito · credit
 *   MAQUETTE DE DÉMONSTRATION · SITE NON OFFICIEL  ← aviso de demo · demo notice
 *   © 2026 Café LaFontaine
 *
 * Dónde cambiar · Where to change:
 *   Nombre, lema, dirección, teléfono, Facebook .. src/data/cafe.config.ts → marca, contacto
 *   Quitar el aviso de demo ...................... src/data/cafe.config.ts → demo: false
 *   Crédito de las fotos ......................... src/estilo/ajustes/textos.ts → COPY.creditos
 *   Colores, columnas ............................ pie.css (esta carpeta · this folder)
 */
import { urlTelefono, useMotor } from "@/motor";
import { COPY } from "@/estilo/ajustes/textos";
import { Flecha, Medallon } from "@/estilo/comun/dibujos";

export function Pie() {
  const { cafe, tx, t } = useMotor();
  const { contacto } = cafe;
  return (
    <footer className="pie">
      {/* ▸ El conducto del techo (comun/piezas.css) · The ceiling duct */}
      <div className="conducto" aria-hidden="true" />

      <div className="pie__contenido">
        {/* ▸ Medallón, nombre y lema · Medallion, name and tagline */}
        <div className="pie__marca">
          <Medallon nombre={cafe.marca.nombre} className="pie__medallon" />
          <div>
            <p className="pie__nombre">{cafe.marca.nombre}</p>
            <p className="pie__lema">{tx(cafe.marca.eslogan)}</p>
          </div>
        </div>
        {/* ▸ Dirección, teléfono y Facebook · Address, phone and Facebook */}
        <address className="pie__contacto">
          <span>{contacto.direccion}</span>
          <span>
            {contacto.codigoPostal} {contacto.ciudad}
          </span>
          {contacto.telefono && <a href={urlTelefono(contacto.telefono)}>{contacto.telefono}</a>}
          {contacto.redes?.facebook && (
            <a href={contacto.redes.facebook} target="_blank" rel="noopener noreferrer">
              {tx(COPY.facebook)}
              <Flecha className="icono" />
            </a>
          )}
        </address>
      </div>

      {/* ▸ Créditos, aviso de demo y © · Credits, demo notice and © */}
      <div className="pie__legal">
        <p>{tx(COPY.creditos)}</p>
        {cafe.demo && <p className="pie__demo">{t("avisoDemo")}</p>}
        {/* ES: suppressHydrationWarning: el año lo calcula el servidor y otra vez el navegador. · EN: the year is computed by the server and again by the browser. */}
        <p suppressHydrationWarning>
          © {new Date().getFullYear()} {cafe.marca.nombre}
        </p>
      </div>
    </footer>
  );
}
