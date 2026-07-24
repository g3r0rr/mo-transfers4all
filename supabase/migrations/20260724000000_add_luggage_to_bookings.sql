-- Adds the luggage field captured by the booking form (a coarse bag-count
-- range: '0', '1-2', '3-4', '5+'). Nullable/text so existing rows and any
-- path that doesn't set it (older hotel form, bulk imports) are unaffected.
-- Surfaced to the driver via the send-booking-push Edge Function (WhatsApp,
-- email, calendar event) so the assigned vehicle can be matched to the load.
alter table public.bookings add column if not exists luggage text;
