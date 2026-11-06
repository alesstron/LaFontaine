# Reservas en línea · Café LaFontaine

**Español** · [English](RESERVAS.en.md)

La web tiene un sistema de reservas de verdad: el cliente elige día y hora entre los huecos libres, la reserva **se guarda en una base de datos** y queda **confirmada al momento** si hay sitio. El café las ve y las gestiona en un **panel con contraseña**. Todo es gratis: la web en **Vercel** y la base de datos en **Neon**, las dos con tu propia cuenta y sin pedir permisos a nadie.

> [!NOTE]
> Mientras `demo: true` (en `src/data/cafe.config.ts`), las páginas de reserva enseñan el aviso «Maquette de démonstration : les réservations faites ici servent d'essai». Las reservas se guardan igual, pero son de prueba.

## Índice

1. [Cómo funciona](#1-cómo-funciona)
2. [Probar en tu ordenador (sin cuentas)](#2-probar-en-tu-ordenador-sin-cuentas)
3. [Publicar en Vercel con Neon, paso a paso](#3-publicar-en-vercel-con-neon-paso-a-paso)
4. [Lista de pruebas](#4-lista-de-pruebas)
5. [Usar el panel del café](#5-usar-el-panel-del-café)
6. [Cambiar plazas, horas y días cerrados](#6-cambiar-plazas-horas-y-días-cerrados)
7. [Variables de entorno](#7-variables-de-entorno)
8. [Problemas frecuentes](#8-problemas-frecuentes)
9. [Privacidad y seguridad](#9-privacidad-y-seguridad)
10. [Límites de los planes gratuitos](#10-límites-de-los-planes-gratuitos)
11. [Cómo está hecho (programadores)](#11-cómo-está-hecho-programadores)

---

## 1. Cómo funciona

```text
 Web (inicio)                    Pestaña nueva: /reserver                      Panel del café: /reserver/gestion
 ┌─────────────────────┐         ┌─────────────────────────────────────┐       ┌────────────────────────────────────┐
 │ «Réserver» en la    │────────►│ 1 ¿Cuántas personas?  ( − 2 + )     │       │ Contraseña → entrar                │
 │ cabecera, la        │ pestaña │ 2 ¿Qué día?  [calendario 30 días]   │       │ Base de datos: conectada (Neon)    │
 │ portada y la        │  nueva  │ 3 ¿A qué hora? (8 h)(8 h 30)…       │       │ Semana: día por día, hora a hora   │
 │ sección «Prenez un  │         │ 4 Nombre, teléfono, nota            │       │ 8 h 30 · 6 / 12 plazas             │
 │ fauteuil»           │         │ ( RÉSERVER LA TABLE )               │       │   Marie · 2 pers. · tel · nota     │
 └─────────────────────┘         │ → «RÉSERVÉ», código y enlace        │       │   [Annuler] / [Rétablir]           │
                                 │   para anular                       │       │ + Añadir reserva (teléfono)        │
                                 └─────────────────────────────────────┘       └────────────────────────────────────┘
```

**El cliente**
- Pulsa «Réserver» en la web: se abre la página `/reserver` en una pestaña nueva, con el mismo estilo de la web (pared crema, sillones, etiquetas salmón).
- Elige cuántas personas (hasta 8; los grupos más grandes llaman), el día (los próximos 30 días) y la hora (cada media hora, desde que abre hasta 1 hora antes de cerrar y con 2 horas de antelación como mínimo).
- Los domingos y los días completos salen apagados; las horas sin sitio salen tachadas.
- Deja su nombre y su teléfono, y la reserva queda **confirmada al momento**, con un código (por ejemplo `7KQ-3XA`) y un **enlace para anularla**. El enlace solo se enseña esa vez: no se envían correos ni SMS.

**Las plazas**
- `plazasPorTurno` (12) es el número máximo de personas que pueden **llegar** en cada media hora, sumando todas las reservas de esa hora. No es el número de sillas del local: alguien que llega a las 9 h sigue sentado a las 9 h 30, pero ese turno vuelve a tener 12 plazas para quien llega a las 9 h 30. Ajusta el número a lo que el café puede recibir de golpe.
- Si dos personas cogen la última plaza a la vez, solo entra una; la otra ve «Ce créneau vient d'être complété» y elige otra hora.

**El café**
- Entra en `/reserver/gestion` con su contraseña. No hay enlaces a esa página desde la web y Google nunca la enseña.
- Ve la semana día por día: cada hora con su ocupación («6 / 12 places») y sus reservas (nombre, personas, teléfono para llamar, nota, si llegó por la web o por teléfono, y el código).
- Puede anular una reserva, volver a confirmarla («Rétablir») y apuntar las que le hacen por teléfono o en la barra.

**Lo que no hace** (por ahora): no cobra, no envía correos ni SMS, no asigna mesas concretas y no modifica una reserva (se anula y se hace otra).

---

## 2. Probar en tu ordenador (sin cuentas)

En tu ordenador no hace falta Neon ni Vercel: la web usa **PGlite**, un Postgres completo que se instala con `npm install` (sin permisos de administrador) y guarda los datos en una carpeta de tu usuario.

En la carpeta del proyecto (`cafe v1/demos/premium/cafe-lafontaine` en tu ordenador, o `LaFontaine` si lo clonas de GitHub):

```bash
npm install
npm run dev
```

1. Abre http://localhost:3000/reserver y haz una reserva.
2. El panel necesita una contraseña en el archivo `.env.local` de la carpeta del proyecto (nunca se sube a GitHub). Si no existe, copia `.env.example` como `.env.local` y escribe tu contraseña después de `RESERVAS_CLAVE=`; si ya existe (en este ordenador ya hay una puesta), ábrelo para verla o cámbiala. Tras cambiarla, reinicia `npm run dev`.
3. Abre http://localhost:3000/reserver/gestion y entra con esa contraseña. El panel dice «Base de données : connectée · PGlite, sur cet ordinateur» y la carpeta donde están los datos.

**Dónde se guardan los datos locales:** `%LOCALAPPDATA%\cafe-lafontaine\reservas-pglite` en Windows (`~/.local/share/cafe-lafontaine/reservas-pglite` en Mac y Linux), fuera de OneDrive a propósito: un sincronizador puede bloquear los archivos de una base de datos. Para **empezar de cero**, para el servidor y borra esa carpeta. Para usar otra carpeta, pon `RESERVAS_PGLITE_DIR=ruta` en `.env.local`.

> [!IMPORTANT]
> No abras dos servidores a la vez sobre la misma base local (por ejemplo `npm run dev` y `npm start`): el segundo se para con el mensaje «La base local … ya la usa otro servidor». Cierra el otro primero.

---

## 3. Publicar en Vercel con Neon, paso a paso

Las dos cuentas son **personales y gratuitas**, y se crean con tu GitHub. No usamos la integración de Neon del «Marketplace» de Vercel porque en las cuentas de equipo pide permiso al administrador: creamos la base en neon.tech y pegamos su dirección en Vercel.

### Paso 1 · Crear la base de datos en Neon

1. Abre **https://neon.tech** y pulsa **Sign up**. Elige **Continue with GitHub** (con tu cuenta, `alesstron`).
2. Crea un proyecto (**Create project**):
   - **Project name**: `cafe-lafontaine`.
   - **Postgres version**: la que viene por defecto.
   - **Region**: **AWS US East 1 (N. Virginia)**. Es la más cercana a Montréal y a los servidores de Vercel, así la web va más rápida.
3. En el panel del proyecto pulsa **Connect** (arriba a la derecha).
   - Deja activado **Connection pooling** (dirección «pooled»: lleva `-pooler` en el nombre del servidor).
   - Copia la dirección que empieza por **`postgresql://`** (botón de copiar).

> [!CAUTION]
> Esa dirección lleva dentro la contraseña de la base de datos. Pégala solo en Vercel (paso 2) o en tu `.env.local`; nunca en GitHub, en un chat ni en un correo.

No hace falta crear tablas ni ejecutar nada en Neon: la web las crea sola la primera vez.

### Paso 2 · Importar el proyecto en Vercel

1. Abre **https://vercel.com/new** y entra con **Continue with GitHub** (cuenta personal, plan **Hobby**).
2. En **Import Git Repository** busca **`alesstron/LaFontaine`** y pulsa **Import**.
   - Si no sale en la lista: **Adjust GitHub App Permissions** → da acceso a ese repositorio. Es tu propia cuenta de GitHub: no hace falta ningún administrador.
3. Deja lo que Vercel detecta: **Framework Preset: Next.js**, **Root Directory: `./`**.
4. Abre **Environment Variables** y añade dos:

   | Key | Value |
   |---|---|
   | `DATABASE_URL` | la dirección `postgresql://…` que copiaste en Neon |
   | `RESERVAS_CLAVE` | la contraseña que quieras para el panel (12 caracteres o más; mejor una frase) |

5. Pulsa **Deploy** y espera a que termine (1–2 minutos).

> [!TIP]
> ¿Ya habías importado el proyecto sin las variables? Ve a **Settings → Environment Variables**, añádelas y después a **Deployments → ⋯ (del último) → Redeploy**. Las variables nuevas solo se aplican al volver a publicar.

### Paso 3 · Comprobar que funciona

1. Abre `https://<tu-proyecto>.vercel.app/reserver/gestion`, escribe tu contraseña y mira la línea de arriba:
   **«Base de données : connectée · Neon, en ligne · Réservations enregistrées : 0»**.
2. En otra pestaña abre `https://<tu-proyecto>.vercel.app/reserver` y haz una reserva de prueba.
3. Pulsa **Actualiser** en el panel: la reserva aparece en su día y su hora.
4. Abre el enlace para anular que te dio la confirmación y anúlala: en el panel sale tachada, «Annulée par le client».

A partir de ahí, cada `git push` a `main` vuelve a publicar la web sola, con las mismas variables.

---

## 4. Lista de pruebas

Márcala en tu ordenador y otra vez en Vercel:

- [ ] Los tres botones de la web (enlace «Réserver» de la cabecera, «Réserver une table» de la portada y «Voir les places libres» de la sección de los sillones) abren `/reserver` en una **pestaña nueva**.
- [ ] Una reserva completa: personas → día → hora → nombre y teléfono → «RÉSERVÉ» con código y enlace.
- [ ] La reserva sale en el panel, en su día y su hora, con el teléfono y la nota.
- [ ] Llenar un turno: una reserva de 8 y otra de 4 a la misma hora → esa hora sale **tachada** (con 1 persona); otra reserva a esa hora se rechaza.
- [ ] El enlace para anular enseña la reserva y, al pulsar «Annuler la réservation», libera las plazas.
- [ ] Panel: «Annuler» y «Rétablir» funcionan; «Ajouter une réservation» apunta una del teléfono; con «Même si le créneau est complet» entra aunque esté lleno.
- [ ] Contraseña mala → «Mot de passe incorrect»; 5 fallos en 15 minutos desde la misma conexión → «Trop d'essais» (espera de 15 minutos).
- [ ] «Quitter» cierra la sesión.
- [ ] Francés, inglés y español (botones FR · EN · ES).
- [ ] En el móvil se lee bien y no hay que desplazarse de lado.

---

## 5. Usar el panel del café

- **Entrar**: `/reserver/gestion` → contraseña → **Entrer**. La sesión dura 12 horas en ese navegador; **Quitter** la cierra antes.
- **La semana**: siete días desde hoy. **‹ ›** cambian de semana; **Aujourd'hui** vuelve a la actual; **Actualiser** recarga (y se recarga sola cada 2 minutos mientras la pestaña está a la vista).
- **Cada hora** enseña la ocupación («6 / 12 places») con una barra que se pone roja al llenarse.
- **Cada reserva**: nombre y personas; teléfono (se puede pulsar para llamar desde el móvil); «en ligne» o «téléphone»; el código; la nota.
- **Annuler**: la reserva queda tachada en la lista y sus plazas se liberan. **Rétablir** la vuelve a confirmar si todavía cabe en su turno.
- **Ajouter une réservation**: para las que llegan por teléfono o en la barra. Admite grupos de hasta 12 personas y fechas hasta un año vista, sin la antelación mínima de la web. **«Même si le créneau est complet»** la guarda aunque el turno esté lleno (si sabéis que cabe una mesa más).

---

## 6. Cambiar plazas, horas y días cerrados

Todo está en `src/data/cafe.config.ts`, bloque `reservas` (y el horario en `horario`):

```ts
reservas: {
  plazasPorTurno: 12,  // personas que pueden llegar en cada media hora
  maxPersonas: 8,      // grupo más grande que reserva en la web
  antelacionMin: 120,  // minutos mínimos de aviso (120 = 2 horas)
  diasVista: 30,       // días que se pueden reservar, contando hoy
  paso: 30,            // minutos entre horas (30 = 8 h, 8 h 30…)
  cerrados: [],        // días sueltos sin reservas: ["2026-12-25", "2027-01-01"]
},
```

| Quiero… | Cambio |
|---|---|
| Más o menos plazas | `plazasPorTurno` |
| Que los grupos de 10 reserven en la web | `maxPersonas: 10` (y `plazasPorTurno` como mínimo 10) |
| Aceptar reservas con 1 hora de aviso | `antelacionMin: 60` |
| Cerrar las reservas un festivo o un evento privado | añade la fecha a `cerrados` |
| Cambiar las horas | `horario.franjas` (las reservas siguen al horario: hasta 1 hora antes de cerrar) |
| Quitar las reservas de la web | `funciones: { reserva: false }` (o borra el bloque `reservas`) |

Después: `git push` y Vercel publica solo. Las reservas ya hechas no cambian.

---

## 7. Variables de entorno

| Variable | Dónde | Para qué |
|---|---|---|
| `DATABASE_URL` | Vercel (obligatoria) · tu ordenador (opcional) | Dirección de Neon. En tu ordenador, si la pones, usarás la base de **Neon** (datos reales) en vez de la local. |
| `RESERVAS_CLAVE` | Vercel (obligatoria) · tu ordenador | Contraseña del panel, mínimo 8 caracteres (mejor 12 o más). En Vercel, sin ella la web **no acepta reservas** (nadie podría verlas). Cambiarla cierra todas las sesiones. |
| `RESERVAS_PGLITE_DIR` | solo tu ordenador (opcional) | Carpeta de la base local, si no quieres la de por defecto. |

El modelo está en `.env.example` (sin valores). Los valores reales van en Vercel o en `.env.local`, que nunca se sube a GitHub.

---

## 8. Problemas frecuentes

| Lo que ves | Qué pasa y qué hacer |
|---|---|
| En `/reserver`: «Les réservations en ligne ne sont pas encore ouvertes» | En Vercel falta `DATABASE_URL` o `RESERVAS_CLAVE`, o las añadiste sin volver a publicar. Añádelas y haz **Redeploy** (paso 2). |
| En el panel: «pas connectée · Il manque la variable DATABASE_URL» | Igual: falta `DATABASE_URL` en Vercel, o no está marcada para **Production**. |
| En el panel: «DATABASE_URL ne contient pas d'adresse postgresql://» | Se pegó otra cosa. Vuelve a copiarla desde **Connect** en Neon: tiene que empezar por `postgresql://`. |
| En el panel: «La base ne répond pas» | Neon está despertando o caído, o la dirección es de un proyecto borrado. Espera un minuto y pulsa **Actualiser**. Debajo sale el mensaje técnico, y en Vercel lo ves en **Logs**. |
| La primera visita del día tarda 1–2 segundos más | Normal en el plan gratuito: Neon se duerme tras unos minutos sin uso y se despierta solo. |
| «Mot de passe incorrect» y no la recuerdas | Cambia `RESERVAS_CLAVE` en Vercel (**Settings → Environment Variables**) y haz **Redeploy**. |
| «Trop d'essais. Réessayez dans 15 minutes.» | 5 contraseñas malas en 15 minutos desde esa conexión. Espera 15 minutos. |
| «Votre session a expiré» | Pasaron 12 horas o cambió la contraseña. Vuelve a entrar. |
| En tu ordenador: «La base local … ya la usa otro servidor (proceso N)» | Hay otro `npm run dev` o `npm start` abierto: ciérralo. Si no hay ninguno, borra el archivo `reservas-pglite.pid` que está junto a la carpeta de datos. |
| En tu ordenador: quiero borrar todas las reservas de prueba | Para el servidor y borra la carpeta `reservas-pglite` (ver apartado 2). |
| Un cliente perdió su enlace para anular | Que llame al café: se anula desde el panel con «Annuler». |

---

## 9. Privacidad y seguridad

**Qué se guarda:** nombre, teléfono, nota, día, hora, personas, idioma y cuándo se hizo. El teléfono solo sirve para avisar al cliente.

**Cuánto tiempo:** cada reserva se **borra sola 30 días después de su fecha**. Los intentos fallidos de entrar al panel se borran a las 24 horas.

**Lo que no se guarda:** la IP del visitante. Para frenar abusos se guarda una huella irreversible que además cambia cada día.

**Protecciones:**
- El servidor vuelve a comprobar cada reserva (fecha, hora, personas, campos) y nunca se fía de la pantalla.
- Antiabuso: campo trampa para robots, máximo 5 reservas por hora desde una misma conexión y 3 reservas futuras por teléfono.
- Panel: contraseña comparada en tiempo constante, pausa tras cada fallo, bloqueo tras 5 fallos en 15 minutos desde una misma conexión y cookie de sesión firmada, `HttpOnly`, `SameSite=Strict`, limitada a `/reserver/gestion` y con caducidad de 12 horas.
- El enlace para anular lleva un secreto de 192 bits: de la base de datos solo se guarda su huella.
- El panel y la página de anular no salen nunca en Google.

> [!IMPORTANT]
> **Ley 25 de Quebec.** Antes de usarlo con clientes de verdad, el café necesita una política de privacidad publicada y una persona responsable de los datos personales (normalmente el dueño). Queda **por confirmar con el dueño**.

---

## 10. Límites de los planes gratuitos

- **Neon Free**: 0,5 GB por proyecto (miles de reservas ocupan muy poco) y la base se duerme tras unos minutos sin uso. Los límites exactos están en https://neon.tech/pricing.
- **Vercel Hobby**: gratis, pero **solo para uso no comercial**. Para enseñar la demo vale; para la web real del café habría que pasar a **Pro** o usar otro alojamiento.

---

## 11. Cómo está hecho (programadores)

En esta demo el motor tiene servidor y base de datos (en la plantilla no). Detalle en la parte B del [manual](MANUAL.md#b11-reservas-en-línea-servidor-y-base-de-datos).

```text
src/app/reserver/
├── page.tsx              /reserver          estática: la piel pide las plazas con una acción de servidor
├── anular/page.tsx       /reserver/anular   estática: el código y el secreto van tras "#" (no llegan a los registros)
└── gestion/page.tsx      /reserver/gestion  dinámica: mira la cookie de sesión antes de pintar
src/motor/reservas/
├── bd.ts                 Neon (DATABASE_URL) o PGlite (local); una sola conexión por proceso
├── esquema.ts            crea las tablas solas y borra lo viejo (30 días)
├── disponibilidad.ts     fechas y horas en la zona del café (puro: servidor y navegador)
├── validar.ts            comprobación campo a campo (puro)
├── seguridad.ts          sesión del panel, contraseña, códigos, secretos y huellas
├── operaciones.ts        leer plazas, guardar si cabe, restaurar si cabe
├── acciones.ts           "use server": consultarDisponibilidad, crearReserva, verReservaParaAnular, anularReserva
├── gestion.ts            "use server": entrar, salir, estadoBaseDeDatos, listarReservas, anular, restaurar, por teléfono
├── cliente.ts            "use client": useReservaEnLinea, useAnularReserva, usePanelReservas
└── tipos.ts              tipos compartidos (el servidor devuelve códigos; la piel los traduce)
src/estilo/paginas/       la piel de las tres páginas (Marco, mensajes, reserva/, anular/, gestion/)
```

**Plazas sin choques.** Guardar es una sola transacción en `READ COMMITTED` con dos sentencias: primero `pg_advisory_xact_lock(72026002, hashtext('turno fecha hora'))`, después `INSERT … SELECT … WHERE (suma de personas confirmadas del turno) + personas <= plazas`. El cerrojo va en su propia sentencia para que la suma vea lo que confirmó la reserva anterior. Probado con 20 reservas simultáneas de 1 persona en un turno de 12: entran exactamente 12.
