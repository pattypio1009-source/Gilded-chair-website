const L = require('./_lib');
module.exports = async (req, res) => {
  if (!L.guard(req, res, 'GET')) return;
  try {
    const [services, stylists] = await Promise.all([
      L.sb('services?is_active=eq.true&select=id,name,description,price_paise,duration_minutes&order=price_paise'),
      L.sb('stylists?is_active=eq.true&select=id,name,role&order=name')]);
    res.setHeader('Cache-Control', 'public, s-maxage=60');
    res.json({ services, stylists });
  } catch (e) { L.fail(res, e); }
};
