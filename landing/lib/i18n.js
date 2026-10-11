/* UI localization only. Passport IDs, input schema and stored records stay stable. */
(function (root) {
  'use strict';
  const text = {
    'Verfahren': ['Verfahren', 'Process', '工艺'],
    'Material': ['Material', 'Material', '材料'],
    'Stückzahl': ['Stückzahl', 'Quantity', '数量'],
    'Lieferland': ['Lieferland', 'Ship-to country', '收货国家'],
    'Auftrag': ['Auftrag', 'Brief', '制造要求'],
    'Abnahme': ['Abnahme', 'Acceptance', '验收'],
    'Toleranzen': ['Toleranzen', 'Tolerances', '公差'],
    'Oberfläche': ['Oberfläche', 'Finish', '表面处理'],
    'Termin': ['Termin', 'Deadline', '交期'],
    'Zeichnungslink': ['Zeichnungslink', 'Drawing link', '图纸链接'],
    'Technische Prüfung und Fertigbarkeit': ['Technische Prüfung und Fertigbarkeit', 'Engineering review and manufacturability', '技术检查与可制造性'],
    'Identität, Fähigkeiten und Nachweise des Anbieters': ['Identität, Fähigkeiten und Nachweise des Anbieters', 'Supplier identity, capabilities, and evidence', '供应商身份、能力与证明材料'],
    'Preis, Kapazität und Lieferzeit im Angebot': ['Preis, Kapazität und Lieferzeit im Angebot', 'Quoted price, capacity, and lead time', '报价、产能与交期'],
    'Toleranzen mit dem Hersteller klären.': ['Toleranzen mit dem Hersteller klären.', 'Confirm tolerances with the manufacturer.', '与制造商确认公差。'],
    'Oberfläche mit dem Hersteller klären.': ['Oberfläche mit dem Hersteller klären.', 'Confirm the finish with the manufacturer.', '与制造商确认表面处理。'],
    'Termin mit dem Hersteller klären.': ['Termin mit dem Hersteller klären.', 'Confirm the deadline with the manufacturer.', '与制造商确认交期。'],
    'Passende Zeichnung ergänzen.': ['Passende Zeichnung ergänzen.', 'Add the appropriate drawing.', '补充适当的图纸。'],
    'CNC machining': ['CNC-Fräsen / Drehen', 'CNC machining', 'CNC 加工'],
    'Sheet metal': ['Blechbearbeitung', 'Sheet metal', '钣金加工'],
    '3D printing': ['3D-Druck', '3D printing', '3D 打印'],
    'Auftrag lokal gespeichert. Noch keine Anfrage gesendet.': ['Auftrag lokal gespeichert. Noch keine Anfrage gesendet.', 'Order saved locally. No request has been sent.', '订单已保存到本地，尚未发送询价。'],
    'Pass darf höchstens 4 MB groß sein.': ['Pass darf höchstens 4 MB groß sein.', 'Passport files must be 4 MB or smaller.', '档案文件不得超过 4 MB。'],
    'Dieser Pass ist bereits vorhanden.': ['Dieser Pass ist bereits vorhanden.', 'This passport is already saved.', '此订单档案已存在。'],
    'Import ist älter oder weicht von der vorhandenen Historie ab. Lokale Daten bleiben erhalten.': ['Import ist älter oder weicht von der vorhandenen Historie ab. Lokale Daten bleiben erhalten.', 'This import is older or conflicts with the saved history. Local records were kept.', '导入记录较旧或与现有历史冲突。原有本地记录已保留。'],
    'Neuere Fortsetzung importiert; Hash-Kette stimmt. Angaben sind selbst erfasst.': ['Neuere Fortsetzung importiert; Hash-Kette stimmt. Angaben sind selbst erfasst.', 'Newer continuation imported; the hash chain is consistent. Records are self-reported.', '已导入更新记录，哈希链一致。内容由用户自行填写。'],
    'Pass importiert; Hash-Kette stimmt. Angaben sind selbst erfasst.': ['Pass importiert; Hash-Kette stimmt. Angaben sind selbst erfasst.', 'Passport imported; the hash chain is consistent. Records are self-reported.', '档案已导入，哈希链一致。内容由用户自行填写。'],
    'Import abgelehnt: ': ['Import abgelehnt: ', 'Import rejected: ', '导入被拒绝：'],
    'Noch kein lokaler Auftrag. Bereite oben deinen ersten Pass vor.': ['Noch kein lokaler Auftrag. Bereite oben deinen ersten Pass vor.', 'No local orders yet. Prepare your first passport above.', '暂无本地订单。请先在上方生成订单档案。'],
    'Abnahmekriterien: ': ['Abnahmekriterien: ', 'Acceptance criteria: ', '验收标准：'],
    'Pass exportieren ↓': ['Pass exportieren ↓', 'Export passport ↓', '导出订单档案 ↓'],
    'Hash-Kette prüfen': ['Hash-Kette prüfen', 'Verify hash chain', '检查哈希链'],
    'Lokale Kopie entfernen': ['Lokale Kopie entfernen', 'Remove local copy', '删除本地副本'],
    'Lokale Kopie entfernt. Ein zuvor exportierter Pass kann wieder importiert werden.': ['Lokale Kopie entfernt. Ein zuvor exportierter Pass kann wieder importiert werden.', 'Local copy removed. You can re-import a previously exported passport.', '本地副本已删除。可重新导入此前导出的档案。'],
    'Auftrags-Pass vorbereitet': ['Auftrags-Pass vorbereitet', 'Order passport prepared', '订单档案已生成'],
    'Belegverweis: ': ['Belegverweis: ', 'Evidence reference: ', '凭证引用：'],
    'Ereignis': ['Ereignis', 'Event', '事件'],
    'Belegverweis (optional)': ['Belegverweis (optional)', 'Evidence reference (optional)', '凭证引用（可选）'],
    'z. B. Angebotsnummer oder privater Beleglink': ['z. B. Angebotsnummer oder privater Beleglink', 'e.g. quote number or a private evidence link', '例如：报价单编号或私有凭证链接'],
    'Was ist passiert?': ['Was ist passiert?', 'What happened?', '发生了什么？'],
    'Ereignis lokal erfassen': ['Ereignis lokal erfassen', 'Record a local event', '记录本地事件'],
    'Auftrag ist nicht mehr im lokalen Speicher.': ['Auftrag ist nicht mehr im lokalen Speicher.', 'This order is no longer in local storage.', '该订单已不在本地存储中。'],
    'Ereignis lokal erfasst. Keine externe Bestätigung oder Zahlung ausgelöst.': ['Ereignis lokal erfasst. Keine externe Bestätigung oder Zahlung ausgelöst.', 'Event recorded locally. No external confirmation or payment was triggered.', '事件已保存到本地，未触发外部确认或付款。'],
    'Ungültiger lokaler Auftragsspeicher. Daten wurden nicht überschrieben.': ['Ungültiger lokaler Auftragsspeicher. Daten wurden nicht überschrieben.', 'Invalid local order storage. Existing data was not overwritten.', '本地订单存储无效，原有数据未被覆盖。'],
    'Doppelte IDs im lokalen Speicher.': ['Doppelte IDs im lokalen Speicher.', 'Duplicate IDs in local storage.', '本地存储中存在重复 ID。'],
    'Lokaler Speicher nicht verfügbar oder ungültig. Export bleibt möglich.': ['Lokaler Speicher nicht verfügbar oder ungültig. Export bleibt möglich.', 'Local storage is unavailable or invalid. Brief export is still available.', '本地存储不可用或无效，仍可导出制造要求。'],
    'Maximal 50 lokale Aufträge. Exportiere und entferne zuerst eine lokale Kopie.': ['Maximal 50 lokale Aufträge. Exportiere und entferne zuerst eine lokale Kopie.', 'Up to 50 local orders. Export and remove a local copy before adding another.', '最多保存 50 个本地订单。请先导出并删除一个本地副本。'],
    'Ein anderer Tab hat den Speicher geändert. Bitte erneut versuchen.': ['Ein anderer Tab hat den Speicher geändert. Bitte erneut versuchen.', 'Another tab changed local storage. Please try again.', '另一个标签页修改了本地存储，请重试。'],
    'Ungültige Pass-Struktur.': ['Ungültige Pass-Struktur.', 'Invalid passport structure.', '订单档案结构无效。'],
    'Ungültiger Pass-Kopf.': ['Ungültiger Pass-Kopf.', 'Invalid passport header.', '订单档案头信息无效。'],
    'Ungültige Auftragsspezifikation.': ['Ungültige Auftragsspezifikation.', 'Invalid order specifications.', '订单规格无效。'],
    'Ungültige Ereignisliste.': ['Ungültige Ereignisliste.', 'Invalid event list.', '事件列表无效。'],
    'Unbekannter Ereignistyp.': ['Unbekannter Ereignistyp.', 'Unknown event type.', '未知事件类型。'],
    'Bitte eine Notiz mit 3–2000 Zeichen eintragen.': ['Bitte eine Notiz mit 3–2000 Zeichen eintragen.', 'Enter a note with 3–2000 characters.', '请填写 3–2000 个字符的备注。'],
    'Belegverweis darf höchstens 1000 Zeichen haben.': ['Belegverweis darf höchstens 1000 Zeichen haben.', 'Evidence references must be 1000 characters or fewer.', '凭证引用不得超过 1000 个字符。'],
    'Abschlusshash stimmt nicht überein.': ['Abschlusshash stimmt nicht überein.', 'The final hash does not match.', '最终哈希值不匹配。'],
    'Maximal 1000 Ereignisse pro Pass.': ['Maximal 1000 Ereignisse pro Pass.', 'Up to 1000 events per passport.', '每份档案最多包含 1000 个事件。'],
    'Anfrage gesendet': ['Anfrage gesendet', 'Request sent', '询价已发送'],
    'Angebot erhalten': ['Angebot erhalten', 'Quote received', '报价已收到'],
    'Auftrag freigegeben': ['Auftrag freigegeben', 'Order approved', '订单已批准'],
    'Fertigung gemeldet': ['Fertigung gemeldet', 'Production reported', '生产状态已记录'],
    'Lieferung erfasst': ['Lieferung erfasst', 'Delivery recorded', '交付已记录'],
    'Abnahme erfasst': ['Abnahme erfasst', 'Acceptance recorded', '验收已记录'],
    'Reklamation erfasst': ['Reklamation erfasst', 'Dispute recorded', '异议已记录'],
    'Zahlung erfasst': ['Zahlung erfasst', 'Payment recorded', '付款已记录'],
    hashStatus: ['Hash-Kette stimmt: {count} Ereignisse. Selbst erfasste Angaben, keine unabhängige Prüfung.', 'Hash chain is consistent: {count} events. Self-reported records, not independently verified.', '哈希链一致：{count} 个事件。内容由用户自行记录，未经独立核验。'],
    storageFailure: ['Lokaler Speicher nicht verfügbar oder ungültig: {error} Vorhandene Daten werden nicht überschrieben. Brief-Export bleibt möglich.', 'Local storage is unavailable or invalid: {error} Existing records will not be overwritten. Brief export is still available.', '本地存储不可用或无效：{error} 原有记录不会被覆盖，仍可导出制造要求。'],
    invalidJson: ['Ungültige JSON-Datei.', 'Invalid JSON file.', 'JSON 文件无效。'],
    requiredField: ['Pflichtfeld: {field}', 'Required field: {field}', '必填项：{field}'],
    unknownField: ['Unbekanntes Feld: {field}', 'Unknown field: {field}', '未知字段：{field}'],
    fieldText: ['{field} muss Text sein.', '{field} must be text.', '{field} 必须为文本。'],
    fieldLength: ['Länge von {field} prüfen.', 'Check the length of {field}.', '请检查 {field} 的长度。'],
    quantityInteger: ['Stückzahl muss eine ganze Zahl sein.', 'Quantity must be a whole number.', '数量必须为整数。'],
    quantityRange: ['Stückzahl muss zwischen 1 und 100000 liegen.', 'Quantity must be between 1 and 100000.', '数量必须在 1 到 100000 之间。'],
    countryCode: ['Lieferland muss ein zweistelliger Code sein, z. B. DE.', 'Use a two-letter country code, e.g. US.', '请使用两位国家代码，例如 CN。'],
    drawingHttps: ['Zeichnungslink muss eine gültige HTTPS-Adresse ohne Zugangsdaten sein.', 'The drawing link must be a valid HTTPS URL without credentials.', '图纸链接必须为有效的 HTTPS 地址，且不能包含登录凭据。'],
    processRequired: ['Bitte ein unterstütztes Verfahren auswählen.', 'Select a supported manufacturing process.', '请选择支持的制造工艺。'],
    badBrief: ['Der Auftrag muss ein gültiges Objekt sein.', 'The brief must be a valid object.', '制造要求必须为有效对象。'],
    badChainEvent: ['Hash-Kette ungültig bei Ereignis {count}.', 'Invalid hash chain at event {count}.', '第 {count} 个事件的哈希链无效。'],
    oversizedBrief: ['Der Brief überschreitet 16000 Bytes.', 'The brief exceeds 16000 bytes.', '制造要求超过 16000 字节。']
  };
  const fields = { process: 'Verfahren', material: 'Material', quantity: 'Stückzahl', country: 'Lieferland', description: 'Auftrag', acceptance: 'Abnahme', tolerance: 'Toleranzen', finish: 'Oberfläche', deadline: 'Termin', drawingUrl: 'Zeichnungslink' };
  function locale(value = root.document?.documentElement.lang || 'en') { return /^zh/i.test(value) ? 'zh' : /^de/i.test(value) ? 'de' : 'en'; }
  function translate(key, language, vars = {}) {
    const row = text[key]; const lang = locale(language);
    let value = row ? row[lang === 'de' ? 0 : lang === 'en' ? 1 : 2] : key;
    return String(value).replace(/\{(\w+)\}/g, (match, name) => Object.hasOwn(vars, name) ? String(vars[name]) : match);
  }
  function error(value, language) {
    if (value?.name === 'SyntaxError') return translate('invalidJson', language);
    const message = typeof value === 'string' ? value : value?.message || 'Error';
    if (text[message]) return translate(message, language);
    const patterns = [
      [/^Required field: (.+)$/, 'requiredField'], [/^Unknown field: (.+)$/, 'unknownField'],
      [/^(.+) must be text\.$/, 'fieldText'], [/^Check the length of (.+)\.$/, 'fieldLength']
    ];
    for (const [pattern, key] of patterns) { const matched = message.match(pattern); if (matched) return translate(key, language, { field: translate(fields[matched[1]] || matched[1], language) }); }
    if (message === 'quantity must be a whole number.') return translate('quantityInteger', language);
    if (message === 'quantity must be between 1 and 100000.') return translate('quantityRange', language);
    if (message.startsWith('country must be a two-letter')) return translate('countryCode', language);
    if (message.startsWith('drawingUrl must be')) return translate('drawingHttps', language);
    if (message.startsWith('Select a supported process:')) return translate('processRequired', language);
    if (message === 'Brief input must be an object.') return translate('badBrief', language);
    if (message === 'Brief exceeds 16000 bytes.') return translate('oversizedBrief', language);
    const event = message.match(/^Hash-Kette ungültig bei Ereignis (\d+)\.$/);
    if (event) return translate('badChainEvent', language, { count: event[1] });
    return message;
  }
  const api = { locale, translate, error, dateLocale: { en: 'en-US', de: 'de-DE', zh: 'zh-CN' } };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Localize = api;
})(globalThis);
