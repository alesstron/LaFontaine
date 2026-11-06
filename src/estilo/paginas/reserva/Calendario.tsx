"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · Página de reserva · Calendario / Booking page · Calendar
 *
 * ES: El paso ② «Quel jour ?»: los días que se pueden reservar (reservas.diasVista desde hoy) en la cuadrícula de un
 *     calendario de papel, mes a mes, de lunes a domingo. Cada día es una opción (radio) del mismo grupo: con el
 *     teclado se pasa de un día a otro con las flechas y se saltan los cerrados y los completos. El estado de cada día
 *     (libre, completo, cerrado) lo calcula el motor para las personas elegidas.
 * EN: Step ② «Quel jour ?»: the bookable days (reservas.diasVista from today) on a paper calendar grid, month by
 *     month, Monday to Sunday. Each day is an option (radio) of the same group: with the keyboard the arrows move from
 *     day to day and skip closed and full ones. Each day's state (free, full, closed) is worked out by the engine for
 *     the chosen number of people.
 *
 *   NOVEMBRE 2026                           ← .calendario__mes
 *    L   M   M   J   V   S   D              ← .calendario__semana (decorativa · decorative)
 *                4   5   6   7   ·          ← hoy: raya salmón · today: salmon line (data-hoy)
 *    9  10  11 ▐12▌ 13  14   ·              ← elegido: relleno oscuro · chosen: dark fill (data-elegido)
 *   16  1̶7̶  18  19  20  21   ·              ← completo: tachado · full: struck through · cerrado: tenue · closed: faded
 *   ─ aujourd'hui  ─ complet  ─ fermé       ← .calendario__leyenda
 *
 * Dónde cambiar · Where to change:
 *   Días que se ven ......... src/data/cafe.config.ts → reservas.diasVista, reservas.cerrados
 *   Colores de cada estado .. reserva-pagina.css → .calendario__dia[data-estado=…] (esta carpeta)
 */
import { formatoFecha, useMotor, type DiaCalendario } from "@/motor";
import { COPY } from "@/estilo/ajustes/textos";

const aUTC = (fecha: string) => new Date(`${fecha}T00:00:00Z`);

/** ES: Huecos antes del primer día para que caiga en su columna (lunes = 0). · EN: Blanks before the first day so it lands in its column (Monday = 0). */
const huecos = (fecha: string) => (aUTC(fecha).getUTCDay() + 6) % 7;

function porMeses(dias: DiaCalendario[]): DiaCalendario[][] {
  const meses: DiaCalendario[][] = [];
  for (const d of dias) {
    const ultimo = meses[meses.length - 1];
    if (ultimo && ultimo[0].fecha.slice(0, 7) === d.fecha.slice(0, 7)) ultimo.push(d);
    else meses.push([d]);
  }
  return meses;
}

export function Calendario({
  dias,
  hoy,
  fecha,
  elegir,
}: {
  dias: DiaCalendario[];
  hoy: string;
  fecha: string;
  elegir: (fecha: string) => void;
}) {
  const { cafe, idioma, locale, t, tx } = useMotor();
  const nombreMes = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" });
  const inicial = new Intl.DateTimeFormat(locale, { weekday: "narrow", timeZone: "UTC" });
  // ES: El 1 de enero de 2024 fue lunes: de ahí salen las iniciales L M M J V S D. · EN: January 1, 2024 was a Monday.
  const semana = Array.from({ length: 7 }, (_, i) => inicial.format(new Date(Date.UTC(2024, 0, 1 + i))));

  return (
    <div className="calendario">
      {porMeses(dias).map((mes) => (
        <div key={mes[0].fecha} className="calendario__bloque">
          {/* ▸ Mes y días de la semana (los lectores de pantalla oyen la fecha entera en cada día)
                Month and weekdays (screen readers hear the full date on each day) */}
          <p className="calendario__mes" aria-hidden="true">
            {nombreMes.format(aUTC(mes[0].fecha))}
          </p>
          <div className="calendario__rejilla">
            {semana.map((inicialDia, i) => (
              <span key={i} className="calendario__semana" aria-hidden="true">
                {inicialDia}
              </span>
            ))}
            {Array.from({ length: huecos(mes[0].fecha) }, (_, i) => (
              <span key={`hueco-${i}`} aria-hidden="true" />
            ))}
            {/* ▸ Un día = una opción del grupo «fecha» · One day = one option of the «fecha» group */}
            {mes.map((d) => {
              const estado = d.estado === "cerrado" ? tx(COPY.diaCerrado) : d.estado === "completo" ? tx(COPY.diaCompleto) : "";
              return (
                <label key={d.fecha} className="calendario__dia" data-estado={d.estado} data-elegido={d.fecha === fecha} data-hoy={d.fecha === hoy}>
                  <input
                    type="radio"
                    name="fecha"
                    className="sr"
                    value={d.fecha}
                    checked={d.fecha === fecha}
                    disabled={d.estado !== "libre"}
                    onChange={() => elegir(d.fecha)}
                  />
                  <span aria-hidden="true">{Number(d.fecha.slice(8))}</span>
                  <span className="sr">
                    {formatoFecha(d.fecha, idioma, cafe.region)}
                    {d.fecha === hoy && `, ${t("hoy")}`}
                    {estado && `, ${estado}`}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {/* ▸ Leyenda · Legend */}
      <ul className="calendario__leyenda" aria-hidden="true">
        <li data-tipo="hoy">{t("hoy")}</li>
        <li data-tipo="completo">{tx(COPY.diaCompleto)}</li>
        <li data-tipo="cerrado">{tx(COPY.diaCerrado)}</li>
      </ul>
    </div>
  );
}
