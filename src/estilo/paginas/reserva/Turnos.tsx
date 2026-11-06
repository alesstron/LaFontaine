"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · Página de reserva · Horas / Booking page · Times
 *
 * ES: El paso ③ «À quelle heure ?»: las horas del día elegido como cápsulas, una opción (radio) cada una. Las que ya
 *     no tienen sitio para las personas elegidas salen tachadas y no se pueden elegir; cuando quedan pocas plazas,
 *     una nota a mano lo dice («plus que 2»).
 * EN: Step ③ «À quelle heure ?»: the chosen day's times as capsules, one option (radio) each. Those without room for
 *     the chosen number of people show struck through and cannot be picked; when few seats are left, a handwritten
 *     note says so («plus que 2»).
 *
 *   ( 8 h )  ( 8 h 30 )  ▐ 9 h ▌  ( 9̶ ̶h̶ ̶3̶0̶ )  ( 10 h )      ← .turnos__hora (elegida: relleno oscuro · chosen: dark)
 *            plus que 2                                   ← .turnos__quedan (Kalam, rojo taza · red cup)
 *
 * Dónde cambiar · Where to change:
 *   Cada cuánto hay horas ...... src/data/cafe.config.ts → reservas.paso (y el horario)
 *   Cuándo sale «plus que n» ... POCAS, abajo
 *   Aspecto de las cápsulas .... reserva-pagina.css → .turnos__hora (esta carpeta)
 */
import { useMotor, type TurnoCalendario } from "@/motor";
import { COPY } from "@/estilo/ajustes/textos";
import { rellenar } from "@/estilo/comun/datos";

// ES: Con estas plazas libres o menos, sale la nota «plus que n». · EN: With this many free seats or fewer, the «plus que n» note shows.
const POCAS = 3;

export function Turnos({ turnos, hora, elegir }: { turnos: TurnoCalendario[]; hora: string; elegir: (hora: string) => void }) {
  const { tx, hora: formatoHora } = useMotor();
  return (
    <div className="turnos">
      {turnos.map((tu) => (
        <label key={tu.hora} className="turnos__hora" data-cabe={tu.cabe} data-elegido={tu.hora === hora}>
          <input
            type="radio"
            name="hora"
            className="sr"
            value={tu.hora}
            checked={tu.hora === hora}
            disabled={!tu.cabe}
            onChange={() => elegir(tu.hora)}
          />
          <span>{formatoHora(tu.hora)}</span>
          {tu.cabe && tu.libres <= POCAS && <span className="turnos__quedan">{rellenar(tx(COPY.quedan), { n: tu.libres })}</span>}
          {!tu.cabe && <span className="sr">, {tx(COPY.diaCompleto)}</span>}
        </label>
      ))}
    </div>
  );
}
