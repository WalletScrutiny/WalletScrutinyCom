// The plugins: one file each in plugins/, run in the order and with the
// switches of PLUGINS in config.mjs, container steps before host steps, and a
// configuration that cannot work refused at startup.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { loadPlugins, runPlugins, PLUGINS_DIR } from '../plugins.mjs';
import { PLUGINS } from '../config.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const tmp = (p) => fs.mkdtempSync(path.join(os.tmpdir(), p));

// A plugins dir with the given files: name -> source of the default export.
function pluginDir(plugins) {
  const dir = tmp('sa-plugins-');
  for (const [name, body] of Object.entries(plugins)) {
    fs.writeFileSync(path.join(dir, `${name}.mjs`), `export default ${body};\n`);
  }
  return dir;
}

test('the shipped configuration: every plugin file listed, the enabled ones load in order', async () => {
  const files = fs.readdirSync(PLUGINS_DIR).map(f => f.replace(/\.mjs$/, '')).sort();
  assert.deepEqual(Object.keys(PLUGINS).sort(), files);
  const plugins = await loadPlugins();
  assert.deepEqual(plugins.map(p => p.name), Object.keys(PLUGINS).filter(n => PLUGINS[n]));
  assert.deepEqual(plugins.map(p => p.name), ['pinning', 'gradle-resolution', 'osv'], 'the default run is unchanged: dependencies and OSV only');
});

test('every plugin loads when enabled, and none pulls the database module into the container', () => {
  // Each one is imported in a fresh process with all switches on; better-sqlite3
  // is native and must stay out of what the container loads.
  const trace = execFileSync('node', ['--input-type=module', '-e',
    `const { default: Module } = await import('module');
     const seen = [];
     const orig = Module._load;
     Module._load = function (req, ...rest) { seen.push(req); return orig.call(this, req, ...rest); };
     const { loadPlugins } = await import('${path.join(here, '..', 'plugins.mjs')}');
     const { PLUGINS } = await import('${path.join(here, '..', 'config.mjs')}');
     const all = Object.fromEntries(Object.keys(PLUGINS).map(n => [n, true]));
     const plugins = await loadPlugins(all);
     console.log(JSON.stringify({ names: plugins.map(p => p.name), seen }));`],
    { encoding: 'utf8', cwd: path.join(here, '..') });
  const { names, seen } = JSON.parse(trace.trim().split('\n').pop());
  assert.deepEqual(names, Object.keys(PLUGINS));
  assert.ok(!seen.includes('better-sqlite3'), `better-sqlite3 loaded: ${seen}`);
});

test('loadPlugins: disabled plugins are not loaded, order follows the configuration', async () => {
  const dir = pluginDir({
    a: `{ container: () => 'a' }`,
    b: `{ container: () => 'b' }`,
    c: `{ host: () => 'c' }`,
  });
  assert.deepEqual((await loadPlugins({ c: true, b: false, a: true }, dir)).map(p => p.name), ['c', 'a']);
});

test('loadPlugins: refuses a listed plugin without a file and a file that is not listed', async () => {
  const dir = pluginDir({ a: `{ container: () => 1 }`, stray: `{ container: () => 1 }` });
  await assert.rejects(loadPlugins({ a: true, typo: false }, dir), (e) =>
    /'typo' is in PLUGINS but there is no plugins\/typo\.mjs/.test(e.message) &&
    /plugins\/stray\.mjs is not in PLUGINS/.test(e.message));
});

test('loadPlugins: a plugin must come after the plugins it requires, and they must be on', async () => {
  const dir = pluginDir({ base: `{ container: () => 1 }`, user: `{ requires: ['base'], host: () => 1 }` });
  assert.deepEqual((await loadPlugins({ base: true, user: true }, dir)).map(p => p.name), ['base', 'user']);
  await assert.rejects(loadPlugins({ user: true, base: true }, dir), /'user' requires 'base'/);
  await assert.rejects(loadPlugins({ base: false, user: true }, dir), /'user' requires 'base'/);
});

test('loadPlugins: a file that exports no step is refused', async () => {
  const dir = pluginDir({ empty: `{ description: 'nothing' }` });
  await assert.rejects(loadPlugins({ empty: true }, dir), /exports neither container\(\) nor host\(\)/);
});

