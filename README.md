# MO Transfers4all Athens

**Live site:** [mo-transfers4all.gr](https://mo-transfers4all.gr)

A licensed taxi driver serving Athens and Attica — airport pickups, long-distance trips, sightseeing, and port/ferry connections. Built and run by the owner directly, with a small admin team (family) managing bookings day to day.

---

## Features

- **Booking form** — public website form, in English and Greek, with Google Places autocomplete for pickup/drop-off
- **Hotel partner portal** (`/hotel`) — a separate login for hotel partners to submit bookings on a guest's behalf
- **Admin dashboard** (`/admin`) — calendar view of all bookings, status/driver management, installable as a PWA for always-on access
- **Push notifications** — admin devices get a real push notification (even with the app fully closed) the moment a new booking comes in, via a Supabase Edge Function and Web Push (VAPID)
- **WhatsApp alerts** — every new booking also sends a WhatsApp message via CallMeBot, sent server-side to avoid browser CORS issues
- **Email confirmations** — customers get an automatic booking confirmation email (via Resend) in whichever language they used on the form
- **Destinations carousel** — popular routes with local photos that cycle automatically
- **Fixed-price rate table** — published rates by route, day/night pricing
- **Cookie consent banner** — currently a placeholder (no tracking scripts are in use yet)
- **SEO** — sitemap, robots.txt, Open Graph + Twitter Card link previews, TaxiService JSON-LD structured data

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Routing | React Router |
| Backend | Supabase (Postgres, Auth, Row Level Security, Edge Functions) |
| Push notifications | Web Push (VAPID) via a custom service worker + Supabase Edge Function |
| WhatsApp | CallMeBot API, called server-side from the Edge Function |
| Email | Resend |
| PWA | vite-plugin-pwa (injectManifest strategy, custom service worker) |
| Hosting | Vercel |
| Domain | mo-transfers4all.gr |

---

## Project Structure

```
src/
  components/      Shared site components (Hero, Services, Fleet, Destinations,
                    Prices, Footer, Navbar, BookingForm, WhatsAppButton, CookieConsent)
  pages/           Home, Login, AdminDashboard, HotelDashboard, Privacy, Terms
  lib/             Supabase client, auth helpers, Google Places autocomplete hook
  sw.js            Custom service worker source (push notifications, caching)
public/            Static assets served as-is (favicons, manifest, robots.txt, sitemap.xml,
                    destination photos, logo)
supabase/          SQL migrations and setup docs for the Supabase backend
  functions/
    send-booking-push/   Edge Function: sends WhatsApp + email + push on every new booking
```

---

## Backend Setup (Supabase)

The `supabase/` folder contains the SQL and setup docs needed to stand up the backend from scratch:

- `push_subscriptions.sql` — table for admin push notification subscriptions
- `booking_notifications_sent.sql` — idempotency guard so a booking never triggers duplicate notifications
- `add_lang_column.sql` — tracks which language a booking was submitted in, for email confirmations
- `secure_bookings_rls_v2.sql` — Row Level Security policies for the `bookings` table
- `functions/send-booking-push/index.ts` — the Edge Function that sends WhatsApp, email, and push notifications on every new booking
- `EMAIL_CONFIRMATION_SETUP.md`, `WHATSAPP_FIX.md` — step-by-step dashboard setup guides

Required Edge Function secrets: `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`, `SUPABASE_SERVICE_ROLE_KEY` (auto-provided), `CALLMEBOT_PHONE`, `CALLMEBOT_APIKEY`, `RESEND_API_KEY`, `RESEND_FROM`.

---

## Local Development

```bash
npm install
npm run dev
```

Requires a `.env` file (not committed) with:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_GEOAPIFY_KEY=
```

## Build

```bash
npm run build
```

Deployed automatically via Vercel on push to `main`.
