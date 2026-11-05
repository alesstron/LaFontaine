/**
 * [NO TOCAR · DO NOT EDIT] Motor / Engine
 *
 * ES: Layout raíz. Conecta las tres piezas: los datos del café (src/data/cafe.config.ts), el motor
 *     (src/motor/: gama, idioma, carrito, SEO) y la piel (src/estilo/: fuentes, estilo.css y la página).
 * EN: Root layout. Connects the three pieces: the café data (src/data/cafe.config.ts), the engine
 *     (src/motor/: tier, language, cart, SEO) and the skin (src/estilo/: fonts, estilo.css and the page).
 */
import type { Metadata, Viewport } from "next";
import { cafe } from "@/data/cafe.config";
import { colorNavegador, fuentes } from "@/estilo";
import { MotorProvider } from "@/motor/proveedor";
import { jsonLdDe, metadataDe } from "@/motor/seo";
import "@/estilo/estilo.css";

export const metadata: Metadata = metadataDe(cafe);
export const viewport: Viewport = { themeColor: colorNavegador };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // ES: "<" se escapa para que ningún texto del café pueda cerrar la etiqueta <script>.
  // EN: "<" is escaped so no café text can close the <script> tag.
  const jsonLd = JSON.stringify(jsonLdDe(cafe)).replace(/</g, "\\u003c");
  return (
    <html lang={cafe.idiomaBase} className={fuentes}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        <MotorProvider cafe={cafe}>{children}</MotorProvider>
      </body>
    </html>
  );
}
