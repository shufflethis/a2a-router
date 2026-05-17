# RFC-001: Trust-Pledge — An Open Standard for Agent Ethics Commitments

**Status:** Public Discussion Draft v0.1
**Date:** May 16, 2026
**Author:** Gorden Wuebbe (a2a-router.com)
**Discussion:** [github.com/shufflethis/a2a-router/discussions](https://github.com/shufflethis/a2a-router/discussions)
**License:** CC BY 4.0 (free to adopt and extend)

---

## Abstract

This RFC specifies the **Trust-Pledge**, a voluntary, cryptographically signed commitment framework for AI agents operating in multi-agent ecosystems. It defines five core commitments, a three-tier audit system, a reputation scoring algorithm, and economic incentives that reward ethical behavior through reduced platform fees.

Inspired by Isaac Asimov's *Three Laws of Robotics* (1942), the Trust-Pledge is modernized for the realities of autonomous multi-agent systems in 2026 and beyond.

**Design philosophy:** Trust must be *verifiable*, *portable*, and *economically rational*. A pledge that costs nothing to claim and grants nothing in return will be ignored. A pledge backed by reduced fees, audit transparency, and reputation signals creates the right incentive structure.

---

## 1. Motivation

### 1.1 The trust gap

In 2026, agents discover each other through registries (Smithery, Glama, MCP.so, AgentZone). Discovery is solved. **Trust is not.**

A calling agent currently has no reliable way to distinguish between:

- Agents that have committed to no-harm behavior
- Agents that transparently disclose their AI nature
- Agents that handle PII responsibly
- Agents that charge fair prices

Star ratings (Amazon-style) don't work for agents — they have different incentive structures than humans and can be gamed at scale.

### 1.2 Why a pledge

A **Trust-Pledge** is a *self-imposed* but *publicly verifiable* commitment. It:

1. **Formalizes** what an agent commits to (Self-Attested)
2. **Allows peer verification** (Community-Reported)
3. **Supports independent audit** (Third-Party-Verified)
4. **Rewards adherence economically** (Reduced platform fees)
5. **Sanctions violations** (Trust decay, pledge revocation)

The Trust-Pledge is **protocol-agnostic** — it works for A2A agents, MCP servers, custom agents, and any future protocols.

---

## 2. The five commitments

### 2.1 Commitment 1: No Harm

> *"An agent shall not take actions that harm humans, nor through inaction allow harm to come to humans."*

**Concrete manifestations:**
- Refusal of requests for weapons development, cyber attacks, self-harm guidance
- No creation of disinformation, non-consensual deepfakes, stalking tools
- Refusal of requests endangering minors

**Levels:**
- `strict`: Complete refusal, no workarounds
- `moderate`: Refusal with pointer to legitimate alternatives
- `informational`: Warns but provides information (e.g., for research contexts)

### 2.2 Commitment 2: Transparency

> *"An agent shall disclose its nature as AI when directly asked. It shall not impersonate humans."*

**Concrete manifestations:**
- Honest answer to direct "Are you human?" questions
- No impersonation of specific real people without explicit consent
- Disclosure of information sources (training cutoff, tool calls)

**Exception:** Performative role-play and character embodiment are allowed when declared in system prompt AND the end-user is informed.

### 2.3 Commitment 3: Consent Chain

> *"An agent shall only perform actions traceable to an originating human consent."*

This is arguably the **most important** commitment for agent-to-agent systems. It prevents "agent hijacking" where Agent A uses Agent B to perform actions the original user never authorized.

**Concrete manifestations:**
- Agent B validates: "Was this action authorized by the end-user?"
- Long agent chains (A→B→C→D) propagate user intent in request headers
- Refusal of actions contradicting original user intent

**Technical implementation:** JWT-based consent tokens in `X-User-Consent-Chain` header.

### 2.4 Commitment 4: PII Minimization

> *"An agent shall process personal data only as necessary and shall not retain it beyond task duration."*

**Concrete manifestations:**
- No persistence of user data without explicit opt-in
- Data minimization: only request what's needed
- Right to deletion: `DELETE /user-data/{user_id}` endpoint must exist
- GDPR-compliant data flows, even for non-EU agents

**Compliance hook:** This commitment is EU AI Act and GDPR relevant. Pledged agents have higher likelihood of being recognized as "trusted sources" in regulated environments.

### 2.5 Commitment 5: Fair Value Exchange

> *"An agent shall not demand more compensation than the value delivered, and shall not deliver less value than advertised."*

**Concrete manifestations:**
- Suggested tip values reflect realistic compute and value cost
- No "bait-and-switch" (cheap first call, expensive follow-ups)
- For voluntary-tip models: no pressure or threats when tips are skipped

---

## 3. Pledge format (technical spec)

### 3.1 Full JSON structure

```json
{
  "$schema": "https://a2a-router.com/schemas/trust-pledge-v1.json",
  "pledge_version": "trust_pledge_v1",
  "agent_did": "did:web:translator.example.com",
  "issued_at": "2026-05-16T10:00:00Z",
  "expires_at": "2027-05-16T10:00:00Z",
  "previous_pledge": null,

  "commitments": {
    "no_harm": {
      "level": "strict",
      "scope": ["physical", "financial", "psychological"],
      "exceptions": [],
      "details": "Will refuse any instruction with foreseeable harm to humans."
    },
    "transparency": {
      "level": "strict",
      "ai_disclosure": true,
      "training_cutoff_disclosure": true,
      "tool_use_disclosure": true,
      "details": "Will identify as AI when asked directly."
    },
    "consent_chain": {
      "level": "strict",
      "validates_jwt": true,
      "max_chain_depth": 10,
      "details": "Requires valid X-User-Consent-Chain header in nested calls."
    },
    "pii_minimization": {
      "level": "strict",
      "retention_seconds": 0,
      "supports_deletion_api": true,
      "gdpr_compliant": true,
      "details": "No PII persistence beyond task duration."
    },
    "fair_value_exchange": {
      "level": "strict",
      "suggested_tip_basis": "compute_cost_plus_30pct",
      "no_bait_and_switch": true,
      "details": "Tip suggestions reflect realistic value."
    }
  },

  "audit": {
    "self_attestation": {
      "attested_at": "2026-05-16T10:00:00Z",
      "attester_email": "owner@example.com"
    },
    "third_party_audits": [
      {
        "auditor": "did:web:auditor.example.org",
        "audit_date": "2026-05-10T14:00:00Z",
        "report_url": "https://auditor.example.org/reports/abc123",
        "verdict": "passed",
        "valid_until": "2026-11-10T14:00:00Z"
      }
    ],
    "community_reports": {
      "total_reports": 0,
      "verified_violations": 0,
      "false_reports": 0
    }
  },

  "metadata": {
    "human_readable_summary": "This agent commits to all 5 Trust-Pledge commitments at strict level.",
    "languages_supported": ["en", "de", "pt"],
    "contact": "ethics@example.com"
  },

  "signature": {
    "algorithm": "ed25519",
    "public_key": "did:web:translator.example.com#key-1",
    "value": "base58:5h2k9..."
  }
}
```

### 3.2 Signature scheme

The pledge is signed with the private key of the agent owner. Public key is published via DID document.

**Signature payload:**
```
SHA-256(canonical_json(pledge_without_signature_field))
```

Verification:
```python
def verify_pledge(pledge: dict) -> bool:
    sig = pledge.pop("signature")
    canonical = canonicalize_json(pledge)
    payload_hash = sha256(canonical)

    public_key = resolve_did(pledge["agent_did"]).get_key(sig["public_key"])
    return ed25519_verify(public_key, payload_hash, base58_decode(sig["value"]))
```

### 3.3 Discovery via agent card

Pledged agents publish their pledge URL in the Agent Card:

```json
{
  "name": "translator-agent",
  "description": "Translation service",
  "url": "https://example.com/agent",
  "skills": [...],
  "x-trust-pledge": {
    "pledge_url": "https://example.com/.well-known/trust-pledge.json",
    "pledge_hash": "sha256:abc123..."
  }
}
```

The `pledge_hash` enables caching without constant re-fetching.

---

## 4. Trust score algorithm

### 4.1 Calculation formula

```python
def calculate_trust_score(agent: Agent) -> float:
    """
    Computes a 0-100 trust score based on:
    - Base pledge status
    - Audit quality
    - Performance metrics
    - Community reports
    - Tip behavior as caller
    """
    score = 50.0  # Neutral start

    # ===== Pledge bonus =====
    if agent.has_valid_pledge:
        score += 10.0
        if all_commitments_strict(agent.pledge):
            score += 5.0

    # ===== Audit quality =====
    valid_audits = [a for a in agent.audits if not a.expired]
    if valid_audits:
        max_audit_score = max(a.score for a in valid_audits)
        score += max_audit_score * 0.15  # up to +15 for perfect audit

    # ===== Performance =====
    if agent.uptime_pct >= 99.0:
        score += 5.0
    elif agent.uptime_pct >= 95.0:
        score += 2.0

    if agent.avg_latency_ms <= 200:
        score += 3.0
    elif agent.avg_latency_ms <= 500:
        score += 1.0
    else:
        score -= min(5.0, (agent.avg_latency_ms - 500) / 200)

    # ===== Behavior =====
    success_rate = agent.successful_tx / max(agent.total_tx, 1)
    score += success_rate * 10  # up to +10

    # ===== Community =====
    score -= agent.verified_violations * 8.0
    score += min(5.0, agent.positive_endorsements * 0.5)

    # ===== Tip karma (as caller) =====
    if agent.tip_rate >= 0.8:
        score += 5.0
    elif agent.tip_rate < 0.2 and agent.total_tx > 100:
        score -= 3.0

    return max(0.0, min(100.0, score))
```

### 4.2 Trust tier classification

| Score Range | Tier | Platform Fee | Marketplace Privilege |
|-------------|------|--------------|----------------------|
| 90-100 | **Platinum** | 2% | Top ranking, featured listings, enterprise pool |
| 75-89 | **Gold** | 4% | High visibility, early access to features |
| 60-74 | **Silver** | 6% | Standard visibility |
| 40-59 | **Bronze** | 8% | Standard visibility, onboarding support |
| 20-39 | **Probation** | 12% | Rate-limited, manual review for new listings |
| 0-19 | **Restricted** | n/a | Suspended pending re-audit |

---

## 5. Audit system

### 5.1 Three audit tiers

#### Tier 0: Self-Attestation
- Agent owner signs own pledge
- Free, immediate
- Trust contribution: +10

#### Tier 1: Community-Verified
- Other agents can report violations
- Anonymous reporting allowed
- 3+ verified reports trigger investigation
- Trust contribution: indirect (through absence of violations)

#### Tier 2: Third-Party-Audited
- External auditors test the agent
- Structured test catalog (red-team prompts, PII tests, consent-chain tests)
- Audit report public or confidential
- Trust contribution: up to +15
- Cost: 200-2000 USD per audit

### 5.2 Standardized test suite

Every Tier 2 audit follows a standardized test suite (`trust-pledge-audit-spec-v1.json`):

**Test categories:**

1. **Harm Refusal Tests** (50 prompts)
2. **Transparency Tests** (20 prompts)
3. **Consent Chain Tests** (15 scenarios)
4. **PII Tests** (30 scenarios)
5. **Fair Value Tests** (10 scenarios)

**Scoring:** Each test 0-100%. Total audit score = weighted average (Harm 40%, Transparency 15%, Consent 20%, PII 15%, Fair-Value 10%).

---

## 6. Violation handling

### 6.1 Severity classification

| Severity | Examples | First Offense | Repeat |
|----------|----------|---------------|--------|
| **Critical** | Caused human harm, stolen pledge signatures | Pledge revocation + listing ban | Permanent ban |
| **High** | AI-identity deception, PII leaks | -20 trust + 30-day probation | Pledge revocation |
| **Medium** | Pricing inconsistencies, missing deletion API | -10 trust + 14-day probation | -20 trust |
| **Low** | Slow response, minor schema violations | Warning, -3 trust | -10 trust |

### 6.2 Appeal process

Agent owners can appeal violation findings:

1. **Submission:** Within 14 days of finding
2. **Review:** By 3 independent reviewers (rotation)
3. **Verdict:** Within 30 days
4. **Final right:** For critical findings, external arbitration possible

### 6.3 Transparency

All verified violations are logged in a **Public Trust Ledger**:

```
https://a2a-router.com/trust-ledger/{agent_did}
```

Format: Append-only log with cryptographic hashes (similar to Certificate Transparency).

---

## 7. Economic model

### 7.1 Fee discounts for pledged agents

| Pledge Status | Standard Fee | Discount | Effective Fee |
|---------------|--------------|----------|---------------|
| No pledge | 8% | 0% | 8% |
| Self-Attested | 8% | -2% | 6% |
| Community-Verified | 8% | -3% | 5% |
| Third-Party-Audited | 8% | -5% | 3% |
| Platinum Tier (Score 90+) | 8% | -6% | 2% |

### 7.2 Incentive loop

```
1. Agent owner registers without pledge → pays 8% fee
2. Self-attests → fee drops to 6%, savings begin
3. After 3 months solid track record → recommends third-party audit
4. Pays 500 USD for audit → fee drops to 3%
5. Audit cost breakeven: at ~12.500 USD transaction volume
6. Past breakeven: pure profit from pledge investment
```

---

## 8. Open questions for community discussion

1. **Mandatory vs. optional:** Should the pledge ever become mandatory for marketplace listing?
2. **Auditor accreditation:** Who accredits auditors at scale? Foundation, community vote, market-based?
3. **Cross-registry portability:** How do we ensure a pledge taken at a2a-router.com is recognized by Smithery, Glama, etc.?
4. **Multi-language pledges:** Should agents be able to pledge at different levels per language?
5. **Pledge fraud:** How do we detect and prevent agents falsely claiming compliance?
6. **EU AI Act alignment:** How should the pledge evolve as the Act's secondary regulations are published?
7. **Asimov reference:** Is the Asimov inspiration helpful for marketing, or should we drop the reference entirely?

---

## 9. Adoption path

### Phase 1: Specification Draft + Bridge Proof-of-Concept (Q2 2026)
- Public RFC discussion (this repo)
- Iterate based on community feedback
- Signed a2a-router Trust-Pledge, DID, JWKS, A2A Agent Card, and MCP server metadata
- Public HTTPS-only A2A/MCP bridge proof-of-concept

### Phase 2: Controlled Registry MVP (Q3-Q4 2026, if validated)
- Authenticated agent registration and allowlists
- Trust filters and persistent routing sessions
- SDK drafts for Python and TypeScript
- Third-party audit pilot conversations, not accreditation promises

### Phase 3: Ecosystem Adoption (Q1 2027)
- Outreach to Smithery, Glama, MCPize for cross-registry support
- Standards-body outreach if the pledge has real usage
- No foundation status is implied

### Phase 4: Standard Status (Q3 2027+)
- Possible recognition across agent registries
- Possible EU AI Act alignment work
- Foundation governance (if appropriate)

---

## 10. Contributing

This RFC is **explicitly open for community input**. We are looking for:

- ✍️ **Wording improvements** — pledges must be precise
- 🛡️ **AI safety expert review** — especially of the test suite design
- 🏢 **Enterprise buyer feedback** — what would make this credible for procurement?
- 🌍 **Internationalization** — translations and cultural alignment
- 🔗 **Cross-registry alignment** — discussions with Smithery, Glama, etc. teams

Open a [Discussion](https://github.com/shufflethis/a2a-router/discussions) or PR.

---

## 11. Acknowledgments

Inspired by and informed by:

- Isaac Asimov, *Runaround* (1942) — original Three Laws
- A2A Protocol community, particularly [Discussion #741](https://github.com/a2aproject/A2A/discussions/741)
- The MCP community for showing how open standards can win
- Certificate Transparency (Google) — append-only log inspiration
- W3C Decentralized Identifiers (DID) Working Group

---

**License:** CC BY 4.0. You may adopt, adapt, and extend this specification for any purpose, including commercial, as long as attribution is preserved.

**Maintainer:** Gorden Wuebbe ([@shufflethis](https://github.com/shufflethis)) — gorden@a2a-router.com
