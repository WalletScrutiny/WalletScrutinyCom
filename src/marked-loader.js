let markedPromise;

export function prefetchMarked() {
  void getMarked();
}

export function getMarked() {
  markedPromise ??= import('marked').then((module) => module.marked ?? module.default);
  return markedPromise;
}

if (typeof window !== 'undefined') {
  window.prefetchMarked = prefetchMarked;
}
