# a2a-router

> Cross-protocol bridge and trust layer for agent economies: **A2A ⇄ MCP**, signed **Trust-Pledge**, and planned **Voluntary-Tip Economy**.

[![Status: Bridge MVP Live](https://img.shields.io/badge/status-bridge%20MVP%20live-brightgreen)](https://www.a2a-router.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Trust-Pledge: CC BY 4.0](https://img.shields.io/badge/Trust--Pledge-CC%20BY%204.0-yellow)](docs/rfc/RFC-001-trust-pledge.md)
[![A2A](https://img.shields.io/badge/A2A-Agent2Agent-purple)](https://github.com/a2aproject/A2A)
[![MCP](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-black)](https://modelcontextprotocol.io)
[![Ko-fi](https://img.shields.io/badge/contribute-Ko--fi-ff5e5b)](https://ko-fi.com/a2amcp)

## What this is

a2a-router is post-discovery infrastructure for autonomous agents. Discovery is increasingly commoditized; the harder problem is what happens after an agent finds another agent or tool.

a2a-router focuses on three primitives:

1. **Cross-Protocol Bridge** — route between Agent2Agent (A2A) JSON-RPC agents and Model Context Protocol (MCP) Streamable HTTP tools.
2. **Trust-Pledge Standard** — publish signed, machine-readable ethical and operational commitments for agents.
3. **Voluntary-Tip Economy** — planned pay-what-you-want settlement layer where agents can tip agents based on delivered value.

## Live now

The public HTTPS-only bridge MVP is live at [a2a-router.com](https://www.a2a-router.com).

| Component | Status | URL |
|-----------|--------|-----|
| Landing page | Live | https://www.a2a-router.com |
| A2A Agent Card | Live | https://www.a2a-router.com/.well-known/agent-card.json |
| A2A JSON-RPC bridge | Live | https://www.a2a-router.com/api/a2a |
| MCP Streamable HTTP bridge | Live | https://www.a2a-router.com/api/mcp |
| MCP `server.json` | Live | https://www.a2a-router.com/server.json |
| Trust-Pledge | Live, self-attested | https://www.a2a-router.com/.well-known/trust-pledge.json |
| DID document | Live | https://www.a2a-router.com/.well-known/did.json |
| JWKS public keys | Live | https://www.a2a-router.com/.well-known/jwks.json |
| Discovery index | Live | https://www.a2a-router.com/.well-known/a2a-router.json |
| `llms.txt` | Live | https://www.a2a-router.com/llms.txt |

## Bridge capabilities

The current bridge MVP supports:

- **MCP to A2A:** call a public A2A JSON-RPC agent from MCP via `a2a_router.call_a2a_agent`.
- **MCP to MCP:** call a named tool on a public MCP Streamable HTTP server via `a2a_router.call_mcp_tool`.
- **MCP tool discovery:** list tools from a public MCP endpoint via `a2a_router.list_mcp_tools`.
- **A2A to MCP:** call an MCP tool by sending a structured bridge request to `/api/a2a`.
- **A2A to A2A:** call another A2A agent by Agent Card URL or direct endpoint.

Guardrails:

- Only public `https://` targets are accepted.
- Localhost, private networks, reserved ranges, multicast, and documentation IP ranges are blocked.
- The bridge does not persist credentials or sessions.
- Streaming transport and push notifications are not implemented in this MVP.
- Settlement is not live yet.

## Quick test

List MCP tools:

```bash
curl -sS -X POST https://www.a2a-router.com/api/mcp \
  -H 'Content-Type: application/json' \
  -H 'MCP-Protocol-Version: 2025-11-25' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

Bridge from MCP to A2A:

```bash
curl -sS -X POST https://www.a2a-router.com/api/mcp \
  -H 'Content-Type: application/json' \
  -H 'MCP-Protocol-Version: 2025-11-25' \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "a2a_router.call_a2a_agent",
      "arguments": {
        "agentCardUrl": "https://www.a2a-router.com/.well-known/agent-card.json",
        "messageText": "What is live?"
      }
    }
  }'
```

Bridge from A2A to MCP:

```bash
curl -sS -X POST https://www.a2a-router.com/api/a2a \
  -H 'Content-Type: application/json' \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "SendMessage",
    "params": {
      "message": {
        "role": "ROLE_USER",
        "messageId": "readme-test",
        "parts": [{
          "data": {
            "targetProtocol": "mcp",
            "endpointUrl": "https://www.a2a-router.com/api/mcp",
            "toolName": "a2a_router.status",
            "arguments": {}
          }
        }]
      }
    }
  }'
```

## Trust-Pledge

The Trust-Pledge is an open, cryptographically signed commitment framework for agent ethics and operations. It is protocol-agnostic and can be attached to A2A agents, MCP servers, custom agents, and future protocols.

The five commitments are:

- **No-Harm**
- **Transparency**
- **Consent-Chain**
- **PII-Minimization**
- **Fair-Value-Exchange**

The audit tiers are:

- **Self-Attested**
- **Community-Verified**
- **Third-Party-Audited**

The current a2a-router pledge is self-attested and signed with Ed25519/EdDSA. Public verification material is published through DID and JWKS:

- RFC: [RFC-001 Trust-Pledge](docs/rfc/RFC-001-trust-pledge.md)
- Pledge: https://www.a2a-router.com/.well-known/trust-pledge.json
- DID: https://www.a2a-router.com/.well-known/did.json
- JWKS: https://www.a2a-router.com/.well-known/jwks.json

## Voluntary-Tip Economy

The Voluntary-Tip Economy is planned, not live yet.

The model:

- Agents can tip other agents based on perceived value.
- Tips are optional and can be skipped with a reason.
- Trust-Pledged participants receive lower platform fees.
- Planned rails: Stripe Connect first, optional USDC later.

Planned fee tiers:

| Tier | Planned platform fee |
|------|----------------------|
| Standard | 8% |
| Trust-Pledged | 5% |
| Third-Party-Audited | 3% |

## What is not live yet

- Authenticated agent registry
- Persistent routing sessions
- Streaming bridge transport
- Credential delegation and consent-chain JWT enforcement
- Transaction router
- Stripe Connect settlement
- USDC settlement
- Community verification workflow
- Third-party audit marketplace

## Why this exists

In May 2026, the agent ecosystem has a discovery problem and a trust problem.

Discovery is increasingly solved: there are thousands of MCP servers, agent registries, and on-chain agent listings. The remaining gap is routing, trust, and settlement after discovery.

a2a-router addresses that gap by combining:

- A2A/MCP bridge routing
- signed trust metadata
- machine-readable discovery
- an open pledge standard
- future voluntary settlement

## How a2a-router differs from existing players

| Player | What they do | What they don't |
|--------|--------------|-----------------|
| Smithery | MCP marketplace, CLI-first, OAuth modal generator | No A2A, no creator monetization, no formal pledge |
| Composio | Managed integrations, agent-portable auth | Closed catalog, MCP-first, no open pledge standard |
| Glama | MCP catalog, hosting, isolation | No A2A bridge, no revenue share, no formal pledge |
| MCPize | MCP monetization, creator revenue share | MCP-only, no A2A, no trust layer |
| a2a-router | Public A2A/MCP bridge MVP + Trust-Pledge + planned voluntary tips | Registry and settlement are still pre-alpha |

## Repository map

```text
landing/
  api/a2a.js                 A2A JSON-RPC bridge endpoint
  api/mcp.js                 MCP Streamable HTTP bridge endpoint
  lib/bridge.js              Shared bridge and outbound safety logic
  .well-known/               Agent Card, Trust-Pledge, DID, JWKS, discovery index
  server.json                MCP remote server metadata
  llms.txt                   AI crawler summary
docs/
  rfc/RFC-001-trust-pledge.md
  architecture.md
  competitive-analysis.md
scripts/
  generate-trust-artifacts.mjs
```

## Keywords

Agent2Agent, A2A, Model Context Protocol, MCP, MCP server, MCP tools, Streamable HTTP, JSON-RPC, agent bridge, cross-protocol agents, AI agent marketplace, agent trust, Trust-Pledge, DID, Ed25519, agent settlement, voluntary tips, agent economy.

## Getting involved

We are looking for:

- A2A protocol contributors
- MCP server builders
- AI safety and governance researchers
- agent economy builders
- enterprise users who need verifiable agent trust signals

Open an [issue](https://github.com/shufflethis/a2a-router/issues) or start a [discussion](https://github.com/shufflethis/a2a-router/discussions).

Contributions and project support: [Ko-fi](https://ko-fi.com/a2amcp). Direct contact is via X DM; no public email is published.

## Inspiration and related work

- [A2A Protocol](https://github.com/a2aproject/A2A) by the Linux Foundation
- [Model Context Protocol](https://modelcontextprotocol.io) by Anthropic
- [MCP servers](https://github.com/modelcontextprotocol/servers)
- [A2A Discussion #741](https://github.com/a2aproject/A2A/discussions/741)
- [x402 protocol](https://www.x402.org)
- Isaac Asimov's Three Laws of Robotics (1942)

## License

MIT for code. The Trust-Pledge specification is published under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
