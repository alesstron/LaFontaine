"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · Panel del café · Entrar / Café panel · Sign in
 *
 * ES: La tarjeta para entrar al panel con la contraseña (RESERVAS_CLAVE). Si la variable no está configurada lo dice
 *     en vez de enseñar el formulario. Los fallos (contraseña mala, demasiados intentos) llegan del servidor.
 * EN: The card to sign in to the panel with the password (RESERVAS_CLAVE). If the variable is not set it says so
 *     instead of showing the form. Failures (wrong password, too many attempts) come from the server.
 *
 *   ┌────────────────────────────────┐
 *   │ ESPACE DU CAFÉ                 │ ← .antetitulo
 *   │ Réservations · gestion         │ ← .titulo-seccion
 *   │ MOT DE PASSE [•••••••••••]     │ ← .campo
 *   │ ( ENTRER )                     │ ← .boton--taza
 *   └────────────────────────────────┘ ← .gestion__entrar
 *
 * Dónde cambiar · Where to change:
 *   La contraseña .......... variable RESERVAS_CLAVE (Vercel o .env.local; ver docs/RESERVAS.md)
 *   Textos ................. src/estilo/ajustes/textos.ts → COPY.panelAntetitulo, clave, entrar, motivo…
 */
import { useState } from "react";
import { useMotor, type ValorPanel } from "@/motor";
import { COPY } from "@/estilo/ajustes/textos";
import { textoMotivo } from "../mensajes";

export function Entrar({ panel, claveLista }: { panel: ValorPanel; claveLista: boolean }) {
  const m = useMotor();
  const { t, tx } = m;
  const [clave, setClave] = useState("");

  return (
    <div className="gestion__entrar">
      <p className="antetitulo">{tx(COPY.panelAntetitulo)}</p>
      <h1 className="titulo-seccion">{t("panelReservas")}</h1>

      {!claveLista ? (
        // ▸ Falta RESERVAS_CLAVE · RESERVAS_CLAVE missing
        <p className="aviso" role="alert">
          {tx(COPY.motivoSinClave)}
        </p>
      ) : (
        // ▸ Formulario con la contraseña · Password form
        <form
          className="formulario"
          onSubmit={(e) => {
            e.preventDefault();
            void panel.entrar(clave);
          }}
        >
          <label className="campo">
            <span>{tx(COPY.clave)}</span>
            <input
              type="password"
              autoComplete="current-password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              required
              aria-invalid={panel.falloEntrar === "clave"}
              aria-describedby={panel.falloEntrar ? "fallo-entrar" : undefined}
            />
          </label>
          {panel.falloEntrar && (
            <p id="fallo-entrar" className="aviso" role="alert">
              {textoMotivo(panel.falloEntrar, m)}
            </p>
          )}
          <button type="submit" className="boton boton--taza boton--ancho" disabled={panel.entrando || !clave}>
            {panel.entrando ? tx(COPY.entrando) : tx(COPY.entrar)}
          </button>
        </form>
      )}
    </div>
  );
}
