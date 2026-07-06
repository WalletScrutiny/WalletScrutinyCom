// Shared setup for main-app unit tests (Node built-in test runner).

if (!globalThis.navigator?.language) {
  Object.defineProperty(globalThis, 'navigator', {
    value: { language: 'en-US' },
    configurable: true,
    writable: true,
  });
}

if (!globalThis.window) {
  globalThis.window = globalThis;
}

if (!globalThis.window.location) {
  globalThis.window.location = {
    search: '',
    hash: '',
    pathname: '/',
    hostname: 'walletscrutiny.com',
    protocol: 'https:',
  };
}

globalThis.location = globalThis.window.location;

if (typeof globalThis.window.addEventListener !== 'function') {
  globalThis.window.addEventListener = () => {};
  globalThis.window.removeEventListener = () => {};
  globalThis.window.dispatchEvent = () => true;
}
