// Shared helpers. Files starting with "_" are not exposed as endpoints by Vercel.
const hits = new Map();
const rate = (req, res, max = 30) => { // best-effort per-instance limiter (serverless memory)
  const ip = String(req.headers['x-forwarded-for'] || 'x').split(',')[0].trim(), now = Date.now();
  const r = (hits.get(ip) || []).filter(t => now - t < 60000); r.push(now); hits.set(ip, r);
  if (hits.size > 5000) hits.clear();
  if (r.length > max) { res.status(429).json({ error: 'Too many requests. Please wait a minute.' }); return false; }
  return true;
};
exports.guard = (req, res, method) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== method) { res.setHeader('Allow', method); res.status(405).json({ error: 'Method not allowed' }); return false; }
  return rate(req, res);
};
const URL_ = process.env.SUPABASE_URL, KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
exports.sb = async (path, body) => {
  if (!URL_ || !KEY) throw new Error('not_configured');
  const r = await fetch(URL_ + '/rest/v1/' + path, {
    method: body ? 'POST' : 'GET',
    headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => null);
  if (!r.ok) throw new Error((j && j.message) || 'db_error');
  return j;
};
const MSG = { slot_unavailable: 'That time was just taken. Please choose another.', invalid_details: 'Please check your details.',
  invalid_service: 'Unknown service.', booking_not_pending: 'This booking is no longer awaiting payment (it may have expired).',
  not_found: 'Booking not found.', invalid_outcome: 'Invalid outcome.' };
exports.fail = (res, e) => {
  const k = Object.keys(MSG).find(x => String(e.message).includes(x));
  if (k) return res.status(k === 'slot_unavailable' ? 409 : 400).json({ error: MSG[k], code: k });
  if (e.message === 'not_configured') return res.status(503).json({ error: 'Booking service is not configured yet.' });
  console.error('api error:', e.message);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
};
exports.uuid = v => typeof v === 'string' && /^[0-9a-f-]{36}$/i.test(v);
