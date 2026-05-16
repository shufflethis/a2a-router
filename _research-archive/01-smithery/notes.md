# 01 — Smithery

- **URL:** https://smithery.ai
- **Geplante Time-Box:** 30 Min
- **Sign-up-Datum / Zeit:** _<einfügen>_
- **Time-to-First-Value (TTFV):** _<Minuten von Login bis erster echter Nutzen>_

---

## 🔎 Desk-Research-Snapshot (von Claude vor dem Sprint)

**Positionierung:** *"The marketplace for AI agents. Connect to 100K+ tools and skills instantly."* — Selbstdarstellung als MCP-Marketplace mit starkem CLI-First-Ansatz.

**Was sie machen:**
- Marketplace für MCP-Server + Skills (über 100K Tools beworben)
- **CLI-zentriert:** `npm install -g @smithery/cli`, dann `smithery mcp search`, `smithery mcp add`, `smithery tool list/get/call`
- **Konzepte:** Namespaces (Workspace-Boundaries pro App/Env), Managed Connections (OAuth, Token-Refresh, Session-Lifecycle), Token Scoping (restricted credentials für untrusted code), `rpcReqMatch` für Per-Request-Tool-Restrictions
- Connection-Status-Modell: `connected` / `auth_required` / `error`
- JSONL-Output wenn gepiped

**Pricing:** Tier-Struktur "Hobby / Pro / Custom" laut Drittquelle ([Oreate-Blog](https://www.oreateai.com/blog/understanding-smitheryai-pricing-a-comprehensive-guide/5171746775e80e32f7175d78b0c37508)), **keine konkreten Preise öffentlich auffindbar**. **MCPize behauptet:** *"developers don't earn from their servers"* — also keine Creator-Monetisierung wie bei MCPize/Glama. **→ im Sprint checken: Pricing-Page, Free-Tier-Limits.**

**Threat-Hypothese (vor dem Sprint):** Eher **Tool-/MCP-Marketplace**, nicht Agent-zu-Agent-Routing. Aber: ihre Connection-/Namespace-Abstraktion ist genau das Primitiv, das a2a-router auch braucht. **Mittlere Bedrohung** — sie könnten in den A2A-Routing-Raum drücken.

---

## Magic Moments (DEINE — beim Sign-up sammeln)

1. _<Magic Moment 1>_
2. _<Magic Moment 2>_
3. _<Magic Moment 3>_

## Pain Points (DEINE — beim Sign-up sammeln)

1. _<Pain Point 1>_
2. _<Pain Point 2>_
3. _<Pain Point 3>_

> Achte besonders auf: CLI vs. Web-Onboarding (sind sie CLI-only, oder gibt's UI?), OAuth-Flow-Qualität bei erstem Connect, wie schnell zum ersten erfolgreichen `tool call`.

---

## Pricing-Notes (beim Sprint verifizieren)

- Free Tier: _<…>_
- Erster Paywall: _<…>_
- Tarifstruktur: Hobby / Pro / Custom (laut Drittquelle, vor Ort prüfen)
- Auffälligkeiten: _<…>_

## Was kopieren — Was anders machen

**Übernehmen für a2a-router:**
- Namespace-Konzept als Workspace-Boundary (passt sauber zu Multi-Tenant-Routing)
- Connection-Status-Modell (`connected` / `auth_required` / `error`) — klar und LLM-freundlich
- `rpcReqMatch` als Pattern für Per-Request-Restriction
- JSONL-Output bei Pipes (machine-readable by default)

**Bewusst anders / besser machen:**
- _<UI-First statt CLI-First?>_
- _<A2A-Routing als First-Class statt nur MCP-Aggregation>_
- _<…>_

---

## Threat-Level
Skala 1–5 (1 = irrelevant, 5 = direkter Konkurrent, akut).

- **Score:** _<1–5>_
- **Begründung:** _<1–2 Sätze>_

---

## Screenshots
Liegen in `./screenshots/` — Schema: `01-smithery_<seq>_<thema>.png`.
