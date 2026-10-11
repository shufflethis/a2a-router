"""Generate US English and Simplified Chinese static HTML from the German page.
Every localized text remains in served HTML; JS is only needed for local orders.
"""
from pathlib import Path
from html import escape
from html.parser import HTMLParser
import json, re

# German source | US English | Simplified Chinese
COPY = r'''a2a-router · Aufträge für die Agenten-Ökonomie|a2a-router · Order passports for the agent economy|a2a-router · 面向智能体经济的订单档案
Zum Inhalt|Skip to content|跳转到正文
POST-LABOR / BUILT IN THE OPEN|POST-LABOR / BUILT IN THE OPEN|后劳动愿景 / 开放构建
FERTIGUNG ALS ERSTER MARKT|MANUFACTURING FIRST|从制造业开始
Produkt|Product|产品
Vertrauen|Trust|信任
Für Agenten|For agents|智能体接口
Pass erstellen ↗|Create a passport ↗|创建订单档案 ↗
AUFTRAGS-PASS MVP · JETZT NUTZBAR|ORDER PASSPORT MVP · AVAILABLE NOW|订单档案 MVP · 现已可用
Dein Agent|Your agent|让智能体
organisiert.|coordinates.|协调流程。
Du bestimmst|You define|由你定义
 das Ergebnis.|the outcome.|最终成果。
Aus einer Idee wird ein Auftrag mit klarer Spezifikation, Abnahmekriterien und nachvollziehbarem Verlauf. Der erste Schritt: Teile und kleine Serien fertigen lassen.|Turn an idea into a manufacturing order with clear specs, acceptance criteria, and a traceable history. Start with a custom part or a small production run.|将想法转化为制造订单，明确规格、验收标准和可追溯记录。从一个定制零件或一批小批量产品开始。
Ersten Auftrags-Pass erstellen ↗|Create your first order passport ↗|创建首份订单档案 ↗
Agent verbinden →|Connect your agent →|连接你的智能体 →
Kostenloser MVP. Ohne Konto. Aufträge bleiben in deinem Browser.|Free MVP. No account needed. Orders stay in your browser.|免费 MVP，无需注册。订单保存在你的浏览器中。
THE INTENT → THE OUTCOME|THE INTENT → THE OUTCOME|从意图到成果
01 / FERTIGUNG|01 / MANUFACTURING|01 / 制造
DU DEFINIERST|YOU DEFINE|你来定义
Was soll entstehen?|What needs to be made?|你想制造什么？
Teil · Material · Stückzahl · Abnahme|Part · Material · Quantity · Acceptance|零件 · 材料 · 数量 · 验收
Auftrags-Pass|Order passport|订单档案
DEIN AGENT KOORDINIERT|YOUR AGENT COORDINATES|智能体协调
Mit klaren Grenzen.|Within clear boundaries.|权限与边界清晰。
Angebote vorbereiten · Freigaben einholen|Prepare requests · Ask for approval|准备询价 · 请求批准
Fertigung durch den gewählten Anbieter|Manufacturing by your chosen supplier|由你选择的供应商制造
DU PRÜFST DAS ERGEBNIS|YOU CHECK THE RESULT|你来检查成果
Geliefert. Geprüft. Dokumentiert.|Delivered. Checked. Recorded.|交付、检查、记录。
Abnahme oder Reklamation festhalten|Record acceptance or a dispute|记录验收或异议
KLARE FREIGABEN|EXPLICIT APPROVALS|明确批准
EXPORTIERBARE HISTORIE|PORTABLE HISTORY|可导出的记录
Ablaufmodell. Anbieterwahl, Fertigung und Zahlung erfolgen derzeit außerhalb dieses MVP.|Workflow illustration. Supplier selection, manufacturing, and payment currently happen outside this MVP.|流程示意。当前 MVP 不负责供应商选择、实际制造或付款，这些步骤需另行完成。
Ein Produkt:|One product:|一个产品：
Erster Markt:|First market:|首个市场：
Fertigung|Manufacturing|制造业
Langfristige Vision:|Long-term vision:|长期愿景：
Post-Labor|Post-labor|后劳动社会
01 / DAS PRODUKT|01 / THE PRODUCT|01 / 产品
Vom Wunsch zum|From an idea to|从想法到
prüfbaren Ergebnis.|an outcome you can check.|可验证的成果。
Wenn Agenten Arbeit koordinieren, braucht es einen gemeinsamen Auftrag: Was wurde zugesagt? Was kam an? Wer hat es abgenommen?|When agents coordinate work, everyone needs the same brief. What was promised? What arrived? Who accepted it?|当智能体协调工作时，各方需要统一的订单要求。承诺了什么？交付了什么？由谁验收？
01 / DEFINIEREN|01 / DEFINE|01 / 定义
Ein klarer Auftrag.|A clear manufacturing brief.|明确的制造要求。
Prozess, Material, Stückzahl und konkrete Abnahmekriterien. Offene Fragen werden sichtbar, bevor jemand ein Angebot abgibt.|Process, material, quantity, and measurable acceptance criteria. Surface missing details before a supplier prepares a quote.|明确工艺、材料、数量和可衡量的验收标准。在供应商报价前，发现尚未确定的细节。
Auftrag vorbereiten ↗|Prepare a brief ↗|准备制造要求 ↗
02 / DOKUMENTIEREN|02 / RECORD|02 / 记录
Ein Auftrags-Pass.|A portable order passport.|可携带的订单档案。
Angebot, Lieferung, Abnahme und Reklamation als Ereignisse erfassen. Mit Belegverweisen und einer prüfbaren Hash-Kette exportieren.|Record quotes, delivery, acceptance, and disputes as events. Export them with evidence references and a verifiable hash chain.|将报价、交付、验收和异议记录为事件，并连同凭证引用和可检查的哈希链一起导出。
LOKALER MVP · SELBST ERFASST|LOCAL MVP · SELF-REPORTED|本地 MVP · 用户自行记录
03 / ANSCHLIESSEN|03 / CONNECT|03 / 连接
Dein Agent kann mitarbeiten.|Bring your agent into the workflow.|让智能体参与流程。
Dieselbe Auftragslogik über WebMCP im Browser und MCP oder REST von außen. Die bestehende A2A/MCP-Bridge verbindet Protokolle.|Use the same brief logic through WebMCP in your browser or MCP and REST from your agent. The existing A2A/MCP bridge connects protocols.|浏览器中的 WebMCP，以及外部的 MCP 和 REST，共用同一套订单逻辑。现有 A2A/MCP 桥接层负责协议连接。
Schnittstellen ansehen ↗|Explore the interfaces ↗|查看接口 ↗
02 / PROBIER ES AUS|02 / TRY IT NOW|02 / 立即体验
Dein erster|Your first|你的首份
Auftrags-Pass.|order passport.|订单档案。
Beginne mit einem Gehäuse, einer Halterung oder einer einfachen Vorrichtung. Trage bekannte Angaben ein. Fehlende Details werden nicht von uns erfunden.|Start with an enclosure, a bracket, or a simple fixture. Enter the specs you know. We leave unknown details open for review.|从外壳、支架或简单工装开始。填写已知规格，尚未确定的细节留待确认。
Was möchtest du fertigen lassen?|What would you like to make?|你想制造什么？
01 / SPEZIFIKATION|01 / SPECIFICATIONS|01 / 规格
Fertigungsverfahren|Manufacturing process|制造工艺
Bitte auswählen|Select a process|请选择工艺
CNC-Fräsen / Drehen|CNC machining / turning|CNC 铣削 / 车削
Blechbearbeitung|Sheet metal fabrication|钣金加工
3D-Druck|3D printing|3D 打印
Material|Material|材料
Stückzahl|Quantity|数量
Lieferland (Ländercode)|Ship-to country (country code)|收货国家（国家代码）
Teil, Maße und Verwendungszweck|Part, dimensions, and intended use|零件、尺寸与用途
Wann gilt der Auftrag als erfüllt?|What counts as an accepted delivery?|达到什么条件才算验收通过？
Weitere Angaben: Zeichnung, Toleranzen, Oberfläche, Termin|More details: drawing, tolerances, finish, deadline|更多信息：图纸、公差、表面处理、交期
Zeichnungslink (optional)|Drawing link (optional)|图纸链接（可选）
Toleranzen (optional)|Tolerances (optional)|公差（可选）
Oberfläche (optional)|Finish (optional)|表面处理（可选）
Liefertermin (optional)|Delivery deadline (optional)|交付日期（可选）
Erstellt einen Entwurf. Sendet keine Anfrage und löst keine Zahlung aus. Mit JavaScript erfolgt die Vorbereitung lokal; ohne JavaScript verarbeitet die API den Brief ohne Auftragsspeicherung.|Creates a draft. Does not send a request or make a payment. With JavaScript, preparation stays local. Without JavaScript, the API prepares the brief without saving an order.|仅生成草稿，不发送询价，也不付款。启用 JavaScript 时在本地处理；未启用时由 API 生成要求，但不保存订单。
Auftrags-Pass vorbereiten ↗|Prepare your order passport ↗|生成订单档案草稿 ↗
Das Ergebnis|Your draft|草稿预览
02 / PRÜFEN|02 / REVIEW|02 / 检查
Ein Brief, mit dem Mensch|A brief people|让人与智能体
und Agent arbeiten können.|and agents can work from.|共用一份制造要求。
Eine strukturierte Spezifikation, prozessbezogene Prüfpunkte und offene Fragen.|Structured specs, process-specific checks, and questions still to resolve.|结构化规格、对应工艺的检查项，以及待确认的问题。
Als JSON exportierbar|Export as JSON|可导出为 JSON
Optional als lokalen Auftrag speichern|Optionally save as a local order|可选择保存为本地订单
Keine automatische Freigabe|No automatic approval|不会自动批准
ENTWURF · NOCH NICHT GESENDET|DRAFT · NOT SUBMITTED|草稿 · 尚未提交
Noch zu klären|Still to resolve|待确认事项
Lokal als Auftrag speichern|Save as a local order|保存为本地订单
JSON herunterladen ↓|Download JSON ↓|下载 JSON ↓
Lokale Speicherung ist an diesen Browser und diese Domain gebunden. Exportiere wichtige Pässe.|Local storage belongs to this browser and domain. Export important passports for backup.|本地记录仅保存在当前浏览器和域名下。请导出重要档案作为备份。
Das Formular funktioniert ohne JavaScript. Lokale Historie und Browser-Tools benötigen JavaScript.|This form works without JavaScript. Local history and browser tools require JavaScript.|表单无需 JavaScript 也可使用。本地记录和浏览器工具需要 JavaScript。
Deine lokalen Aufträge|Your local orders|你的本地订单
03 / VERLAUF FESTHALTEN|03 / RECORD THE HISTORY|03 / 记录进展
Selbst erfasste Angaben in diesem Browser. Keine unabhängige Prüfung, kein zentraler Trust Ledger. Belege werden als Verweise gespeichert, nicht hochgeladen.|Self-reported records in this browser. No independent verification or central Trust Ledger. Evidence is stored as references, not uploaded.|记录由用户自行填写并保存在本浏览器中，未经独立核验，也不是中央信任账本。凭证仅保存引用，不上传文件。
Noch kein lokaler Auftrag. Bereite oben deinen ersten Pass vor.|No local orders yet. Prepare your first passport above.|暂无本地订单。请先在上方生成订单档案。
Pass importieren|Import a passport|导入订单档案
Import prüft Struktur und Hash-Kette. Exporte separat aufbewahren.|Import checks the structure and hash chain. Keep exported backups separately.|导入时会检查结构和哈希链。请另行保管导出的备份。
03 / WIE VERTRAUEN ENTSTEHT|03 / BUILDING TRUST|03 / 建立信任
Ein Versprechen|A promise|每项承诺
braucht Belege.|needs evidence.|都需要凭证。
Die geplante wirtschaftliche Grundlage sind geprüfte Anbieter und dokumentierte Auftragsergebnisse. Die Bridge ist der Anschluss. Ein selbst signierter Pledge ist eine Selbstauskunft.|The planned business is built around reviewed suppliers and documented order outcomes. The bridge connects them. A self-signed pledge is a declaration, not an audit.|未来业务将围绕经过审核的供应商和有凭证的订单结果展开。桥接层提供连接，自签署承诺属于自行声明，而非审计。
STUFE 1 / SELBSTAUSKUNFT|TIER 1 / SELF-DECLARATION|第 1 级 / 自行声明
Offen deklarieren.|Declare capabilities openly.|公开声明能力。
Anbieter veröffentlichen Fähigkeiten, Grenzen und eigene Nachweise. Eine Signatur bestätigt den Herausgeber einer Aussage; sie beweist keine Fertigungsqualität.|Suppliers publish capabilities, limits, and supporting documents. A signature identifies the source of a statement; it does not prove manufacturing quality.|供应商公开能力、限制和支持文件。签名标识声明的发布者，但不能证明制造质量。
BESTEHENDER PLEDGE: SELBST ATTESTIERT|EXISTING PLEDGE: SELF-ATTESTED|现有承诺：自行声明
STUFE 2 / DOKUMENTENPRÜFUNG|TIER 2 / DOCUMENT REVIEW|第 2 级 / 文件审核
Nachweise prüfen.|Review the evidence.|核查证明材料。
Geplante bezahlte Prüfung von Unternehmensidentität, Maschinen und Zertifikaten einschließlich Geltungsbereich und Ablaufdatum. Prüfbericht statt pauschalem Siegel.|Planned paid review of company identity, equipment, and certificates, including scope and expiration. A specific review report, not a blanket seal of approval.|计划提供付费审核，核查企业身份、设备及证书的范围与有效期，并出具具体报告，而非笼统的认可标志。
GEPLANT · NICHT BUCHBAR|PLANNED · NOT AVAILABLE TO BOOK|计划中 · 暂不可预约
STUFE 3 / AUFTRAGSPRÜFUNG|TIER 3 / ORDER REVIEW|第 3 级 / 订单审核
Ergebnisse belegen.|Document real outcomes.|记录真实结果。
Geplante Stichproben anhand echter Aufträge: Maßprotokolle, Lieferung, Abnahme und Reklamationen. Spätere Zahlungen sollen über einen Zahlungsanbieter erfolgen.|Planned sampling of real orders: inspection records, delivery, acceptance, and disputes. Future payments would be handled by a payment provider.|计划抽查真实订单，包括尺寸检验记录、交付、验收和异议。未来付款将通过支付服务商处理。
GEPLANT · KEIN ESCROW AKTIV|PLANNED · NO ACTIVE ESCROW|计划中 · 尚无资金托管
Unser Ziel: wiederholbare Qualität.|Our goal: repeatable quality.|目标：稳定、可重复的质量。
Geld soll für konkrete Prüfleistungen und später für die Abwicklung fließen. Prüfgebühren kaufen kein positives Urteil. Trinkgeld ist kein Bestandteil des Produkts.|The planned revenue comes from specific reviews and, later, transaction services. Review fees do not buy a positive verdict. Tipping is not part of the product.|计划通过具体审核服务，以及后续交易服务获得收入。审核费用不能购买正面结论。本产品不采用小费模式。
04 / DIE POST-LABOR-IDEE|04 / THE POST-LABOR VISION|04 / 后劳动愿景
Weniger koordinieren.|Less coordination.|减少协调负担。
Mehr verwirklichen.|More creation.|实现更多想法。
Menschen beschreiben, was sie brauchen. Agenten helfen, Spezifikationen zu entwickeln, Angebote zu vergleichen und Abläufe zu koordinieren. Reale Anbieter fertigen, Menschen geben frei und prüfen das Ergebnis.|People describe what they need. Agents help develop specs, compare quotes, and coordinate the workflow. Real suppliers manufacture. People approve the work and check the result.|人们描述需求，智能体帮助完善规格、比较报价并协调流程。实际制造由供应商完成，批准与成果检查由人负责。
a2a-router beginnt bei einem kleinen Fertigungsauftrag. Mit klarer Verantwortung und dokumentierter Abnahme. Eine Welt mit weniger Arbeit ist die Vision; ein nachvollziehbarer Auftrag ist das Produkt von heute.|a2a-router starts with a small manufacturing order, clear responsibility, and recorded acceptance. A world with less work is the vision. A traceable order is the product you can use today.|a2a-router 从小型制造订单开始，明确责任并记录验收。减少劳动负担是长期愿景；可追溯订单是今天即可使用的产品。
Etwas Konkretes anfangen ↗|Start with something real ↗|从一个具体项目开始 ↗
05 / STATUS · 11. OKTOBER 2026|05 / STATUS · OCTOBER 11, 2026|05 / 状态 · 2026 年 10 月 11 日
Heute ein Werkzeug.|A tool you can use today.|今天可用的工具。
Morgen eine Abwicklung.|A transaction layer to build next.|下一步构建交易层。
Fortschritt messen wir an echten Aufträgen. Die nächsten Schritte haben klare Bedingungen statt abgelaufener Quartalsversprechen.|Progress means real orders. The next steps have concrete conditions rather than expired quarterly promises.|进展以真实订单衡量。后续步骤有具体前提，而非已经过期的季度承诺。
JETZT NUTZBAR|AVAILABLE NOW|现已可用
Auftrags-Pass MVP|Order Passport MVP|订单档案 MVP
Brief vorbereiten, lokale Historie erfassen, Hash-Kette prüfen und exportieren. REST, MCP, WebMCP und die bestehende Bridge.|Prepare a brief, record local events, verify the hash chain, and export. REST, MCP, WebMCP, and the existing protocol bridge.|准备制造要求、记录本地事件、检查哈希链并导出。支持 REST、MCP、WebMCP 和现有协议桥接。
NÄCHSTER PILOT|NEXT PILOT|下一阶段试点
10–20 Fertigungsanbieter|10–20 manufacturing suppliers|10–20 家制造供应商
Ziel: Anbieter persönlich prüfen und echte Aufträge begleiten. Voraussetzung: teilnehmende Fabriken, Käufer und konkrete Nachweise.|Goal: review suppliers directly and support real orders. Requires participating shops, buyers, and concrete evidence.|目标是直接审核供应商并跟进真实订单。前提是有参与的工厂、买家和具体凭证。
NACH ECHTEN AUFTRÄGEN|AFTER REAL ORDERS|在真实订单产生后
Gemeinsamer Trust Ledger|Shared Trust Ledger|共享信任账本
Zentrale, geschützte Historie mit bestätigten Parteien. Hier gibt es heute keine geprüften Fabriken oder zentral erfassten Produktionsaufträge.|A central, access-controlled history with confirmed counterparties. No independently reviewed factories or centrally recorded production orders are published here today.|建立权限受控的中央记录，并确认交易各方身份。当前尚未公布独立审核的工厂或集中记录的生产订单。
NACH PILOT-VALIDIERUNG|AFTER PILOT VALIDATION|在试点验证后
Meilenstein-Zahlungen|Milestone payments|按里程碑付款
Über einen geeigneten Zahlungsanbieter, mit vereinbarter Abnahme und Reklamationsweg. Zahlungsintegration und Käuferschutz sind noch nicht verfügbar.|Through a suitable payment provider, with agreed acceptance and a dispute process. Payment integration and buyer protection are not available yet.|通过适当的支付服务商，依据约定验收条件和异议处理流程付款。目前尚未提供支付集成或买家保障。
06 / KLARE ANTWORTEN|06 / STRAIGHT ANSWERS|06 / 常见问题
Bevor du anfängst.|Before you start.|开始前请了解。
Ist das bereits ein geprüfter Marktplatz?|Is this already a verified marketplace?|这已经是经过核验的交易市场了吗？
Nein. Heute gibt es den Auftrags-Pass und Agenten-Schnittstellen. Fabrik-Audits, gemeinsame Reputation, Käuferschutz und Zahlungen sind nächste Entwicklungsstufen.|No. Today you can use the order passport and agent interfaces. Factory audits, shared reputation, buyer protection, and payments are future stages.|还不是。目前可用的是订单档案和智能体接口。工厂审核、共享信誉、买家保障和支付属于后续阶段。
Was beweist die Hash-Kette?|What does the hash chain prove?|哈希链能证明什么？
Sie verknüpft den Brief und die erfassten Ereignisse mit SHA-256. Inkonsistente Änderungen innerhalb eines Exports werden erkannt. Wer den ganzen Pass neu berechnet, kann einen anderen Verlauf erstellen. Die Kette beweist keine Identität, Wahrheit, serverseitige Unveränderlichkeit oder Zahlung. Bewahre Exporte als Vergleichsstände auf.|It links the brief and recorded events using SHA-256. It detects inconsistent changes within an export. Someone who recalculates the entire passport can create a different history. It does not prove identity, truth, server-side immutability, or payment. Keep exported snapshots for comparison.|它使用 SHA-256 连接制造要求和事件记录，可发现导出文件中的不一致修改。但重新计算整份档案仍可创建不同历史。它不能证明身份、真实性、服务器端不可篡改性或付款。请保留导出快照用于对比。
Wo bleiben meine Daten?|Where is my data stored?|我的数据保存在哪里？
Mit JavaScript bleibt die Vorbereitung lokal. Gespeicherte Aufträge liegen in localStorage dieses Browsers und werden nicht automatisch an uns übertragen. Ohne JavaScript sendet das Formular den Brief an unsere API; sie erstellt einen Entwurf ohne Auftragsspeicherung. Löschen von Browserdaten entfernt lokale Aufträge. Exportiere wichtige Pässe. Die Bridge übermittelt gezielte Aufrufe an die ausgewählten Endpunkte. Agent Tracking (agenttracking.co) erfasst Seitenpfad, verweisende Domain, gegebenenfalls utm_source und Namen, Dauer und Status der Tool-Aufrufe sowie Klicks auf gekennzeichnete Aktionen. Das eingebundene Skript verwendet keine Cookies und übermittelt keine Formularwerte oder Auftragsinhalte. Bei der Verbindung zum Dienst fallen technische Verbindungsdaten an.|With JavaScript, preparation stays local. Saved orders are in this browser's localStorage and are not automatically sent to us. Without JavaScript, the form sends the brief to our API, which creates a draft without saving an order. Clearing browser data removes local orders. Export important passports. The bridge sends targeted calls to your chosen endpoints. Agent Tracking (agenttracking.co) records page paths, referral domains, utm_source when present, tool names, duration and status, and clicks on marked actions. Its embedded script does not use cookies or send form values or order contents. Connecting to the service involves technical connection data.|启用 JavaScript 时在本地准备订单。已保存订单位于本浏览器的 localStorage 中，不会自动发送给我们。未启用时，表单将要求发送至 API，仅生成草稿，不保存订单。清除浏览器数据会删除本地订单，请导出重要档案。桥接层向你选择的接口发送调用。Agent Tracking（agenttracking.co）记录页面路径、来源域名、存在时的 utm_source、工具名称、调用时长与状态，以及标记操作的点击。嵌入脚本不使用 Cookie，不发送表单值或订单内容。连接该服务会产生技术连接数据。
Datenschutz beim Tracking-Dienst|Tracking service privacy policy|追踪服务隐私政策
Wie komme ich vom Brief zur Fertigung?|How do I move from a brief to manufacturing?|如何从制造要求进入实际生产？
Lade den Brief herunter und sende ihn an deinen gewählten Anbieter. Als optionalen Anschluss kannst du das|Download the brief and send it to your chosen supplier. You can optionally use the|下载制造要求并发送给你选择的供应商。你也可以选择使用
Anfrageformular von Vibe Manufacturing|Vibe Manufacturing request form|Vibe Manufacturing 询价表单
nutzen. Dort prüfst du Empfänger und Datennutzung vor dem Absenden. Der Pass wird nicht automatisch übertragen.|. Review recipients and data use before submitting there. Your passport is not transferred automatically.|。提交前请检查接收方和数据使用方式。订单档案不会自动传输。
Ist der offene Trust-Pledge noch verfügbar?|Is the open Trust-Pledge still available?|开放的 Trust-Pledge 仍可使用吗？
Ja.|Yes.|可以。
Signierter Trust-Pledge|The signed Trust-Pledge|已签署的 Trust-Pledge
und|and|和
signierte Agent Card|signed Agent Card|已签署的 Agent Card
bleiben als bestehende, selbst attestierte Bridge-Metadaten verfügbar. Sie beschreiben den früheren Bridge-MVP; der|remain available as existing, self-attested bridge metadata. They describe the earlier bridge MVP. The|仍作为原有的自行声明桥接元数据提供，描述早期桥接 MVP。
aktuelle Produktstatus|current product status|当前产品状态
ist separat veröffentlicht.|is published separately.|另行发布。
Aufträge für die Agenten-Ökonomie.|Orders for the agent economy.|面向智能体经济的订单。
Offene Schnittstellen. Konkrete Ergebnisse.|Open interfaces. Real outcomes.|开放接口，明确成果。
Kontakt: @wuebbe ↗|Contact: @wuebbe ↗|联系：@wuebbe ↗
Impressum ↗|Company information ↗|运营方信息 ↗
Datennutzung: siehe FAQ|Data use: see FAQ|数据使用：见常见问题
© 2026 a2a-router · Auftrags-Pass MVP · Audits, zentraler Ledger und Zahlungen sind geplant.|© 2026 a2a-router · Order Passport MVP · Audits, a central ledger, and payments are planned.|© 2026 a2a-router · 订单档案 MVP · 审核、中央账本和支付功能处于计划阶段。
a2a-router Startseite|a2a-router home|a2a-router 首页
Hauptnavigation|Main navigation|主导航
Ablauf: Mensch definiert, Agent koordiniert, Anbieter fertigt, Mensch prüft|Workflow: people define, agents coordinate, suppliers manufacture, people check|流程：人定义需求，智能体协调，供应商制造，人检查成果
z. B. Aluminium EN AW-6082|e.g. Aluminum 6061-T6|例如：铝合金 6061-T6
z. B. 10|e.g. 10|例如：10
z. B. DE|e.g. US|例如：CN
Was soll das Teil leisten? Welche Maße, Schnittstellen und Einschränkungen stehen fest?|What should the part do? Include known dimensions, units, interfaces, and constraints.|零件的用途是什么？请填写已知尺寸、单位、接口和限制条件。
z. B. Alle 10 Teile entsprechen der freigegebenen Zeichnung; Lochabstände werden gemessen und dokumentiert.|e.g. All 10 parts match the approved drawing; hole spacing is measured and recorded.|例如：10 个零件均符合批准的图纸，并测量、记录孔间距。
Nur bekannte Vorgaben eintragen|Enter confirmed requirements only|仅填写已确认的要求
z. B. entgratet, unbehandelt|e.g. deburred, unfinished|例如：去毛刺，未做表面处理
z. B. Datum oder flexibel|e.g. a date or flexible|例如：具体日期或可协商'''
TRANSLATIONS = {row.split('|')[0].strip(): row.split('|')[1:] for row in COPY.splitlines()}
SHARED = {'a2a','/','router','A2A ⇄ MCP + WEBMCP','01','02','03','◆','↓','⇄','↗','a2a-router','{↗}','.','OpenAPI','llms.txt','GitHub ↗','https://…','EN','中文','DE'}

