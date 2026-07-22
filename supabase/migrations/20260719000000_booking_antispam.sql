-- Server-side anti-abuse backstop for the public bookings table, which
-- has to allow anonymous INSERT (that's how the website booking form
-- works) and therefore can be hit directly against the Supabase REST
-- API, bypassing the form's client-side honeypot/timing checks. Each
-- inserted row fans out to WhatsApp, push, email, and up to three
-- Google Calendars via the send-booking-push webhook, so an unchecked
-- flood is expensive.
--
-- This is deliberately conservative: it SILENTLY DROPS (returns NULL,
-- which skips the insert without raising an error) only in cases that
-- are almost never a real customer, so a legitimate booking is never
-- blocked with a scary error:
--
--   1. An identical booking (same source, phone, pickup, dropoff, date,
--      time) already arrived in the last 2 minutes — i.e. a double-click
--      double-submit or a naive replay flood. Dropping it silently means
--      the duplicate never triggers a second WhatsApp/calendar event, and
--      the user still sees the normal success message.
--   2. More than 5 website bookings from the same phone in the last 10
--      minutes — a real person does not book six rides in ten minutes,
--      but this is generous enough never to catch one who books a couple.
--
-- A randomized direct-API flood (fresh phone each time) still gets
-- through; stopping that needs a real captcha (e.g. Cloudflare Turnstile)
-- verified server-side, which is the documented next step if it happens.

-- The time-window checks below depend on created_at. It's almost
-- certainly already present (Supabase Table Editor adds it by default),
-- but guard defensively: if it were missing, the trigger would raise on
-- every insert and block ALL bookings. A no-op when it already exists.
alter table public.bookings
  add column if not exists created_at timestamptz not null default now();

create or replace function public.bookings_antispam()
returns trigger
language plpgsql
as $$
declare
  dup_count integer;
  phone_count integer;
begin
  -- 1. Exact-duplicate within 2 minutes -> silent drop.
  select count(*) into dup_count
  from public.bookings
  where source = new.source
    and passenger_phone is not distinct from new.passenger_phone
    and pickup is not distinct from new.pickup
    and dropoff is not distinct from new.dropoff
    and date is not distinct from new.date
    and time is not distinct from new.time
    and created_at > now() - interval '2 minutes';
  if dup_count > 0 then
    return null;
  end if;

  -- 2. Same phone, more than 5 website bookings in 10 minutes -> silent drop.
  if new.source = 'website' and new.passenger_phone is not null then
    select count(*) into phone_count
    from public.bookings
    where source = 'website'
      and passenger_phone = new.passenger_phone
      and created_at > now() - interval '10 minutes';
    if phone_count >= 5 then
      return null;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_bookings_antispam on public.bookings;
create trigger trg_bookings_antispam
  before insert on public.bookings
  for each row
  execute function public.bookings_antispam();
