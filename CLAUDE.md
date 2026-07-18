# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The marketing site + booking system for MO Transfers4all, a licensed taxi service in Athens, Greece. A single React SPA serves three audiences from one codebase: the public site (bookings, destinations, rates), a hotel partner portal (`/hotel`), and an admin dashboard (`/admin`) for managing incoming bookings. Live at mo-transfers4all.gr.

## Commands

```bash
npm install
npm run dev       # start Vite dev server
npm run build     # production build to dist/
npm run preview   # preview the production build locally
```

There is no lint, typecheck, or test script configured in `package.json` — don't invent one; verify changes by running the dev server and exercising the affected flow in the browser.

Requires a `.env` (not committed) with:
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_GEOAPIFY_KEY=
VITE_GOOGLE_PLACES_KEY=
```

Deploys automatically via Vercel on push to `main` (see `vercel.json` — it's an SPA rewrite: all paths serve `/index.html`, routing is client-side via React Router).

## Architecture

**Stack:** React 18 + Vite, React Router, Supabase (Postgres + Auth + Realtime + Edge Functions) as the entire backend — there is no custom server. The frontend talks to Supabase directly from the browser using the anon key; access control is enforced by Postgres Row Level Security policies, not application code. This repo is primarily the frontend — Supabase schema and RLS policies are managed outside this repo (not checked in here). The one Edge Function, `supabase/functions/send-booking-push/index.ts`, is kept here for review/history, but deploys are manual (paste into Supabase Dashboard → Edge Functions → quick-processor → Deploy) — there's no CI/CD wiring this file to the live function, so an edit here doesn't take effect until someone deploys it.

**Three apps in one bundle** (`src/App.jsx` defines all routes):
- Public site — `/` and `/gr` (English/Greek), plus `/destinations/:slug` — built from `src/pages/Home.jsx` and `src/pages/DestinationPage.jsx`, composed from the components in `src/components/`.
- Hotel portal — `/hotel`, lets a hotel partner submit a booking on a guest's behalf and see their own submission history — enforced via RLS on `bookings.created_by` (see `supabase/migrations/20260718230000_scope_hotel_bookings_by_owner.sql`), not just the client-side `.eq('source', 'hotel')` filter in `HotelDashboard.jsx`'s `fetchBookings`, which by itself would show every hotel partner's bookings to every other one.
- Admin dashboard — `/admin`, calendar + list view of all bookings, driver assignment, status changes, push notifications. Installable as its own PWA (separate manifest, see below).

`AdminDashboard` and `HotelDashboard` are lazy-loaded (`React.lazy` in `App.jsx`) so their code never ships to public-site visitors, who are the vast majority of traffic.

**Auth & authorization** (`src/lib/auth.js`, `src/components/ProtectedRoute.jsx`): Supabase Auth handles login (`src/pages/Login.jsx`). Role (`admin` or `hotel`) lives in a `profiles` table keyed by `auth.users.id`, fetched separately after getting the session — it is *not* stored in Supabase user metadata. `ProtectedRoute` redirects to `/login` if there's no session, and cross-redirects to the correct dashboard if the logged-in user's role doesn't match the route's `requiredRole`. Any change to how roles are checked must be kept in sync in three places: `ProtectedRoute`, `Login.jsx`'s post-login redirect, and the RLS policies on the Supabase side.

**Bookings data flow:** Both `BookingForm.jsx` (public) and `HotelDashboard.jsx` insert directly into a Supabase `bookings` table client-side (`source: 'website'` vs `source: 'hotel'`), no API layer in between. A Postgres webhook on `bookings` INSERT triggers a Supabase Edge Function (`supabase/functions/send-booking-push/index.ts` in this repo; deployed as project `uzxswadvavjrbexwegie`, function slug `quick-processor` — its Dashboard display name is "send-booking-push", so don't be thrown off when the two don't match) that sends the WhatsApp alert (via CallMeBot), the email confirmation (via Resend, website bookings only), the push notification, and creates a Google Calendar event with a 60-minute-prior popup reminder (for both website and hotel bookings) — this is deliberately server-side because the CallMeBot API doesn't return CORS headers, so a client-side fetch to it silently fails, and because unattended Calendar API access needs a standing OAuth refresh token that can't live in the browser. Don't reintroduce client-side WhatsApp/email calls; both `BookingForm.jsx` and `HotelDashboard.jsx` have comments noting this was tried and reverted. The Calendar step reads `GOOGLE_CALENDAR_CLIENT_ID`/`_CLIENT_SECRET`/`_REFRESH_TOKEN`/`_ID` Edge Function secrets and no-ops silently (like the CallMeBot/Resend calls do) if they're unset — it's unrelated to any interactive Google Calendar MCP connector, which only works inside chat sessions and can't be invoked by the deployed webhook. The date/time passed into the Calendar step are normalized to fixed-width prefixes (`date.slice(0, 10)`, `time.slice(0, 5)`) before being parsed — the `bookings.time` column round-trips through the webhook as `"HH:MM:SS"`, not the frontend's `"HH:MM"`, and building a timestamp string without accounting for that throws `RangeError: Invalid time value`. If touching this function's date handling again, keep that normalization.

`AdminDashboard.jsx` subscribes to Postgres Realtime changes on `bookings` (`supabase.channel(...).on('postgres_changes', ...)`) for live updates, with a 60s polling fallback (`setInterval`) alongside it.

**Push notifications** (admin only): `src/sw.js` is the custom service worker source, built via `vite-plugin-pwa`'s `injectManifest` strategy (see `vite.config.js` — `registerType: 'autoUpdate'`, manual registration, not auto-injected into `index.html`). It handles the `push` and `notificationclick` events and precaches assets with Workbox, but is deliberately narrow-scoped: it must never intercept non-GET requests (Workbox's cache API throws on those), so the only `registerRoute` in the file is scoped to GET requests against `*.supabase.co`. The admin dashboard registers the service worker itself (`AdminDashboard.jsx`'s `usePWAInstall` hook) and swaps in a separate `public/admin-manifest.json` (scope/start_url `/admin`) instead of the default manifest, so installing the PWA from `/admin` opens straight into the dashboard. Subscriptions are stored in a `push_subscriptions` table via `subscribeToPush`, keyed by the VAPID public key hardcoded near the top of `AdminDashboard.jsx`.

**Bilingual content (EN/GR), SEO-driven:** Language is not just a UI toggle — each language is a real, separate crawlable URL (`/` vs `/gr`, `/destinations/:slug` vs `/gr/destinations/:slug`), so Google indexes both independently. `Home.jsx` and `DestinationPage.jsx` derive `lang` from `location.pathname` and imperatively rewrite `<title>`, meta description, canonical URL, OG/Twitter tags, `<html lang>`, hreflang alternates, and JSON-LD structured data on every render via `document.querySelector`/`createElement` (there's no `react-helmet`). When adding a new page that needs language variants, follow this same pattern rather than introducing a new SEO mechanism. Per-component translation strings live in local `translations`/`T`/`copy` objects (English and Greek keyed side by side) inside each component/page file — there's no central i18n library or catalog.

**Destination content** (`src/data/destinations.js`): shared, hand-written EN/GR copy per destination (not templated from a shared string with swapped nouns — genuinely distinct copy so pages don't read as thin/duplicate content to search engines), consumed by both the homepage destinations grid (`src/components/Destinations.jsx`) and the dedicated `DestinationPage.jsx`. Adding a destination means adding a full entry (copy, FAQ, highlights, photos, price, pickup/dropoff defaults) to both the `en` and `gr` arrays, plus corresponding photos in `public/destinations/`.

**Styling:** No CSS framework. Global tokens (blue palette, text/border colors) are CSS custom properties in `src/index.css` (`--blue-deep`, `--blue-bright`, `--text-mid`, `--border`, etc.) used throughout the public site. Admin/hotel/login pages use scoped class names with a `<style>` block embedded directly in the component instead (`adm-*`, `htl-*`, `login-*` prefixes) — largely self-contained rather than pulling from `index.css` tokens.

**Analytics:** `src/lib/analytics.js` wraps `window.gtag` so event names/shapes stay consistent (`trackBookingSubmitted`, `trackWhatsAppContact`, etc.). GA4 consent mode is configured directly in `index.html`: analytics/ad storage defaults to denied for EEA/UK/Switzerland visitors and granted elsewhere, and `CookieConsent.jsx` calls `gtag('consent', 'update', ...)` on accept. `trackEvent` calls are safe to fire unconditionally — consent mode drops them silently rather than erroring. `<Analytics />` and `<SpeedInsights />` from `@vercel/analytics/react` / `@vercel/speed-insights/react` are also mounted once in `App.jsx` (inside `BrowserRouter`, after `Routes`) — these are cookie-free by design (no cookie or persistent identifier), so unlike GA4 they run unconditionally and aren't gated behind cookie consent.

**Hotel booking ownership:** `bookings.created_by` (added by `supabase/migrations/20260718230000_scope_hotel_bookings_by_owner.sql`) is set on insert from `session.user.id` in `HotelDashboard.jsx`'s `handleSubmit` — fetched fresh via `supabase.auth.getSession()` at submit time rather than read from the component's own `user` state, since that's populated by a separate fire-and-forget effect and could still be pending if someone submits right after the page loads. The `"View bookings by role"` RLS policy scopes hotel-role SELECT access to `source = 'hotel' AND created_by = auth.uid()` (admins still see everything). If you ever add a bulk-import path or an admin-side "create booking on behalf of a hotel" feature, make sure `created_by` gets set correctly there too, or that hotel's bookings will be invisible to them.

**Data retention / GDPR erasure:** `supabase/migrations/20260718220000_auto_erase_completed_bookings.sql` implements the "Automatic Data Erasure" commitment in `Privacy.jsx` (section 04) and `Terms.jsx` (section 07): a `completed_at` column + trigger stamps the moment a booking's `status` becomes `'completed'`, and a daily `pg_cron` job (`erase-completed-booking-pii-daily`, 03:00 UTC) nulls `passenger_name`/`passenger_phone`/`passenger_email`/`notes`/`flight_number` on bookings whose `completed_at` is more than 30 days old. Route/date/vehicle/status are deliberately left intact — they're retained for driver payment reconciliation, dispute handling, and Greek tax/accounting retention requirements, and aren't personally identifying once the passenger fields above are gone. If the deletion window or which fields get erased ever changes, update the Privacy Policy text in `Privacy.jsx` (both `en` and `gr`) to match — the 30-day figure is stated explicitly there, not just in this migration.

## MCP connector usage

- **Memory:** use the `mem0` connector for persisting/recalling memory on this project. Fall back to the `sentry` connector for bug investigation only if mem0 can't help.
- **Bug fixing:** use the `sentry` connector to look up errors/issues when debugging.
- **Infra:** this project has `vercel` (deploys, project/env info, logs) and `supabase` (database, migrations, edge functions, logs, advisors) connectors available — prefer them over asking the user to check dashboards manually.

## Working in this repo

- This is a single-owner small business site with no CI, no test suite, and no separate staging environment — changes go live on merge to `main`. Be conservative with anything touching the booking form, auth, or the service worker, since those directly affect whether real bookings and admin notifications keep working.
- Prices, driver names/phone numbers (`DRIVERS` in `AdminDashboard.jsx`), and rate-table content are real business data, not placeholders — don't alter them without being asked to.
- Vehicle option values (`"Taxi (1-4 Επιβάτες)"`, `"Van (5-9 Επιβάτες)"`) are stored in Greek in the database from both the EN and GR forms; keep `BookingForm.jsx` and `HotelDashboard.jsx` in sync if these values ever change, since existing rows and any downstream logic depend on the exact strings.
