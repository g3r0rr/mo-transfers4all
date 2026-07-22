// Supabase Edge Function: send-booking-push
// Runs whenever a new booking is created (Postgres Database Webhook on
// INSERT into "bookings"). Does four things:
//   1. Sends a Web Push notification to every subscribed admin device
//   2. Sends a WhatsApp message via CallMeBot
//   3. Sends an acknowledgement email to the customer via Resend, in
//      whichever language (en/gr) they used on the booking form. Worded as
//      "received, we'll confirm shortly" (not "confirmed"), to match Terms
//      section 02 — a booking isn't confirmed until we explicitly confirm.
//   4. Creates an event on the admin's Google Calendar with a 60-minute-
//      prior popup reminder, for both website and hotel-portal bookings
// WhatsApp and email both used to be attempted from the browser, which is
// unreliable for WhatsApp (CallMeBot has no CORS headers) and impossible
// for email (no email API can run safely client-side without exposing
// the API key). Running everything here, server-side, fixes both.
//
// Deployed manually via Supabase Dashboard (Edge Functions -> quick-processor
// -> paste this file's content -> Deploy). NOT wired to CI/CD from this repo —
// this file is kept here for review/history only; deploys still happen
// directly against the project (id uzxswadvavjrbexwegie, function slug
// "quick-processor", display name "send-booking-push" — see CLAUDE.md).
//
// Required secrets (Edge Functions -> quick-processor -> Secrets):
//   VAPID_PUBLIC_KEY
//   VAPID_PRIVATE_KEY
//   VAPID_SUBJECT          (e.g. mailto:you@example.com)
//   SUPABASE_URL           (auto-provided by Supabase, no need to set)
//   SUPABASE_SERVICE_ROLE_KEY  (set this one manually — needed to read push_subscriptions)
//   CALLMEBOT_PHONE        (the WhatsApp number registered with CallMeBot, no + or spaces)
//   CALLMEBOT_APIKEY       (the API key CallMeBot gave you for that number)
//   RESEND_API_KEY         (from resend.com -> API Keys)
//   RESEND_FROM            (e.g. "MO Transfers4all <bookings@mo-transfers4all.gr>" —
//                           must be a domain you've verified in Resend)
//   GOOGLE_CALENDAR_CLIENT_ID      (OAuth client, from Google Cloud Console)
//   GOOGLE_CALENDAR_CLIENT_SECRET
//   GOOGLE_CALENDAR_REFRESH_TOKEN  (obtained once via OAuth consent)
//   GOOGLE_CALENDAR_IDS            (comma-separated calendar emails/ids, defaults to "primary"
//                                   if unset. One OAuth token can write to any calendar the
//                                   account has been granted "Make changes to events" on, so
//                                   this can include calendars owned by other people who've
//                                   shared their calendar with this account — that's how a
//                                   booking reaches multiple family members without a
//                                   separate OAuth app/refresh token per person)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from 'https://esm.sh/web-push@3.6.7'

