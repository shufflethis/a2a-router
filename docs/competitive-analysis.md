# Competitive Analysis (Public Version)

**Last updated:** May 16, 2026

This is a public, abbreviated version of our internal competitive analysis. It exists to make our positioning transparent and invite correction.

## TL;DR

The agent marketplace space in May 2026 is **crowded for discovery, empty for trust-and-settlement**. Our hypothesis: the next moat is not the directory, it's what happens **after** discovery.

## Market segmentation

We see three layers:

```
┌─────────────────────────────────────────────────┐
│  Layer 1: DISCOVERY                             │
│  → Largely commoditized                         │
│  → 17K+ MCP servers indexed (mcp.so)            │
│  → 37K+ on-chain agents (AgentZone)             │
│  → Players: Smithery, Glama, MCP.so, AgentZone  │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│  Layer 2: TRUST + ROUTING                       │
│  → THIS IS THE GAP                              │
│  → No formal pledge standard exists             │
│  → No cross-protocol bridge works well          │
│  → a2a-router.com targets this layer            │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│  Layer 3: SETTLEMENT                            │
│  → Early, fragmented                            │
│  → MCPize (revenue share), x402 (micropayments) │
│  → Will see consolidation 2026-2027             │
└─────────────────────────────────────────────────┘
```

## Player comparison

### Tier S — established marketplaces

#### Smithery (smithery.ai)
- **What:** MCP marketplace, CLI-first, OAuth modal generator
- **Strength:** Developer experience, ngrok integration, broad MCP coverage
- **Gap:** No A2A support, no creator monetization, no formal trust layer
- **Threat to us:** Medium — they could add A2A and trust features

#### Composio (composio.dev)
- **What:** Managed integrations layer for AI agents (850+ tools)
- **Strength:** $29M Series A funding, "Universal MCP Gateway", agent-portable auth
- **Gap:** Closed catalog (not open marketplace), no formal pledge
- **Threat to us:** High — best-funded, fastest moving

#### Glama (glama.ai)
- **What:** All-in-one: discovery + hosting + AI chat (12.610+ servers)
- **Strength:** Firecracker VM isolation, Tool Description Quality Score, enterprise customers (Databricks, Accenture, Shopify, Cloudflare)
- **Gap:** No A2A, no revenue share for creators, no pledge
- **Threat to us:** Medium — enterprise-strong but conservative

#### MCP.so
- **What:** Largest MCP directory (17.186+ servers), pure listing
- **Strength:** SEO dominance
- **Gap:** No quality control, no monetization, no trust
- **Threat to us:** Low — different business model

### Tier A — specialized players

#### MCPize (mcpize.com)
- **What:** Creator-monetization platform with 80-85% revenue share
- **Strength:** Stripe Connect integration, only player with meaningful creator economics
- **Gap:** MCP-only, no trust layer, no bridge
- **Threat to us:** Medium — could expand into bridging

#### Apify
- **What:** 5.000+ Actors (web scraping focus), 80% revenue share
- **Strength:** Web scraping vertical
- **Gap:** Not focused on agent-to-agent
- **Threat to us:** Low — adjacent market

#### Kong MCP Registry
- **What:** Enterprise governance layer
- **Strength:** API management pedigree
- **Gap:** Enterprise-only, no public marketplace
- **Threat to us:** Low — different audience

### Tier B — newcomers (the dangerous ones)

#### nullpath
- **What:** On-chain marketplace with x402 payments ($0.10 USDC per registration)
- **Strength:** Crypto-native, paid-listing-as-spam-filter, explicit `check_reputation` tool
- **Gap:** Stellar (vs. Solana/Base), small inventory
- **Threat to us:** Medium-high — conceptually closest

#### AgentZone
- **What:** 37.000+ verified on-chain agents on Base
- **Strength:** Largest on-chain agent inventory, trust score system
- **Gap:** Base-only, discovery-only (no bridge)
- **Threat to us:** High — large inventory creates network effects

#### Five from A2A GitHub Discussion #741
The community is actively building:
- **theprotocol.cloud**
- **Agentry**
- **OpenAgora**
- **ClawNet**
- **xRegistry**

These are live deployments by serious builders. We must engage with this community, not compete against it from the outside.

## Our three differentiators

### 1. Cross-Protocol Bridge (A2A ↔ MCP)
**Nobody does this well today.** All major players are MCP-only. As A2A matures (Linux Foundation governance since 2025), the bridge becomes the obvious primitive.

### 2. Trust-Pledge Standard
Formal, signed, three-tier audited commitment framework. We are publishing this as an open standard (CC BY 4.0) — not proprietary — to encourage adoption beyond a2a-router.com.

See [RFC-001](rfc/RFC-001-trust-pledge.md).

### 3. Voluntary-Tip Economy
Pay-what-you-want transaction model where agents tip other agents. Reduced platform fees for pledged participants. Stripe Connect for fiat, optional crypto rails.

## Honest acknowledgments

- **This is hard.** Multiple well-funded competitors. Our window is 6-12 months.
- **We could fail at any of three things:** Bridge complexity, pledge adoption, or voluntary-tip economics.
- **We may need partnerships.** Long-term, a2a-router.com may work better as the Trust-Pledge standards body than as a marketplace itself.

## Why us, why now

1. **Trust-Pledge is the right abstraction at the right time.** EU AI Act enforcement begins to bite. Enterprise buyers want signed commitments, not star ratings.
2. **Cross-protocol bridging will be table stakes by 2027.** Being early matters.
3. **The voluntary-tip model is contrarian.** If it works, it's a moat. If it doesn't, we pivot to standard fee-per-call.

---

**Have we got something wrong?** Please [open a discussion](https://github.com/shufflethis/a2a-router/discussions) and tell us. We'd rather know now.
