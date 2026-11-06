"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · Panel del café · Añadir una reserva / Café panel · Add a booking
 *
 * ES: El formulario del panel para apuntar una reserva tomada por teléfono o en la barra. Cuenta para las plazas igual
 *     que las de la web; con «Même si le créneau est complet» entra aunque el turno esté lleno. Admite grupos hasta
 *     las plazas del turno y fechas hasta un año vista, sin la antelación mínima de la web.
 * EN: The panel's form to record a booking taken by phone or at the counter. It counts towards the seats like online
 *     ones; with «Même si le créneau est complet» it goes in even if the slot is full. It accepts groups up to the slot's
 *     seats and dates up to a year ahead, without the website's minimum notice.
 *
 *   ┌ AJOUTER UNE RÉSERVATION · prise par téléphone ou au comptoir ──────────┐
 *   │ PERSONNES [ 2 ]   DATE [2026-11-12]   HEURE [ 9 h 30 ▾]                 │ ← .nueva__fila
 *   │ NOM [__________]  TÉLÉPHONE [__________]   NOTE [________________]      │
 *   │ [✓] Même si le créneau est complet        ( ENREGISTRER )  ( FERMER )   │ ← .nueva__pie
 *   └─────────────────────────────────────────────────────────────────────────┘ ← .nueva
 *
 * Dónde cambiar · Where to change:
 *   Textos ............... src/estilo/ajustes/textos.ts → COPY.anadirReserva, anadirAyuda, forzarPlazas, guardar…
 *   Aspecto .............. gestion.css → .nueva… (esta carpeta · this folder)
 */
import { useState, type FormEvent } from "react";
import { LIMITES_RESERVA, useMotor, type CampoReserva, type ErroresReserva, type MotivoFallo, type ValorPanel } from "@/motor";
import { COPY } from "@/estilo/ajustes/textos";
import { rellenar } from "@/estilo/comun/datos";
import { textoError, textoMotivo } from "../mensajes";

const VACIO = { nombre: "", telefono: "", nota: "" };

export function NuevaReserva({ panel, cerrar }: { panel: ValorPanel; cerrar: () => void }) {
  const m = useMotor();
  const { cafe, idioma, t, tx } = m;
  const maximo = cafe.reservas?.plazasPorTurno ?? 1;
  const [personas, setPersonas] = useState(2);
  const [fecha, setFecha] = useState(panel.hoy);
  const [hora, setHora] = useState("");
  const [datos, setDatos] = useState(VACIO);
  const [forzar, setForzar] = useState(false);
  const [errores, setErrores] = useState<ErroresReserva>({});
  const [aviso, setAviso] = useState<MotivoFallo | null>(null);
  const [hecha, setHecha] = useState("");
  const [enviando, setEnviando] = useState(false);
  const horas = panel.horasTelefono(fecha);

  const guardar = async (e: FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setAviso(null);
    setHecha("");
    try {
      const r = await panel.anadir({ fecha, hora, personas, ...datos, idioma, forzar });
      if (r.ok) {
        setHecha(r.reserva.codigo);
        setDatos(VACIO);
        setHora("");
        setForzar(false);
        setErrores({});
      } else {
        setAviso(r.motivo);
        setErrores(r.errores ?? {});
      }
    } catch {
      setAviso("bd-caida");
    } finally {
      setEnviando(false);
    }
  };

  const error = (campo: CampoReserva) => {
    const codigo = errores[campo];
    return codigo ? (
      <small id={`nueva-error-${campo}`} className="campo__error">
        {textoError(campo, codigo, m, maximo)}
      </small>
    ) : null;
  };
  const invalido = (campo: CampoReserva) => ({
    "aria-invalid": Boolean(errores[campo]),
    "aria-describedby": errores[campo] ? `nueva-error-${campo}` : undefined,
  });

  return (
    <form className="nueva" onSubmit={guardar} noValidate aria-labelledby="titulo-nueva">
      <h2 id="titulo-nueva" className="nueva__titulo">
        {tx(COPY.anadirReserva)}
      </h2>
      <p className="nueva__ayuda">{tx(COPY.anadirAyuda)}</p>

      {/* ▸ Personas, fecha y hora · People, date and time */}
      <div className="nueva__fila">
        <label className="campo">
          <span>{t("personas")}</span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={maximo}
            value={personas}
            onChange={(e) => setPersonas(Math.min(maximo, Math.max(1, Math.round(Number(e.target.value) || 1))))}
            {...invalido("personas")}
          />
          {error("personas")}
        </label>
        <label className="campo">
          <span>{t("fecha")}</span>
          <input
            type="date"
            min={panel.hoy || undefined}
            value={fecha}
            onChange={(e) => {
              setFecha(e.target.value);
              setHora("");
            }}
            {...invalido("fecha")}
          />
          {error("fecha")}
        </label>
        <label className="campo">
          <span>{t("hora")}</span>
          <select value={hora} onChange={(e) => setHora(e.target.value)} disabled={!fecha || horas.length === 0} {...invalido("hora")}>
            <option value="">{!fecha ? tx(COPY.eligeFecha) : horas.length === 0 ? tx(COPY.sinHoras) : "—"}</option>
            {horas.map((h) => (
              <option key={h} value={h}>
                {m.hora(h)}
              </option>
            ))}
          </select>
          {error("hora")}
        </label>
      </div>

      {/* ▸ Nombre, teléfono y nota · Name, phone and note */}
      <div className="nueva__fila">
        <label className="campo">
          <span>{t("nombre")}</span>
          <input
            value={datos.nombre}
            onChange={(e) => setDatos((d) => ({ ...d, nombre: e.target.value }))}
            maxLength={LIMITES_RESERVA.nombre}
            autoComplete="off"
            {...invalido("nombre")}
          />
          {error("nombre")}
        </label>
        <label className="campo">
          <span>{tx(COPY.telefono)}</span>
          <input
            type="tel"
            inputMode="tel"
            value={datos.telefono}
            onChange={(e) => setDatos((d) => ({ ...d, telefono: e.target.value }))}
            maxLength={LIMITES_RESERVA.telefono}
            autoComplete="off"
            {...invalido("telefono")}
          />
          {error("telefono")}
        </label>
        <label className="campo">
          <span>{t("nota")}</span>
          <input
            value={datos.nota}
            onChange={(e) => setDatos((d) => ({ ...d, nota: e.target.value }))}
            maxLength={LIMITES_RESERVA.nota}
            {...invalido("nota")}
          />
          {error("nota")}
        </label>
      </div>

      {/* ▸ Forzar, avisos y botones · Force, notices and buttons */}
      <label className="nueva__forzar">
        <input type="checkbox" checked={forzar} onChange={(e) => setForzar(e.target.checked)} />
        {tx(COPY.forzarPlazas)}
      </label>
      {aviso && (
        <p className="aviso" role="alert">
          {textoMotivo(aviso, m)}
        </p>
      )}
      {hecha && (
        <p className="aviso aviso--bien" role="status">
          {rellenar(tx(COPY.reservaAnadida), { codigo: hecha })}
        </p>
      )}
      <div className="nueva__pie">
        <button type="submit" className="boton boton--taza" disabled={enviando}>
          {enviando ? tx(COPY.enviando) : tx(COPY.guardar)}
        </button>
        <button type="button" className="boton boton--linea" onClick={cerrar}>
          {t("cerrar")}
        </button>
      </div>
    </form>
  );
}