const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')!
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!
const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT') || 'mailto:admin@example.com'
const CALLMEBOT_PHONE = Deno.env.get('CALLMEBOT_PHONE')
const CALLMEBOT_APIKEY = Deno.env.get('CALLMEBOT_APIKEY')

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Idempotency guard against Supabase retrying a webhook delivery it
// (incorrectly) thinks failed, which would otherwise double-send the
// WhatsApp/email/calendar. Done as an atomic insert-first claim rather
// than check-then-insert: two truly simultaneous retries could both pass
// a separate "already processed?" read and both proceed, but only one
// can win the INSERT on booking_notifications_sent's primary key — the
// loser gets a duplicate-key error and bails. Returns true iff we claimed
// this booking and should do the sending.
const claimBooking = async (bookingId: string | undefined): Promise<boolean> => {
  if (!bookingId) return true // no id to dedupe on — proceed (best effort)
  const { error } = await supabase
    .from('booking_notifications_sent')
    .insert({ booking_id: bookingId })
  if (error) {
    // 23505 = unique_violation: someone already claimed it. Any other
    // error we log but still proceed, so a transient DB hiccup doesn't
    // silently drop a real booking's notifications.
    if (error.code === '23505') return false
    console.error('Idempotency claim failed, proceeding anyway:', error)
    return true
  }
  return true
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const RESEND_FROM = Deno.env.get('RESEND_FROM') || 'MO Transfers4all <bookings@mo-transfers4all.gr>'

const emailTemplates = {
  en: (b: any) => ({
    subject: 'Booking Received — MO Transfers4all',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #0f3460;">
        <h2 style="color: #0f3460;">🚖 Booking Received</h2>
        <p>Hi ${b.passenger_name || ''},</p>
        <p>We've received your booking request and will confirm it with you shortly. Here are the details you sent:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 6px 0;"><strong>Pickup:</strong></td><td>${b.pickup || '—'}</td></tr>
          <tr><td style="padding: 6px 0;"><strong>Drop-off:</strong></td><td>${b.dropoff || '—'}</td></tr>
          <tr><td style="padding: 6px 0;"><strong>Date:</strong></td><td>${b.date || '—'}</td></tr>
          <tr><td style="padding: 6px 0;"><strong>Time:</strong></td><td>${b.time || '—'}</td></tr>
          <tr><td style="padding: 6px 0;"><strong>Vehicle:</strong></td><td>${b.vehicle || '—'}</td></tr>
          ${b.notes ? `<tr><td style="padding: 6px 0;"><strong>Notes:</strong></td><td>${b.notes}</td></tr>` : ''}
        </table>
        <p>Once we confirm, we'll be in touch with your driver's details.</p>
        <p>If anything above is incorrect, just reply to this email or contact us on WhatsApp.</p>
        <p style="margin-top: 24px; color: #7a99b5; font-size: 0.85em;">MO Transfers4all — Athens, Greece</p>
      </div>
    `
  }),
  gr: (b: any) => ({
    subject: 'Λάβαμε την Κράτησή σας — MO Transfers4all',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #0f3460;">
        <h2 style="color: #0f3460;">🚖 Λάβαμε την Κράτησή σας</h2>
        <p>Γεια σας ${b.passenger_name || ''},</p>
        <p>Λάβαμε το αίτημα κράτησής σας και θα το επιβεβαιώσουμε σύντομα. Τα στοιχεία που στείλατε:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 6px 0;"><strong>Παραλαβή:</strong></td><td>${b.pickup || '—'}</td></tr>
          <tr><td style="padding: 6px 0;"><strong>Προορισμός:</strong></td><td>${b.dropoff || '—'}</td></tr>
          <tr><td style="padding: 6px 0;"><strong>Ημερομηνία:</strong></td><td>${b.date || '—'}</td></tr>
          <tr><td style="padding: 6px 0;"><strong>Ώρα:</strong></td><td>${b.time || '—'}</td></tr>
          <tr><td style="padding: 6px 0;"><strong>Όχημα:</strong></td><td>${b.vehicle || '—'}</td></tr>
          ${b.notes ? `<tr><td style="padding: 6px 0;"><strong>Σημειώσεις:</strong></td><td>${b.notes}</td></tr>` : ''}
        </table>
        <p>Μόλις επιβεβαιώσουμε, θα επικοινωνήσουμε μαζί σας με τα στοιχεία του οδηγού σας.</p>
        <p>Εάν κάτι παραπάνω είναι λάθος, απαντήστε σε αυτό το email ή επικοινωνήστε μαζί μας στο WhatsApp.</p>
        <p style="margin-top: 24px; color: #7a99b5; font-size: 0.85em;">MO Transfers4all — Αθήνα, Ελλάδα</p>
      </div>
    `
  })
}

const sendConfirmationEmail = async (booking: any) => {
  if (booking.source !== 'website') {
    return { ok: false, reason: 'not a website booking, skipping email' }
  }
  if (!RESEND_API_KEY) {
    console.warn('Resend not configured, skipping confirmation email')
    return { ok: false, reason: 'not configured' }
  }
  if (!booking.passenger_email) {
    return { ok: false, reason: 'no email on booking' }
  }

  const lang = booking.lang === 'gr' ? 'gr' : 'en'
  const { subject, html } = emailTemplates[lang](booking)

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: booking.passenger_email,
        subject,
        html
      })
    })
    const data = await res.json()
    return { ok: res.ok, status: res.status, data }
  } catch (err) {
    console.error('Resend request failed:', err)
    return { ok: false, error: String(err) }
  }
}

