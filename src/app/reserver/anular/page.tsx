/**
 * [NO TOCAR · DO NOT EDIT] Motor / Engine · Reservas
 *
 * ES: Página para anular una reserva (/reserver/anular#c=CÓDIGO&t=SECRETO). El enlace se le da al cliente
 *     al confirmar; lo que va tras "#" lo lee el navegador (useAnularReserva) y nunca queda en los registros
 *     del servidor. Nunca sale en Google.
 * EN: Page to cancel a booking (/reserver/anular#c=CODE&t=SECRET). The guest gets the link when the booking
 *     is confirmed; what follows "#" is read by the browser (useAnularReserva) and never ends up in the
 *     server logs. It never shows up on Google.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cafe } from "@/data/cafe.config";
import { PaginaAnular } from "@/estilo";
import { seccionesDe } from "@/motor/gamas";
import { metadataDePagina } from "@/motor/seo";

export const metadata: Metadata = metadataDePagina(cafe, "anular");

export default function Anular() {
  if (!seccionesDe(cafe).reserva) notFound();
  return <PaginaAnular />;
}
