# Cowork-Briefing: a2a-router.com Sign-up-Support

**Was das ist:** Eine vorgefertigte Anweisungs-Liste, die du in **Cowork** (Anthropic's Desktop-Automation-Tool) einfügen kannst. Cowork erledigt damit die **Drumherum-Arbeit**, während du die eigentlichen Sign-ups manuell machst.

**Wichtige Erinnerung:** Cowork **kann keine Sign-ups selbst** machen — OAuth/CAPTCHA/Email-Verifizierung blockieren das. Aber es kann **alles drumherum** automatisieren.

---

## 🚀 Vorbereitungs-Auftrag für Cowork (vor dem Sprint)

Kopiere folgenden Block in Cowork und sag: "Bitte erledige diese Vorbereitungsaufgaben für meinen Sign-up-Sprint":

```
Hi Cowork, ich starte gleich einen 2,5-Stunden Konkurrenz-Recherche-Sprint
für a2a-router.com. Bitte bereite folgendes vor:

1. ORDNER-STRUKTUR auf meinem Desktop erstellen:
   /Desktop/a2a-router-research/
     /01-smithery/
       /screenshots/
       /notes.md
     /02-composio/
       /screenshots/
       /notes.md
     /03-glama/
       /screenshots/
       /notes.md
     /04-mcpize/
       /screenshots/
       /notes.md
     /05-a2a-github/
       /screenshots/
       /notes.md
     /06-consolidation/

2. NOTES.MD TEMPLATE in jeden Ordner mit folgender Struktur:
   - Plattform-Name
   - Sign-up-Datum/Zeit
   - Time-to-First-Value
   - Magic Moments (3 Felder)
   - Pain Points (3 Felder)
   - Pricing-Notes
   - Was kopieren, was anders machen
   - Threat-Level

3. BROWSER-BOOKMARKS FOLDER "a2a-router-audit" mit:
   - https://smithery.ai
   - https://composio.dev
   - https://glama.ai
   - https://mcpize.com
   - https://mcp.so
   - https://github.com/a2aproject/A2A/discussions/741

4. EINE TIMER-DATEI im Hauptordner mit den geplanten
   Time-Boxes (30/30/20/15/15/30 Min)

5. NACH ABSCHLUSS bestätige bitte, was du gemacht hast und was ggf.
   nicht funktioniert hat.
```

---

## 📸 Screenshot-Auftrag während des Sprints

Wenn du Screenshots machst, sag Cowork (entweder pro Stunde oder am Ende):

```
Hi Cowork, ich habe gerade Screenshots gemacht. Bitte:

1. Schau in meinem Standard-Screenshot-Ordner nach neuen Dateien
   der letzten 30 Min (oder von [Zeitfenster])

2. Sortiere sie automatisch in die a2a-router-research-Unterordner
   basierend auf dem Inhalt:
   - Wenn Smithery-Logo/URL erkennbar → 01-smithery/screenshots/
   - Wenn Composio → 02-composio/screenshots/
   - Wenn Glama → 03-glama/screenshots/
   - Wenn MCPize → 04-mcpize/screenshots/
   - Wenn GitHub → 05-a2a-github/screenshots/

3. Benenne sie um nach Schema:
   [01-smithery]_[Sequenz-Nummer]_[grobes-Thema].png
   z.B. 01-smithery_01_landingpage.png
        01-smithery_02_signup-flow.png

4. Falls Inhalt nicht klar zuordenbar: in einen /unsorted/ Ordner
   und mir Bescheid geben.
```

---

## 📧 Email-Monitoring-Auftrag (parallel laufend)

```
Hi Cowork, ich erwarte heute Email-Verifizierungen und Welcome-Mails
von 5 Plattformen. Bitte:

1. ÜBERWACHE meine Inbox (Email: gw@famefact.com)
   auf eingehende Mails von:
   - smithery.ai
   - composio.dev
   - glama.ai
   - mcpize.com
   - github.com (Discussion-Notifications)

2. Wenn eine Verifizierungs-Mail kommt:
   - Markiere sie mit Label "a2a-research"
   - Speichere sie in /a2a-router-research/[plattform]/welcome-email.eml
   - Bestätige mir kurz "Email von [Plattform] eingegangen"

3. Den Verification-Link öffne NICHT automatisch - ich klicke selber,
   weil viele Plattformen das Browser-Session-gebunden tracken.

4. Aus den Welcome-Mails extrahiere:
   - Erste Schritte / Onboarding-Tipps
   - Pricing-Hinweise
   - Documentation-Links
   und fasse sie in /a2a-router-research/email-summary.md zusammen.
```

---

## 📊 Konsolidierungs-Auftrag nach dem Sprint

Wenn du fertig bist mit den Sign-ups, lass Cowork das Material zusammenführen:

```
Hi Cowork, ich habe meinen Sign-up-Sprint abgeschlossen. Bitte konsolidiere:

1. Lies ALLE 5 notes.md-Dateien aus den Plattform-Ordnern.

2. Übertrage die Inhalte ins XLSX:
   /a2a-router-research/signup-audit-tracker.xlsx

   Pro Plattform ein Sheet, Felder sind dort vorbereitet
   (gelbe Zellen = einfügen).

3. Erstelle aus den Screenshots eine ÜBERSICHTSDATEI:
   - PDF mit allen Screenshots pro Plattform
   - Reihenfolge: chronologisch wie sie entstanden sind
   - Filename: a2a-router-research-screenshots-[plattform].pdf

4. Bereite eine SLACK/EMAIL-NACHRICHT vor an Patrick Bergmann
   und Tobias Sander mit:
   - "Hey, hab heute Konkurrenz-Recherche für a2a-router.com gemacht."
   - Top 3 Erkenntnisse (aus dem Erkenntnisse-Sheet im XLSX)
   - Frage: Wann finden wir 1h für ein Sync-Meeting?
   - Anhang: signup-audit-tracker.xlsx

   Bitte als DRAFT speichern, ich versende selbst.

5. CALENDAR-EINTRAG vorbereiten für:
   "a2a-router Strategy-Sync mit Patrick & Tobias"
   Dauer: 60 Min
   Vorschlag: morgen oder übermorgen, basierend auf
   verfügbaren Slots in meinem Kalender.
```

---

## ⏰ Calendar-Block für den Sprint

```
Hi Cowork, blocke mir folgenden Termin im Kalender:

Titel: "a2a-router Konkurrenz-Recherche-Sprint"
Dauer: 2,5 Stunden
Empfehlung: heute Abend 19:00-21:30 ODER morgen 09:00-11:30

Mit folgenden Sub-Items als Beschreibung:
- 30 Min: Smithery
- 30 Min: Composio
- 20 Min: Glama
- 15 Min: MCPize
- 15 Min: A2A GitHub
- 30 Min: Konsolidierung
- INKL: 2x 5-Min-Pausen

DND-Modus aktivieren während des Termins.
Erinnerung 10 Min vorher.
```

---

## ❓ Wenn etwas nicht funktioniert

Cowork ist Beta - manche Anfragen klappen, manche nicht. **Realistisch erwartet:**

✅ **Wird wahrscheinlich klappen:**
- Ordner-Struktur erstellen
- Dateien umbenennen/sortieren
- Templates aus Markdown anlegen
- Calendar-Blocks einrichten
- Drafts für Emails/Slack vorbereiten

⚠️ **Könnte klappen, könnte aber zicken:**
- Email-Inbox-Monitoring (je nach Email-Provider)
- Screenshot-Inhalts-Erkennung (OCR-Qualität variabel)
- Cross-Application-Workflows (Calendar + Email + Files)

❌ **Wird NICHT klappen:**
- Sign-ups selbst durchführen
- OAuth-Flows automatisieren
- CAPTCHA umgehen
- Live UX-Bewertungen abgeben

**Wenn etwas nicht klappt:** Sag Cowork "geht nicht? mach den Rest". Das Tool ist robust gegen Teil-Erfolge. Was Cowork nicht kann, mach manuell - die XLSX und der Battle-Plan funktionieren auch ohne Cowork-Support.

---

## 🎯 Mein realistischer Tipp

**Hau nicht alles auf einmal in Cowork.** Mach das schrittweise:

1. **Erst nur Schritt 1** (Ordner-Struktur) → schauen, ob es geht
2. **Dann Schritt 4** (Calendar-Block) → wenn das auch klappt: weiter
3. **Während Sprint:** Wenn du eine Pause machst, gib Cowork den Screenshot-Auftrag
4. **Nach Sprint:** Konsolidierungs-Auftrag

So merkst du früh, was klappt und was nicht. Bei einem Mega-Brief am Anfang verlierst du Übersicht, wenn etwas hängenbleibt.

---

## Status der Tools

| Tool | Status | Wofür |
|------|--------|-------|
| `signup-audit-tracker.xlsx` | ✅ Bereit | Strukturierte Eingabe deiner Erkenntnisse |
| `signup-battle-plan.md` | ✅ Bereit | Schritt-für-Schritt-Anleitung für den Sprint |
| Dieses Cowork-Briefing | ✅ Bereit | Cowork-Anweisungen fürs Drumherum |
| Cowork Desktop-App | ✅ Du benutzt sie gerade | — |

**Du hast jetzt alles, was du brauchst. Mach den Sprint - heute Abend oder morgen früh. Bei Fragen während des Sprints, ping mich.**
