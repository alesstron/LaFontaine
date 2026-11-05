/**
 * [CON CUIDADO · EDIT WITH CARE] Piel / Skin · 05 Carta · Cómo se ordena la carta / How the menu is laid out
 *
 * ES: Funciones puras (sin React) que convierten las categorías de cafe.config.ts en lo que se pinta en las pizarras.
 *     No cambian los datos: solo deciden cómo se muestran.
 * EN: Pure functions (no React) that turn the categories in cafe.config.ts into what the boards draw.
 *     They don't change the data: they only decide how it is shown.
 *
 *   repartirTableros(carta)   categorías → 3 pizarras (según ajustes/textos.ts → TABLEROS)
 *   agruparPlatos(platos)     "Latté · petit" + "Latté · moyen" + "Latté · grand"  →  LATTÉ  (P 4,60) (M 5,20) (G 5,70)
 *   precioComun(platos)       TACOS: 12,75 · 12,75 · 12,75 · 10  →  "TACOS 12,75 $" en la caja; el 10 $ va a mano
 *   quitaCategoria(…)         bajo "TACOS": "Tacos birria" → "birria" (solo si TODOS empiezan por "Tacos")
 */
import type { Categoria, Plato, Texto } from "@/motor";
import { TABLEROS } from "@/estilo/ajustes/textos";

/** ES: Una pizarra con sus categorías ya buscadas en la carta. · EN: A board with its categories already looked up in the menu. */
export type Tablero = (typeof TABLEROS)[number] & { grupos: Categoria[] };

/**
 * ES: Reparte las categorías de la carta entre las pizarras de TABLEROS. Las que no están en ninguna van a la
 *     última, así ningún plato desaparece si el dueño añade una categoría. Las pizarras vacías no salen.
 * EN: Shares the menu categories out between the TABLEROS boards. Any category in none of them goes to the last
 *     one, so no item disappears if the owner adds a category. Empty boards don't show.
 */
export function repartirTableros(carta: Categoria[]): Tablero[] {
  const usadas = new Set<string>();
  const tableros: Tablero[] = TABLEROS.map((tb) => {
    const grupos = tb.categorias
      .map((id) => carta.find((c) => c.id === id))
      .filter((c): c is Categoria => Boolean(c && c.platos.length));
    grupos.forEach((c) => usadas.add(c.id));
    return { ...tb, grupos };
  });
  const sueltas = carta.filter((c) => !usadas.has(c.id) && c.platos.length);
  if (sueltas.length) tableros[tableros.length - 1].grupos.push(...sueltas);
  return tableros.filter((tb) => tb.grupos.length);
}

/** ES: Un tamaño de un plato: el plato, la palabra ("moyen") y su letra ("M"). · EN: One size of an item: the item, the word ("moyen") and its letter ("M"). */
export type Opcion = { plato: Plato; tamano: string; letra: string };
/** ES: Una línea de la pizarra: un plato suelto o un plato con varios tamaños. · EN: One board line: a single item or an item with several sizes. */
export type Fila = { tipo: "plato"; plato: Plato } | { tipo: "tamanos"; base: string; opciones: Opcion[] };

const SEPARADOR = " · ";

/**
 * ES: Junta los platos seguidos que comparten nombre antes de " · " en una fila con un botón por tamaño. La letra
 *     es la inicial del tamaño (P, M, G) salvo que dos se repitan: entonces sale la palabra entera.
 * EN: Joins consecutive items sharing the name before " · " into one row with one button per size. The letter is the
 *     size's initial (S, M, L) unless two repeat: then the whole word shows.
 */
export function agruparPlatos(platos: Plato[], tx: (t?: Texto) => string): Fila[] {
  const filas: Fila[] = [];
  for (const plato of platos) {
    const nombre = tx(plato.nombre);
    const corte = nombre.indexOf(SEPARADOR);
    const ultima = filas[filas.length - 1];
    if (corte > 0) {
      const base = nombre.slice(0, corte);
      const tamano = nombre.slice(corte + SEPARADOR.length);
      const opcion = { plato, tamano, letra: tamano.charAt(0).toLocaleUpperCase() };
      if (ultima?.tipo === "tamanos" && ultima.base === base) ultima.opciones.push(opcion);
      else filas.push({ tipo: "tamanos", base, opciones: [opcion] });
    } else filas.push({ tipo: "plato", plato });
  }
  return filas.map((f): Fila => {
    if (f.tipo !== "tamanos") return f;
    if (f.opciones.length === 1) return { tipo: "plato", plato: f.opciones[0].plato };
    const letras = new Set(f.opciones.map((o) => o.letra));
    return letras.size === f.opciones.length ? f : { ...f, opciones: f.opciones.map((o) => ({ ...o, letra: o.tamano })) };
  });
}

/**
 * ES: Precio común del grupo, como "TACOS 12,75 $" en el menú: todos los platos menos uno como mucho cuestan lo
 *     mismo (y ninguno es suplemento). El que cambia lleva su precio escrito a mano. null = sin precio común.
 * EN: The group's shared price, like "TACOS $12.75" on the menu: every item but one at most costs the same (and none
 *     is an add-on). The one that differs gets its price handwritten. null = no shared price.
 */
export function precioComun(platos: Plato[]): number | null {
  const conPrecio = platos.filter((p) => typeof p.precio === "number");
  if (conPrecio.length < 2 || conPrecio.some((p) => p.suplemento)) return null;
  const veces = new Map<number, number>();
  for (const p of conPrecio) veces.set(p.precio as number, (veces.get(p.precio as number) ?? 0) + 1);
  const [precio, cuantas] = [...veces.entries()].sort((a, b) => b[1] - a[1])[0];
  return cuantas >= 2 && conPrecio.length - cuantas <= 1 ? precio : null;
}

// ES: Comparar palabras sin tildes, mayúsculas ni plural ("Tacos" = "taco"). · EN: Compare words ignoring accents, case and plural ("Tacos" = "taco").
const normal = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
const raiz = (palabra: string) => normal(palabra).replace(/s$/, "");

/**
 * ES: Nombre corto bajo su categoría, como en la pizarra: si TODOS los platos empiezan por la palabra de la
 *     categoría ("Tacos birria", "Tacos pastor"…), esa palabra se quita ("birria", "pastor"). Si no, nombre
 *     completo. El mensaje de WhatsApp siempre lleva el nombre completo.
 * EN: Short name under its category, as on the board: if ALL items start with the category's word ("Tacos birria",
 *     "Tacos pastor"…), that word is dropped ("birria", "pastor"). Otherwise the full name. The WhatsApp message
 *     always carries the full name.
 */
export function quitaCategoria(nombres: string[], categoria: string): (nombre: string) => string {
  const palabra = raiz(categoria.split(" ")[0] ?? "");
  const todos = nombres.length >= 2 && nombres.every((n) => n.includes(" ") && raiz(n.split(" ")[0]) === palabra);
  return (nombre) => (todos && nombre.includes(" ") && raiz(nombre.split(" ")[0]) === palabra ? nombre.slice(nombre.indexOf(" ") + 1) : nombre);
}
