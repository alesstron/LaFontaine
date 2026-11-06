"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · Páginas de reservas · Mensajes / Messages
 *
 * ES: Convierte los códigos que devuelve el servidor (src/motor/reservas/tipos.ts) en frases de ajustes/textos.ts.
 *     El servidor nunca manda frases: así los textos se cambian sin tocar el motor. Lo usan las tres páginas.
 * EN: Turns the codes the server returns (src/motor/reservas/tipos.ts) into sentences from ajustes/textos.ts.
 *     The server never sends sentences: this way texts change without touching the engine. All three pages use it.
 *
 *   textoError("telefono", "invalido", m)   → "Numéro à vérifier (7 à 15 chiffres)."
 *   textoMotivo("completo", m)              → "Ce créneau vient d'être complété. Choisissez une autre heure."
 *   textoMotivo("bd-caida", m, true)        → "… Vous pouvez aussi appeler le café au 514 …"
 *   textoPersonas(3, m) · textoReservas(1, m) → "3 personnes" · "1 réservation"
 *   <ConTelefono texto="… au 514 …" />      → el número como enlace tel: · the number as a tel: link
 *
 * Dónde cambiar · Where to change:
 *   Las frases ........... src/estilo/ajustes/textos.ts → COPY.error…, COPY.motivo…, COPY.llamarAl
 */
import { urlTelefono, type CampoReserva, type ErrorCampo, type MotivoFallo, type Texto, type ValorMotor } from "@/motor";
import { COPY } from "@/estilo/ajustes/textos";
import { rellenar } from "@/estilo/comun/datos";

type Motor = Pick<ValorMotor, "cafe" | "t" | "tx">;

const MOTIVOS: Record<MotivoFallo, Texto> = {
  "sin-bd": COPY.motivoSinBd,
  "bd-caida": COPY.motivoBdCaida,
  completo: COPY.motivoCompleto,
  limite: COPY.motivoLimite,
  datos: COPY.motivoDatos,
  "no-encontrada": COPY.motivoNoEncontrada,
  pasada: COPY.motivoPasada,
  sesion: COPY.motivoSesion,
  clave: COPY.motivoClave,
  bloqueado: COPY.motivoBloqueado,
  "sin-clave": COPY.motivoSinClave,
  error: COPY.motivoError,
};

/** ES: 120 → "2 h"; 90 → "90 min". · EN: 120 → "2 h"; 90 → "90 min". */
function duracion(minutos: number): string {
  return minutos % 60 === 0 ? `${minutos / 60} h` : `${minutos} min`;
}

/**
 * ES: Error de un campo. `maxPersonas` cambia el máximo del mensaje (el panel permite grupos más grandes).
 * EN: A field's error. `maxPersonas` changes the message's maximum (the panel allows bigger groups).
 */
export function textoError(campo: CampoReserva, codigo: ErrorCampo, { cafe, t, tx }: Motor, maxPersonas?: number): string {
  const conf = cafe.reservas;
  const personas = () => rellenar(tx(COPY.errorPersonas), { max: maxPersonas ?? conf?.maxPersonas ?? 1 });
  switch (codigo) {
    case "requerido":
      return t("campoObligatorio");
    case "largo":
      return tx(COPY.errorLargo);
    case "cerrado":
      return tx(COPY.errorCerrado);
    case "pasada":
      return tx(COPY.errorPasada);
    case "antelacion":
      return rellenar(tx(COPY.errorAntelacion), { horas: duracion(conf?.antelacionMin ?? 0) });
    case "fuera":
      return campo === "personas" ? personas() : tx(COPY.errorFecha);
    case "invalido":
      if (campo === "telefono") return tx(COPY.errorTelefono);
      if (campo === "hora") return tx(COPY.errorHora);
      if (campo === "personas") return personas();
      return tx(COPY.errorFecha);
  }
}

/**
 * ES: Por qué algo no salió. Con `conTelefono`, añade «Vous pouvez aussi appeler le café au …» si hay teléfono.
 * EN: Why something did not work. With `conTelefono`, adds «You can also call the café at …» if there is a phone.
 */
export function textoMotivo(motivo: MotivoFallo, { cafe, tx }: Motor, conTelefono = false): string {
  const texto = tx(MOTIVOS[motivo]);
  const telefono = cafe.contacto.telefono;
  return conTelefono && telefono ? `${texto} ${rellenar(tx(COPY.llamarAl), { telefono })}` : texto;
}

export function textoPersonas(n: number, { tx }: Motor): string {
  return n === 1 ? tx(COPY.unaPersona) : rellenar(tx(COPY.variasPersonas), { n });
}

export function textoReservas(n: number, { tx }: Motor): string {
  return n === 1 ? tx(COPY.unaReserva) : rellenar(tx(COPY.variasReservas), { n });
}

/** ES: Una frase con el teléfono del café convertido en enlace para llamar. · EN: A sentence with the café's phone turned into a call link. */
export function ConTelefono({ texto, telefono }: { texto: string; telefono?: string }) {
  if (!telefono || !texto.includes(telefono)) return <>{texto}</>;
  const [antes, despues] = texto.split(telefono);
  return (
    <>
      {antes}
      <a href={urlTelefono(telefono)}>{telefono}</a>
      {despues}
    </>
  );
}
