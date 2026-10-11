(async function () {
  'use strict';
  const M = window.Manufacturing;
  const P = window.OrderPassport;
  const L = window.Localize;
  const lang = L.locale();
  const t = (key, vars) => L.translate(key, lang, vars);
  const errorText = error => L.error(error, lang);
  const form = document.getElementById('brief-form');
  const byId = id => document.getElementById(id);
  const storageKey = 'a2a-router-orders-v1';
  let draft;
  let busy = false;
  let storageError = false;
  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function message(text) { byId('storage-message').textContent = text; }
  function download(value, filename) {
    const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }));
    const link = element('a'); link.href = url; link.download = filename;
    document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function readOrders() {
    const value = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (!Array.isArray(value) || value.length > 50) throw new Error(t('Ungültiger lokaler Auftragsspeicher. Daten wurden nicht überschrieben.'));
    return value;
  }
  async function validatedOrders() {
    const orders = readOrders();
    for (const order of orders) await P.verify(order);
    if (new Set(orders.map(order => order.id)).size !== orders.length) throw new Error(t('Doppelte IDs im lokalen Speicher.'));
    return orders;
  }
  function writeOrders(orders) {
    if (storageError) throw new Error(t('Lokaler Speicher nicht verfügbar oder ungültig. Export bleibt möglich.'));
    if (orders.length > 50) throw new Error(t('Maximal 50 lokale Aufträge. Exportiere und entferne zuerst eine lokale Kopie.'));
    localStorage.setItem(storageKey, JSON.stringify(orders));
  }
  async function mutate(action) {
    if (busy) return;
    busy = true;
    try {
      const work = async () => { const before = localStorage.getItem(storageKey); const orders = await validatedOrders(); const next = await action(orders); if (localStorage.getItem(storageKey) !== before) throw new Error(t('Ein anderer Tab hat den Speicher geändert. Bitte erneut versuchen.')); if (next) writeOrders(next); };
      if (navigator.locks) await navigator.locks.request(storageKey, work); else await work();
      await renderOrders();
    } catch (error) { message(errorText(error)); }
    finally { busy = false; }
  }
  function preview(result) {
    draft = result; byId('brief-empty').hidden = true; byId('brief-result').hidden = false;
    byId('brief-summary').replaceChildren();
    const labels = { process: t('Verfahren'), material: t('Material'), quantity: t('Stückzahl'), country: t('Lieferland'), description: t('Auftrag'), acceptance: t('Abnahme'), tolerance: t('Toleranzen'), finish: t('Oberfläche'), deadline: t('Termin'), drawingUrl: t('Zeichnungslink') };
    for (const [key, value] of Object.entries(result.brief)) {
      const row = element('div'); row.append(element('dt', labels[key]), element('dd', key === 'process' ? t(M.processes[value].name) : value)); byId('brief-summary').append(row);
    }
    const missingLabels = { tolerance: t('Toleranzen mit dem Hersteller klären.'), finish: t('Oberfläche mit dem Hersteller klären.'), deadline: t('Termin mit dem Hersteller klären.'), drawingUrl: t('Passende Zeichnung ergänzen.') };
    const questions = [t('Technische Prüfung und Fertigbarkeit'), t('Identität, Fähigkeiten und Nachweise des Anbieters'), t('Preis, Kapazität und Lieferzeit im Angebot')];
    for (const key of Object.keys(missingLabels)) if (!result.brief[key]) questions.push(missingLabels[key]);
    byId('brief-unresolved').replaceChildren(...questions.map(text => element('li', text)));
    byId('brief-result').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest' });
  }
  if (form) {
    form.addEventListener('submit', event => { event.preventDefault(); byId('form-error').textContent = ''; try { preview(M.prepareBrief(Object.fromEntries(new FormData(form)))); } catch (error) { byId('form-error').textContent = errorText(error); } });
    byId('download-brief').addEventListener('click', () => { if (draft) download(draft, 'a2a-manufacturing-brief.json'); });
    byId('save-order').addEventListener('click', () => mutate(async orders => { if (!draft) return; const order = await P.create(draft.brief); message(t('Auftrag lokal gespeichert. Noch keine Anfrage gesendet.')); return [...orders, order]; }));
    byId('import-passport').addEventListener('change', async event => {
      const file = event.target.files[0]; event.target.value = ''; if (!file) return;
      if (file.size > 4000000) return message(t('Pass darf höchstens 4 MB groß sein.'));
      try {
        const imported = JSON.parse(await file.text()); await P.verify(imported);
        await mutate(async orders => {
          const existing = orders.find(order => order.id === imported.id);
          if (existing) {
            if (existing.headHash === imported.headHash) { message(t('Dieser Pass ist bereits vorhanden.')); return; }
            const prefix = imported.events.slice(0, existing.events.length);
            const prefixHash = prefix.at(-1)?.hash || await P.hash({ version: imported.version, id: imported.id, createdAt: imported.createdAt, brief: imported.brief });
            if (prefixHash !== existing.headHash || imported.events.length <= existing.events.length) throw new Error(t('Import ist älter oder weicht von der vorhandenen Historie ab. Lokale Daten bleiben erhalten.'));
            message(t('Neuere Fortsetzung importiert; Hash-Kette stimmt. Angaben sind selbst erfasst.'));
            return orders.map(order => order.id === imported.id ? imported : order);
          }
          message(t('Pass importiert; Hash-Kette stimmt. Angaben sind selbst erfasst.')); return [...orders, imported];
        });
      } catch (error) { message(t('Import abgelehnt: ') + errorText(error)); }
    });
    await renderOrders();
    window.addEventListener('storage', event => { if (event.key === storageKey) renderOrders(); });
  }
  async function renderOrders() {
    if (!form) return;
    try {
      const orders = await validatedOrders(); storageError = false;
      const list = byId('order-list'); list.replaceChildren();
      if (!orders.length) { list.append(element('p', t('Noch kein lokaler Auftrag. Bereite oben deinen ersten Pass vor.'), 'empty-orders')); return; }
      for (const order of orders.slice().reverse()) {
        const card = element('article', undefined, 'order-card'); card.dataset.orderId = order.id;
        card.append(element('h4', order.brief.description.slice(0, 100)), element('p', `${order.brief.quantity} × ${order.brief.material} · ${order.brief.country} · ${order.id}`, 'order-meta'), element('p', t('Abnahmekriterien: ') + order.brief.acceptance, 'order-meta'));
        const actions = element('div', undefined, 'order-actions');
        const exportButton = element('button', t('Pass exportieren ↓'), 'secondary'); exportButton.type = 'button'; exportButton.addEventListener('click', () => download(order, `a2a-order-${order.id}.json`));
        const verifyButton = element('button', t('Hash-Kette prüfen'), 'secondary'); verifyButton.type = 'button'; verifyButton.addEventListener('click', async () => { try { const result = await P.verify(readOrders().find(item => item.id === order.id)); message(t('hashStatus', { count: result.eventCount })); } catch (error) { message(errorText(error)); } });
        const remove = element('button', t('Lokale Kopie entfernen'), 'secondary'); remove.type = 'button'; remove.addEventListener('click', () => mutate(async orders => { message(t('Lokale Kopie entfernt. Ein zuvor exportierter Pass kann wieder importiert werden.')); return orders.filter(item => item.id !== order.id); }));
        actions.append(exportButton, verifyButton, remove); card.append(actions);
        const events = element('ol', undefined, 'events');
        const prepared = element('li'); prepared.append(element('strong', t('Auftrags-Pass vorbereitet')), element('p', new Date(order.createdAt).toLocaleString(L.dateLocale[lang]))); events.append(prepared);
        for (const event of order.events) { const row = element('li'); row.append(element('strong', t(P.labels[event.type]) + ' · ' + new Date(event.at).toLocaleString(L.dateLocale[lang])), element('p', event.note)); if (event.evidence) row.append(element('p', t('Belegverweis: ') + event.evidence)); events.append(row); }
        card.append(events, element('p', 'SHA-256 · ' + order.headHash, 'order-meta'));
        const eventForm = element('form', undefined, 'event-form');
        const typeLabel = element('label', t('Ereignis')); const select = element('select'); select.name = 'type'; select.required = true; for (const [value, label] of Object.entries(P.labels)) { const option = element('option', t(label)); option.value = value; select.append(option); } typeLabel.append(select);
        const evidenceLabel = element('label', t('Belegverweis (optional)')); const evidence = element('input'); evidence.name = 'evidence'; evidence.maxLength = 1000; evidence.placeholder = t('z. B. Angebotsnummer oder privater Beleglink'); evidenceLabel.append(evidence);
        const noteLabel = element('label', t('Was ist passiert?'), 'wide'); const note = element('textarea'); note.name = 'note'; note.required = true; note.minLength = 3; note.maxLength = 2000; note.rows = 2; noteLabel.append(note);
        const submit = element('button', t('Ereignis lokal erfassen'), 'secondary'); submit.type = 'submit'; eventForm.append(typeLabel, evidenceLabel, noteLabel, submit);
        eventForm.addEventListener('submit', event => { event.preventDefault(); const data = Object.fromEntries(new FormData(eventForm)); mutate(async orders => { const current = orders.find(item => item.id === order.id); if (!current) throw new Error(t('Auftrag ist nicht mehr im lokalen Speicher.')); const updated = await P.append(current, data.type, data.note, data.evidence); message(t('Ereignis lokal erfasst. Keine externe Bestätigung oder Zahlung ausgelöst.')); return orders.map(item => item.id === order.id ? updated : item); }); });
        card.append(eventForm); list.append(card);
      }
    } catch (error) { storageError = true; message(t('storageFailure', { error: errorText(error) })); }
  }
  try {
    if (!document.modelContext) return;
    const tools = [
      { name: 'get_project_status', description: 'Read the current a2a-router product status, live capabilities and planned audits, ledger and payments.', inputSchema: { type: 'object', properties: {}, additionalProperties: false }, execute: async () => M.status },
      { name: 'get_manufacturing_requirements', description: 'Read required specifications, file formats and checks for CNC, sheet metal or 3D printing.', inputSchema: { type: 'object', properties: { process: M.schema.properties.process }, required: ['process'], additionalProperties: false }, execute: async ({ process }) => M.requirements(process) },
      { name: 'prepare_manufacturing_brief', description: 'Validate and return a manufacturing draft with acceptance criteria and unresolved questions. Does not save, submit, contact a supplier or pay. Never invent missing specifications.', inputSchema: M.schema, execute: async args => M.prepareBrief(args) }
    ];
    for (const tool of tools) await document.modelContext.registerTool({ ...tool, annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true } });
    document.documentElement.dataset.webmcp = 'ready';
  } catch (error) { console.warn('WebMCP registration unavailable:', error.message); }
})();
