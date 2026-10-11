const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');
const M = require('../lib/manufacturing');
const input = { process: 'sheet_metal', description: 'Ten aluminium brackets matching the approved drawing.', material: 'EN AW-6082', quantity: 10, country: 'de', acceptance: 'Buyer measures every critical dimension against the approved drawing.' };
const sandbox = { crypto: crypto.webcrypto, TextEncoder, Manufacturing: M };
vm.runInNewContext(fs.readFileSync(require.resolve('../passport.js'), 'utf8'), sandbox);
const P = sandbox.OrderPassport;
async function call(name, req) {
  let body = '';
  const res = { statusCode: 200, headers: {}, setHeader(name, value) { this.headers[name.toLowerCase()] = value; }, end(value = '') { body = value; } };
  await require('../api/' + name)(req, res);
  return { code: res.statusCode, headers: res.headers, raw: body, data: res.headers['content-type']?.includes('json') && body ? JSON.parse(body) : undefined };
}
test('Briefs stay drafts, preserve acceptance criteria and report missing specifications', () => {
  const result = M.prepareBrief(input);
  assert.equal(result.status, 'draft_only'); assert.equal(result.submitted, false); assert.equal(result.persisted, false);
  assert.equal(result.brief.acceptance, input.acceptance); assert.equal(result.brief.country, 'DE');
  assert.ok(result.unresolved.some(text => text.includes('tolerance')));
  assert.equal(M.status.product, 'a2a-router Order Passport');
});
test('Incomplete, oversized and malformed specifications are rejected', () => {
  for (const patch of [{ quantity: 0 }, { quantity: 1.5 }, { quantity: '1e3' }, { quantity: true }, { country: 'Germany' }, { acceptance: ' ' }, { material: 'x'.repeat(121) }, { description: 'x'.repeat(2001) }, { process: '__proto__' }, { drawingUrl: 'javascript:alert(1)' }, { drawingUrl: 'https://secret@site.com/drawing' }, { extra: 'unknown' }]) assert.throws(() => M.prepareBrief({ ...input, ...patch }));
});
test('Local passports bind the brief and ordered events; tampering and truncation fail', async () => {
  const order = await P.create(input);
  const delivered = await P.append(order, 'delivered', 'Ten parts received.', 'delivery-note-10');
  const accepted = await P.append(delivered, 'accepted', 'Dimensions checked against drawing.', 'inspection-10');
  assert.equal((await P.verify(accepted)).eventCount, 2); assert.equal(order.events.length, 0);
  for (const mutate of [p => { p.brief.quantity = 11; }, p => { p.events[0].note = 'Changed note'; }, p => { p.events.reverse(); }, p => { p.events.pop(); }, p => { p.events[0].extra = 'unexpected'; }]) {
    const copy = JSON.parse(JSON.stringify(accepted)); mutate(copy); await assert.rejects(P.verify(copy));
  }
  await assert.rejects(P.append(order, '__proto__', 'Bad type'));
});
test('REST supports JSON and HTML without reflecting executable markup', async () => {
  const json = await call('brief', { method: 'POST', headers: { 'content-type': 'application/json' }, body: input });
  assert.equal(json.code, 200); assert.equal(json.data.submitted, false); assert.equal(json.headers['cache-control'], 'no-store');
  const html = await call('brief', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ ...input, description: '<script>alert(1)</script> bracket description' }).toString() });
  assert.equal(html.code, 200); assert.ok(html.raw.includes('&lt;script&gt;')); assert.ok(!html.raw.includes('<script>alert'));
  assert.equal((await call('brief', { method: 'GET', headers: {} })).code, 405);
  assert.equal((await call('brief', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{bad' })).code, 400);
  assert.equal((await call('brief', { method: 'POST', headers: { 'content-type': 'text/plain' }, body: '{}' })).code, 415);
  assert.equal((await call('brief', { method: 'OPTIONS', headers: {} })).code, 204);
  assert.equal((await call('requirements', { method: 'GET', query: { process: 'sheet_metal' } })).code, 200);
  assert.equal((await call('requirements', { method: 'GET', query: { process: 'unknown' } })).code, 400);
});
test('No-JavaScript brief reviews and validation errors keep the selected locale', async () => {
  for (const [lang, htmlLang, path, title, required] of [
    ['en', 'en-US', '/', 'Your manufacturing brief', 'Required field'],
    ['de', 'de', '/de/', 'Dein Fertigungsbrief', 'Pflichtfeld'],
    ['zh', 'zh-CN', '/zh/', '你的制造要求', '必填项']
  ]) {
    const request = { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, query: { lang }, body: new URLSearchParams(input).toString() };
    const result = await call('brief', request);
    assert.equal(result.code, 200);
    assert.ok(result.raw.includes(`lang="${htmlLang}"`));
    assert.ok(result.raw.includes(title));
    assert.ok(result.raw.includes(`href="${path}#brief"`));
    const missing = { ...input }; delete missing.material;
    const invalid = await call('brief', { ...request, body: new URLSearchParams(missing).toString() });
    assert.equal(invalid.code, 400); assert.ok(invalid.raw.includes(required));
  }
  const unsafe = await call('brief', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, query: { lang: '<script>alert(1)</script>' }, body: new URLSearchParams(input).toString() });
  assert.ok(unsafe.raw.includes('lang="en-US"'));
  assert.ok(!unsafe.raw.includes('<script>alert'));
});
test('MCP advertises and executes brief tools and reports current product status', async () => {
  const rpc = body => call('mcp', { method: 'POST', headers: {}, body: { jsonrpc: '2.0', id: 1, ...body } });
  const listed = await rpc({ method: 'tools/list' });
  const tool = listed.data.result.tools.find(tool => tool.name === 'a2a_router.prepare_manufacturing_brief');
  assert.equal(tool.annotations.readOnlyHint, true);
  const prepared = await rpc({ method: 'tools/call', params: { name: tool.name, arguments: input } });
  assert.equal(prepared.data.result.structuredContent.brief.quantity, 10);
  const invalid = await rpc({ method: 'tools/call', params: { name: tool.name, arguments: { ...input, quantity: 0 } } });
  assert.ok(invalid.data.error);
  const status = await rpc({ method: 'tools/call', params: { name: 'a2a_router.status', arguments: {} } });
  assert.equal(status.data.result.structuredContent.status, 'order_passport_mvp');
  const pledge = await rpc({ method: 'tools/call', params: { name: 'a2a_router.trust_pledge', arguments: {} } });
  assert.equal(pledge.data.result.structuredContent.bridgeRuntimeAvailable, true);
});
test('A2A still answers status requests with the new product status', async () => {
  const response = await call('a2a', { method: 'POST', headers: {}, body: { jsonrpc: '2.0', id: 1, method: 'SendMessage', params: { message: { parts: [{ text: 'What is live?' }] } } } });
  assert.equal(response.data.result.task.artifacts[0].parts[0].data.status, 'order_passport_mvp');
});
test('Existing signed Agent Card remains cryptographically valid', () => {
  const card = JSON.parse(fs.readFileSync(require.resolve('../.well-known/agent-card.json')));
  const jwk = JSON.parse(fs.readFileSync(require.resolve('../.well-known/jwks.json'))).keys[0];
  const signature = card.signatures[0]; delete card.signatures;
  const stable = value => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, stable(item)])) : value;
  const payload = Buffer.from(JSON.stringify(stable(card))).toString('base64url');
  assert.equal(crypto.verify(null, Buffer.from(signature.protected + '.' + payload), crypto.createPublicKey({ key: jwk, format: 'jwk' }), Buffer.from(signature.signature, 'base64url')), true);
});
