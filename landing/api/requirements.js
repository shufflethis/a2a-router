const { requirements } = require('../lib/manufacturing');
module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
  if (req.method !== 'GET') { res.statusCode = 405; res.setHeader('Allow', 'GET, OPTIONS'); return res.end(JSON.stringify({ error: 'Method not allowed' })); }
  try { res.statusCode = 200; res.end(JSON.stringify(requirements(req.query?.process), null, 2)); }
  catch (error) { res.statusCode = 400; res.end(JSON.stringify({ error: error.message })); }
};
