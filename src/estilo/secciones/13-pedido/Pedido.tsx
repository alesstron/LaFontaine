"use client";

/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · 13 Pedido / Order · «le sac kraft»
 *
 * ES: El panel del pedido es la bolsa de papel kraft que hay sobre los silos: borde dentado, pliegue, etiqueta salmón
 *     ("Pour emporter · Pour : nombre") y el ticket dentro. Al enviarlo se abre WhatsApp con el pedido escrito (sin
 *     pago en la web). Se abre con la bolsa de la cabecera. Solo en premium y con WhatsApp en cafe.config.ts.
 * EN: The order panel is the kraft paper bag sitting on the bins: serrated edge, fold, salmon label ("Pour emporter ·
 *     Pour: name") and the ticket inside. Sending it opens WhatsApp with the order written (no payment on the site).
 *     It opens from the header bag. Premium only, with a WhatsApp number in cafe.config.ts.
 *
 *   Móvil: sube desde abajo · Mobile: slides up      Escritorio: a la derecha · Desktop: on the right
 *   ┌╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲┐  ← borde dentado · serrated edge (.bolsa__pliegue)
 *   │ [Pour emporter · Pour : Alex] │  ← etiqueta salmón · salmon label
 *   │ Votre commande            (✕) │
 *   │ ┌───────────────────────────┐ │
 *   │ │ Tacos birria  (−) 2 (+)  25,50 $ │  ← ticket (líneas del carrito · cart lines)
 *   │ │ TOTAL ESTIMÉ        35,70 $ │ │
 *   │ └───────────────────────────┘ │
 *   │ NOM [______________]          │
 *   │ HEURE DE CUEILLETTE [▾]       │  ← cada 15 min hasta el cierre · every 15 min until closing
 *   │ NOTE [______________]         │
 *   │ ( ENVOYER PAR WHATSAPP )      │
 *   └───────────────────────────────┘
 *
 * Accesibilidad · Accessibility: al abrir, el foco va a ✕, Tab no sale del panel, Escape cierra y el foco vuelve al
 * botón que lo abrió; la página de detrás no se desplaza.
 *
 * Dónde cambiar · Where to change:
 *   Platos y precios ............ src/data/cafe.config.ts → carta
 *   Número de WhatsApp .......... src/data/cafe.config.ts → contacto.whatsapp
 *   Etiqueta de la bolsa ........ src/estilo/ajustes/textos.ts → COPY.bolsaEtiqueta / bolsaPara
 *   Mensaje de WhatsApp ......... lo arma el motor (src/motor/proveedor.tsx → usePedido), no se toca aquí
 *   Aspecto de la bolsa y ticket  pedido.css (esta carpeta) · campos: comun/piezas.css (.campo)
 */
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, type KeyboardEvent } from "react";
import { useCarrito, useMotor, usePedido } from "@/motor";
import { COPY } from "@/estilo/ajustes/textos";
import { rellenar } from "@/estilo/comun/datos";

