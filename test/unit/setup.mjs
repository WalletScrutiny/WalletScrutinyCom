// Shared setup for main-app unit tests (Node built-in test runner).

import { parseHTML } from 'linkedom';

const { window: domWindow, document } = parseHTML('<!DOCTYPE html><html><body></body></html>');

globalThis.document = document;
globalThis.window = domWindow;
globalThis.HTMLElement = domWindow.HTMLElement;
globalThis.Node = domWindow.Node;
globalThis.DocumentFragment = domWindow.DocumentFragment;

const navigatorStub = globalThis.navigator?.language
  ? globalThis.navigator
  : { language: 'en-US' };

try {
  Object.defineProperty(domWindow, 'navigator', {
    value: navigatorStub,
    configurable: true,
  });
} catch {
  // linkedom may already expose a non-configurable navigator
}

if (!globalThis.navigator?.language) {
  Object.defineProperty(globalThis, 'navigator', {
    value: navigatorStub,
    configurable: true,
    writable: true,
  });
}

domWindow.location = {
  search: '',
  hash: '',
  pathname: '/',
  hostname: 'walletscrutiny.com',
  protocol: 'https:',
};

globalThis.location = domWindow.location;

if (typeof domWindow.addEventListener !== 'function') {
  domWindow.addEventListener = () => {};
  domWindow.removeEventListener = () => {};
  domWindow.dispatchEvent = () => true;
}
