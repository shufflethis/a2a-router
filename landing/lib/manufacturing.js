/* Shared, side-effect-free brief preparation for the website, REST and MCP. */
(function (root) {
  'use strict';
  const base = 'https://www.a2a-router.com';
  const processes = {
    cnc_machining: { name: 'CNC machining', files: ['STEP', 'PDF dimensioned drawing'], checks: ['Critical dimensions and tolerances', 'Threads, surface finish and inspection method'] },
    sheet_metal: { name: 'Sheet metal', files: ['DXF for flat parts', 'STEP for bent parts', 'PDF dimensioned drawing'], checks: ['Sheet thickness, bend radius and bend direction', 'Deburring, coating and critical dimensions'] },
    additive_manufacturing: { name: '3D printing', files: ['STEP', 'STL', '3MF'], checks: ['Dimensions, fit and print orientation', 'Material properties, finish and critical dimensions'] }
  };
  const schema = {
    type: 'object', additionalProperties: false,
    properties: {
      process: { type: 'string', enum: Object.keys(processes), description: 'Manufacturing process.' },
      description: { type: 'string', minLength: 10, maxLength: 2000, description: 'What the part does, dimensions and constraints. Never invent specifications.' },
      material: { type: 'string', minLength: 1, maxLength: 120 },
      quantity: { type: 'integer', minimum: 1, maximum: 100000 },
      country: { type: 'string', pattern: '^[A-Za-z]{2}$', description: 'Two-letter destination country code, e.g. US.' },
      acceptance: { type: 'string', minLength: 10, maxLength: 1000, description: 'How the buyer will check and accept the delivered parts.' },
      tolerance: { type: 'string', maxLength: 200 },
      finish: { type: 'string', maxLength: 200 },
      deadline: { type: 'string', maxLength: 100 },
      drawingUrl: { type: 'string', maxLength: 1000, description: 'Optional https drawing link. This tool does not fetch it.' }
    },
    required: ['process', 'description', 'material', 'quantity', 'country', 'acceptance']
  };
  const status = {
    project: 'a2a-router', product: 'a2a-router Order Passport', status: 'order_passport_mvp', primaryMarket: 'United States', locales: { 'en-US': base + '/', 'zh-Hans': base + '/zh/', de: base + '/de/' }, updatedAt: '2026-10-11',
    purpose: 'An order passport and trust infrastructure for agent-assisted manufacturing. Post-labor is the long-term vision; manufacturing is the first market.',
    live: {
      website: base + '/', briefBuilder: base + '/#brief', localOrderPassport: base + '/#orders', briefApi: base + '/api/brief',
      requirements: base + '/api/requirements', productStatus: base + '/api/status',
      mcpEndpoint: base + '/api/mcp', a2aJsonRpc: base + '/api/a2a',
      a2aAgentCard: base + '/.well-known/agent-card.json', mcpServerJson: base + '/server.json',
      trustPledge: base + '/.well-known/trust-pledge.json', did: base + '/.well-known/did.json', jwks: base + '/.well-known/jwks.json',
      llms: base + '/llms.txt', openapi: base + '/openapi.json',
      agentDocumentation: base + '/agents.html'
    },
    optionalHandoffs: { manufacturingRequest: 'https://vibe-manufacturing.com/request-quote', note: 'Optional external service. Not required to use a2a-router; no automatic transfer.' },
    planned: {
      factoryAttestations: 'Paid evidence review of identity, capabilities and certificate scope; not yet available.',
      orderLedger: 'Persistent evidence-backed order events, delivery, acceptance, disputes and payment; not yet available.',
      settlement: 'Provider-managed milestone payments after buyer acceptance; no escrow or payments on this site today.'
    },
    pilot: {
      name: 'Guided Manufacturing Pilot', inquiryStatus: 'open', enrollmentOpen: true,
      targetCustomers: 3, primaryCustomers: 'Small US hardware teams and product studios',
      firstProcesses: Object.keys(processes), price: { amount: 500, currency: 'USD', basis: 'One-time fee for one guided order; applicable taxes specified in the proposal.' },
      scope: 'One part, one supplier, one order: a kickoff, structured brief, comparison of up to three buyer-provided quotes, milestone plan, acceptance checklist, and exportable order passport using buyer and supplier evidence.',
      excludes: ['Manufacturing and shipping costs', 'Engineering design', 'Supplier sourcing', 'Independent quality inspection', 'Third-party inspection costs'],
      inquiryUrl: base + '/#pilot', contactEmail: 'go@vibe-manufacturing.com', operator: 'FINAL MASTER LLC',
      inquiryMethod: 'Email: the website opens a draft in the visitor’s mail app. The visitor must review and send it. No web submission or checkout.',
      nextStep: 'Scope, timeline and fee confirmed in writing before the customer decides to proceed and receives an invoice. No charge or commitment to inquire.',
      verifiedFactoryCount: 0, recordedOrderCount: 0,
      note: 'Personally guided service. Supplier communication and payments happen outside the software. No completed pilots, independently audited factories or central production ledger orders are published here.'
    },
    limitations: [
      'Brief preparation does not submit an RFQ, contact a manufacturer or take payment. Saving a local order is a separate human action.',
      'The published Trust-Pledge and signed Agent Card remain historical, self-attested bridge metadata.',
      'Order events are self-reported and stored in the browser. No central verified ledger, factory audit, buyer protection or escrow service is available here yet.',
      'Bridge calls accept public HTTPS targets only; private and reserved networks are blocked.',
      'The bridge does not persist credentials or sessions; streaming and push notifications are not implemented.'
    ]
  };
  function requirements(process) {
    if (typeof process !== 'string' || !Object.hasOwn(processes, process)) throw new Error('Select a supported process: ' + Object.keys(processes).join(', '));
    return { process, ...processes[process], requiredFields: schema.required, acceptance: 'Define a measurable acceptance check before requesting quotes.', workflowUrl: status.live.briefBuilder, status: 'requirements_only' };
  }
  function prepareBrief(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Brief input must be an object.');
    for (const key of Object.keys(input)) if (!Object.hasOwn(schema.properties, key)) throw new Error('Unknown field: ' + key);
    const normalized = {};
    for (const [key, definition] of Object.entries(schema.properties)) {
      const value = input[key];
      if (value === undefined || value === '') {
        if (schema.required.includes(key)) throw new Error('Required field: ' + key);
        continue;
      }
      if (definition.type === 'integer') {
        if ((typeof value !== 'number' && typeof value !== 'string') || (typeof value === 'string' && !/^\d+$/.test(value))) throw new Error(key + ' must be a whole number.');
        const number = Number(value);
        if (!Number.isInteger(number) || number < definition.minimum || number > definition.maximum) throw new Error(key + ' must be between 1 and 100000.');
        normalized[key] = number;
      } else {
        if (typeof value !== 'string') throw new Error(key + ' must be text.');
        const text = value.trim();
        if (text.length < (definition.minLength || (schema.required.includes(key) ? 1 : 0)) || text.length > definition.maxLength) throw new Error('Check the length of ' + key + '.');
        if (definition.pattern && !(new RegExp(definition.pattern)).test(text)) throw new Error('country must be a two-letter code, e.g. US.');
        normalized[key] = key === 'country' ? text.toUpperCase() : text;
      }
    }
    const process = requirements(normalized.process);
    if (normalized.drawingUrl) {
      let url;
      try { url = new URL(normalized.drawingUrl); } catch { throw new Error('drawingUrl must be a valid HTTPS link.'); }
      if (url.protocol !== 'https:' || url.username || url.password) throw new Error('drawingUrl must be an HTTPS link without credentials.');
    }
    const unresolved = ['Engineering review and manufacturability', 'Supplier identity, capability and certificate verification', 'Quoted price, capacity and lead time'];
    for (const key of ['tolerance', 'finish', 'deadline', 'drawingUrl']) if (!normalized[key]) unresolved.push('Confirm ' + key + ' with the manufacturer.');
    return {
      schemaVersion: 'manufacturing-brief-v1', status: 'draft_only', submitted: false, persisted: false,
      brief: normalized, requiredFiles: process.files, processChecks: process.checks, unresolved,
      nextStep: { url: base + '/#orders', instruction: 'Save this draft locally in a2a-router or download it. Contact your chosen manufacturer separately and attach actual drawings. Record the resulting quote, delivery and acceptance in your order passport. No automatic transfer or submission occurs.' }
    };
  }
  const api = { processes, schema, status, requirements, prepareBrief };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Manufacturing = api;
})(typeof globalThis === 'object' ? globalThis : this);
