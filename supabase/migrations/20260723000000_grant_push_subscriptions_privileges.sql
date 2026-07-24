-- Push notifications never worked because the browser-side insert into
-- push_subscriptions failed with 42501 "permission denied for table".
-- RLS policies existed and were correct, but the `authenticated` role had
-- no base table privilege, so Postgres rejected the write before RLS was
-- ever evaluated. A missing table-level GRANT and a missing RLS policy
-- fail differently: RLS denial says "new row violates row-level security
-- policy", while a missing GRANT says "permission denied for table" — this
-- was the latter, which is why the (correct) policies never got a chance
-- to run. Grant the four CRUD privileges the RLS policies already scope to
-- auth.uid() = user_id, so the admin dashboard can upsert its own
-- subscription row.
grant select, insert, update, delete on public.push_subscriptions to authenticated;

-- The send-booking-push Edge Function runs as service_role (bypasses RLS)
-- and prunes dead endpoints (404/410 from the push service) via DELETE.
-- It was missing DELETE, so pruning would have failed once rows existed.
grant delete on public.push_subscriptions to service_role;
