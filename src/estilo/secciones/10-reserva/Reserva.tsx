"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · 10 Reserva / Booking · «prenez un fauteuil»
 *
 * ES: El rincón de los sillones de cuero coñac y la mesa baja negra del salón, sobre el suelo de hormigón. Sobre la
 *     mesa, la tarjeta de reserva: una frase y el botón que abre la página de reserva (/reserver) en una pestaña
 *     nueva, donde se eligen día y hora entre los huecos libres. Sale si la gama incluye reservas y hay bloque
 *     `reservas` en cafe.config.ts.
 * EN: The corner with the cognac leather armchairs and the room's low black table, on the concrete floor. On the
 *     table, the reservation card: one sentence and the button that opens the booking page (/reserver) in a new tab,
 *     where the day and time are picked among the free slots. Shows if the tier includes booking and cafe.config.ts
 *     has a `reservas` block.
 *
 *   Escritorio · Desktop (≥ 900 px)
 *   ┌──────────────────────────────────────────────────────────────────┐
 *   │                    ┌──────────────────────┐                      │
 *   │                    │ PRENEZ UN FAUTEUIL   │                      │ ← .reserva__tarjeta
 *   │                    │ Réserver une table   │                      │
 *   │                    │ Choisissez le jour…  │                      │ ← .reserva__texto
 *   │   ▟▀▙              │ ( VOIR LES PLACES ↗ )│              ▟▀▙     │ ← .boton--taza · sillones · armchairs
 *   │   █▄▄▄╲            └──────────────────────┘            ╱▄▄▄█     │
 *   │   ╱   ╲                ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀                ╱   ╲     │ ← mesa baja · low table
 *   │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ ← suelo · floor (--sol)
 *   └──────────────────────────────────────────────────────────────────┘
 *   Móvil · Mobile: la tarjeta ocupa el ancho; sillones y mesa, pequeños, abajo.
 *
 * Dónde cambiar · Where to change:
 *   Quitar o poner las reservas ...... src/data/cafe.config.ts → bloque `reservas` / funciones: { reserva: false }
 *   Antetítulo, frase y botón ........ src/estilo/ajustes/textos.ts → COPY.sillonesAntetitulo, sillonesTexto, verPlazas
 *   La página que abre ............... src/estilo/paginas/reserva/ (ruta: src/app/reserver/page.tsx)
 *   Escena, tarjeta, tamaños ......... reserva.css (esta carpeta · this folder)
 *   Sillones y mesa (dibujo) ......... comun/dibujos.tsx (Sillon, MesaBaja: también los usa la página de reserva)
 */
import { useMotor } from "@/motor";
import { COPY } from "@/estilo/ajustes/textos";
import { Aparece } from "@/estilo/comun/animacion";
import { Flecha, MesaBaja, Sillon } from "@/estilo/comun/dibujos";

export function Reserva() {
  const { t, tx } = useMotor();
  return (
    <section id="reserver" className="reserva" aria-labelledby="titulo-reserva">
      {/* ▸ La escena: sillón, mesa baja, sillón (decorativa) · The scene: armchair, low table, armchair (decorative) */}
      <div className="reserva__escena" aria-hidden="true">
        <Sillon className="reserva__sillon reserva__sillon--izq" />
        <MesaBaja className="reserva__mesa" />
        <Sillon espejo className="reserva__sillon reserva__sillon--der" />
      </div>

      {/* ▸ La tarjeta de reserva · The reservation card */}
      <Aparece className="reserva__tarjeta">
        <p className="antetitulo">{tx(COPY.sillonesAntetitulo)}</p>
        <h2 id="titulo-reserva" className="titulo-seccion">
          {t("reservar")}
        </h2>
        <p className="reserva__texto">{tx(COPY.sillonesTexto)}</p>
        {/* ▸ Botón a /reserver en una pestaña nueva; el aviso oculto lo dice a los lectores de pantalla
              Button to /reserver in a new tab; the hidden note tells screen readers */}
        <a className="boton boton--taza boton--ancho" href="/reserver" target="_blank" rel="noopener">
          {tx(COPY.verPlazas)}
          <span className="sr"> {tx(COPY.nuevaPestana)}</span>
          <Flecha className="icono" />
        </a>
      </Aparece>
    </section>
  );
}
