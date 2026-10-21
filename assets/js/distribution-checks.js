/*
 * Store-package step on review pages (_includes/review/steps/flathub.html): shows what
 * WalletScrutiny found for each checked store commit, and lets users look up the commit
 * they have installed.
 *
 * Every value shown comes from untrusted input (a pasted `flatpak info`, and later Nostr
 * labels), so check entries are validated field by field and everything is written with
 * textContent. Nothing here builds HTML from strings.
 *
 * Loaded as a plain script in the browser (window.wsDistributionChecks) and with require()
 * in the unit tests.
 */
(function (root) {
  'use strict';

  var HEX64 = /^[0-9a-f]{64}$/;
  var HEX64_ANYWHERE = /\b[0-9a-fA-F]{64}\b/g;
  var VERSION = /^[0-9A-Za-z][0-9A-Za-z.+~_-]{0,39}$/;
  var DATE = /^\d{4}-\d{2}-\d{2}$/;
  var FILE = /^[A-Za-z0-9][A-Za-z0-9._+-]{0,99}$/;
  var MAX_PASTE = 20000;
  var RESULTS = ['matches', 'differs'];
  // Verdicts of the wrapped file, as in src/verifications_common.mjs getStatusText.
  var VERDICTS = {
    reproducible: { text: 'reproducible', tone: 'good' },
    not_reproducible: { text: 'not reproducible', tone: 'bad' },
    ftbfs: { text: 'failed to build from source', tone: 'bad' },
    nosource: { text: 'source not found', tone: 'bad' },
    notag: { text: 'git revision not clear', tone: 'bad' },
    obfuscated: { text: 'source obfuscated', tone: 'bad' },
    spam: { text: 'spam', tone: 'bad' },
    warning: { text: 'warning', tone: 'warn' }
  };

  function str(v) {
    return typeof v === 'string' ? v : '';
  }

  /**
   * A check entry, or null if any field is malformed. One bad entry never takes the
   * others down, and a malformed one is dropped rather than shown.
   */
  function normalizeCheck(raw) {
    if (!raw || typeof raw !== 'object') return null;
    var commit = str(raw.commit).toLowerCase();
    var version = str(raw.version);
    var checked = str(raw.checked);
    var result = str(raw.result);
    var file = str(raw.file);
    var sha256 = str(raw.sha256).toLowerCase();
    var verdict = raw.verdict == null || raw.verdict === '' ? null : str(raw.verdict);
    if (!HEX64.test(commit) || !VERSION.test(version) || !DATE.test(checked)) return null;
    if (RESULTS.indexOf(result) < 0 || !FILE.test(file) || !HEX64.test(sha256)) return null;
    if (verdict !== null && !Object.prototype.hasOwnProperty.call(VERDICTS, verdict)) return null;
    return { commit: commit, version: version, checked: checked, result: result, file: file, sha256: sha256, verdict: verdict };
  }

  /** Valid entries, newest check first; one entry per commit (the newest check wins). */
  function normalizeChecks(list) {
    if (!Array.isArray(list)) return [];
    var seen = {};
    return list.map(normalizeCheck).filter(Boolean)
      .sort(function (a, b) { return a.checked < b.checked ? 1 : a.checked > b.checked ? -1 : 0; })
      .filter(function (c) {
        if (seen[c.commit]) return false;
        seen[c.commit] = true;
        return true;
      });
  }

  /**
   * Reads the commit (and version, if present) from a pasted `flatpak info <id>`,
   * `flatpak info --show-commit <id>` or a bare commit.
   * @returns {{ ok: true, commit: string, version: string|null } | { ok: false, error: string }}
   */
  function parseFlatpakInfo(text, expectedId) {
    var input = str(text);
    if (!input.trim()) return { ok: false, error: 'Paste the output of the command first.' };
    if (input.length > MAX_PASTE) return { ok: false, error: 'That is far longer than the output of flatpak info. Paste only that output.' };
    var lines = input.split(/\r?\n/);
    var fields = {};
    lines.forEach(function (line) {
      var m = line.match(/^\s*([A-Za-z]+):\s*(.*?)\s*$/);
      if (m && !(m[1] in fields)) fields[m[1]] = m[2];
    });
    if (fields.ID && expectedId && fields.ID !== expectedId) {
      return { ok: false, error: 'That is the output for another app. Run the command for ' + expectedId + '.' };
    }
    var commit = null;
    if ('Commit' in fields) {
      commit = fields.Commit.toLowerCase();
      if (!HEX64.test(commit)) return { ok: false, error: 'The Commit line does not hold a 64 character hex commit. Copy the whole line.' };
    } else {
      // No "Commit:" label, e.g. --show-commit output, a bare commit or a translated
      // flatpak. Only accept it if there is exactly one commit in the text, because the
      // full output also lists the parent commit.
      var all = input.match(HEX64_ANYWHERE) || [];
      if (all.length === 0) return { ok: false, error: 'No commit found. A commit is 64 characters from 0-9 and a-f.' };
      if (all.length > 1) return { ok: false, error: 'This has more than one commit in it. Paste only the line that starts with Commit:, or run flatpak info --show-commit.' };
      commit = all[0].toLowerCase();
    }
    var version = 'Version' in fields && VERSION.test(fields.Version) ? fields.Version : null;
    return { ok: true, commit: commit, version: version };
  }

  /** Headline and colour of one check. "matches" never has a colour of its own. */
  function describe(check) {
    if (check.result === 'differs') {
      return { tone: 'bad', verdictText: null, text: 'differs from ' + check.file };
    }
    var v = check.verdict ? VERDICTS[check.verdict] : null;
    return {
      tone: v ? v.tone : 'none',
      verdictText: v ? v.text : 'no verdict',
      text: 'matches ' + check.file + ', whose verdict is ' + (v ? v.text : 'no verdict')
    };
  }

  // ---- DOM ----

  function el(doc, tag, cls, text) {
    var e = doc.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function shortCommit(commit) {
    return commit.slice(0, 8);
  }

  function code(doc, text, title) {
    var c = el(doc, 'code', null, text);
    if (title) c.title = title;
    return c;
  }

  function resultLine(doc, check, storeName) {
    var d = describe(check);
    var p = el(doc, 'p', 'distribution-result distribution-tone-' + d.tone);
    p.appendChild(doc.createTextNode('WalletScrutiny checked ' + storeName + ' ' + check.version + ' (commit '));
    p.appendChild(code(doc, shortCommit(check.commit), check.commit));
    p.appendChild(doc.createTextNode(') on ' + check.checked + ': '));
    p.appendChild(el(doc, 'b', null, d.text));
    p.appendChild(doc.createTextNode('.'));
    if (check.result === 'differs') {
      p.appendChild(doc.createTextNode(' The package contains files that are not in the official file.'));
    }
    return p;
  }

  function wrappedLink(doc, check, baseurl) {
    var a = el(doc, 'a', null, check.file);
    a.href = baseurl + '/asset/?sha256=' + check.sha256;
    return a;
  }

  function historyTable(doc, checks, baseurl) {
    var table = el(doc, 'table', 'distribution-history');
    var head = table.appendChild(el(doc, 'thead')).appendChild(el(doc, 'tr'));
    ['Version', 'Commit', 'Checked', 'Result', 'Official file’s verdict'].forEach(function (h) {
      head.appendChild(el(doc, 'th', null, h));
    });
    var body = table.appendChild(el(doc, 'tbody'));
    checks.slice(0, 5).forEach(function (c) {
      var d = describe(c);
      var tr = body.appendChild(el(doc, 'tr'));
      tr.appendChild(el(doc, 'td', null, c.version));
      tr.appendChild(el(doc, 'td')).appendChild(code(doc, shortCommit(c.commit), c.commit));
      tr.appendChild(el(doc, 'td', null, c.checked));
      var res = tr.appendChild(el(doc, 'td', 'distribution-tone-' + (c.result === 'differs' ? 'bad' : 'none')));
      res.appendChild(doc.createTextNode(c.result + ' '));
      res.appendChild(wrappedLink(doc, c, baseurl));
      tr.appendChild(el(doc, 'td', 'distribution-tone-' + d.tone, c.result === 'differs' ? '–' : d.verdictText));
    });
    return table;
  }

  function lookupAnswer(doc, check, storeName, unknownCommit) {
    var box = el(doc, 'div', 'distribution-lookup-answer');
    if (!check) {
      var p = el(doc, 'p', 'distribution-result distribution-tone-none');
      p.appendChild(doc.createTextNode('Not checked by us: we have no result for commit '));
      p.appendChild(code(doc, shortCommit(unknownCommit), unknownCommit));
      p.appendChild(doc.createTextNode('. That says nothing good or bad about it. You can check it yourself with the commands below.'));
      box.appendChild(p);
      return box;
    }
    box.appendChild(resultLine(doc, check, storeName));
    return box;
  }

  /**
   * Fills one step. `container` is the .distribution-checks element; its data-* attributes
   * carry the store name, app ID and baseurl, and a JSON script child carries the checks.
   */
  function mount(container) {
    if (container.getAttribute('data-mounted')) return;
    container.setAttribute('data-mounted', '1');
    var doc = container.ownerDocument;
    var storeName = container.getAttribute('data-store') || 'the store';
    var appId = container.getAttribute('data-id') || '';
    var baseurl = container.getAttribute('data-baseurl') || '';
    var source = container.querySelector('script[type="application/json"]');
    var checks = [];
    var isSample = false;
    if (source) {
      try {
        var parsed = JSON.parse(source.textContent);
        checks = normalizeChecks(parsed.checks);
        isSample = parsed.sample === true;
      } catch (e) {
        checks = [];
      }
    }
    var step = container.closest('.step') || container.parentNode;
    var diy = step.querySelector('details.distribution-diy');
    var status = container.querySelector('.distribution-status');
    var form = container.querySelector('form.distribution-version-lookup');
    var answer = form && form.querySelector('.distribution-lookup-output');
    var error = form && form.querySelector('.distribution-lookup-error');
    var select = form && form.querySelector('select');

    function show(node) {
      answer.textContent = '';
      if (node) answer.appendChild(node);
    }

    function render() {
      status.textContent = '';
      if (isSample && checks.length) {
        status.appendChild(el(doc, 'p', 'distribution-sample-note', 'Preview: these are sample results for review, not real checks.'));
      }
      if (checks.length) {
        status.appendChild(resultLine(doc, checks[0], storeName));
        status.appendChild(el(doc, 'p', 'distribution-history-caption', 'Last checked commits:'));
        status.appendChild(historyTable(doc, checks, baseurl));
      } else {
        status.appendChild(el(doc, 'p', 'distribution-result distribution-tone-none', 'Not checked by WalletScrutiny yet.'));
      }
      if (!form) return;
      show(null);
      error.hidden = true;
      if (select) {
        var versions = [];
        checks.forEach(function (c) { if (versions.indexOf(c.version) < 0) versions.push(c.version); });
        while (select.options.length > 1) select.remove(1);
        versions.forEach(function (v) { select.appendChild(el(doc, 'option', null, v)).value = v; });
        select.closest('.distribution-version-picker').hidden = versions.length === 0;
      }
    }

    render();
    if (form) {
      form.hidden = false;
      form.noValidate = true;
      if (select) {
        select.addEventListener('change', function () {
          error.hidden = true;
          var v = select.value;
          var box = el(doc, 'div', 'distribution-lookup-answer');
          checks.filter(function (c) { return c.version === v; }).forEach(function (c) {
            box.appendChild(resultLine(doc, c, storeName));
          });
          show(v ? box : null);
        });
      }
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var r = parseFlatpakInfo(form.elements.flatpakInfo.value, appId);
        error.hidden = r.ok;
        if (!r.ok) {
          error.textContent = r.error;
          show(null);
          return;
        }
        var hit = checks.filter(function (c) { return c.commit === r.commit; })[0] || null;
        show(lookupAnswer(doc, hit, storeName, r.commit));
        if (!hit && diy) diy.open = true;
      });
    }

    // Real results: NIP-32 labels signed by the pinned key, loaded by the verifications
    // bundle (src/distribution-labels.mjs). They replace sample results when there are any.
    var pubkey = (container.getAttribute('data-label-pubkey') || '').toLowerCase();
    var channel = container.getAttribute('data-channel') || '';
    var win = doc.defaultView;
    if (!HEX64.test(pubkey) || !win) return;
    function loadLabels() {
      win.loadDistributionChecks({ pubkey: pubkey, channel: channel, id: appId }).then(function (found) {
        var real = normalizeChecks(found);
        if (!real.length) return;
        checks = real;
        isSample = false;
        render();
      }).catch(function () {});
    }
    if (typeof win.loadDistributionChecks === 'function') {
      loadLabels();
    } else {
      win.addEventListener('verificationsDataLoaded', function onLoaded() {
        win.removeEventListener('verificationsDataLoaded', onLoaded);
        if (typeof win.loadDistributionChecks === 'function') loadLabels();
      });
    }
  }

  function mountAll(doc) {
    var nodes = doc.querySelectorAll('.distribution-checks');
    for (var i = 0; i < nodes.length; i++) mount(nodes[i]);
  }

  var api = {
    normalizeCheck: normalizeCheck,
    normalizeChecks: normalizeChecks,
    parseFlatpakInfo: parseFlatpakInfo,
    describe: describe,
    mount: mount,
    mountAll: mountAll
  };
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root && root.document) {
    root.wsDistributionChecks = api;
    if (root.document.readyState === 'loading') {
      root.document.addEventListener('DOMContentLoaded', function () { mountAll(root.document); });
    } else {
      mountAll(root.document);
    }
  }
})(typeof window !== 'undefined' ? window : null);
