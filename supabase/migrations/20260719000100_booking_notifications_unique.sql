-- Guarantees the uniqueness that the send-booking-push Edge Function's
-- insert-first idempotency claim relies on. The function now inserts a
-- row into booking_notifications_sent BEFORE sending anything and treats
-- a 23505 unique_violation as "another webhook retry already claimed this
-- booking, bail out". That race-safety only holds if booking_id is
-- actually unique — otherwise two concurrent retries both insert
-- successfully and both send.
--
-- booking_id is almost certainly already the primary key of this table
-- (it's the idempotency guard), in which case this unique index is a
-- harmless no-op-ish redundancy. But making it explicit means the
-- Edge Function's correctness no longer depends on an unverified
-- assumption. If this fails because duplicate booking_ids already exist,
-- that itself is the bug to fix (idempotency was already broken).

create unique index if not exists booking_notifications_sent_booking_id_key
  on public.booking_notifications_sent (booking_id);
