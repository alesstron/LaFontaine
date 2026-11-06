/**
 * [NO TOCAR · DO NOT EDIT] Motor / Engine · Reservas
 *
 * ES: Página de reserva (/reserver). Se abre en una pestaña nueva desde los botones «Réserver» de la web.
 *     La pinta la piel (src/estilo/paginas/reserva/); las plazas las pide al servidor con useReservaEnLinea().
 *     Sin bloque `reservas` en cafe.config.ts (o si la gama no incluye reservas), la página no existe (404) y la
 *     web no enseña botones de reserva.
 * EN: Booking page (/reserver). It opens in a new tab from the website's «Réserver» buttons.
 *     The skin draws it (src/estilo/paginas/reserva/); it asks the server for seats with useReservaEnLinea().
 *     Without a `reservas` block in cafe.config.ts (or if the tier has no booking), the page does not exist (404)
 *     and the site shows no booking buttons.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cafe } from "@/data/cafe.config";
import { PaginaReserva } from "@/estilo";
import { seccionesDe } from "@/motor/gamas";
import { metadataDePagina } from "@/motor/seo";

export const metadata: Metadata = metadataDePagina(cafe, "reserva");

export default function Reservar() {
  if (!seccionesDe(cafe).reserva) notFound();
  return <PaginaReserva />;
}