const sendWhatsApp = async (booking: any) => {
  if (!CALLMEBOT_PHONE || !CALLMEBOT_APIKEY) {
    console.warn('CallMeBot not configured, skipping WhatsApp message')
    return { ok: false, reason: 'not configured' }
  }

  const sourceLabel = booking.source === 'hotel' ? '🏨 Νέα Κράτηση (Ξενοδοχείο)' : '🚖 Νέα Κράτηση'
  const message =
    `${sourceLabel} — MO Transfers4all\n\n` +
    `👤 Όνομα: ${booking.passenger_name || '—'}\n` +
    `📞 Τηλέφωνο: ${booking.passenger_phone || '—'}\n` +
    `✉️ Email: ${booking.passenger_email || '—'}\n` +
    `🚗 Όχημα: ${booking.vehicle || '—'}\n` +
    `📍 Παραλαβή: ${booking.pickup || '—'}\n` +
    `🏁 Προορισμός: ${booking.dropoff || '—'}\n` +
    `📅 Ημερομηνία: ${booking.date || '—'}\n` +
    `⏰ Ώρα: ${booking.time || '—'}\n` +
    `📝 Σημειώσεις: ${booking.notes || '—'}`

  const url = `https://api.callmebot.com/whatsapp.php?phone=${CALLMEBOT_PHONE}&text=${encodeURIComponent(message)}&apikey=${CALLMEBOT_APIKEY}`

  try {
    const res = await fetch(url)
    const text = await res.text()
    return { ok: res.ok, status: res.status, body: text }
  } catch (err) {
    console.error('CallMeBot request failed:', err)
    return { ok: false, error: String(err) }
  }
}

// --- Google Calendar sync ---
// Creates an event on the admin's calendar for every booking (website AND
// hotel), with a 60-minute-prior popup reminder, so a driver's pickup is
// never missed even if push/WhatsApp gets dismissed. Uses a standing OAuth
// refresh token (obtained once via manual consent — a Deno Edge Function
// can't do an interactive browser OAuth flow itself) rather than a service
// account, since service-account domain-wide delegation isn't available
// for a personal Gmail calendar.
const GOOGLE_CALENDAR_CLIENT_ID = Deno.env.get('GOOGLE_CALENDAR_CLIENT_ID')
const GOOGLE_CALENDAR_CLIENT_SECRET = Deno.env.get('GOOGLE_CALENDAR_CLIENT_SECRET')
const GOOGLE_CALENDAR_REFRESH_TOKEN = Deno.env.get('GOOGLE_CALENDAR_REFRESH_TOKEN')
const GOOGLE_CALENDAR_IDS = (Deno.env.get('GOOGLE_CALENDAR_IDS') || 'primary')
  .split(',')
  .map((id) => id.trim())
  .filter(Boolean)
const BOOKING_EVENT_DURATION_MINUTES = 30

const getGoogleAccessToken = async () => {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: GOOGLE_CALENDAR_CLIENT_ID!,
      client_secret: GOOGLE_CALENDAR_CLIENT_SECRET!,
      refresh_token: GOOGLE_CALENDAR_REFRESH_TOKEN!,
      grant_type: 'refresh_token'
    })
  })
  if (!res.ok) throw new Error(`Token refresh failed: ${res.status} ${await res.text()}`)
  const data = await res.json()
  return data.access_token as string
}

// booking.date and booking.time come from the bookings row via the DB
// webhook, not straight from the frontend's <input> value — Postgres
// date/time columns often serialize with more precision than the form
// sends (e.g. a `time` column comes back as "HH:MM:SS", not "HH:MM"), so
// normalize both to fixed-width prefixes before building the timestamp
// string. Parsing with a trailing "Z" is a trick to get a Date object
// whose UTC getters return exactly the digits we typed, regardless of the
// runtime's own timezone, so we can do simple arithmetic (add the event
// duration) without any local-time drift, then hand the same naive digits
// to Google alongside an explicit Athens timeZone field.
const toAthensDateTimeStrings = (date: string, time: string) => {
  const datePart = date.slice(0, 10)
  const timePart = time.slice(0, 5)
  const start = new Date(`${datePart}T${timePart}:00Z`)
  if (isNaN(start.getTime())) {
    throw new Error(`Could not parse booking date/time: date="${date}" time="${time}"`)
  }
  const end = new Date(start.getTime() + BOOKING_EVENT_DURATION_MINUTES * 60000)
  return {
    startDateTime: start.toISOString().slice(0, 19),
    endDateTime: end.toISOString().slice(0, 19)
  }
}

const createCalendarEventOn = async (calendarId: string, accessToken: string, event: unknown) => {
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(event)
    }
  )
  const data = await res.json()
  if (!res.ok) console.error(`Google Calendar event creation failed for ${calendarId}:`, data)
  return { calendarId, ok: res.ok, status: res.status, data }
}

