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
    const archivedFolderData = archivedData[folder];
    if (archivedFolderData && archivedFolderData.apps) {
      const apps = archivedFolderData.apps;
      apps.forEach(w => {
        w.folder = folder;
        w.archived = true;
        wallets.push(w);
      });
    }
  });
  window.wallets = wallets;
  window.versionTag();
})();
