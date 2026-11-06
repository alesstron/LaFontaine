# Online bookings · Café LaFontaine

[Español](RESERVAS.md) · **English**

The site has a real booking system: the guest picks a day and a time among the free slots, the booking **is saved in a database** and is **confirmed instantly** if there is room. The café sees and manages bookings in a **password-protected panel**. Everything is free: the site on **Vercel** and the database on **Neon**, both with your own account and without asking anyone for permission.

> [!NOTE]
> While `demo: true` (in `src/data/cafe.config.ts`), the booking pages show the notice «Maquette de démonstration : les réservations faites ici servent d'essai» (Demo mock-up: bookings made here are for testing). Bookings are saved all the same, but they are test bookings.

## Contents

1. [How it works](#1-how-it-works)
2. [Try it on your computer (no accounts)](#2-try-it-on-your-computer-no-accounts)
3. [Publish on Vercel with Neon, step by step](#3-publish-on-vercel-with-neon-step-by-step)
4. [Test checklist](#4-test-checklist)
5. [Using the café panel](#5-using-the-café-panel)
6. [Change seats, times and closed days](#6-change-seats-times-and-closed-days)
7. [Environment variables](#7-environment-variables)
8. [Common problems](#8-common-problems)
9. [Privacy and security](#9-privacy-and-security)
10. [Free plan limits](#10-free-plan-limits)
11. [How it is built (developers)](#11-how-it-is-built-developers)

---

## 1. How it works

```text
 Site (home page)                 New tab: /reserver                          Café panel: /reserver/gestion
 ┌─────────────────────┐         ┌───────────────────────────────────┐       ┌──────────────────────────────────┐
 │ «Réserver» in the   │────────►│ 1 How many people?  ( − 2 + )     │       │ Password → sign in               │
 │ header, the hero    │   new   │ 2 Which day?  [30-day calendar]   │       │ Database: connected (Neon)       │
 │ and the «Prenez un  │   tab   │ 3 What time? (8 h)(8 h 30)…       │       │ Week: day by day, hour by hour   │
 │ fauteuil» section   │         │ 4 Name, phone, note               │       │ 8 h 30 · 6 / 12 seats            │
 │                     │         │ ( RÉSERVER LA TABLE )             │       │   Marie · 2 people · tel · note  │
 └─────────────────────┘         │ → «RÉSERVÉ», code and link        │       │   [Annuler] / [Rétablir]         │
                                 │   to cancel                       │       │ + Add booking (phone)            │
                                 └───────────────────────────────────┘       └──────────────────────────────────┘
```

**The guest**
- Clicks «Réserver» on the site: the `/reserver` page opens in a new tab, in the same style as the site (cream wall, armchairs, salmon labels).
- Chooses how many people (up to 8; larger groups call), the day (the next 30 days) and the time (every half hour, from opening until 1 hour before closing, and at least 2 hours ahead).
- Sundays and full days are greyed out; times with no room left are crossed out.
- Leaves their name and phone number, and the booking is **confirmed instantly**, with a code (for example `7KQ-3XA`) and a **link to cancel it**. The link is only shown that once: no emails or text messages are sent.

**Seats**
- `plazasPorTurno` (12) is the maximum number of people who can **arrive** in each half hour, adding up all the bookings for that time. It is not the number of chairs in the café: someone who arrives at 9:00 is still seated at 9:30, but that slot has 12 seats again for whoever arrives at 9:30. Set the number to what the café can take in at once.
- If two people take the last seat at the same time, only one gets it; the other sees «Ce créneau vient d'être complété» (That time slot just filled up) and picks another time.

**The café**
- Goes to `/reserver/gestion` with its password. Nothing on the site links to that page and Google never shows it.
- Sees the week day by day: each time with its occupancy («6 / 12 places») and its bookings (name, guests, phone to call, note, whether it came in online or by phone, and the code).
- Can cancel a booking, confirm it again («Rétablir») and record the ones made by phone or at the counter.

**What it does not do** (for now): it does not take payment, send emails or text messages, assign specific tables or modify a booking (you cancel it and make a new one).

---

## 2. Try it on your computer (no accounts)

On your computer you don't need Neon or Vercel: the site uses **PGlite**, a full Postgres that comes with `npm install` (no administrator rights needed) and keeps its data in a folder in your user profile.

In the project folder (`cafe v1/demos/premium/cafe-lafontaine` on your computer, or `LaFontaine` if you clone it from GitHub):

```bash
npm install
npm run dev
```

1. Open http://localhost:3000/reserver and make a booking.
2. The panel needs a password in the `.env.local` file of the project folder (it is never pushed to GitHub). If it does not exist, copy `.env.example` to `.env.local` and write your password after `RESERVAS_CLAVE=`; if it already exists (this computer already has one), open it to see it or change it. After changing it, restart `npm run dev`.
3. Open http://localhost:3000/reserver/gestion and sign in with that password. The panel says «Base de données : connectée · PGlite, sur cet ordinateur» (Database: connected · PGlite, on this computer) and shows the folder where the data is.

**Where the local data is stored:** `%LOCALAPPDATA%\cafe-lafontaine\reservas-pglite` on Windows (`~/.local/share/cafe-lafontaine/reservas-pglite` on Mac and Linux), outside OneDrive on purpose: a sync client can lock a database's files. To **start from scratch**, stop the server and delete that folder. To use another folder, set `RESERVAS_PGLITE_DIR=path` in `.env.local`.

> [!IMPORTANT]
> Don't run two servers at once on the same local database (for example `npm run dev` and `npm start`): the second one stops with the message «La base local … ya la usa otro servidor» (the local database … is already in use by another server). Close the other one first.

---

## 3. Publish on Vercel with Neon, step by step

Both accounts are **personal and free**, and you create them with your GitHub account. We don't use the Neon integration from the Vercel Marketplace because, on team accounts, it asks the administrator for permission: we create the database on neon.tech and paste its address into Vercel.

### Step 1 · Create the database on Neon

1. Open **https://neon.tech** and click **Sign up**. Choose **Continue with GitHub** (with your account, `alesstron`).
2. Create a project (**Create project**):
   - **Project name**: `cafe-lafontaine`.
   - **Postgres version**: the default one.
   - **Region**: **AWS US East 1 (N. Virginia)**. It is the closest to Montréal and to Vercel's servers, so the site runs faster.
3. On the project dashboard, click **Connect** (top right).
   - Leave **Connection pooling** on (the "pooled" address: it has `-pooler` in the server name).
   - Copy the address that starts with **`postgresql://`** (copy button).

> [!CAUTION]
> That address contains the database password. Paste it only into Vercel (step 2) or your `.env.local`; never into GitHub, a chat or an email.

There is no need to create tables or run anything on Neon: the site creates them by itself the first time.

### Step 2 · Import the project into Vercel

1. Open **https://vercel.com/new** and sign in with **Continue with GitHub** (personal account, **Hobby** plan).
2. Under **Import Git Repository**, find **`alesstron/LaFontaine`** and click **Import**.
   - If it is not in the list: **Adjust GitHub App Permissions** → give access to that repository. It is your own GitHub account: no administrator is needed.
3. Keep what Vercel detects: **Framework Preset: Next.js**, **Root Directory: `./`**.
4. Open **Environment Variables** and add two:

   | Key | Value |
   |---|---|
   | `DATABASE_URL` | the `postgresql://…` address you copied from Neon |
   | `RESERVAS_CLAVE` | the password you want for the panel (12 characters or more; a passphrase is better) |

5. Click **Deploy** and wait for it to finish (1–2 minutes).

> [!TIP]
> Already imported the project without the variables? Go to **Settings → Environment Variables**, add them, then go to **Deployments → ⋯ (on the latest one) → Redeploy**. New variables only take effect after redeploying.

### Step 3 · Check that it works

1. Open `https://<your-project>.vercel.app/reserver/gestion`, type your password and look at the top line:
   **«Base de données : connectée · Neon, en ligne · Réservations enregistrées : 0»** (Database: connected · Neon, online · Stored bookings: 0).
2. In another tab, open `https://<your-project>.vercel.app/reserver` and make a test booking.
3. Click **Actualiser** in the panel: the booking shows up on its day and time.
4. Open the cancel link the confirmation gave you and cancel the booking: in the panel it shows crossed out, «Annulée par le client» (Cancelled by the guest).

From then on, every `git push` to `main` republishes the site automatically, with the same variables.

---

## 4. Test checklist

Tick it off on your computer and again on Vercel:

- [ ] The site's three buttons (the «Réserver» link in the header, «Réserver une table» in the hero and «Voir les places libres» in the armchair section) open `/reserver` in a **new tab**.
- [ ] A full booking: guests → day → time → name and phone → «RÉSERVÉ» with code and link.
- [ ] The booking shows up in the panel, on its day and time, with the phone and the note.
- [ ] Fill a slot: one booking for 8 and another for 4 at the same time → that time shows **crossed out** (even for 1 person); another booking at that time is rejected.
- [ ] The cancel link shows the booking and, when you click «Annuler la réservation», frees the seats.
- [ ] Panel: «Annuler» and «Rétablir» work; «Ajouter une réservation» records a phone booking; with «Même si le créneau est complet» it goes in even if the slot is full.
- [ ] Wrong password → «Mot de passe incorrect»; 5 failures within 15 minutes from the same connection → «Trop d'essais» (a 15-minute wait).
- [ ] «Quitter» signs out.
- [ ] French, English and Spanish (FR · EN · ES buttons).
- [ ] On a phone it reads well and there is no sideways scrolling.

---

## 5. Using the café panel

- **Signing in**: `/reserver/gestion` → password → **Entrer**. The session lasts 12 hours in that browser; **Quitter** ends it sooner.
- **The week**: seven days from today. **‹ ›** switch weeks; **Aujourd'hui** goes back to the current one; **Actualiser** reloads (and it reloads by itself every 2 minutes while the tab is visible).
- **Each time** shows its occupancy («6 / 12 places») with a bar that turns red as it fills up.
- **Each booking**: name and guests; phone (you can tap it to call from a mobile); «en ligne» or «téléphone»; the code; the note.
- **Annuler**: the booking is crossed out in the list and its seats are freed. **Rétablir** confirms it again if it still fits in its slot.
- **Ajouter une réservation**: for the ones that come in by phone or at the counter. It accepts groups of up to 12 people and dates up to a year ahead, without the site's minimum notice. **«Même si le créneau est complet»** saves it even if the slot is full (if you know there is room for one more table).

---

## 6. Change seats, times and closed days

Everything is in `src/data/cafe.config.ts`, in the `reservas` block (and the opening hours in `horario`):

```ts
reservas: {
  plazasPorTurno: 12,  // people who can arrive in each half hour
  maxPersonas: 8,      // largest group that can book on the site
  antelacionMin: 120,  // minimum notice in minutes (120 = 2 hours)
  diasVista: 30,       // days that can be booked, counting today
  paso: 30,            // minutes between times (30 = 8 h, 8 h 30…)
  cerrados: [],        // single days with no bookings: ["2026-12-25", "2027-01-01"]
},
```

| I want to… | Change |
|---|---|
| Have more or fewer seats | `plazasPorTurno` |
| Let groups of 10 book on the site | `maxPersonas: 10` (and `plazasPorTurno` at least 10) |
| Accept bookings with 1 hour's notice | `antelacionMin: 60` |
| Close bookings on a holiday or for a private event | add the date to `cerrados` |
| Change the times | `horario.franjas` (bookings follow the opening hours: until 1 hour before closing) |
| Remove bookings from the site | `funciones: { reserva: false }` (or delete the `reservas` block) |

Then: `git push` and Vercel publishes on its own. Bookings already made don't change.

---

## 7. Environment variables

| Variable | Where | What for |
|---|---|---|
| `DATABASE_URL` | Vercel (required) · your computer (optional) | Neon address. On your computer, if you set it, you will use the **Neon** database (real data) instead of the local one. |
| `RESERVAS_CLAVE` | Vercel (required) · your computer | Panel password, at least 8 characters (12 or more is better). On Vercel, without it the site **does not accept bookings** (nobody could see them). Changing it signs out every session. |
| `RESERVAS_PGLITE_DIR` | your computer only (optional) | Local database folder, if you don't want the default one. |

The template is `.env.example` (no values). The real values go in Vercel or in `.env.local`, which is never pushed to GitHub.

---

## 8. Common problems

| What you see | What is going on and what to do |
|---|---|
| On `/reserver`: «Les réservations en ligne ne sont pas encore ouvertes» (Online booking is not open yet) | On Vercel, `DATABASE_URL` or `RESERVAS_CLAVE` is missing, or you added them without redeploying. Add them and **Redeploy** (step 2). |
| In the panel: «pas connectée · Il manque la variable DATABASE_URL» (not connected · the DATABASE_URL variable is missing) | Same thing: `DATABASE_URL` is missing on Vercel, or it is not ticked for **Production**. |
| In the panel: «DATABASE_URL ne contient pas d'adresse postgresql://» (DATABASE_URL has no postgresql:// address) | Something else was pasted. Copy it again from **Connect** on Neon: it must start with `postgresql://`. |
| In the panel: «La base ne répond pas» (The database is not answering) | Neon is waking up or down, or the address belongs to a deleted project. Wait a minute and click **Actualiser**. The technical message shows underneath, and on Vercel you can see it under **Logs**. |
| The first visit of the day takes 1–2 seconds longer | Normal on the free plan: Neon goes to sleep after a few minutes without use and wakes up on its own. |
| «Mot de passe incorrect» (Wrong password) and you don't remember it | Change `RESERVAS_CLAVE` on Vercel (**Settings → Environment Variables**) and **Redeploy**. |
| «Trop d'essais. Réessayez dans 15 minutes.» (Too many attempts. Try again in 15 minutes.) | 5 wrong passwords within 15 minutes from that connection. Wait 15 minutes. |
| «Votre session a expiré» (Your session has expired) | 12 hours went by or the password changed. Sign in again. |
| On your computer: «La base local … ya la usa otro servidor (proceso N)» (the local database … is already in use by another server, process N) | Another `npm run dev` or `npm start` is open: close it. If there is none, delete the `reservas-pglite.pid` file next to the data folder. |
| On your computer: I want to delete all the test bookings | Stop the server and delete the `reservas-pglite` folder (see section 2). |
| A guest lost their cancel link | They call the café: the booking is cancelled from the panel with «Annuler». |

---

## 9. Privacy and security

**What is stored:** name, phone, note, day, time, guests, language and when the booking was made. The phone is only used to contact the guest.

**For how long:** each booking **deletes itself 30 days after its date**. Failed attempts to sign in to the panel are deleted after 24 hours.

**What is not stored:** the visitor's IP. To curb abuse, an irreversible fingerprint is stored instead, and it changes every day.

**Protections:**
- The server checks every booking again (date, time, guests, fields) and never trusts the screen.
- Anti-abuse: a trap field for bots, at most 5 bookings per hour from the same connection and 3 future bookings per phone number.
- Panel: password compared in constant time, a pause after each failure, lockout after 5 failures within 15 minutes from one connection and a signed session cookie, `HttpOnly`, `SameSite=Strict`, limited to `/reserver/gestion` and expiring after 12 hours.
- The cancel link carries a 192-bit secret: the database only stores its fingerprint.
- The panel and the cancel page never show up on Google.

> [!IMPORTANT]
> **Quebec's Law 25.** Before using it with real guests, the café needs a published privacy policy and a person in charge of protecting personal information (usually the owner). This is still **to be confirmed with the owner**.

---

## 10. Free plan limits

- **Neon Free**: 0.5 GB per project (thousands of bookings take up very little) and the database goes to sleep after a few minutes without use. The exact limits are at https://neon.tech/pricing.
- **Vercel Hobby**: free, but **for non-commercial use only**. It is fine for showing the demo; for the café's real site you would need to move to **Pro** or use another host.

---

## 11. How it is built (developers)

In this demo the engine has a server and a database (the template does not). Details in part B of the [manual](MANUAL.en.md#b11-online-bookings-server-and-database).

```text
src/app/reserver/
├── page.tsx              /reserver          static: the skin asks for the seats with a server action
├── anular/page.tsx       /reserver/anular   static: the code and the secret go after "#" (they never reach the logs)
└── gestion/page.tsx      /reserver/gestion  dynamic: checks the session cookie before rendering
src/motor/reservas/
├── bd.ts                 Neon (DATABASE_URL) or PGlite (local); a single connection per process
├── esquema.ts            creates the tables by itself and deletes old data (30 days)
├── disponibilidad.ts     dates and times in the café's time zone (pure: server and browser)
├── validar.ts            field-by-field check (pure)
├── seguridad.ts          panel session, password, codes, secrets and fingerprints
├── operaciones.ts        read seats, save if it fits, restore if it fits
├── acciones.ts           "use server": consultarDisponibilidad, crearReserva, verReservaParaAnular, anularReserva
├── gestion.ts            "use server": entrar, salir, estadoBaseDeDatos, listarReservas, cancel, restore, phone booking
├── cliente.ts            "use client": useReservaEnLinea, useAnularReserva, usePanelReservas
└── tipos.ts              shared types (the server returns codes; the skin translates them)
src/estilo/paginas/       the skin of the three pages (Marco, mensajes, reserva/, anular/, gestion/)
```

**Seats without race conditions.** Saving is a single `READ COMMITTED` transaction with two statements: first `pg_advisory_xact_lock(72026002, hashtext('turno fecha hora'))`, then `INSERT … SELECT … WHERE (sum of the slot's confirmed guests) + personas <= plazas`. The lock goes in its own statement so that the sum sees what the previous booking committed. Tested with 20 simultaneous 1-person bookings on a 12-seat slot: exactly 12 get in.