const createCalendarEvent = async (booking: any) => {
  if (!GOOGLE_CALENDAR_CLIENT_ID || !GOOGLE_CALENDAR_CLIENT_SECRET || !GOOGLE_CALENDAR_REFRESH_TOKEN) {
    console.warn('Google Calendar not configured, skipping calendar sync')
    return { ok: false, reason: 'not configured' }
  }
  if (!booking.date || !booking.time) {
    return { ok: false, reason: 'booking has no date/time' }
  }

  try {
    const accessToken = await getGoogleAccessToken()
    const { startDateTime, endDateTime } = toAthensDateTimeStrings(booking.date, booking.time)
    const sourceLabel = booking.source === 'hotel' ? '🏨 Hotel' : '🌐 Website'

    const event = {
      summary: `🚖 ${booking.pickup || '—'} → ${booking.dropoff || '—'} (${booking.passenger_name || 'Passenger'})`,
      description:
        `${sourceLabel} booking\n` +
        `Passenger: ${booking.passenger_name || '—'}\n` +
        `Phone: ${booking.passenger_phone || '—'}\n` +
        `Vehicle: ${booking.vehicle || '—'}\n` +
        (booking.notes ? `Notes: ${booking.notes}\n` : ''),
      start: { dateTime: startDateTime, timeZone: 'Europe/Athens' },
      end: { dateTime: endDateTime, timeZone: 'Europe/Athens' },
      reminders: {
        useDefault: false,
        overrides: [{ method: 'popup', minutes: 60 }]
      }
    }

    // One access token can write to every calendar in GOOGLE_CALENDAR_IDS
    // as long as the account has "Make changes to events" permission on
    // each — no per-calendar credentials needed, even for calendars owned
    // by someone else who's shared theirs with this account.
    const settled = await Promise.allSettled(
      GOOGLE_CALENDAR_IDS.map((calendarId) => createCalendarEventOn(calendarId, accessToken, event))
    )
    const results = settled.map((r, i) =>
      r.status === 'fulfilled'
        ? r.value
        : { calendarId: GOOGLE_CALENDAR_IDS[i], ok: false, error: String(r.reason) }
    )
    return { ok: results.every((r) => r.ok), calendars: results }
  } catch (err) {
    console.error('Google Calendar sync failed:', err)
    return { ok: false, error: String(err) }
  }
}

Deno.serve(async (req) => {
  let booking: any
  try {
    const payload = await req.json()
    // Database Webhook sends { type, table, record, ... } on INSERT
    booking = payload.record || payload
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid payload' }), { status: 400 })
  }

  // Respond to the webhook immediately. If we make Supabase's webhook
  // wait for CallMeBot (which can be slow) and Web Push to finish, a slow
  // response can cause Supabase to treat the delivery as failed and retry
  // it — which re-runs this whole function and sends the WhatsApp message
  // a second time for the same booking. Returning right away and doing the
  // actual sending in the background avoids that.
  const work = (async () => {
    try {
      if (!(await claimBooking(booking.id))) {
        console.log('Booking', booking.id, 'already claimed, skipping duplicate send')
        return
      }

      const whatsappResult = await sendWhatsApp(booking)
      const emailResult = await sendConfirmationEmail(booking)
      const calendarResult = await createCalendarEvent(booking)

      const { data: subs, error } = await supabase.from('push_subscriptions').select('*')
      if (error) throw error

      let sent = 0, failed = 0
      if (subs && subs.length > 0) {
        const notificationPayload = JSON.stringify({
          title: '🚖 New Booking — MO Transfers4all',
          body: `${booking.passenger_name || 'New passenger'} · ${booking.pickup || ''} → ${booking.dropoff || ''}`,
          url: '/admin',
          tag: 'booking-' + (booking.id || Date.now())
        })

        const results = await Promise.allSettled(
          subs.map((sub) =>
            webpush.sendNotification(
              {
                endpoint: sub.endpoint,
                keys: { p256dh: sub.p256dh, auth: sub.auth }
              },
              notificationPayload
            ).catch(async (err) => {
              if (err.statusCode === 404 || err.statusCode === 410) {
                await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint)
              }
              throw err
            })
          )
        )
        sent = results.filter(r => r.status === 'fulfilled').length
        failed = results.length - sent
      }

      console.log('Booking notification result:', { whatsappResult, emailResult, calendarResult, push: { sent, failed } })
    } catch (err) {
      console.error('Background notification work failed:', err)
    }
  })()

  // @ts-ignore - EdgeRuntime is available in the Supabase Edge Functions runtime
  if (typeof EdgeRuntime !== 'undefined' && EdgeRuntime.waitUntil) {
    // @ts-ignore
    EdgeRuntime.waitUntil(work)
  }

  return new Response(JSON.stringify({ ok: true, accepted: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
})