test('runPlugins: results flow from the container steps to the host steps, in order', async () => {
  const calls = [];
  const plugins = [
    { name: 'deps', container: () => { calls.push('deps:c'); return ['x']; }, host: ({ results }) => { calls.push(`deps:h:${results.deps}`); } },
    { name: 'vulns', requires: ['deps'], host: ({ results }) => { calls.push('vulns:h'); return results.deps.length; } },
    { name: 'scan', container: () => { calls.push('scan:c'); } },
  ];
  const ctx = await runPlugins(plugins, 'container', { appType: 'npm' });
  // What crosses the container boundary is JSON.
  const back = JSON.parse(JSON.stringify({ results: ctx.results, failed: ctx.failed }));
  await runPlugins(plugins, 'host', { appType: 'npm', ...back });
  assert.deepEqual(calls, ['deps:c', 'scan:c', 'deps:h:x', 'vulns:h']);
  assert.deepEqual(back.results, { deps: ['x'], vulns: 1 });
  assert.deepEqual(back.failed, []);
});

test('runPlugins: a failing plugin is recorded, its dependants and its own host step are skipped, the rest runs', async () => {
  const calls = [];
  const plugins = [
    { name: 'deps', container: () => { throw new Error('boom'); }, host: () => { calls.push('deps:h'); } },
    { name: 'vulns', requires: ['deps'], host: () => { calls.push('vulns:h'); } },
    { name: 'scan', container: () => { calls.push('scan:c'); }, host: () => { calls.push('scan:h'); } },
  ];
  const ctx = await runPlugins(plugins, 'container', { appType: 'npm' });
  await runPlugins(plugins, 'host', ctx);
  assert.deepEqual(calls, ['scan:c', 'scan:h']);
  assert.deepEqual(ctx.failed.map(f => f.plugin), ['deps', 'vulns']);
  assert.equal(ctx.failed[0].error, 'boom');
});

test('runPlugins: plugins that need an ecosystem are skipped for an unknown app type', async () => {
  const calls = [];
  const plugins = [
    { name: 'install', needsKnownAppType: true, container: () => { calls.push('install'); } },
    { name: 'files', container: () => { calls.push('files'); } },
  ];
  await runPlugins(plugins, 'container', { appType: 'unknown' });
  assert.deepEqual(calls, ['files']);
});

// runSourceCodeAnalysis with a stub docker that leaves a result.json: the host
// steps of the shipped plugins run on it (osv: no checkable row, so no network).
function analyseWithStubResult(containerResult) {
  const dir = tmp('sa-host-');
  const cli = path.join(dir, 'docker');
  fs.writeFileSync(path.join(dir, 'result.json'), JSON.stringify(containerResult));
  fs.writeFileSync(cli, `#!/usr/bin/env bash
[ "$1" = run ] || exit 0
for a in "$@"; do case "$a" in *:/work:rw) cp "${dir}/result.json" "\${a%:/work:rw}/result.json";; esac; done
`);
  fs.chmodSync(cli, 0o755);
  const out = execFileSync('node', ['--input-type=module', '-e',
    `const { runSourceCodeAnalysis } = await import('${path.join(here, '..', 'appAnalysis.mjs')}');
     const { initDatabase } = await import('${path.join(here, '..', 'ddbbUtils.mjs')}');
     const db = initDatabase(':memory:');
     const result = await runSourceCodeAnalysis({ name: 'app', repoUrl: 'https://github.com/o/r', version: 'v1', db });
     console.log('RESULT ' + JSON.stringify(result));`],
    { encoding: 'utf8', cwd: path.join(here, '..'), env: {
      ...process.env, SOURCE_ANALYSIS_CONTAINER_CLI: cli, SOURCE_ANALYSIS_TEMP_DIR: path.join(dir, 'temp'),
      SOURCE_ANALYSIS_CACHE_DIR: path.join(dir, 'cache'),
    } });
  return JSON.parse(out.split('\n').find(l => l.startsWith('RESULT ')).slice(7));
}

test('runSourceCodeAnalysis: the host steps run on the container results', () => {
  const result = analyseWithStubResult({ ok: true, commit: 'c'.repeat(40), appType: 'npm', results: { pinning: [] }, failed: [] });
  assert.equal(result.commit, 'c'.repeat(40));
  assert.deepEqual(result.results.pinning, []);
  assert.equal(result.results.osv.checked, 0, 'osv ran on the host');
});

test('runSourceCodeAnalysis: a plugin that failed in the container fails the analysis', () => {
  const result = analyseWithStubResult({ ok: true, commit: 'c'.repeat(40), appType: 'npm', results: {}, failed: [{ plugin: 'pinning', error: 'boom' }] });
  assert.equal(result, null);
});
