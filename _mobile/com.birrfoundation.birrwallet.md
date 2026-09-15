---
title: BirrOS
date: 2026-09-15
website: https://birr.foundation
redirect_from:
- /android/com.birrfoundation.birrwallet/
- /iphone/com.birrfoundation.birrnetwork/
- /mobile/com.birrfoundation.birrnetwork/
android:
  appId: com.birrfoundation.birrwallet
  users: 100
  appCountry: us
  released: 2026-07-10
  updated: 2026-09-09
  version: 2.5.3
  icon: com.birrfoundation.birrwallet.png
  meta: fewusers
  verdict: wip
  developerName: Birrfoundation
iphone:
  appId: com.birrfoundation.birrnetwork
  idd: '6757838434'
  appCountry: us
  released: 2026-06-05
  updated: 2026-09-11
  version: 2.5.4
  reviews: 2
  icon: com.birrfoundation.birrnetwork.jpg
  meta: ok
  verdict: wip
  developerName: Ermiyas Asfaw

---

{% include review/externalResearchAlert.html url="https://kek.lol/research/appstore-wallets/#app-6757838434" author="overtorment" severity="critical" finding="Base64 labeled encryptedMnemonic is uploaded on 2FA and Settings. The recover API returns the phrase in plaintext." %}
