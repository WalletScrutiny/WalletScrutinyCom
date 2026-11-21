// The wallet page's two steps painted from the source analysis export
// (external/source_analysis/export.mjs): "Dependencies" and "Known
// vulnerabilities". Some fifty listings have an export, so the code of both
// steps is a chunk of its own, fetched once the export's index.json names the
// listing. Every other listing downloads neither the chunk nor asks for an
// app file that is not there.

// Where the export is served from: the analyser copies it to the web server
// after each pass (external/source_analysis/publish.mjs), no site build involved.
export const EXPORT_BASE = (typeof window !== 'undefined' && window.WS_SOURCE_ANALYSIS_BASE) || '/api/source-analysis';

// File name the export uses for an app id or release tag (export.mjs safeName).
export function safeName(s) {
  return String(s).replace(/[^A-Za-z0-9._+-]/g, '_').replace(/^\.+/, '_') || '_';
}

// index.json, fetched once per base: `ids` are the ids it names, the analysed
// apps and the sibling listings (`aliases`) whose stub points at one.
// `complete` says those are all the ids with a file under apps/: only an
// index a full export wrote says so (export.mjs). Not so when the index
// cannot be read, comes from an exporter that did not list the aliases yet,
// or was started anew for one app.
const indexCache = new Map();
export function exportIndex({ base = EXPORT_BASE, fetchImpl = globalThis.fetch } = {}) {
  if (!indexCache.has(base)) {
    indexCache.set(base, Promise.resolve()
      .then(() => fetchImpl(`${base}/index.json`, { headers: { Accept: 'application/json' } }))
      .then(response => (response.ok ? response.json() : null))
      .then((index) => {
        const apps = Array.isArray(index?.apps) ? index.apps : null;
        return {
          ids: new Set((apps || []).flatMap(a => [a.appId, ...(a.aliases || [])])),
          complete: Boolean(apps) && index.complete === true,
        };
      })
      .catch(() => ({ ids: new Set(), complete: false })));
  }
  return indexCache.get(base);
}

// Whether the listing has an app file. When the index cannot rule it out,
// the file itself is asked for (once per id), as every listing did before
// the index was read.
const probeCache = new Map();
export async function hasExport(appId, { base = EXPORT_BASE, fetchImpl = globalThis.fetch } = {}) {
  const { ids, complete } = await exportIndex({ base, fetchImpl });
  if (complete || ids.has(appId)) return ids.has(appId);
  const url = `${base}/apps/${safeName(appId)}.json`;
  if (!probeCache.has(url)) {
    probeCache.set(url, Promise.resolve()
      .then(() => fetchImpl(url, { headers: { Accept: 'application/json' } }))
      .then(response => response.ok, () => false));
  }
  return probeCache.get(url);
}

// The chunk with both steps, or null when it cannot be fetched (a page kept
// open across a deploy asks for a file that is gone): the steps stay hidden.
function loadSteps(load) {
  return load().catch((error) => {
    console.warn('Source analysis steps: script not reachable', error);
    return null;
  });
}

// What the step includes call (_includes/review/steps/dependencies.html and
// ownVulnerabilities.html). Both resolve to null without painting when the
// listing has no export.
export async function renderDependenciesPanel(options = {}) {
  if (!options.host || !options.appId || !(await hasExport(options.appId, options))) return null;
  const panel = await loadSteps(() => import(/* webpackChunkName: "dependencies-panel" */ './dependencies-panel.mjs'));
  return panel ? panel.renderDependenciesPanel(options) : null;
}

export async function renderOwnVulnerabilities(options = {}) {
  if (!options.host || !options.appId || !(await hasExport(options.appId, options))) return null;
  const step = await loadSteps(() => import(/* webpackChunkName: "dependencies-panel" */ './own-vulnerabilities.mjs'));
  return step ? step.renderOwnVulnerabilities(options) : null;
}

if (typeof window !== 'undefined') {
  window.renderDependenciesPanel = renderDependenciesPanel;
  window.renderOwnVulnerabilities = renderOwnVulnerabilities;
}
