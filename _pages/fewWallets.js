---
layout: null
permalink: /fewWallets.js
---

(() => {
  const wallets = [];
  const data = {% include fewProducts.json %};
  const opinions = {% include allOpinions.json %};
  window.verdicts = data.verdicts;
  const folders = ["hardware", "android", "iphone", "bearer", "desktop", "others"];
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
  window.wallets = window.wallets || wallets;
})();
