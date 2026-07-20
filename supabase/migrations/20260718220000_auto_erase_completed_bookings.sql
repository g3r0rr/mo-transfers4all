-- Automatically erases personally-identifying fields from completed
-- bookings ~30 days after completion, backing the Privacy Policy's
-- "Automatic Data Erasure" commitment (src/pages/Privacy.jsx, section 04).
-- Keeps a minimal trip record (route, date, vehicle, status) for driver
-- payment reconciliation, dispute handling, and Greek tax/accounting
-- retention requirements, but removes passenger name, phone, email,
-- notes, and flight number — the fields that identify a specific person.
--
-- Requires the pg_cron extension. If `create extension` below fails due
-- to privileges, enable pg_cron via Supabase Dashboard -> Database ->
-- Extensions first, then re-run this migration.

create extension if not exists pg_cron with schema extensions;

-- Tracks when a booking became 'completed', independent of any other
-- edit to the row (e.g. reassigning a driver shouldn't reset the clock),
-- so the 30-day window is measured from the actual completion event.
alter table public.bookings
  add column if not exists completed_at timestamptz;

create or replace function public.bookings_set_completed_at()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'completed' and (old.status is distinct from 'completed') then
    new.completed_at := now();
  elsif new.status is distinct from 'completed' then
    new.completed_at := null;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_bookings_set_completed_at on public.bookings;
create trigger trg_bookings_set_completed_at
  before update on public.bookings
  for each row
  execute function public.bookings_set_completed_at();

-- Bookings that were already 'completed' before this migration ran have
-- no completed_at yet — start their 30-day countdown from today rather
-- than leaving them permanently exempt from erasure.
update public.bookings
set completed_at = now()
where status = 'completed' and completed_at is null;

-- The actual erasure. Only touches rows that still have personal data
-- left to remove, so re-running this daily is a cheap no-op once a
-- booking has already been scrubbed.
create or replace function public.erase_completed_booking_pii()
returns void
language sql
as $$
  update public.bookings
  set passenger_name = null,
      passenger_phone = null,
      passenger_email = null,
      notes = null,
      flight_number = null
  where status = 'completed'
    and completed_at < now() - interval '30 days'
    and (passenger_name is not null or passenger_phone is not null
         or passenger_email is not null or notes is not null
         or flight_number is not null);
$$;

-- Runs once a day. cron.schedule() with a job name is an upsert, so
-- re-applying this migration just replaces the existing schedule.
select cron.schedule(
  'erase-completed-booking-pii-daily',
  '0 3 * * *', -- 03:00 UTC daily
  $$ select public.erase_completed_booking_pii(); $$
);
