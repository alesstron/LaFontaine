/**
 * [NO TOCAR · DO NOT EDIT] Motor / Engine
 *
 * ES: Configuración de Next.js: cabeceras de seguridad HTTP e imágenes; las cabeceras se aplican a
 *     todas las rutas mediante headers(). Viene de la plantilla, con un añadido propio de esta demo:
 *     la base de datos local de las reservas (serverExternalPackages, ver docs/RESERVAS.md).
 * EN: Next.js configuration: HTTP security headers and images; the headers apply to every route
 *     through headers(). It comes from the template, plus one addition specific to this demo:
 *     the local bookings database (serverExternalPackages, see docs/RESERVAS.en.md).
 */

// ES: En desarrollo se relajan algunas directivas de la CSP (recarga en caliente de Next).
// EN: In development some CSP rules are relaxed (Next hot reload).
const isDev = process.env.NODE_ENV !== "production";

// ES: Content-Security-Policy: orígenes desde los que el navegador puede cargar recursos.
//     Next.js inyecta scripts y estilos inline, por eso 'unsafe-inline'; 'unsafe-eval' solo en desarrollo.
// EN: Content-Security-Policy: origins the browser may load resources from.
//     Next.js injects inline scripts and styles, hence 'unsafe-inline'; 'unsafe-eval' only in development.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  // ES: Todas las fotos se sirven desde /public. · EN: All photos are served from /public.
  "img-src 'self' data: blob:",
  // ES: Las fuentes las aloja next/font en el propio dominio. · EN: Fonts are self-hosted by next/font.
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  // ES: Único iframe permitido: el mapa de Google (sin API key). · EN: Only allowed iframe: the Google map (no API key).
  "frame-src https://www.google.com https://maps.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  // ES: Los formularios solo se envían al propio dominio (reservas) o abren WhatsApp con el mensaje armado.
  // EN: Forms are only posted to this same domain (bookings) or open WhatsApp with the message ready.
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ES: Oculta "X-Powered-By: Next.js" para no revelar el stack. · EN: Hides "X-Powered-By: Next.js".
  poweredByHeader: false,
  // ES: Solo imágenes locales, servidas en AVIF/WebP. · EN: Local images only, served as AVIF/WebP.
  images: { formats: ["image/avif", "image/webp"] },
  // ES: PGlite (Postgres local para probar las reservas sin cuenta) trae su propio WebAssembly: se carga
  //     desde node_modules tal cual en vez de empaquetarlo. En Vercel no se usa (allí va Neon).
  // EN: PGlite (local Postgres to try bookings without an account) ships its own WebAssembly: it is
  //     loaded from node_modules as is instead of being bundled. Vercel does not use it (Neon runs there).
  serverExternalPackages: ["@electric-sql/pglite"],
  // ES: …y como en Vercel nunca se usa, se deja fuera de sus funciones (pesa unos 26 MB).
  // EN: …and since Vercel never uses it, it is left out of its functions (it weighs about 26 MB).
  outputFileTracingExcludes: { "*": ["node_modules/@electric-sql/pglite/**"] },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // ES: El panel del café y la página de anular nunca deben salir en buscadores (además de su <meta robots>).
      // EN: The café panel and the cancel page must never show up in search engines (on top of their <meta robots>).
      { source: "/reserver/:pagina(gestion|anular)", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

module.exports = nextConfig;
