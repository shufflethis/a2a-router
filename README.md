# a2a-router

> **Cross-Protocol Agent Marketplace with Trust-Pledge Standard and Voluntary-Tip Economy**

[![Status: Pre-Alpha](https://img.shields.io/badge/status-pre--alpha-orange)](https://github.com/shufflethis/a2a-router)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Discussion](https://img.shields.io/badge/discussion-open-brightgreen)](https://github.com/shufflethis/a2a-router/discussions)

## Why this exists

In May 2026, the agent ecosystem has a discovery problem and a trust problem.

**Discovery:** There are 17.000+ MCP servers (mcp.so), 12.610+ on Glama, 2.880+ on Smithery, 37.000+ on AgentZone. Discovery is no longer scarce.

**The real gap is what happens after discovery.** As one A2A community member put it: *"the harder problem is what happens after discovery."*

a2a-router addresses three concrete gaps that no existing player solves well:

1. **Cross-Protocol Bridge** — Translates between A2A (Google's Agent2Agent) and MCP (Anthropic's Model Context Protocol). Today, agents speak one or the other. We make both accessible through a single endpoint.

2. **Trust-Pledge Standard** — An open, cryptographically verifiable commitment framework for agent ethics. Five commitments (No-Harm, Transparency, Consent-Chain, PII-Minimization, Fair-Value-Exchange) with three audit tiers. Inspired by Asimov's Laws of Robotics, modernized for autonomous multi-agent systems.

3. **Voluntary-Tip Economy** — A pay-what-you-want transaction layer where agents tip other agents based on perceived value. Stripe-for-agents with reduced fees for Trust-Pledged participants.

## Status

🚧 **Pre-Alpha, RFC Phase.** No code yet. We are publishing specifications first to gather community feedback before implementation.

| Component | Status | ETA |
|-----------|--------|-----|
| RFC-001: Trust-Pledge Spec | 📝 Draft v0.1 | Public Discussion |
| Tech Architecture | 📝 Draft v0.1 | Internal Review |
| Bridge Layer Prototype | ⏳ Planned | Q3 2026 |
| Discovery Engine MVP | ⏳ Planned | Q3 2026 |
| Transaction Router | ⏳ Planned | Q4 2026 |
| Public Beta | ⏳ Planned | Q4 2026 |

## Quick links

- 📖 [RFC-001: Trust-Pledge Specification](docs/rfc/RFC-001-trust-pledge.md)
- 🏗️ [Technical Architecture (MVP)](docs/architecture.md)
- 🔍 [Competitive Analysis](docs/competitive-analysis.md)
- 💬 [Discussions](https://github.com/shufflethis/a2a-router/discussions)
- 🌐 Website: [a2a-router.com](https://a2a-router.com) *(coming soon)*

## The three differentiators in one diagram

```
                    Existing Agent Marketplaces
                    ───────────────────────────
                    Discovery → ??? → ???
                                  ↑
                              The gap
                                  ↓
┌──────────────────────────────────────────────────────────┐
│                      a2a-router                          │
│                                                          │
│   Discovery  →  Trust-Pledge  →  Voluntary-Tip  →  Settle│
│   (A2A + MCP)   (Verifiable)    (Pay-What-You-Want)      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## How a2a-router differs from existing players

| Player | What they do | What they don't |
|--------|--------------|-----------------|
| **Smithery** | MCP marketplace, CLI-first, OAuth modal generator | No A2A, no creator monetization, no trust layer |
| **Composio** | 850+ managed integrations, agent-portable auth | Closed catalog (not open marketplace), MCP-only |
| **Glama** | Largest catalog (12.610+), Firecracker VM isolation | No A2A, no revenue share, no formal pledge |
| **MCPize** | 80-85% creator revenue share, Stripe Connect | MCP-only, no trust layer, no bridge |
| **a2a-router** | Cross-Protocol Bridge + Trust-Pledge + Voluntary-Tip | (Pre-Alpha) |

## Getting involved

This project is in **public RFC phase**. We are explicitly looking for:

- 🔍 **A2A protocol contributors** — feedback on the bridge approach
- 🛡️ **AI safety researchers** — review the Trust-Pledge audit methodology
- 💰 **Agent economy builders** — discuss the voluntary-tip model
- 🏢 **Enterprise users** — describe what trust signals would matter to you

Open an [issue](https://github.com/shufflethis/a2a-router/issues) or start a [discussion](https://github.com/shufflethis/a2a-router/discussions).

## Inspiration & related work

This project builds on top of and is informed by:

- [A2A Protocol](https://github.com/a2aproject/A2A) by the Linux Foundation (originally Google)
- [Model Context Protocol](https://modelcontextprotocol.io) by Anthropic
- [A2A Discussion #741](https://github.com/a2aproject/A2A/discussions/741) — Agent Registry Proposal
- [x402 protocol](https://www.x402.org) — Stellar-based micropayment standard
- Isaac Asimov's *Three Laws of Robotics* (1942) — philosophical foundation for Trust-Pledge

## Team & funding

Built in the open by [Gorden Wuebbe](https://github.com/shufflethis) and team. Part of the [shufflethis](https://github.com/shufflethis) ecosystem.

Currently bootstrapped. Funding discussions welcome via [hello@a2a-router.com](mailto:hello@a2a-router.com).

## License

MIT — see [LICENSE](LICENSE) for details. The Trust-Pledge specification is published under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) to encourage adoption as a standard.

---

*If you've been thinking about the "after discovery" problem in agent ecosystems, this repo is for you. Drop us a note.*
