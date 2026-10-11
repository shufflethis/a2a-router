# a2a-router Order Passport MVP

One product for agent-assisted manufacturing. The first usable release prepares
a manufacturing brief and keeps a portable, self-reported order history locally
in the browser. Factory attestations, a shared verified ledger and payments are
planned. Vibe Manufacturing is an optional external RFQ handoff only.

## Local checks

No build step or runtime npm dependencies are required.

```sh
node --test tests/product.test.cjs
node scripts/dev.cjs
```

Preview: http://127.0.0.1:4318. The local server adapts the same Vercel functions.
Do not deploy it as an alternative production backend.

## Interfaces

- POST `/api/brief`: JSON draft preparation, or HTML review for a standard form.
- GET `/api/requirements?process=sheet_metal`: required specifications.
- GET `/api/status`: authoritative live/planned product status.
- `/api/mcp`: existing MCP bridge plus manufacturing brief tools.
- `/api/a2a`: existing A2A bridge with updated status.
- `/openapi.json`, `/.well-known/api-catalog`, `/.well-known/webmcp`.
- Browser tools on `/` and `/agents.html`: status, requirements, brief preparation.

`lib/manufacturing.js` is shared by browser, REST and MCP. It validates input
without filling missing specifications or contacting third parties.

## Local passport boundaries

`passport.js` hashes a normalized brief and each event using SHA-256 over sorted
JSON keys. Event hashes bind order ID, index, timestamp, previous hash, note and
evidence reference. Import validates schema and the complete chain; conflicting
or stale histories do not overwrite a local copy. The browser stores at most 50
orders, each with at most 1000 events. Export creates a portable JSON backup.

This proves internal hash consistency only. Users can rewrite an entire chain.
There is no trusted timestamp, signed counterparty, independently verified fact,
server anchoring, public ledger or payment confirmation. Users manually record
external actions; selecting “payment recorded” does not perform a payment.

Existing signed Agent Card, pledge, DID and JWKS remain unchanged to preserve
signature validity. Their earlier bridge positioning is historical. The new
product status is deliberately separate at `/api/status` and in the unsigned
discovery index.

Agent Tracking is the user-requested external script. The inspected script
records path, referral/UTM source, tool names and execution status/duration;
it does not transmit tool arguments, form values or local order records.
Its remote implementation may change. Data use is described in the page FAQ.

Vercel project `a2a-router` uses repository root directory `landing`. Deploy the
repository-shaped source with `landing/vercel.json`; do not change its root.
