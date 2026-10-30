const L = require('./_lib');
module.exports = async (req, res) => {
  if (!L.guard(req, res, 'GET')) return;
  const q = req.query || {}, st = q.stylist || null;
  if (!L.uuid(q.service) || (st && !L.uuid(st)) || !/^\d{4}-\d{2}-\d{2}$/.test(q.date || ''))
    return res.status(400).json({ error: 'Invalid request' });
  try { res.json({ slots: await L.sb('rpc/get_slots', { p_service: q.service, p_stylist: st, p_day: q.date }) }); }
  catch (e) { L.fail(res, e); }
};
