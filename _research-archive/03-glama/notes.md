# 03 — Glama

- **URL:** https://glama.ai
- **Geplante Time-Box:** 20 Min
- **Sign-up-Datum / Zeit:** _<einfügen>_
- **Time-to-First-Value (TTFV):** _<Minuten von Login bis erster echter Nutzen>_

---

## 🔎 Desk-Research-Snapshot (von Claude vor dem Sprint)

**Positionierung:** *"The MCP Server Registry, Inspector & Gateway. Every MCP server, in one registry."* — Superset der offiziellen MCP Registry, mit Hosting + Gateway-Layer obendrauf.

**Was sie machen (Stand 12. Mai 2026):**
- **23.411 MCP-Server**, **3.327 MCP-Connectors**, **156.151 MCP-Tools** indexiert — bei weitem die größte Sammlung
- **Drei Säulen:**
  - **Registry** (Discovery, Quality-Scoring, Audits)
  - **Inspector** (Browser-Sandbox, ephemeral, shareable Debug-URLs, OAuth/Tokens in-browser)
  - **Gateway** (Reverse-Proxy vor MCP-Server, Logging, Per-Tool-Access-Control, OAuth, Analytics)
- **Tool-Level Search** ("query Postgres", "send email", "generate Figma component") — wenig andere Directories machen das
- Eigene Studie zitiert: *"LLMs select tools with well-written descriptions 260% more often"* — TDQS (Tool Definition Quality Score)
- Logos prominent: Databricks, Accenture, Shopify, Cloudflare, Duolingo, Zomato, Zillow, Square, UiPath, Neo4j
- Auch eigene AI-Produkte: AI Playground, AI Gateway, AI Models

**Pricing** (public, glama.ai/pricing):
- **Starter $9/Mo** — $9 AI-Credits, **3 hosted MCP-Server**, 100K Logs/Mo, 30 Tage Retention, Custom Agents, Automations
- **Pro $26/Mo** — $26 AI-Credits, **10 hosted Server**, File Uploads, Projects, Memory, Web Fetch/Search, 90 Tage Retention
- **Business $80/Mo** — $80 AI-Credits, **30 hosted Server**, Priority Support, 180 Tage Retention, Request Labeling
- **Open Source: kostenlos** (open-source MCP-Server hosten + laufen lassen)
- Zusatzkosten: extra Server $2–$4 je Tier, extra Logs $3–$9/100K

**Threat-Hypothese (vor dem Sprint):** **Mittel.** Glama ist Marktführer in *Discovery & Inspection* — wenn a2a-router primär Routing/Orchestrierung ist, überlappt es nur am Rand. ABER ihr Gateway-Produkt wandert Richtung "Runtime-Layer", das ist näher dran. **Inspector ist ein starkes Onboarding-Asset, das a2a-router nicht hat.**

---

## Magic Moments (DEINE — beim Sign-up sammeln)

1. _<Magic Moment 1>_
2. _<Magic Moment 2>_
3. _<Magic Moment 3>_

> Achte besonders auf: Den **Inspector** — eine MCP-Server-URL einfügen, ohne Account oder Install Tools listen und callen. Wenn der zuverlässig ist, ist das ein echter Magic-Moment-Kandidat. Auch: Tool-Level Search ausprobieren.

## Pain Points (DEINE — beim Sign-up sammeln)

1. _<Pain Point 1>_
2. _<Pain Point 2>_
3. _<Pain Point 3>_

> Achte besonders auf: Tarif-Verwirrung (AI-Credits + Server-Slots + Log-Volumen — 3 Achsen), Quality-Score-Verständlichkeit (Was bedeuten die Zahlen?), Inspector-Latenz bei OAuth-Flows.

---

## Pricing-Notes (verifiziert von Landing/Pricing)

- Free Tier: **NUR für Open-Source-Server-Hosting kostenlos** — sonst gibt's keine Gratis-Stufe
- Erster Paywall: ab $9/Mo (Starter)
- Tarifstruktur: 3 Stufen, **mehrdimensional** (Credits + Server-Slots + Log-Retention)
- Auffälligkeiten: Hybrid aus "AI-Provider-Wallet" (Credits) + "Infra-Plattform" (Server) — ungewöhnlich, könnte verwirren

## Was kopieren — Was anders machen

**Übernehmen für a2a-router:**
- **Browser-Inspector ohne Sign-up** — gigantisches Friction-Reducer. Übertrag aufs A2A-Universum: "Routing-Inspector" der A2A-Calls live zeigt
- **Quality-Score / TDQS** als Qualitätssignal (Audits + Annotations)
- **Open-Source = kostenlos** als Goodwill-Pitch
- Logo-Strip mit Enterprise-Brands ist starkes Social Proof

**Bewusst anders / besser machen:**
- Klareres Pricing (eine Achse statt drei)
- Pure Discovery ist Commodity geworden — a2a-router muss **Routing & Trust** verkaufen, nicht "noch ein Registry"
- _<…>_

---

## Threat-Level
Skala 1–5 (1 = irrelevant, 5 = direkter Konkurrent, akut).

- **Score:** _<1–5>_ (Tipp vor Sprint: **3**)
- **Begründung:** _<1–2 Sätze>_

---

## Screenshots
Liegen in `./screenshots/` — Schema: `03-glama_<seq>_<thema>.png`.
