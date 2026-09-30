// Page bootstrap: preloads and appends the webpack bundles in the order the
// site needs them. The per-page values (bundle URLs with their content hashes
// and which UI to load) come from the small inline object that
// src/templates/scripts.html emits as window.wsLoader; everything else lives
// here so browsers cache it once instead of parsing it inline on every page.
const {
  domSanitizationSrc,
  verificationsDataSrc,
  verificationsUiSrc,
  shareUiSrc,
  loadVerificationsUi,
  loadShareUi,
  deferSiteWideLoad,
} = window.wsLoader;

function preloadScript(href) {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'script';
  link.href = href;
  document.head.appendChild(link);
}

preloadScript(domSanitizationSrc);
preloadScript(verificationsDataSrc);

function appendScript(src, onload) {
  const script = document.createElement('script');
  if (onload) {
    script.onload = onload;
  }
  script.src = src;
  document.body.appendChild(script);
  return script;
}

if (loadVerificationsUi) {
  const verificationsUiPreload = document.createElement('link');
  verificationsUiPreload.rel = 'preload';
  verificationsUiPreload.as = 'script';
  verificationsUiPreload.href = verificationsUiSrc;
  document.head.appendChild(verificationsUiPreload);
}

const startVerificationsData = () => {
  window.dispatchEvent(new CustomEvent("verificationsDataLoaded"));

  (async function() {
    const ndkConnectPromise = nostrConnect();

    if (deferSiteWideLoad) {
      // Wallet pages paint their own table first. The site-wide load below
      // pulls thousands of events and verifies their signatures on the main
      // thread, which would delay that table and the verification modal.
      await new Promise((resolve) => {
        const timer = setTimeout(resolve, 4000);
        window.addEventListener('assetsTableLoaded', () => {
          clearTimeout(timer);
          resolve();
        }, { once: true });
      });
    }

    window.allAssetInformation = await getAllAssetInformation({
      onCachedDataLoaded: (cachedData) => {
        console.log('Cached data loaded immediately!', cachedData);
        window.allAssetInformation = cachedData;
        window.dispatchEvent(new CustomEvent("allAssetInformationLoaded"));
      }
    });

    await ndkConnectPromise.catch(() => {});

    window.dispatchEvent(new CustomEvent("allAssetInformationLoaded"));
    loadDraftVerificationsNotifications();

    setTimeout(() => {
      backgroundSyncEvents();
    }, 7000);
  })();

  const onUiLoaded = () => {
    window.dispatchEvent(new CustomEvent("verificationsUILoaded"));
  };

  if (loadVerificationsUi) {
    appendScript(verificationsUiSrc, onUiLoaded);
  } else if (loadShareUi) {
    appendScript(shareUiSrc, onUiLoaded);
  }
};

appendScript(domSanitizationSrc, () => {
  appendScript(verificationsDataSrc, startVerificationsData);
});
