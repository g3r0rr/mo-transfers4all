-- Fixes a cross-tenant privacy gap found via Supabase Advisors +
-- manual review: the "View bookings by role" policy let ANY
-- authenticated hotel-role user see ALL source='hotel' bookings, not
-- just the ones they submitted (HotelDashboard.jsx's own query has the
-- same gap — it just filters by source, not by who created the row).
-- Harmless while there's only one hotel partner account, but a real
-- leak the moment a second one is added. This adds a created_by column
-- and scopes the SELECT policy to it.

alter table public.bookings
  add column if not exists created_by uuid references auth.users(id);

-- Backfill existing hotel bookings. Assumes exactly one hotel profile
-- exists today (true as of this migration) — if that's no longer the
-- case when this runs, this arbitrary pick could assign existing rows
-- to the wrong hotel account; check profiles for role='hotel' first.
update public.bookings
set created_by = (select id from public.profiles where role = 'hotel' limit 1)
where source = 'hotel' and created_by is null;

drop policy if exists "View bookings by role" on public.bookings;
create policy "View bookings by role" on public.bookings
for select
to authenticated
using (
  (source = 'hotel' and created_by = (select auth.uid()))
  or (exists (
    select 1 from public.profiles
    where profiles.id = (select auth.uid()) and profiles.role = 'admin'
  ))
);

-- Minor cleanup flagged by Supabase Advisors: this policy is a strict
-- subset of "Anyone can insert a booking" ({anon,authenticated} vs
-- {anon}), so it's redundant and just costs an extra policy evaluation
-- per insert for no behavior difference.
drop policy if exists "Anon users can insert bookings" on public.bookings;
