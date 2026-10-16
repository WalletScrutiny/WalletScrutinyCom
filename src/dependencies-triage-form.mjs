// The "Judge" dialog of the Dependencies panel: one triage statement
// (src/dependency-triage.mjs) written in the page and signed with the
// visitor's Nostr browser extension (NIP-07), the way opinions are. The
// statement is published to the project relay and the site's public relays;
// the site build picks it up from there (scripts/build-dependency-triage.mjs),
// and the panel shows it on the row at once without waiting for a build.
//
// Who signs decides the weight: an author on the trusted list settles rows,
// anyone else is counted as a community statement. The dialog says which of
// the two the visitor is before they write.

import { waitNostr } from 'nip07-awaiter';
import { el } from './html-utils.mjs';
import {
  triageTemplate, statementFromEvent, statementChoices, triageSubject, evidenceUrl,
  TRIAGE_STATUSES, TRIAGE_LABEL, TRIAGE_JUSTIFICATIONS, JUSTIFICATION_LABEL,
} from './dependency-triage.mjs';
import { connectNostr, ensureConnected, getUserPubkeyFromSigner, publishEvent, signEvent, nip19 } from './nostr-client.mjs';
import { eventRelayUrls, mainRelayUrl } from './nostr-constants.mjs';
import { SEVERITY_LABEL } from './dependencies-panel-model.mjs';

// Same set the command-line publisher and the build's pull use.
export const TRIAGE_PUBLISH_RELAYS = [...new Set([mainRelayUrl, ...eventRelayUrls])];

const NIP07_WAIT_MS = 3125;

export const NO_EXTENSION_MESSAGE = 'Publishing a statement needs a Nostr browser extension (NIP-07), for example Alby, nos2x or Flamingo.';

const STATUS_HINT = {
  affected: 'the flaw reaches whoever uses the package this way',
  not_affected: 'the vulnerable code is never reached, or the flaw needs a position an attacker does not have here',
  fixed: 'the direct user has moved past the vulnerable version (say which versions)',
  under_investigation: 'being looked at; no call yet',
};

// The browser's signer and relays; tests pass their own.
export function browserNostr() {
  return {
    waitExtension: () => waitNostr(NIP07_WAIT_MS).then(Boolean, () => false),
    getPubkey: getUserPubkeyFromSigner,
    signEvent,
    publish: async (event) => {
      try {
        await ensureConnected();
      } catch {
        // No verifications UI on this page has opened the shared pool yet.
        await connectNostr({ relayUrls: TRIAGE_PUBLISH_RELAYS });
      }
      return publishEvent(event, TRIAGE_PUBLISH_RELAYS);
    },
  };
}

/**
 * The template fields for a statement about `advisory` from the form's
 * values: `choice` is one of statementChoices(), `status`, `justification`,
 * `versions`, `evidence`, `content` what was typed. Throws on what
 * triageTemplate refuses and on a `not_affected` without a reason.
 */
export function statementFields(advisory, { choice, status, justification = '', versions = '', evidence = '', content = '' }) {
  if (!choice) throw new Error('choose what the statement is about');
  if (!TRIAGE_STATUSES.includes(status)) throw new Error('choose a status');
  const why = String(content || '').trim();
  if (status === 'not_affected' && !justification && !why) throw new Error('"not affected" needs a justification or a reason in the text');
  if (String(evidence || '').trim() && !evidenceUrl(evidence)) throw new Error('the evidence link must be an http(s) URL');
  return {
    vulns: [advisory.id, ...(advisory.aliases || [])],
    pkg: `${advisory.ecosystem || 'npm'}:${advisory.package}`,
    via: choice.via || null,
    app: choice.app || null,
    status,
    justification: status === 'not_affected' && justification ? justification : null,
    versions: choice.via ? String(versions || '').trim() || null : null,
    evidence: String(evidence || '').trim() || null,
    content: why,
  };
}

// The signer's current statement on a subject, if the wallet's file has one.
export function ownStatement(triage, pubkey, d) {
  if (!pubkey || !triage?.statements) return null;
  return triage.statements
    .filter(s => s.pubkey === pubkey && s.d === d)
    .reduce((best, s) => (!best || s.created_at > best.created_at ? s : best), null);
}

