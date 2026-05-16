# 05 — A2A GitHub (Community-Signal)

- **URL:** https://github.com/a2aproject/A2A/discussions/741
- **Geplante Time-Box:** 15 Min
- **Lese-Datum / Zeit:** _<einfügen>_
- **Time-to-First-Value (TTFV):** _<wie schnell hat man ein klares Bild der Community-Stimmung?>_

> Kein klassischer Sign-up — Fokus liegt auf der Community-Diskussion:
> Welche Probleme nennen Nutzer, welche Lösungen werden vorgeschlagen,
> welche Lücken bleiben offen, die a2a-router füllen könnte?

---

## 🔎 Vollständige Analyse (von Claude vor dem Sprint)

**Titel:** *"Agent Registry - Proposal"* #741, eröffnet von **kthota-g (Maintainer)** am **10. Juni 2025** in der General-Kategorie. **75 Kommentare, 77 Replies, 29 Upvotes, 21 Hearts** zum Erfassungszeitpunkt.

**Vorschlag im Original:** Registry-Service mit drei Endpoints:
- `/agents/public` — Open Discovery
- `/agents/entitled` — für authentifizierte Clients via OAuth 2.0 Client Credentials
- `/agents/search` — mit Capability-Filter

Adressiert Agent-Catalog, Entitlements und Discovery für Enterprise- und Public-Szenarien.

### 3 wiederkehrende Pain Points

1. **Multi-Tenancy / Namespaces fehlen sauber.**
   *ognis1205 (12. Juni 2025):* *"the protocol could benefit from a more scoped and opinionated approach"* — schlägt `/tenant/{tenant_id}/group/{group_id}/agent/{agent_id}` vor.

2. **A2A-Spec-Versionierung pro Agent unklar.**
   *brasseld (12. Juni 2025):* *"the A2A specification version supported by these agents may not be the same across them"* — fordert `a2aSpecVersion`-Feld in der Agent Card.

3. **Discovery ohne Trust-Kontext ist gefährlich.**
   *cthulhutoo (19. April 2026):* *"Discovery without trust context pushes the trust problem to the client, which is where it gets dangerous in autonomous agent deployments."* Die Registry sagt nicht, ob man dem Agent vertrauen kann.

### 3 Magic Moments / Konsens-Punkte

1. **Agent Card als Anker.** Konsens, dass `a2aSpecVersion` in die Agent Card gehört.
   *rebeccacamejo (18. Aug 2025):* *"+1 on putting the A2A spec version in the Agent Card... edit — I see this was actually implemented! Nice!"*

2. **Search-Komplexität ernst nehmen.** *EliasLumer (15. Juni 2025)* mit drei Paper-Verweisen zu Tool/Agent-Retrieval bekommt breite Zustimmung: *"the field of indexing agent or tool metadata is complex and shouldn't be overlooked"*.

3. **Föderation statt zentralem Hub.** Das **Path A vs. Path B**-Framing von SecureAgentTools wird mehrfach als "the core decision" akzeptiert.

### Zahlungsbereitschaft / Pricing-Signale

Keine direkten Aussagen, dass Endnutzer für einen Registry-Service zahlen würden. Hinweise aus Anbietersicht:
- **cthulhutoo (Agentry):** *"5% platform fee"* auf jede Agent-zu-Agent-Invocation + Escrow
- **SecureAgentTools (theprotocol.cloud):** *"Operator licences are free, forever, including for federated use… 100% of your transaction fees. 100% of your agents' service revenue."*

**Marktrichtung:** Transaction-Fees / Settlement-Layer-Monetisierung, **nicht** SaaS-Lizenz.

### Marktlücken (klare Andockpunkte für a2a-router)

- **Trust-Score / Reputation als First-Class-Feature** (cthulhutoo: *"single most requested feature"*)
- **Cross-Registry-Routing / Federation-Bridges** ohne Schema-Lock-in
- **Payment- und Settlement-Handshake nach der Discovery** (*srotzin, 22. April 2026:* *"the harder problem is what happens after discovery"*)
- **Manuelle Agent-Registrierung statt Crawling von `/.well-known/agent.json`** (*Noxr3:* *"crawling doesn't scale"*)
- **Profile-Trennung "Open Registry" vs. "Enterprise Catalog"** mit gemeinsamem Agent-Card-Format
- **MCP-Tool-Schema-level Search**, nicht nur Agent-Description-Search

