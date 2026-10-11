# a2a-router

**An order passport for agent-assisted manufacturing.** People define the outcome,
AI agents help coordinate the work, and the buyer records delivery and acceptance.
Post-labor is the long-term vision; a concrete manufacturing order is the first product.

Website: **https://www.a2a-router.com/** · [Agent interfaces](https://www.a2a-router.com/agents.html)

## Usable today

- Prepare a structured manufacturing brief for CNC, sheet metal or 3D printing.
- Define material, quantity, destination and acceptance criteria without inventing missing specifications.
- Save a local order passport and manually record quotes, approval, production, delivery, acceptance, disputes and payment observations.
- Export and import the passport as JSON; verify its SHA-256 event chain.
- Read requirements and prepare drafts through REST, remote MCP and browser WebMCP.
- Use the existing public HTTPS-only A2A/MCP protocol bridge.

The passport is free and needs no account. Orders live in browser localStorage,
not a central database. Brief preparation does not submit an RFQ, contact a factory
or pay anyone. The form also works without JavaScript through the draft-only API.

## What trust means in this MVP

Order events are self-reported. Hash verification checks internal consistency;
it does **not** independently establish identity, truth, delivery or payment.
A complete chain can be recomputed. Keep exported snapshots as comparison records.

The existing signed Trust-Pledge, DID, JWKS and Agent Card remain unchanged
historical bridge metadata. Their signatures are preserved, and the pledge remains
self-attested. The authoritative new status is [GET /api/status](https://www.a2a-router.com/api/status).

## Next product stages

1. Recruit 10–20 manufacturers and buyers with real manufacturing orders.
2. Pilot paid evidence review: company identity, capabilities, certificate scope and expiry.
3. Build a centrally persisted, access-controlled ledger with identified counterparties and order evidence.
4. Validate provider-managed milestone payments and a dispute process after real order volume exists.

These are planned, not available services. No independently audited factories or
central production orders are published here. Escrow, buyer protection and payment
processing are not live. Voluntary tipping is no longer the product's revenue model.

Vibe Manufacturing is an optional external RFQ handoff. a2a-router is an independent
product and does not require that service or transfer a brief automatically.

## Agent interfaces

- [OpenAPI 3.1](https://www.a2a-router.com/openapi.json)
- [API catalogue](https://www.a2a-router.com/.well-known/api-catalog)
- [WebMCP convention manifest](https://www.a2a-router.com/.well-known/webmcp)
- MCP endpoint: `https://www.a2a-router.com/api/mcp`
- A2A endpoint: `https://www.a2a-router.com/api/a2a`
- GET `/api/requirements?process=sheet_metal`
- POST `/api/brief`

Browser tools: `get_project_status`, `get_manufacturing_requirements`,
`prepare_manufacturing_brief`. Remote MCP adds
`a2a_router.manufacturing_requirements` and `a2a_router.prepare_manufacturing_brief`
alongside existing status, pledge and bridge tools.

## Development

The Vercel project is `a2a-router`, with root directory **landing**. The site is
buildless HTML/CSS/JavaScript with Node.js Vercel functions and a locally served,
version-pinned WebMCP polyfill. See [landing/README.md](landing/README.md) for limits,
source layout and preview details.

```sh
cd landing
node tests/product.test.cjs
node scripts/dev.cjs
```

## Historical specifications

The [Trust-Pledge RFC](docs/rfc/RFC-001-trust-pledge.md),
[bridge architecture](docs/architecture.md) and
[earlier competitive analysis](docs/competitive-analysis.md) document the original
horizontal bridge proposal. Where they discuss tipping, a generic registry or
quarter-based roadmap, treat those as historical proposals superseded by the
current product status above.

Code: MIT. The historical Trust-Pledge standard is published under CC BY 4.0.
Contact: [@wuebbe](https://x.com/wuebbe).
