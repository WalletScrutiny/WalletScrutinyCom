// Shared test setup. Each test file imports this first so any future
// before-everything hooks land in a single place. Logger silencing is handled
// inside logger.mjs based on the BUILD_SERVER_TEST=1 env var that the npm test
// script sets, so we don't have to monkey-patch winston here.
