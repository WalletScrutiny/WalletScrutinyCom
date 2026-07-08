---
layout: null
permalink: /allWallets.js
---

(() => {
  function expandScore(score) {
    if (!score) return undefined;
    if (Array.isArray(score)) {
      return { numerator: score[0], denominator: score[1] };
    }
    return score;
  }

  function walletUrl(folder, appId) {
    return folder === 'mobile' ? `/mobile/${appId}/` : `/${folder}/${appId}/`;
  }

  function normalizeArchivedWallet(wallet, folder, featureAlerts) {
    const w = {
      ...wallet,
      folder,
      archived: true,
      meta: wallet.meta || 'ok',
      url: wallet.url || walletUrl(folder, wallet.appId),
      iconFolder: wallet.iconFolder || folder,
      features: wallet.features || [],
    };
    w.alertFeatures = w.features.filter((feature) => featureAlerts[feature]);
    if (folder === 'mobile') {
      w.storePlatform = wallet.storePlatform || 'android';
      w.iconFolder = wallet.iconFolder || w.storePlatform;
      w.hasAndroid = Boolean(wallet.androidAppId);
      w.hasIphone = Boolean(wallet.iphoneAppId || (w.storePlatform === 'iphone' && wallet.storeAppId));
    }
    return w;
  }

  function normalizeWallet(wallet, folder, category, featureAlerts) {
    const w = { ...wallet };
    w.score = expandScore(wallet.score);
    w.scoreAndroid = expandScore(wallet.scoreAndroid);
    w.scoreIphone = expandScore(wallet.scoreIphone);
    w.meta = wallet.meta || 'ok';
    w.url = wallet.url || walletUrl(folder, wallet.appId);
    w.features = wallet.features || [];
    w.alertFeatures = w.features.filter((feature) => featureAlerts[feature]);
    w.category = category;
    w.folder = folder;
    w.iconFolder = wallet.iconFolder || folder;
    if (folder === 'mobile') {
      w.metaAndroid = wallet.metaAndroid || 'ok';
      w.metaIphone = wallet.metaIphone || 'ok';
      w.storePlatform = wallet.storePlatform || 'android';
      w.iconFolder = wallet.iconFolder || w.storePlatform;
      w.users = wallet.users || 0;
      w.reviews = wallet.reviews || 0;
      w.hasAndroid = Boolean(wallet.androidAppId);
      w.hasIphone = Boolean(wallet.iphoneAppId || (w.storePlatform === 'iphone' && wallet.storeAppId));
    }
    return w;
  }

  const wallets = [];
  const data = {% include allProducts.json %};
  const archivedData = {% include allArchivedProducts.json %};
  const opinions = {% include allOpinions.json %};
  const featureAlerts = data.featureAlerts || {};
  window.verdicts = data.verdicts;
  window.featureAlerts = featureAlerts;
  window.featureAlertMessages = data.featureAlertMessages || {};
  const folders = ["hardware", "mobile", "bearer", "desktop", "others"];
  // Active listings use `mobile`; archived store listings still live under
  // _archived/android, _archived/iphone, and (new) _archived/mobile.
  const archivedKeysByFolder = {
    mobile: ["mobile", "android", "iphone"],
    hardware: ["hardware"],
    bearer: ["bearer"],
    desktop: ["desktop"],
    others: ["others"],
  };
  folders.forEach(folder => {
    const folderData = data[folder];
    const category = folderData.category;
    const apps = folderData.apps;
    apps.forEach(raw => {
      const w = normalizeWallet(raw, folder, category, featureAlerts);
      w.opinion = opinions[`${folder}/${w.appId}`];
      wallets.push(w);
    });
  });
  folders.forEach(folder => {
    const archivedKeys = archivedKeysByFolder[folder] || [folder];
    for (const archivedKey of archivedKeys) {
      const archivedFolderData = archivedData[archivedKey];
      if (!archivedFolderData || !archivedFolderData.apps) {
        continue;
      }
      archivedFolderData.apps.forEach(raw => {
        wallets.push(normalizeArchivedWallet(raw, archivedKey, featureAlerts));
      });
    }
  });
  window.wallets = wallets;
  if (typeof window.versionTag === 'function') {
    window.versionTag();
  }
})();
