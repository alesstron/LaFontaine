/**
 * [NO TOCAR · DO NOT EDIT] Motor / Engine
 *
 * ES: SEO: título, descripción y vista previa al compartir el enlace (Open Graph), más los datos
 *     estructurados que Google usa para la ficha del negocio (dirección, horario, coordenadas).
 *     Todo sale de src/data/cafe.config.ts.
 * EN: SEO: title, description and link preview when sharing (Open Graph), plus the structured data
 *     Google uses for the business listing (address, hours, coordinates). Everything comes from
 *     src/data/cafe.config.ts.
 */
import type { Metadata } from "next";
import { traducir } from "./textos";
import type { CafeConfig, DiaSemana } from "./tipos";

const DIA_SCHEMA = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

export function metadataDe(cafe: CafeConfig): Metadata {
  const base = cafe.idiomaBase;
  const titulo = `${cafe.marca.nombre} · ${traducir(cafe.marca.eslogan, base, base)}`;
  const descripcion = traducir(cafe.marca.descripcion, base, base);
  const imagen = cafe.portada?.src;
  return {
    title: titulo,
    description: descripcion,
    metadataBase: cafe.seo?.url ? new URL(cafe.seo.url) : undefined,
    icons: cafe.marca.icono ? { icon: cafe.marca.icono } : undefined,
    openGraph: {
      title: titulo,
      description: descripcion,
      type: "website",
      siteName: cafe.marca.nombre,
      locale: `${base}_${cafe.region.toUpperCase()}`,
      images: imagen ? [{ url: imagen }] : undefined,
    },
    // ES: Una demo no debe salir en Google ni competir con la web oficial del café.
    // EN: A demo must not appear on Google or compete with the café's official website.
    robots: cafe.demo ? { index: false, follow: false } : undefined,
  };
}

/** ES: Datos estructurados schema.org (JSON-LD en layout.tsx). · EN: schema.org structured data (JSON-LD in layout.tsx). */
export function jsonLdDe(cafe: CafeConfig): Record<string, unknown> {
  const base = cafe.idiomaBase;
  const { contacto } = cafe;
  // ES: Agrupa los días que comparten horario: { "10:00-22:00": [0, 1, 2, 3] }.
  // EN: Groups the days that share opening hours: { "10:00-22:00": [0, 1, 2, 3] }.
  const porHorario = new Map<string, DiaSemana[]>();
  for (const f of cafe.horario.franjas) {
    const clave = `${f.abre}-${f.cierra}`;
    porHorario.set(clave, [...(porHorario.get(clave) ?? []), f.dia]);
  }
  return {
    "@context": "https://schema.org",
    "@type": cafe.tipo,
    name: cafe.marca.nombre,
    description: traducir(cafe.marca.descripcion, base, base),
    url: cafe.seo?.url,
    image: cafe.portada?.src,
    telephone: contacto.telefono,
    address: {
      "@type": "PostalAddress",
      streetAddress: contacto.direccion,
      addressLocality: contacto.ciudad,
      postalCode: contacto.codigoPostal,
      addressRegion: contacto.provincia,
      addressCountry: contacto.pais,
    },
    geo: { "@type": "GeoCoordinates", latitude: contacto.lat, longitude: contacto.lng },
    openingHoursSpecification: [...porHorario].map(([clave, dias]) => {
      const [abre, cierra] = clave.split("-");
      return { "@type": "OpeningHoursSpecification", dayOfWeek: dias.map((d) => DIA_SCHEMA[d]), opens: abre, closes: cierra };
    }),
    sameAs: Object.values(contacto.redes ?? {}).filter(Boolean),
  };
}
