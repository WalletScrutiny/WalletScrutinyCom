function isDebugEnv() {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.location.hostname.includes('localhost') || window.location.hostname.includes('beta') || window.location.hostname.includes('old');
}

const userHasBrowserExtension = function() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    
    if (window.nostr) {
      resolve(true);
      return;
    }

    // Retry system: 125 attempts, 25ms per attempt
    // The nostr extension is not available until the dom is fully loaded, but
    // we start doing stuff way before that (if the user has a slow connection).
    // That's why we need to start checking soon, but continue checking for a while.
    // We cannot wait too long, though, as the user may not have a Nostr browser
    // extension installed.
    let attempts = 0;
    const maxAttempts = 125;
    const retryDelay = 25;

    const checkExtension = () => {
      attempts++;
      
      if (window.nostr) {
        console.debug("Browser extension found on attempt:", attempts);
        resolve(true);
        return;
      }
      
      if (attempts >= maxAttempts) {
        console.debug("Browser extension not found after", maxAttempts, "attempts");
        resolve(false);
        return;
      }
      
      // Schedule next attempt
      setTimeout(checkExtension, retryDelay);
    };

    // Start the retry process
    setTimeout(checkExtension, retryDelay);
  });
}

export {
  isDebugEnv,
  userHasBrowserExtension
};

if (typeof window !== 'undefined') {
  window.userHasBrowserExtension = userHasBrowserExtension;
}