class Translate(HTMLParser):
    def __init__(self, locale): super().__init__(convert_charrefs=False); self.locale=locale; self.out=[]; self.script=False; self.missing=set()
    def tr(self, text):
        key=text.strip()
        if not key or key in SHARED:return text
        if key not in TRANSLATIONS:self.missing.add(key);return text
        lead=text[:len(text)-len(text.lstrip())];tail=text[len(text.rstrip()):]
        return lead+TRANSLATIONS[key][0 if self.locale=='en' else 1]+tail
    def handle_starttag(self,tag,attrs):
        if tag=='script':self.script=True
        attrs=[(k,self.tr(v) if k in ['placeholder','aria-label'] else v) for k,v in attrs]
        self.out.append('<'+tag+''.join(' '+k+('="'+escape(v,quote=True)+'"' if v is not None else '') for k,v in attrs)+'>')
    def handle_endtag(self,tag):
        self.out.append('</'+tag+'>')
        if tag=='script':self.script=False
    def handle_data(self,text):self.out.append(text if self.script else escape(self.tr(text),quote=False))
    def handle_decl(self,decl):self.out.append('<!'+decl+'>')
    def handle_entityref(self,name):self.out.append('&'+name+';')
    def handle_charref(self,name):self.out.append('&#'+name+';')

