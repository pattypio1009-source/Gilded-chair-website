// Creates a PENDING booking (+ a DEMO payment record). Price, deposit, stylist assignment and
// availability are all decided in the database; browser-sent amounts are ignored (none are accepted).
const L = require('./_lib');
module.exports = async (req, res) => {
  if (!L.guard(req, res, 'POST')) return;
  const b = req.body && typeof req.body === 'object' ? req.body : {};
  if (!L.uuid(b.serviceId) || (b.stylistId && !L.uuid(b.stylistId)) || isNaN(Date.parse(b.startsAt)))
    return res.status(400).json({ error: 'Invalid request' });
  try {
    const rows = await L.sb('rpc/create_booking', { p_service: b.serviceId, p_stylist: b.stylistId || null,
      p_start: new Date(b.startsAt).toISOString(), p_name: String(b.name || '').slice(0, 80),
      p_phone: String(b.phone || '').slice(0, 20), p_email: String(b.email || '').slice(0, 120) });
    res.status(201).json(rows[0]);
  } catch (e) { L.fail(res, e); }
};
