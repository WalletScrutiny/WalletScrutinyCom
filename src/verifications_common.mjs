function isDebugEnv() {
  if (typeof window === 'undefined') {
    return false;
  }
  if (new URLSearchParams(window.location.search).get('forceProd') === 'true') {
    return false;
  }
  return window.location.hostname.includes('localhost') || window.location.hostname.includes('beta') || window.location.hostname.includes('old');
}

function getFirstTagValue(event, tagName, valueIfNull = '') {
  return event.tags.find(tag => tag[0] === tagName)?.[1] ?? valueIfNull;
}

function getStatusText(status, short = false) {
  switch (status) {
    case 'reproducible':
      return 'Reproducible when tested';
    case 'not_reproducible':
      return short ? 'Not reproducible' : 'Not reproducible from source provided, or differences are significant';
    case 'ftbfs':
      return short ? 'Failed to build from source' : 'Failed to build from source provided';
    case 'spam':
      return short ? 'Spam' : 'The application is spam';
    case 'notag':
      return short ? 'Git revision not clear' : 'The git revision to compile is not clear';
    case 'nosource':
      return short ? 'Source not found' : 'Source for this version was not found or repository was taken down';
    case 'obfuscated':
      return short ? 'Source obfuscated' : 'Source code is obfuscated';
    case 'warning':
      return 'Warning';
    default:
      return status;
  }
}

export {
  isDebugEnv,
  getFirstTagValue,
  getStatusText,
};

if (typeof window !== 'undefined') {
  window.getFirstTagValue = getFirstTagValue;
  window.getStatusText = getStatusText;
}