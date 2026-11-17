// Release days from the forge for tags without dated GitHub release files
// (releaseDates.mjs), against a stubbed fetch.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { initDatabase, saveAppList, recordAnalysis } from '../ddbbUtils.mjs';
import { forgeOf, undatedReleases, fillReleaseDates } from '../releaseDates.mjs';

const json = (status, body) => ({ status, ok: status >= 200 && status < 300, json: async () => body });

function seeded() {
  const db = initDatabase(':memory:');
  saveAppList(db, [
    { appId: 'core', platform: 'desktop', repository: 'https://github.com/bitcoin/bitcoin' },
    { appId: 'gl', platform: 'android', repository: 'https://gitlab.com/org/app.git' },
    { appId: 'self', platform: 'android', repository: 'https://git.example.org/app' },
  ]);
  const analysed = (appId, ref) => recordAnalysis(db, { appId, kind: 'release', ref, status: 'ok', analyser: 't' });
  for (const [appId, ref] of [['core', 'v32.1'], ['core', 'v31.0'], ['core', 'v-gone'], ['core', 'v-dated'], ['gl', 'v1.0'], ['self', 'v9']]) analysed(appId, ref);
  db.prepare("INSERT INTO assets (app_id, source, version, asset_name, sha256, published_at) VALUES ('core', 'github', 'v-dated', 'x.tgz', 'h', '2026-01-01T00:00:00Z')").run();
  return db;
}

test('forgeOf reads GitHub and GitLab repository URLs only', () => {
  assert.deepEqual(forgeOf('https://github.com/bitcoin/bitcoin'), { host: 'github', path: 'bitcoin/bitcoin' });
  assert.deepEqual(forgeOf('https://gitlab.com/org/app.git'), { host: 'gitlab', path: 'org/app' });
  assert.equal(forgeOf('https://git.example.org/app'), null);
});

test('fillReleaseDates asks once per undated ref, stores unknown refs without a date and retries failures', async () => {
  const db = seeded();
  assert.deepEqual(undatedReleases(db).map(r => `${r.appId} ${r.ref}`), ['core v-gone', 'core v31.0', 'core v32.1', 'gl v1.0', 'self v9']);
  const asked = [];
  const fetchImpl = async (url, { headers }) => {
    asked.push(url);
    if (url.includes('v32.1')) { assert.equal(headers.Authorization, 'token t0k'); return json(200, { commit: { committer: { date: '2026-10-26T17:57:47Z' } } }); }
    if (url.includes('v-gone')) return json(422, { message: 'No commit found' });
    if (url.includes('v31.0')) return json(403, { message: 'rate limit' });
    if (url.startsWith('https://gitlab.com/api/v4/projects/org%2Fapp/repository/commits/v1.0')) return json(200, { committed_date: '2026-05-01T10:00:00.000+02:00' });
    throw new Error(`unexpected ${url}`);
  };
  const log = { warn: () => {} };
  assert.deepEqual(await fillReleaseDates(db, { fetchImpl, githubToken: 't0k', log }), { looked: 4, dated: 2, failed: 1 });
  assert.deepEqual(db.prepare('SELECT app_id, ref, released_at FROM release_dates ORDER BY app_id, ref').all().map(r => [r.app_id, r.ref, r.released_at]),
    [['core', 'v-gone', null], ['core', 'v32.1', '2026-10-26'], ['gl', 'v1.0', '2026-05-01']]);
  asked.length = 0;
  await fillReleaseDates(db, { fetchImpl, githubToken: 't0k', log });
  assert.deepEqual(asked, ['https://api.github.com/repos/bitcoin/bitcoin/commits/v31.0']);
});
