"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · Piezas comunes / Shared pieces
 *
 * ES: Dos piezas que usan varias secciones. Sus estilos están en comun/piezas.css.
 * EN: Two pieces used by several sections. Their styles live in comun/piezas.css.
 *
 *   <Imagen>        Foto de public/img con next/image (tamaño real y texto alternativo traducido)
 *                   Usada en · Used in: portada, carta (polaroids), galería, promociones
 *   <BotonAnadir>   Botón que añade un plato al pedido · Button that adds an item to the order
 *                   Usada en · Used in: plato del día ("texto"), carta ("redondo" y "tamano")
 *
 *     variante="redondo"   (+)            variante="texto"   ( AJOUTER )    variante="tamano"   ( M 5,20 $ )
 *     Al pulsar · On click: se rellena un momento y sale [n] con la cantidad · fills briefly and shows [n]
 */
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useCarrito, useMotor, type Foto, type Plato } from "@/motor";

/**
 * ES: Foto de public/img. `sizes` dice qué ancho ocupa en pantalla para que se descargue la versión justa.
 * EN: Photo from public/img. `sizes` tells how wide it shows on screen so the right version is downloaded.
 */
export function Imagen({ foto, sizes, className, prioridad = false }: { foto: Foto; sizes: string; className?: string; prioridad?: boolean }) {
  const { tx } = useMotor();
  return <Image src={foto.src} alt={tx(foto.alt)} width={foto.ancho} height={foto.alto} sizes={sizes} className={className} priority={prioridad} />;
}

/**
 * ES: Botón rojo taza que añade un plato al pedido. Solo se pinta si la gama tiene pedido (lo decide cada sección).
 *     El nombre completo y el precio van en aria-label para lectores de pantalla.
 * EN: Red-cup button that adds an item to the order. Only drawn if the tier has ordering (each section decides).
 *     The full name and price go in aria-label for screen readers.
 */
export function BotonAnadir({ plato, variante = "redondo", children }: { plato: Plato; variante?: "redondo" | "texto" | "tamano"; children?: ReactNode }) {
  const { t, tx, precio } = useMotor();
  const carrito = useCarrito();
  const [hecho, setHecho] = useState(false);
  const temporizador = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(temporizador.current), []);
  const n = carrito.cantidadDe(plato.id);

  // ES: Añade y marca el botón como "hecho" 1,3 s (CSS: [data-hecho="true"]). · EN: Adds and marks the button "done" for 1.3 s (CSS: [data-hecho="true"]).
  const anadir = () => {
    carrito.anadir(plato.id);
    setHecho(true);
    window.clearTimeout(temporizador.current);
    temporizador.current = window.setTimeout(() => setHecho(false), 1300);
  };

  const etiqueta = `${t("anadir")} : ${tx(plato.nombre)}${typeof plato.precio === "number" ? ` (${precio(plato.precio, plato.suplemento)})` : ""}`;
  return (
    <button type="button" className={`anadir anadir--${variante}`} data-hecho={hecho} onClick={anadir} aria-label={etiqueta}>
      {variante === "texto" && <span>{hecho ? t("anadido") : t("anadir")}</span>}
      {variante === "redondo" && <span className="anadir__signo" aria-hidden="true" />}
      {variante === "tamano" && children}
      {/* ES: [n] cuántos hay ya en el pedido. · EN: [n] how many are already in the order. */}
      {n > 0 && (
        <span className="anadir__n" aria-hidden="true">
          {n}
        </span>
      )}
    </button>
  );
}
