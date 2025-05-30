function isDebugEnv() {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.location.hostname.includes('localhost') || window.location.hostname.includes('beta') || window.location.hostname.includes('old');
}

export {
  isDebugEnv
};
