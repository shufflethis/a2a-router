# a2a-router — Technical Architecture

**Status:** Bridge MVP live + draft architecture v0.1
**Last updated:** May 17, 2026

This document describes the current bridge MVP and planned architecture of a2a-router.com. The public HTTPS-only A2A/MCP bridge is live; registry, persistent sessions, streaming transport, and settlement are still planned.

## System overview

```
                         ┌────────────────────────────────┐
                         │   REQUESTING AGENT             │
                         │   (Claude, GPT, Custom Agent)  │
                         └─────────────┬──────────────────┘
                                       │
                                       │ HTTPS + JSON-RPC 2.0
                                       │ (A2A) or stdio/SSE (MCP)
                                       ▼
        ┌──────────────────────────────────────────────────────────┐
        │              a2a-router.com (Core)                       │
        │                                                          │
        │  ┌────────────┐  ┌────────────┐  ┌──────────────────┐    │
        │  │ Discovery  │  │   Bridge   │  │   Transaction    │    │
        │  │  Engine    │  │   Layer    │  │     Router       │    │
        │  └─────┬──────┘  └─────┬──────┘  └────────┬─────────┘    │
        │        │               │                   │              │
        │  ┌─────┴───────────────┴───────────────────┴────────┐    │
        │  │           Identity + Trust Layer                 │    │
        │  │  (DID, Trust-Pledge, Reputation, Rate-Limit)     │    │
        │  └───────────────────────┬──────────────────────────┘    │
        └──────────────────────────┼───────────────────────────────┘
                                   │
        ┌──────────────────────────┼───────────────────────────────┐
        │                          ▼                                │
        │  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐  │
        │  │ A2A Agents  │  │ MCP Servers  │  │ Hybrid Bridged  │  │
        │  │ (native)    │  │ (translated) │  │   (both ways)   │  │
        │  └─────────────┘  └──────────────┘  └─────────────────┘  │
        └───────────────────────────────────────────────────────────┘
```

## Core components

### 1. Discovery Engine
**Purpose:** Crawl, index, and search agents across A2A and MCP ecosystems.

Current MVP:
- Publishes machine-readable discovery through `/.well-known/a2a-router.json`
- Publishes A2A discovery through `/.well-known/agent-card.json`
- Publishes MCP remote metadata through `/server.json`
- Publishes AI crawler context through `/llms.txt`

Planned:
- Crawl `/.well-known/agent-card.json` (A2A) and MCP `server.json` metadata
- Vector DB (Qdrant) for semantic capability search
- PostgreSQL for structured filtering (skills, auth, pricing, latency)

### 2. Bridge Layer (KEY DIFFERENTIATOR)
**Purpose:** Translate between A2A and MCP protocols transparently.

Current MVP:
- **MCP → A2A:** MCP tool `a2a_router.call_a2a_agent` invokes public A2A JSON-RPC `SendMessage`
- **MCP → MCP:** MCP tool `a2a_router.call_mcp_tool` invokes public MCP `tools/call`
- **A2A → MCP:** A2A `SendMessage` with structured bridge data invokes public MCP `tools/call`
- **A2A → A2A:** A2A `SendMessage` with structured bridge data invokes public A2A `SendMessage`
- Public HTTPS targets only; localhost, private, reserved, multicast, and documentation IP ranges are blocked

Planned:
- authenticated agent registry
- persistent routing sessions
- streaming bridge transport
- consent-chain JWT enforcement

### 3. Transaction Router
**Purpose:** Route agent calls, measure quality, handle voluntary tips.

Current status: planned, not live.

- Rust implementation (latency-critical)
- JWT-based agent authentication
- Stripe Connect for fiat payouts, optional Solana/USDC integration
- Tip and skip APIs
- Quality score tracking

### 4. Identity + Trust Layer
**Purpose:** DID-based agent identity, Trust-Pledge verification, reputation.

Current MVP:
- Publishes DID document at `/.well-known/did.json`
- Publishes JWKS at `/.well-known/jwks.json`
- Publishes signed Trust-Pledge at `/.well-known/trust-pledge.json`
- Signs Agent Card and Trust-Pledge with Ed25519/EdDSA

Planned:
- Trust score computation (see RFC-001)
- Rate limiting per agent
- community verification and third-party audit workflow

## Tech stack

| Component | Tech | Reasoning |
|-----------|------|-----------|
| Bridge MVP | Vercel Functions (Node.js) | Small public HTTPS bridge, fast iteration |
| Discovery + Bridge Registry | Python (FastAPI) | Agent/LLM ecosystem is Python-first |
| Transaction Router | Rust | Latency-critical, no GIL |
| Frontend | Next.js 15 | Modern, fast, Vercel-deployable |
| Vector DB | Qdrant | Open-source, performant |
| Primary DB | PostgreSQL | Battle-tested, JSONB-friendly |
| Cache | Redis | Standard choice |
| Infrastructure | Hetzner Cloud + Vercel | Cost-effective, EU-friendly |

## Why this stack

- **Python** for protocol-translation layers — the agent ecosystem speaks Python
- **Rust** for hot-path transaction routing — every ms matters in agent chains
- **PostgreSQL** as source of truth, **Qdrant** for vector search
- **Hetzner** keeps costs predictable; Vercel handles edge frontend
- **Open-source-first** — no vendor lock-in on core components

## Detailed component specs

*(In progress — will be added as the RFC discussions mature.)*

- `docs/architecture/discovery-engine.md` — coming soon
- `docs/architecture/bridge-layer.md` — coming soon
- `docs/architecture/transaction-router.md` — coming soon

## Estimated cost & timeline

| Phase | Duration | Cost (Infra) | Cost (Dev) |
|-------|----------|--------------|------------|
| Phase 1: Discovery MVP | 4-6 weeks | ~150 EUR/mo | ~30k EUR |
| Phase 2: Bridge Layer | 4-6 weeks | ~150 EUR/mo | ~30k EUR |
| Phase 3: Transaction Router | 6-8 weeks | ~250 EUR/mo | ~50k EUR |
| Phase 4: Trust-Pledge | 3-4 weeks | ~250 EUR/mo | ~20k EUR |
| **MVP Total** | **~6 months** | **~250 EUR/mo** | **~130k EUR** |

## Open architectural questions

1. **DID method:** `did:web` (simple) vs. `did:key` (decentralized) vs. custom?
2. **Crypto payments:** Solana (popular) vs. USDC on Base/Polygon vs. Stellar (x402)?
3. **Open-source strategy:** Core open, enterprise closed? Or full SaaS?
4. **Multi-region deployment:** When to go beyond EU-only?
5. **Bridge consistency:** Stateless vs. stateful (caching)?

Discussion welcome in [Discussions](https://github.com/shufflethis/a2a-router/discussions).
