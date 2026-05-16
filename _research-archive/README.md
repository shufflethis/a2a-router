# a2a-router-research

Materialien für den 2,5-h-Konkurrenz-Sign-up-Sprint.

## Quick-Start

1. **Lies zuerst** [`signup-battle-plan.md`](./signup-battle-plan.md) — das ist die Sprint-Anleitung.
2. **Importiere** [`bookmarks.html`](./bookmarks.html) in deinen Browser (Chrome/Safari/Firefox → Bookmarks → Import HTML). Anschließend hast du den Folder *a2a-router-audit* mit allen 6 URLs griffbereit.
3. **Doppelklick** auf [`sprint-calendar.ics`](./sprint-calendar.ics) → öffnet zwei Vorschläge (heute Abend 19:00 ODER morgen 09:00) in deinem Kalender. Eine löschen, andere bestätigen.
4. **Während des Sprints** offen halten: [`timer.md`](./timer.md) (Zeit-Boxes ankreuzen).
5. **Pro Plattform** Notizen in den entsprechenden `notes.md` (s.u.).
6. **Nach dem Sprint** [`signup-audit-tracker.xlsx`](./signup-audit-tracker.xlsx) füllen + [`stakeholder-draft.md`](./stakeholder-draft.md) versenden.

## Struktur

```
a2a-router-research/
├── README.md                     ← du bist hier
├── signup-battle-plan.md         ← Sprint-Anleitung
├── signup-cowork-briefing.md     ← Original-Briefing für Cowork
├── signup-audit-tracker.xlsx     ← Konsolidierungs-XLSX (gelbe Zellen = eingeben)
├── stakeholder-draft.md          ← Vorbereitete Nachricht an Patrick + Tobias
├── timer.md                      ← Zeit-Boxes + Pausen
├── bookmarks.html                ← In Browser importieren
├── sprint-calendar.ics           ← In Kalender importieren
│
├── 01-smithery/
│   ├── notes.md                  ← Felder ausfüllen während des Sprints
│   └── screenshots/              ← Screenshots manuell ablegen
├── 02-composio/   …
├── 03-glama/      …
├── 04-mcpize/     …
├── 05-a2a-github/ …
└── 06-consolidation/             ← Platz für finale Outputs (PDFs etc.)
```

## Screenshot-Namensschema

`<plattform-prefix>_<seq>_<thema>.png`

Beispiele:
- `01-smithery_01_landing.png`
- `01-smithery_02_signup-flow.png`
- `01-smithery_03_dashboard.png`
- `02-composio_01_landing.png`

## Was Cowork (ich) gerade NICHT erledigen konnte — und warum

| Aufgabe aus dem Briefing | Status | Grund |
|---|---|---|
| Ordnerstruktur + Templates | ✅ erledigt | — |
| Bookmarks (Browser-direkt) | ⚠️ als HTML-Import bereitgestellt | Kein direkter API-Zugriff auf Chrome/Safari-Bookmark-Store |
| Calendar-Block | ⚠️ als .ics-Datei bereitgestellt | Kein Live-Calendar-Connector verbunden — .ics ist Doppelklick-Import |
| Email-Inbox-Monitoring | ❌ offen | Kein Email-Connector verbunden (Gmail/Outlook müsste authentifiziert werden) |
| Slack/Email an Patrick + Tobias senden | ⚠️ Draft erstellt | Kein Versand-Connector verbunden — Draft ist copy-paste-ready |
| Screenshot-OCR + Auto-Sortierung | ❌ offen | Während des Sprints — Cowork kann das nach dem Sprint übernehmen, wenn alle Screenshots im selben Ordner liegen |
| DND-Modus aktivieren | ❌ offen | Kein OS-Steuerungs-Zugriff (Computer Use deaktiviert) |

Sobald du Gmail/Outlook/Slack/Calendar-Connector verbindest, kann ich diese Lücken nachholen.
