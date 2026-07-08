# Tests

These tests run automatically in the GitLab CI pipeline on merge requests and on the default branch. You can also run them locally as explained below.

This directory contains the main application test suites:

- `unit/` — unit tests (Node.js built-in test runner)
- `e2e/` — end-to-end tests (Playwright)

Other packages in this repository (for example `external/build_server/` and `external/ws_notifications/`) keep their own `test/` folders and are run from those directories.

## Prerequisites

From the repository root:

```bash
npm ci
npm run playwright:install   # required once for e2e tests
```

E2E tests start a local server automatically via Playwright (`scripts/e2e-server.mjs`). No manual build is required before running them.

## Run all tests

There is no single npm script that runs both suites. Run them sequentially:

```bash
npm test && npm run test:e2e
```

## Run unit tests

```bash
npm test
```

## Run e2e tests

```bash
npm run test:e2e
```

Interactive UI mode:

```bash
npm run test:e2e:ui
```

## Run a specific test

### Unit test

Pass the file path to Node's test runner:

```bash
node --test --test-reporter=spec test/unit/assets-table-hash.test.mjs
```

### E2E test

Pass the spec file path to Playwright:

```bash
npx playwright test test/e2e/zeus-verification.spec.mjs
```

You can also filter by test title:

```bash
npx playwright test test/e2e/zeus-verification.spec.mjs -g "Test endorsement modal"
```

Or match a title fragment across all e2e specs:

```bash
npx playwright test -g "Homepage drop area"
```
