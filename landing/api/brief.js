const { prepareBrief } = require('../lib/manufacturing');
const L = require('../lib/i18n');
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
  const lang = L.locale(typeof req.query?.lang === 'string' ? req.query.lang : 'en');
  const copy = {
    en: { language: 'en-US', path: '/', title: 'Your manufacturing brief', back: 'Back to the brief builder', tag: 'DRAFT PREPARED · NOT SUBMITTED', description: 'Download or copy this brief and send it to your chosen manufacturer. No supplier has received it. Review unresolved details before requesting quotes.', next: 'Back to your order passport', error: 'Check your brief' },
    de: { language: 'de', path: '/de/', title: 'Dein Fertigungsbrief', back: 'Zurück zum Auftragsbrief', tag: 'ENTWURF · NOCH NICHT GESENDET', description: 'Kopiere diesen Brief und sende ihn an deinen gewählten Hersteller. Kein Anbieter hat ihn erhalten. Kläre offene Angaben vor der Angebotsanfrage.', next: 'Zurück zu deinem Auftrags-Pass', error: 'Prüfe deine Angaben' },
    zh: { language: 'zh-CN', path: '/zh/', title: '你的制造要求', back: '返回制造要求表单', tag: '草稿 · 尚未提交', description: '复制这份制造要求并发送给你选择的制造商。尚未有供应商收到此草稿，请在询价前确认未确定的细节。', next: '返回订单档案', error: '请检查填写内容' }
  }[lang];
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
    res.end(`<!doctype html><html lang="${copy.language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${copy.title} · a2a-router</title><link rel="stylesheet" href="/styles.css"></head><body><main class="container document"><a href="${copy.path}#brief">← ${copy.back}</a><p class="eyebrow">${copy.tag}</p><h1>${copy.title}.</h1><p>${copy.description}</p><pre>${escape(JSON.stringify(result, null, 2))}</pre><a class="button" href="${copy.path}#orders">${copy.next} →</a></main></body></html>`);
  } catch (error) {
    res.statusCode = 400;
    if (!html) return res.end(JSON.stringify({ error: error.message }));
    res.end(`<!doctype html><html lang="${copy.language}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${copy.error}</title><link rel="stylesheet" href="/styles.css"></head><body><main class="container document"><h1>${copy.error}.</h1><p>${escape(L.error(error, lang))}</p><a href="${copy.path}#brief">${copy.back}</a></main></body></html>`);
  }
};
