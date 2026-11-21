import { test, expect } from './relay-fixture.mjs';

import { injectNip07Signer, waitForVerificationsUi } from './helpers.mjs';

// The source analysis export is not part of the e2e build: these routes stand
// in for /api/source-analysis/. Every other file under it is a 404.
const APP = {
  schema: 1,
  appId: 'app.zeusln.zeus',
  aliases: [{ appId: 'app.zeusln.zeus', platform: 'android' }],
  releases: [{
    kind: 'release', ref: 'v0.0.1-e2e', commit: 'a1b2c3d4', analysedAt: '2026-10-01 00:00:00', status: 'ok',
    lockfiles: ['package-lock.json'],
    osv: { checked: 2, skipped: {} },
    dependencies: { total: 2, direct: 1, dev: 0, devUnknown: 0, byScope: { app: 2, build: 0, tests: 0, unknown: 0 }, byEcosystem: { npm: 2 }, tiers: {}, lockfiles: ['package-lock.json'] },
    vulnerabilities: { total: 1, bySeverity: { malicious: 0, critical: 0, high: 1, moderate: 0, low: 0, unknown: 0 }, packages: 1, byScope: { app: 1, build: 0, tests: 0, unknown: 0 } },
    advisories: [{ id: 'GHSA-e2e', severity: 'high', aliases: [], fixed: [], summary: '', ecosystem: 'npm', package: 'pkg', version: '1.0.0', direct: true, dev: false }],
  }],
  defaultBranch: null,
};

async function serveExport(page, index, app = APP) {
  const asked = [];
  page.on('request', (request) => {
    const path = new URL(request.url()).pathname;
    if (/\/dist\/dependencies-panel\.|\/assets\/css\/dependencies-steps\.css|\/api\/source-analysis\/apps\//.test(path)) asked.push(path);
  });
  await page.route('**/api/source-analysis/**', (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith('/index.json')) return route.fulfill({ json: index });
    if (path.endsWith('/apps/app.zeusln.zeus.json')) return route.fulfill({ json: app });
    return route.fulfill({ status: 404, body: 'not found' });
  });
  return asked;
}

test.describe('Dependencies panel', () => {
  test('a listing the export names fetches the panel and its styles and paints it', async ({ page }) => {
    const asked = await serveExport(page, { schema: 1, complete: true, apps: [{ appId: 'app.zeusln.zeus', aliases: [] }] });
    await page.goto('/mobile/app.zeusln.zeus/');

    const panel = page.locator('#dependencies-android');
    await expect(panel).toBeVisible({ timeout: 60_000 });
    // "Every version" shows the newest verified version, which the export
    // does not have. Its one release got a stone there: picking it from the
    // panel shows the release.
    await panel.locator('.dp-pick-version').click();
    await expect(panel).toContainText('Checked release v0.0.1-e2e');
    await expect(page.locator('#dependencies-iphone')).toBeHidden();
    expect(asked.filter(path => path.includes('/dist/dependencies-panel.'))).toHaveLength(1);
    // styled by the stylesheet linked with the chunk
    expect(asked.filter(path => path.endsWith('/dependencies-steps.css'))).toHaveLength(1);
    await expect(panel.locator('.dp-panel')).toHaveCSS('border-radius', '14px');
    expect(asked).not.toContain('/api/source-analysis/apps/com.zeusln.zeus.json');
  });

  test('a listing the export does not name fetches no panel, styles or app file', async ({ page }) => {
    const asked = await serveExport(page, { schema: 1, complete: true, apps: [] });
    await page.goto('/mobile/app.zeusln.zeus/');
    await waitForVerificationsUi(page);

    const painted = await page.evaluate(() => window.renderDependenciesPanel({
      host: document.getElementById('dependencies-android'), appId: 'app.zeusln.zeus', platform: 'android',
    }));
    expect(painted).toBeNull();
    await expect(page.locator('.dependencies-step').first()).toBeHidden();
    expect(asked).toEqual([]);
  });

  test('the statement dialog offers "every wallet" only for a library in this wallet', async ({ page }) => {
    await injectNip07Signer(page);
    const release = APP.releases[0];
    const advisory = { ...release.advisories[0], dependants: ['lib'] };
    await serveExport(page, { schema: 1, complete: true, apps: [{ appId: 'app.zeusln.zeus', aliases: [] }] }, { ...APP, releases: [{ ...release, advisories: [advisory] }] });
    await page.goto('/mobile/app.zeusln.zeus/');

    const panel = page.locator('#dependencies-android');
    await expect(panel).toBeVisible({ timeout: 60_000 });
    await panel.locator('.dp-pick-version').click();
    const judge = panel.locator('.dp-judge');
    await expect(judge).toBeAttached();
    if (!(await judge.isVisible())) await panel.locator('.dp-details-link').click();
    await judge.click();

    const dialog = page.locator('.dp-dialog');
    const everywhere = dialog.locator('.dp-form__everywhere');
    // opens on the wallet's own use of the package: the form hides the box,
    // and the dialog's label styles must not bring it back
    await expect(dialog.locator('input[name="subject"][value="app:app.zeusln.zeus"]')).toBeChecked();
    await expect(everywhere).toBeHidden();
    await dialog.locator('input[name="subject"][value="via:npm:lib"]').check();
    await expect(everywhere).toBeVisible();
    await expect(everywhere).toContainText('I maintain lib');
    await dialog.locator('input[name="subject"][value="package"]').check();
    await expect(everywhere).toBeHidden();
    await expect(dialog.locator('.dp-form [hidden]:visible')).toHaveCount(0);
  });
});
