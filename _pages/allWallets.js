---
layout: compress
permalink: /allWallets.js
---

(() => {
  window.wallets = []
  const data = {% include allAppList.html %}
  const opinions = {% include allOpinions.html %}
  window.verdicts = data.verdicts
  const folders = ["hardware", "android", "iphone", "bearer"]
  folders.forEach(folder => {
    const folderData = data[folder]
    const category = folderData.category
    const apps = folderData.apps
    apps.forEach(w => {
      w.opinion = opinions[w.url]
      w.category = category
      w.folder = folder
      window.wallets.push(w)
    })
  })
})()
