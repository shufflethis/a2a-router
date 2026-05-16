# 02 — Composio

- **URL:** https://composio.dev
- **Geplante Time-Box:** 30 Min
- **Sign-up-Datum / Zeit:** _<einfügen>_
- **Time-to-First-Value (TTFV):** _<Minuten von Login bis erster echter Nutzen>_

---

## 🔎 Desk-Research-Snapshot (von Claude vor dem Sprint)

**Positionierung:** *"Make your agents do more."* — Tool-/Auth-/Sandbox-Layer für Agents (Claude, Codex, Custom). Skip the heavy lifting by connecting your agent to **1,000+ apps**. **Strapline:** *"Stop chatting and start acting."*

**Was sie machen:**
- Connector-Plattform mit **50.000+ Usern** und 1.000+ Apps (Gmail, GitHub, Slack, Notion, Linear, Figma, HubSpot, Calendar, Drive, …)
- Produktlinien: **For You** (Office Worker), **Developer Platform**, **Enterprise**, **MCP Gateway**, **CLI**
- Use-Case-Trichter: 11 Solutions-Pages (Sales, Marketing, Eng, Support, HR, Finance, E-Commerce, Content, IT-Security …)
- Agent-spezifische Landingpages: Claude, Codex, Openclaw, Cursor, Hermes
- USPs: **Multi-Account pro App** (mehrere Gmails gleichzeitig), **Connections leben bei Composio** (Agent wechseln, ohne neu zu connecten), **OAuth statt API-Keys** (Prompt-Injection-Schutz)

**Pricing** (public): **Free** $0/Mo (20K Tool Calls/Mo, Community Support). **Cheap** $29/Mo (200K, Email Support, $0.299/1K extra). **Business** $229/Mo (2M, Slack Support, $0.249/1K extra). **Enterprise** Custom (SOC-2, Dedicated SLA, VPC/On-Prem).

**Threat-Hypothese (vor dem Sprint):** **Hoch.** Composio ist der ausgereifteste Player im *Agent-Connection-Layer* und greift schon explizit in MCP-Gateway-Territorium. Wenn a2a-router auf Routing positioniert ist, ist Composio entweder Konkurrent oder potenzieller Partner (Composio liefert Tools, a2a-router routet zwischen Agents). **Sehr klar denken: Wo überlappt es, wo nicht.**

---

## Magic Moments (DEINE — beim Sign-up sammeln)

1. _<Magic Moment 1>_
2. _<Magic Moment 2>_
3. _<Magic Moment 3>_

> Achte besonders auf: das "For You"-Onboarding mit den vorgeschlagenen 6 Demos (Linear+Slack-Update, blocked PRs etc.) — das ist der wahrscheinlichste Magic Moment. Wie schnell vom Login zum ersten gerouteten Tool-Call?

## Pain Points (DEINE — beim Sign-up sammeln)

1. _<Pain Point 1>_
2. _<Pain Point 2>_
3. _<Pain Point 3>_

> Achte besonders auf: Onboarding-Überladung (11 Solutions, 5 Agent-Targets, 1.000 Apps — wo führen sie dich hin?), OAuth-Permission-Granularität (Composio bewirbt "scoped permissions" — funktioniert es?), Pricing-Klarheit bei "Tool Call"-Zählung.

---

## Pricing-Notes (verifiziert von Landing)

- Free Tier: **20K Tool Calls/Monat**, Community-Support
- Erster Paywall: ab 20K Tool Calls — dann $29/Mo Cheap-Plan
- Tarifstruktur: usage-based mit Tier-Inklusiv-Volumen + $/1K Overages
- Auffälligkeiten: Aggressives Pricing für KMU-Größe ($29 für 200K Calls), klarer Sprung Business→Enterprise (Custom-Quote)

## Was kopieren — Was anders machen

**Übernehmen für a2a-router:**
- **"Connections leben bei uns, Agents austauschen"** — das ist ein starker Vendor-Lock-Schutz und ein gutes Verkaufsargument
- **Multi-Account-pro-App** als Default (mehrere Gmails, Workspaces)
- **OAuth-only, nie Passwords** — Sicherheits-USP für Enterprise
- Klare Pricing-Tiers mit konkreten Zahlen statt "Contact Sales"

**Bewusst anders / besser machen:**
- A2A-Routing statt nur Tool-Aggregation
- _<klarere Positionierung als die 11 Solutions-Pages?>_
- _<…>_

---

## Threat-Level
Skala 1–5 (1 = irrelevant, 5 = direkter Konkurrent, akut).

- **Score:** _<1–5>_ (Tipp vor Sprint: **4–5**)
- **Begründung:** _<1–2 Sätze>_

---

## Screenshots
Liegen in `./screenshots/` — Schema: `02-composio_<seq>_<thema>.png`.
