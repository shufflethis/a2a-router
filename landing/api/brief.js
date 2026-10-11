const { prepareBrief } = require('../lib/manufacturing');
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  res.setHeader('Referrer-Policy', 'no-referrer');
  if (req.method !== 'POST') { res.statusCode = 405; res.setHeader('Allow', 'POST'); res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify({ error: 'Use POST to prepare a brief.' })); }
  const type = req.headers['content-type'] || '';
  const html = type.includes('application/x-www-form-urlencoded');
  res.setHeader('Content-Type', html ? 'text/html; charset=utf-8' : 'application/json; charset=utf-8');
  try {
    if (!html && !type.includes('application/json')) { res.statusCode = 415; return res.end(JSON.stringify({ error: 'Use application/json or application/x-www-form-urlencoded.' })); }
    let input = req.body;
    if (typeof input === 'string') {
      if (Buffer.byteLength(input) > 16000) throw new Error('Brief exceeds 16000 bytes.');
      input = html ? Object.fromEntries(new URLSearchParams(input)) : JSON.parse(input);
    }
    const result = prepareBrief(input);
    res.statusCode = 200;
    if (!html) return res.end(JSON.stringify(result, null, 2));
    res.end(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Your manufacturing brief · a2a-router</title><link rel="stylesheet" href="/styles.css"></head><body><main class="container document"><a href="/#brief">← Back to the brief builder</a><p class="eyebrow">DRAFT PREPARED · NOT SUBMITTED</p><h1>Your manufacturing brief.</h1><p>Copy this brief into Vibe Manufacturing and attach your drawings. No manufacturer has received it. Missing details still need review.</p><pre>${escape(JSON.stringify(result, null, 2))}</pre><a class="button" href="https://vibe-manufacturing.com/request-quote" rel="noreferrer">Open the manufacturing request →</a></main></body></html>`);
  } catch (error) {
    res.statusCode = 400;
    if (!html) return res.end(JSON.stringify({ error: error.message }));
    res.end(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Check your brief</title><link rel="stylesheet" href="/styles.css"><main class="container document"><h1>Check your brief.</h1><p>${escape(error.message)}</p><a href="/#brief">Back to the form</a></main></html>`);
  }
};