// A <select>'s value, settable where the DOM has no form state (unit tests) too.
function setSelect(select, v) {
  try {
    select.value = v || '';
  } catch {
    for (const o of select.querySelectorAll('option')) o.toggleAttribute('selected', o.value === (v || ''));
  }
}
function selectValue(select) {
  const v = select.value;
  if (typeof v === 'string') return v;
  return [...select.querySelectorAll('option')].find(o => o.hasAttribute('selected'))?.value || '';
}

const shortNpub = (pubkey) => {
  const npub = nip19.npubEncode(pubkey);
  return `${npub.slice(0, 12)}…${npub.slice(-6)}`;
};

// "3 of 6 relays accepted; relay.nostr.info: blocked: kind not allowed"
export function publishOutcome(summary) {
  const failures = (summary.failures || []).map(f => `${f.url.replace(/^wss:\/\//, '').replace(/\/$/, '')}: ${f.error}`);
  return { ok: summary.successful > 0, text: `${summary.successful} of ${summary.total} relays accepted the statement${failures.length ? `; ${failures.join('; ')}` : ''}` };
}

/**
 * Open the dialog for one advisory row. `triage` is the wallet's statements
 * file (or null), `trusted` the trusted-author pubkeys (used when the file
 * has none), `onPublished(statement, summary)` runs after a relay accepted
 * the signed event. Returns the <dialog> element.
 */
