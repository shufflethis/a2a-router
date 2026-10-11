/* A portable, self-reported local record. Hash consistency is not attestation. */
(function (root) {
  'use strict';
  const labels = { rfq_sent: 'Anfrage gesendet', quote_received: 'Angebot erhalten', approved: 'Auftrag freigegeben', production: 'Fertigung gemeldet', delivered: 'Lieferung erfasst', accepted: 'Abnahme erfasst', disputed: 'Reklamation erfasst', paid: 'Zahlung erfasst' };
  function canonical(value) {
    if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
    if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + canonical(value[key])).join(',') + '}';
    return JSON.stringify(value);
  }
  async function hash(value) {
    const bytes = new TextEncoder().encode(canonical(value));
    return Array.from(new Uint8Array(await root.crypto.subtle.digest('SHA-256', bytes)), b => b.toString(16).padStart(2, '0')).join('');
  }
  function header(passport) { return { version: passport.version, id: passport.id, createdAt: passport.createdAt, brief: passport.brief }; }
  function eventData(event) { const { hash: ignored, ...data } = event; return data; }
  function keys(value, allowed) {
    if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).some(key => !allowed.includes(key)) || allowed.some(key => !Object.hasOwn(value, key))) throw new Error('Ungültige Pass-Struktur.');
  }
  function validTime(time) { return typeof time === 'string' && !Number.isNaN(Date.parse(time)) && new Date(time).toISOString() === time; }
  function validateEvent(type, note, evidence) {
    if (!Object.hasOwn(labels, type)) throw new Error('Unbekannter Ereignistyp.');
    if (typeof note !== 'string' || note.trim().length < 3 || note.length > 2000) throw new Error('Bitte eine Notiz mit 3–2000 Zeichen eintragen.');
    if (typeof evidence !== 'string' || evidence.length > 1000) throw new Error('Belegverweis darf höchstens 1000 Zeichen haben.');
  }
  async function verify(passport) {
    keys(passport, ['version', 'id', 'createdAt', 'brief', 'events', 'headHash']);
    if (passport.version !== 'a2a-order-passport-v1' || typeof passport.id !== 'string' || !/^[a-f0-9-]{36}$/.test(passport.id) || !validTime(passport.createdAt)) throw new Error('Ungültiger Pass-Kopf.');
    const normalized = root.Manufacturing.prepareBrief(passport.brief).brief;
    if (canonical(normalized) !== canonical(passport.brief)) throw new Error('Ungültige Auftragsspezifikation.');
    if (!Array.isArray(passport.events) || passport.events.length > 1000) throw new Error('Ungültige Ereignisliste.');
    let previous = await hash(header(passport));
    let at = passport.createdAt;
    for (const [index, event] of passport.events.entries()) {
      keys(event, ['orderId', 'index', 'type', 'at', 'note', 'evidence', 'previousHash', 'hash']);
      validateEvent(event.type, event.note, event.evidence);
      if (event.orderId !== passport.id || event.index !== index || event.previousHash !== previous || !validTime(event.at) || event.at < at || await hash(eventData(event)) !== event.hash) throw new Error('Hash-Kette ungültig bei Ereignis ' + (index + 1) + '.');
      previous = event.hash; at = event.at;
    }
    if (previous !== passport.headHash) throw new Error('Abschlusshash stimmt nicht überein.');
    return { valid: true, eventCount: passport.events.length, headHash: previous, assurance: 'self_reported_hash_consistency_only' };
  }
  async function create(brief) {
    const passport = { version: 'a2a-order-passport-v1', id: root.crypto.randomUUID(), createdAt: new Date().toISOString(), brief: root.Manufacturing.prepareBrief(brief).brief, events: [], headHash: '' };
    passport.headHash = await hash(header(passport));
    return passport;
  }
  async function append(passport, type, note, evidence = '') {
    await verify(passport); validateEvent(type, note, evidence);
    if (passport.events.length >= 1000) throw new Error('Maximal 1000 Ereignisse pro Pass.');
    const copy = JSON.parse(JSON.stringify(passport));
    const last = copy.events.at(-1)?.at || copy.createdAt;
    const event = { orderId: copy.id, index: copy.events.length, type, at: new Date(Math.max(Date.now(), Date.parse(last))).toISOString(), note: note.trim(), evidence: evidence.trim(), previousHash: copy.headHash };
    event.hash = await hash(event); copy.events.push(event); copy.headHash = event.hash;
    return copy;
  }
  root.OrderPassport = { labels, canonical, hash, create, append, verify };
})(globalThis);