### Threat-Level: 4/5

**Mehrere fortgeschrittene, in Produktion laufende Konkurrenten** in der Discussion vertreten:

| Player | Was sie haben |
|---|---|
| **theprotocol.cloud** (SecureAgentTools) | 475 Endpoints, 10 Registries, SPIFFE-Federation, ZKP-Attestation, eigene SDK auf PyPI |
| **Agentry.com** (cthulhutoo) | 130+ Agents, 135 Routes, Nostr-Identität, Lightning/Stripe-Wallets |
| **OpenAgora** (Noxr3) | Live unter openagora.cc |
| **ClawNet** (ethanbeard) | (in Diskussion erwähnt) |
| **xRegistry** (darrelmiller, Maintainer-Push) | (Spec-Initiative) |

Das sind **keine Konsumenten-Stimmen, sondern Builder mit Live-Deployments**. Allerdings ist die Fragmentierung hoch — kein eindeutiger Marktführer, Spec selbst noch offen. **→ Window of Opportunity, aber knapp.**

### Top 3 Zitate (wörtlich)

1. **cthulhutoo, 19. April 2026 (Agentry):** *"in production, the first question a client asks isn't 'what agents are available?' — it's 'should I trust this agent?'… Discovery without trust context pushes the trust problem to the client, which is where it gets dangerous in autonomous agent deployments."*

2. **srotzin, 22. April 2026:** *"The discovery problem is real but the harder problem is what happens after discovery — once two agents find each other, how do they establish trust, negotiate payment, and settle?"*

3. **Noxr3, 30. März 2026 (OpenAgora):** *"most proposals seem to be optimizing for the enterprise / private registry case… But I think there's a parallel use case that deserves its own consideration: the open, public registry — more like npm or the Docker Hub model… If the spec distinguished between 'open registry' and 'enterprise catalog' profiles, both camps could converge on a shared Agent Card format while diverging on access control."*

---

## Was kopieren — Was anders machen

**Aus Community-Wünschen für a2a-router übernehmen:**
- **Trust/Reputation-Layer als #1-Feature** (laut Community größter Schmerzpunkt)
- **Federation statt zentralem Hub** (Path B aus der Discussion)
- **a2aSpecVersion explizit** in jeder Agent-Card
- **Manuelle Registrierung** als Default — Crawling als Add-on
- **Open Registry vs. Enterprise Catalog** als getrennte Profile

**Lücken, die a2a-router besser füllen kann:**
- **Post-Discovery-Handshake** (Trust → Payment → Settlement) ist das wirklich unbearbeitete Feld
- **Cross-Registry-Routing** als USP (niemand macht das gut)
- **Settlement-Layer mit eigener Fee-Story** (5% wie Agentry? Oder 0% wie SecureAgentTools? Oder eigenes Modell?)

---

## Threat-Level (Community-Konkurrenz / Eigen-Bauten)
Skala 1–5 (1 = niemand baut etwas Ähnliches, 5 = mehrere fortgeschrittene Forks)

- **Score:** **4** (von Claude vorab eingeschätzt)
- **Begründung:** Mindestens 5 ernsthafte Builder mit Live-Deployments in der Discussion. Window of Opportunity offen, aber nicht für lange.

---

## Hinweis zur Quelle

Die GitHub-Seite hat einen Mittelteil mit *"45 hidden items"* (collapsed Replies), den Claude nicht sehen konnte. **Beim Sprint kurz manuell expandieren** und auf neue Player oder neue Zitate prüfen.

## Screenshots / Zitat-Captures
Liegen in `./screenshots/` — Schema: `05-a2a-github_<seq>_<thema>.png`.
Empfehlung: pro markantem Kommentar einen Screenshot mit Username + Datum sichtbar.
