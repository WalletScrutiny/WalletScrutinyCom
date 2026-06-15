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

export {
  isDebugEnv,
  getFirstTagValue,
};

if (typeof window !== 'undefined') {
  window.getFirstTagValue = getFirstTagValue;
}