BASE='https://www.a2a-router.com'
paths={'en':'/','de':'/de/','zh':'/zh/'}
langs={'en':'en-US','de':'de','zh':'zh-CN'}
meta={
'en':{'title':'a2a-router · Order passports for the agent economy','description':'Your agent coordinates. You define the outcome. Prepare a manufacturing brief, set acceptance criteria, and record the order history. Free Order Passport MVP with A2A, MCP, and WebMCP.','headline':'Your agent coordinates. You define the outcome.','ogDescription':'An order passport for agent-assisted manufacturing. Specs, acceptance criteria, and a portable order history.','vision':'Post-labor is the vision. Traceable manufacturing orders are the first product.','currency':'USD','ogLocale':'en_US'},
'zh':{'title':'a2a-router · 面向智能体经济的订单档案','description':'让智能体协调流程，由你定义成果。准备制造要求、设定验收标准并记录订单进展。免费订单档案 MVP，支持 A2A、MCP 和 WebMCP。','headline':'让智能体协调流程，由你定义最终成果。','ogDescription':'面向智能体辅助制造的订单档案，包含规格、验收标准与可导出的订单记录。','vision':'后劳动社会是愿景，可追溯制造订单是首个产品。','currency':'CNY','ogLocale':'zh_CN'},
'de':{'title':'a2a-router · Aufträge für die Agenten-Ökonomie','description':'Dein Agent organisiert. Du bestimmst das Ergebnis. Erstelle einen Fertigungs-Auftrags-Pass mit Abnahmekriterien und dokumentiere den Verlauf. Lokal nutzbarer MVP mit A2A, MCP und WebMCP.','headline':'Dein Agent organisiert. Du bestimmst das Ergebnis.','ogDescription':'Ein Auftrags-Pass für agentengestützte Fertigung. Spezifikation, Abnahme und Auftragshistorie in einem exportierbaren Dokument.','vision':'Post-Labor als Vision. Nachvollziehbare Fertigungsaufträge als erstes Produkt.','currency':'EUR','ogLocale':'de_DE'}}
source=Path('de/index.html').read_text()
source=re.sub(r'<div class="language-switcher".*?</div>','',source)
source=source.replace('<div class="header-actions">','').replace('</nav></div></header>','</nav></header>')
source=re.sub(r'<link rel="alternate"[^>]*>','',source)
source=re.sub(r'<meta property="og:locale"[^>]*>','',source)
for locale in ['en','zh','de']:
    if locale=='de':page=source
    else:
        parser=Translate(locale);parser.feed(source)
        if parser.missing:raise SystemExit('Missing translations: '+repr(parser.missing))
        page=''.join(parser.out)
    m=meta[locale];url=BASE+paths[locale]
    page=re.sub(r'<html lang="[^"]+">','<html lang="'+langs[locale]+'">',page)
    page=re.sub(r'<link rel="canonical"[^>]+>','<link rel="canonical" href="'+url+'">',page)
    alternates=''.join('<link rel="alternate" hreflang="'+code+'" href="'+BASE+paths[key]+'">' for key,code in [('en','en-US'),('en','en'),('de','de'),('zh','zh-Hans'),('en','x-default')])
    page=page.replace('<link rel="canonical"',alternates+'<link rel="canonical"',1)
    for attr,key in [('name="description"','description'),('property="og:title"','headline'),('property="og:description"','ogDescription'),('name="twitter:title"','title'),('name="twitter:description"','vision')]:
        page=re.sub('<meta '+attr+' content="[^"]*">','<meta '+attr+' content="'+escape(m[key],quote=True)+'">',page)
    page=re.sub(r'<meta property="og:url"[^>]+>','<meta property="og:url" content="'+url+'"><meta property="og:locale" content="'+m['ogLocale']+'">',page)
    graph={'@context':'https://schema.org','@graph':[{'@type':'WebSite','name':'a2a-router','url':url,'inLanguage':langs[locale]},{'@type':'SoftwareApplication','name':'a2a-router Order Passport' if locale=='en' else 'a2a-router 订单档案' if locale=='zh' else 'a2a-router Auftrags-Pass','applicationCategory':'BusinessApplication','operatingSystem':'Web browser','url':url+'#brief','inLanguage':langs[locale],'description':m['description'],'offers':{'@type':'Offer','price':'0','priceCurrency':m['currency']}}]}
    page=re.sub(r'<script type="application/ld\+json">.*?</script>','<script type="application/ld+json">'+json.dumps(graph,ensure_ascii=False,separators=(',',':'))+'</script>',page)
    page=page.replace('<script defer src="/lib/manufacturing.js">','<script defer src="/lib/i18n.js"></script><script defer src="/lib/manufacturing.js">') if '/lib/i18n.js' not in page else page
    page=re.sub(r'action="/api/brief[^"]*"','action="/api/brief?lang='+locale+'"',page)
    page=page.replace('<nav aria-label=', '<div class="header-actions"><nav aria-label=',1)
    switch='<div class="language-switcher" aria-label="Language">'+''.join('<a href="'+path+'" lang="'+langs[key]+'" hreflang="'+langs[key]+'"'+(' aria-current="page"' if key==locale else '')+'>'+label+'</a>' for key,path,label in [('en','/','EN'),('zh','/zh/','中文'),('de','/de/','DE')])+'</div>'
    page=page.replace('</nav></header>','</nav>'+switch+'</div></header>',1)
    page=re.sub(r'class="logo" href="[^"]+"', 'class="logo" href="'+paths[locale]+'"',page)
    page=page.replace('<script defer data-domain=', '<script async data-domain=')
    Path('index.html' if locale=='en' else locale+'/index.html').write_text(page)
print('Generated / (en-US), /zh/ (zh-CN), /de/ (de).')
