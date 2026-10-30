# The Gilded Chair — salon booking site

Static site (`index.html` + `assets/`) · Vercel serverless functions (`api/`) · Supabase (Postgres). No runtime npm dependencies.

## What works
- Services & stylists load from Supabase via `/api/services`.
- Availability comes from the database (`get_slots`), in **IST**; "Any available stylist" is assigned server-side.
- Double booking is impossible (DB exclusion constraint + server checks). Prices and the 20% deposit are computed in SQL only.
- Pending bookings hold a slot for 10 minutes, then expire automatically (`expire_pending`).
- **Demo checkout** (UPI / Cards / Net banking / Wallets tabs): simulated success, failure, cancel. No gateway, no card data is ever collected. Payments are stored with `provider = 'demo'`.
- `api/razorpayWebhook.js` is intentionally still a 503 stub — real Razorpay is not used.

## Setup (you need to do this once)
1. Create a Supabase project. In **SQL Editor** run, in order: `supabase/migrations/20260101000000_init.sql`, then `20260101000100_booking_logic.sql` (both are safe to re-run).
2. Vercel > Project > Settings > Environment Variables: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (Project Settings > API). Server-only: never put them in `index.html` or Git. See `.env.example`.
3. Redeploy. Without these the site shows "Online booking is temporarily unavailable".

## Files
`api/_lib.js` shared helpers (validation, rate limit, errors) · `services.js` · `slots.js` · `createOrder.js` (creates pending booking + demo payment record) · `demoPay.js` (simulated outcome) · `razorpayWebhook.js` stub.

## Notes
- Rate limiting is in-memory per serverless instance (best effort). For stronger limits use Vercel WAF / Upstash.
- Booking IDs are random UUIDs and act as the capability to pay for that booking.
- Make a real owner view later by adding an admin role and RLS policy; none exists yet.