export function Pedido() {
  const { t, tx, precio, hora } = useMotor();
  const carrito = useCarrito();
  // ES: Estado del formulario, horas de recogida, validación y envío (motor). · EN: Form state, pickup times, validation and sending (engine).
  const p = usePedido();
  const panelRef = useRef<HTMLElement>(null);
  const cerrarRef = useRef<HTMLButtonElement>(null);
  // ES: La función de cerrar cambia en cada render; se guarda en una ref para no repetir el efecto.
  // EN: The close function changes on every render; it is kept in a ref so the effect does not re-run.
  const cerrar = useRef(carrito.cerrar);
  cerrar.current = carrito.cerrar;

  // ES: Al abrir: bloquea el scroll de la página, enfoca "cerrar", Escape cierra y el foco vuelve al botón.
  // EN: On open: locks page scroll, focuses "close", Escape closes and focus returns to the button.
  useEffect(() => {
    if (!carrito.abierto) return;
    const previo = document.activeElement as HTMLElement | null;
    const raiz = document.documentElement;
    const antes = raiz.style.overflow;
    raiz.style.overflow = "hidden";
    cerrarRef.current?.focus();
    const alPulsar = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") cerrar.current();
    };
    window.addEventListener("keydown", alPulsar);
    return () => {
      raiz.style.overflow = antes;
      window.removeEventListener("keydown", alPulsar);
      previo?.focus?.();
    };
  }, [carrito.abierto]);

  // ES: Mantiene el foco dentro del panel con Tab. · EN: Keeps focus inside the panel with Tab.
  const atrapar = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusables = panelRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), input, select, textarea, a[href]");
    const primero = focusables[0];
    const ultimo = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === primero) {
      e.preventDefault();
      ultimo?.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primero?.focus();
    }
  };

  const nombre = p.datos.nombre.trim();
  return (
    <AnimatePresence>
      {carrito.abierto && (
        // ▸ Capa oscura: un clic fuera de la bolsa la cierra · Dark layer: a click outside the bag closes it
        <motion.div className="pedido" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={carrito.cerrar}>
          {/* ▸ La bolsa (sube desde abajo) · The bag (slides up from the bottom) */}
          <motion.aside
            ref={panelRef}
            className="bolsa"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-bolsa"
            initial={{ y: "105%" }}
            animate={{ y: 0 }}
            exit={{ y: "105%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={atrapar}
          >
            <div className="bolsa__pliegue" aria-hidden="true" />
            <div className="bolsa__interior">
              {/* ▸ Etiqueta salmón, título y ✕ · Salmon label, title and ✕ */}
              <div className="bolsa__cabecera">
                <p className="bolsa__etiqueta">
                  {tx(COPY.bolsaEtiqueta)}
                  {nombre && <span> · {rellenar(tx(COPY.bolsaPara), { nombre })}</span>}
                </p>
                <h2 id="titulo-bolsa" className="bolsa__titulo">
                  {t("pedido")}
                </h2>
                <button ref={cerrarRef} type="button" className="bolsa__cerrar" onClick={carrito.cerrar} aria-label={t("cerrar")}>
                  <span aria-hidden="true">×</span>
                </button>
              </div>

              {/* ▸ El ticket: líneas con − cantidad + y total · The ticket: lines with − quantity + and total */}
              <div className="bolsa__ticket">
                {carrito.lineas.length === 0 ? (
                  <p className="bolsa__vacia">{t("pedidoVacio")}</p>
                ) : (
                  <ul className="ticket">
                    {carrito.lineas.map((l) => (
                      <li key={l.plato.id} className="ticket__linea">
                        <span className="ticket__nombre">{tx(l.plato.nombre)}</span>
                        <span className="ticket__cantidad">
                          <button type="button" aria-label={`${t("quitarUno")} : ${tx(l.plato.nombre)}`} onClick={() => carrito.quitar(l.plato.id)}>
                            −
                          </button>
                          <output aria-live="polite">{l.cantidad}</output>
                          <button type="button" aria-label={`${t("anadirUno")} : ${tx(l.plato.nombre)}`} onClick={() => carrito.anadir(l.plato.id)}>
                            +
                          </button>
                        </span>
                        <span className="ticket__precio">{precio(l.subtotal)}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="ticket__total">
                  <span>{t("totalEstimado")}</span>
                  <strong>{precio(carrito.total)}</strong>
                </p>
              </div>

              {/* ▸ Formulario: nombre, hora de recogida, nota y enviar · Form: name, pickup time, note and send */}
              <form
                className="formulario bolsa__formulario"
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  p.enviar();
                }}
              >
                <label className="campo">
                  <span>{t("nombre")}</span>
                  <input
                    value={p.datos.nombre}
                    onChange={(e) => p.cambiar("nombre", e.target.value)}
                    maxLength={60}
                    autoComplete="name"
                    aria-invalid={Boolean(p.errores.nombre)}
                    aria-describedby={p.errores.nombre ? "error-pedido-nombre" : undefined}
                  />
                  {p.errores.nombre && (
                    <small id="error-pedido-nombre" className="campo__error">
                      {p.errores.nombre}
                    </small>
                  )}
                </label>
                <label className="campo">
                  <span>{t("horaRecogida")}</span>
                  <select value={p.datos.hora} onChange={(e) => p.cambiar("hora", e.target.value)}>
                    <option value="">{t("loAntesPosible")}</option>
                    {p.horas.map((h) => (
                      <option key={h} value={h}>
                        {hora(h)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="campo">
                  <span>{t("nota")}</span>
                  <textarea value={p.datos.nota} onChange={(e) => p.cambiar("nota", e.target.value)} maxLength={300} rows={2} placeholder={t("notaAyuda")} />
                </label>
                <button type="submit" className="boton boton--taza boton--ancho" disabled={carrito.lineas.length === 0}>
                  {t("enviarPedido")}
                </button>
                <p className="formulario__ayuda">{t("pedidoAyuda")}</p>
              </form>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
