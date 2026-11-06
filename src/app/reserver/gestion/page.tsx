/**
 * [NO TOCAR · DO NOT EDIT] Motor / Engine · Reservas
 *
 * ES: Panel del café (/reserver/gestion), con contraseña (RESERVAS_CLAVE). El servidor mira la cookie de
 *     sesión antes de pintar: sin ella solo se ve el formulario para entrar. Cada acción del panel vuelve a
 *     comprobarla (src/motor/reservas/gestion.ts). No tiene enlaces desde la web y nunca sale en Google.
 * EN: Café panel (/reserver/gestion), password protected (RESERVAS_CLAVE). The server checks the session
 *     cookie before drawing: without it only the sign-in form shows. Every panel action checks it again
 *     (src/motor/reservas/gestion.ts). Nothing on the website links to it and it never shows up on Google.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cafe } from "@/data/cafe.config";
import { PaginaGestion } from "@/estilo";
import { claveLista, sesionValida } from "@/motor/reservas/seguridad";
import { seccionesDe } from "@/motor/gamas";
import { metadataDePagina } from "@/motor/seo";

export const metadata: Metadata = metadataDePagina(cafe, "gestion");
// ES: Depende de la cookie de cada visita: nunca se guarda hecha. · EN: Depends on each visit's cookie: never cached.
export const dynamic = "force-dynamic";

export default async function Gestion() {
  if (!seccionesDe(cafe).reserva) notFound();
  return <PaginaGestion entrado={await sesionValida()} claveLista={claveLista()} />;
}
