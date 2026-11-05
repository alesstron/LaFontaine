"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · La página entera / The whole page
 *
 * ES: Piel de Café LaFontaine: "Le mur" (ficha de estilo en docs/DISEÑO.md). La web es la pared del fondo del café.
 *     Este archivo solo decide el ORDEN de las secciones; cada una vive en su carpeta (secciones/NN-nombre/) con su
 *     componente .tsx, su .css y, si tiene, sus dibujos. Qué secciones salen lo decide el motor según la gama: para
 *     quitar una, cambia la gama o `funciones` en src/data/cafe.config.ts en vez de borrar líneas aquí.
 * EN: Café LaFontaine skin: "Le mur" (style sheet in docs/DISEÑO.md). The site is the café's back wall. This file only
 *     decides the ORDER of the sections; each one lives in its folder (secciones/NN-name/) with its .tsx component,
 *     its .css and, if any, its drawings. Which sections show is decided by the engine from the tier: to hide one,
 *     change the tier or `funciones` in src/data/cafe.config.ts instead of deleting lines here.
 *
 *   La página de arriba abajo · The page top to bottom    Carpeta · Folder               Sale en · Shows in
 *   ┌───────────────────────────────────────────────┐
 *   │ 01 Cabecera · «le plafond»                    │   secciones/01-cabecera         todas · all
 *   ├───────────────────────────────────────────────┤
 *   │ 02 Portada · «le mur»              #inicio    │   secciones/02-portada          todas
 *   │ 03 Mostrador · «au comptoir»                  │   secciones/03-mostrador        todas
 *   │ 04 Plato del día                   #plat-du-jour  secciones/04-plato-del-dia  todas, si hay destacado
 *   │ 05 Carta · «les tableaux»          #carta     │   secciones/05-carta            todas
 *   │ 06 Historia · «le sac de jute»     #histoire  │   secciones/06-historia         estándar, premium
 *   │ 07 Galería · «l'expo»              #expo      │   secciones/07-galeria          estándar, premium (≥ 3 fotos)
 *   │ 08 Opiniones · «le livre d'or»     #avis      │   secciones/08-opiniones        estándar, premium
 *   │ 09 Promociones · «à l'affiche»     #affiche   │   secciones/09-promos           premium, si hay promos
 *   │ 10 Reserva · «prenez un fauteuil»  #reserver  │   secciones/10-reserva          premium, con WhatsApp
 *   │ 11 Visita · «nous trouver»         #visite    │   secciones/11-visita           todas
 *   ├───────────────────────────────────────────────┤
 *   │ 12 Pie                                        │   secciones/12-pie              todas
 *   └───────────────────────────────────────────────┘
 *     13 Pedido · «le sac kraft» (panel por encima)       secciones/13-pedido           premium, con WhatsApp y precios
 *     14 WhatsApp flotante (botón fijo)                   secciones/14-whatsapp         estándar, premium, con WhatsApp
 *
 * ES: data-anim en la raíz = nivel de animación ("ninguna" básica, "scroll" estándar, "completa" premium): los .css
 *     de cada sección lo usan para encender sus animaciones (ver comun/animacion.tsx).
 * EN: data-anim on the root = animation level ("ninguna" basic, "scroll" standard, "completa" premium): each
 *     section's .css uses it to switch its animations on (see comun/animacion.tsx).
 */
import { MotionConfig } from "framer-motion";
import { useMotor } from "@/motor";
import { Cabecera } from "./secciones/01-cabecera/Cabecera";
import { Portada } from "./secciones/02-portada/Portada";
import { Mostrador } from "./secciones/03-mostrador/Mostrador";
import { PlatoDelDia } from "./secciones/04-plato-del-dia/PlatoDelDia";
import { Carta } from "./secciones/05-carta/Carta";
import { Historia } from "./secciones/06-historia/Historia";
import { Galeria } from "./secciones/07-galeria/Galeria";
import { Opiniones } from "./secciones/08-opiniones/Opiniones";
import { Promos } from "./secciones/09-promos/Promos";
import { Reserva } from "./secciones/10-reserva/Reserva";
import { Visita } from "./secciones/11-visita/Visita";
import { Pie } from "./secciones/12-pie/Pie";
import { Pedido } from "./secciones/13-pedido/Pedido";
import { WhatsappFlotante } from "./secciones/14-whatsapp/WhatsappFlotante";

export function Pagina() {
  const { secciones, funciones } = useMotor();
  const anim = funciones.animacionesAvanzadas ? "completa" : funciones.animaciones ? "scroll" : "ninguna";
  return (
    // ES: reducedMotion="user": framer-motion respeta "reducir movimiento" del sistema. · EN: framer-motion respects the system's "reduce motion".
    <MotionConfig reducedMotion="user">
      <div className="piel" data-anim={anim}>
        <Cabecera />
        <main id="contenido">
          <Portada />
          <Mostrador />
          <PlatoDelDia />
          {secciones.carta && <Carta />}
          {secciones.historia && <Historia />}
          {secciones.galeria && <Galeria />}
          {secciones.resenas && <Opiniones />}
          {secciones.promos && <Promos />}
          {secciones.reserva && <Reserva />}
          <Visita />
        </main>
        <Pie />
        {secciones.pedido && <Pedido />}
        {funciones.whatsappFlotante && <WhatsappFlotante />}
      </div>
    </MotionConfig>
  );
}