export function openTriageDialog({ advisory, appId, triage = null, trusted = [], nostr = browserNostr(), onPublished = () => {} }) {
  const choices = statementChoices(advisory, { appId });
  const trustedSet = new Set(triage?.trusted?.length ? triage.trusted : trusted);
  let pubkey = null;
  let prefilledFrom = null;

  const radio = (name, value, label, hint, checked = false) => el('label', { className: 'dp-form__choice' },
    el('input', { type: 'radio', name, value, checked: checked || null }),
    el('span', {}, el('span', { className: 'dp-form__choice-label' }, label), hint ? el('span', { className: 'dp-form__choice-hint' }, hint) : null),
  );

  const subjectGroup = el('fieldset', { className: 'dp-form__group' },
    el('legend', {}, 'This statement is about'),
    ...choices.map(c => radio('subject', c.key, c.label, c.hint, c.preferred)),
  );
  const statusGroup = el('fieldset', { className: 'dp-form__group' },
    el('legend', {}, 'Status'),
    ...TRIAGE_STATUSES.map(s => radio('status', s, TRIAGE_LABEL[s], STATUS_HINT[s])),
  );
  const justification = el('select', { name: 'justification' },
    el('option', { value: '' }, 'choose one, or explain in the text'),
    ...TRIAGE_JUSTIFICATIONS.map(j => el('option', { value: j }, JUSTIFICATION_LABEL[j])),
  );
  const justificationField = el('label', { className: 'dp-form__field', hidden: true }, el('span', {}, 'Why not affected'), justification);
  const versions = el('input', { type: 'text', name: 'versions', placeholder: 'optional, e.g. 7.23 and later' });
  const versionsLabel = el('span', {}, 'Versions this holds for');
  const versionsField = el('label', { className: 'dp-form__field', hidden: true }, versionsLabel, versions);
  const evidence = el('input', { type: 'url', name: 'evidence', placeholder: 'https://… the issue, pull request or code line that shows it' });
  const content = el('textarea', { name: 'content', rows: 4, placeholder: 'Why. One or two sentences another reviewer can check.' });
  const signer = el('p', { className: 'dp-form__signer' }, 'Looking for a Nostr extension…');
  const error = el('p', { className: 'dp-form__error', hidden: true });
  const cancel = el('button', { type: 'button', className: 'btn-small' }, 'Cancel');
  const publish = el('button', { type: 'submit', className: 'btn-small dp-form__publish', disabled: true }, 'Publish statement');

  const sev = SEVERITY_LABEL[advisory.severity] || advisory.severity;
  const form = el('form', { className: 'dp-form', method: 'dialog' },
    el('button', { type: 'button', className: 'dp-dialog__close', 'aria-label': 'Close' }, '×'),
    el('h3', { className: 'dp-dialog__title' }, 'Judge ', el('a', { href: `https://osv.dev/vulnerability/${encodeURIComponent(advisory.id)}`, target: '_blank', rel: 'noopener noreferrer' }, advisory.id)),
    el('p', { className: 'dp-form__context' }, `${advisory.package} ${advisory.version || ''}`.trim(), ' · ', String(sev).toLowerCase(), advisory.summary ? ` · ${advisory.summary}` : ''),
    subjectGroup,
    statusGroup,
    justificationField,
    versionsField,
    el('label', { className: 'dp-form__field' }, el('span', {}, 'Evidence'), evidence),
    el('label', { className: 'dp-form__field' }, el('span', {}, 'Reasoning'), content),
    signer,
    error,
    el('div', { className: 'dp-form__actions' }, cancel, publish),
  );
  const dialog = el('dialog', { className: 'dp-dialog' }, form);

  // the property in a browser; the attribute where a DOM has no form state (unit tests)
  const isChecked = (input) => (typeof input.checked === 'boolean' ? input.checked : input.hasAttribute('checked'));
  const value = (name) => [...form.querySelectorAll(`input[name="${name}"]`)].find(isChecked)?.value || '';
  const choiceOf = (key) => choices.find(c => c.key === key) || null;
  const showError = (message) => {
    error.textContent = message || '';
    error.hidden = !message;
  };
  const close = () => {
    if (typeof dialog.close === 'function' && dialog.open) dialog.close();
    dialog.remove();
  };

  function syncFields() {
    const choice = choiceOf(value('subject'));
    justificationField.hidden = value('status') !== 'not_affected';
    versionsField.hidden = !choice?.via;
    if (choice?.via) versionsLabel.textContent = `Versions of ${choice.via.replace(/^[a-z]+:/, '')} this holds for`;
  }

  // The signer's existing statement on the chosen subject fills the form, so
  // publishing again edits it (the relay replaces the older event).
  function prefill() {
    const choice = choiceOf(value('subject'));
    if (!choice || !pubkey) return;
    const d = triageSubject({ vuln: advisory.id, via: choice.via || null, app: choice.app || null });
    const mine = ownStatement(triage, pubkey, d);
    if (mine) {
      form.querySelector(`input[name="status"][value="${mine.status}"]`).checked = true;
      setSelect(justification, mine.justification);
      versions.value = mine.versions || '';
      evidence.value = mine.evidence || '';
      content.value = mine.content || '';
      publish.textContent = 'Update statement';
      prefilledFrom = d;
    } else if (prefilledFrom) {
      for (const input of form.querySelectorAll('input[name="status"]')) input.checked = false;
      setSelect(justification, '');
      versions.value = '';
      evidence.value = '';
      content.value = '';
      publish.textContent = 'Publish statement';
      prefilledFrom = null;
    }
    syncFields();
  }

  form.addEventListener('change', (event) => {
    if (event.target?.name === 'subject') prefill();
    syncFields();
    showError(null);
  });
  cancel.addEventListener('click', close);
  form.querySelector('.dp-dialog__close').addEventListener('click', close);
  dialog.addEventListener('close', () => dialog.remove());

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    showError(null);
    let template;
    try {
      template = triageTemplate(statementFields(advisory, {
        choice: choiceOf(value('subject')),
        status: value('status'),
        justification: selectValue(justification),
        versions: versions.value,
        evidence: evidence.value,
        content: content.value,
      }));
    } catch (e) {
      showError(e.message);
      return;
    }
    publish.disabled = true;
    publish.textContent = 'Publishing…';
    try {
      const signed = await nostr.signEvent(template);
      const statement = statementFromEvent(signed);
      if (!statement) throw new Error('the extension returned an event that is not a statement');
      const summary = await nostr.publish(signed);
      const outcome = publishOutcome(summary);
      if (!outcome.ok) throw new Error(`No relay accepted the statement: ${outcome.text}`);
      close();
      onPublished(statement, { ...summary, text: outcome.text, trusted: trustedSet.has(statement.pubkey) });
    } catch (e) {
      showError(e.message || String(e));
      publish.disabled = false;
      publish.textContent = prefilledFrom ? 'Update statement' : 'Publish statement';
    }
  });

  document.body.appendChild(dialog);
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
  syncFields();

  (async () => {
    try {
      if (!(await nostr.waitExtension())) throw new Error(NO_EXTENSION_MESSAGE);
      pubkey = await nostr.getPubkey();
      const weight = trustedSet.has(pubkey)
        ? 'your statements settle rows on this site'
        : 'counted as a community statement; the site lists whose statements settle rows';
      signer.textContent = `Signing as ${shortNpub(pubkey)} · ${weight}.`;
      signer.dataset.pubkey = pubkey;
      publish.disabled = false;
      prefill();
    } catch (e) {
      signer.textContent = e.message || NO_EXTENSION_MESSAGE;
      signer.classList.add('dp-form__signer--none');
    }
  })();

  return dialog;
}
