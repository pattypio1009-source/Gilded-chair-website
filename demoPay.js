// SIMULATED payment. No gateway, no card/UPI data is accepted or stored.
const L = require('./_lib');
module.exports = async (req, res) => {
  if (!L.guard(req, res, 'POST')) return;
  const b = req.body && typeof req.body === 'object' ? req.body : {};
  if (!L.uuid(b.bookingId) || !['success', 'failure', 'cancel'].includes(b.outcome))
    return res.status(400).json({ error: 'Invalid request' });
  try { res.json({ outcome: await L.sb('rpc/demo_pay', { p_booking: b.bookingId, p_outcome: b.outcome }) }); }
  catch (e) { L.fail(res, e); }
};
