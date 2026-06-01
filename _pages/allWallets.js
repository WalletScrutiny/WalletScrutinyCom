---
layout: null
permalink: /allWallets.js
---

(() => {
  const wallets = [];
  const data = {% include allProducts.json %};
  const archivedData = {% include allArchivedProducts.json %};
  const opinions = {% include allOpinions.json %};
  window.verdicts = data.verdicts;
  window.featureAlerts = data.featureAlerts || {};
  window.featureAlertMessages = data.featureAlertMessages || {};
  window.featureShorts = data.featureShorts || {};
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
    apps.forEach(w => {
      w.opinion = opinions[`${folder}/${w.appId}`];
      w.category = category;
      w.folder = folder;
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
      archivedFolderData.apps.forEach(w => {
        w.folder = archivedKey;
        w.archived = true;
        wallets.push(w);
      });
    }
  });
  window.wallets = wallets;
  window.versionTag();
})();
