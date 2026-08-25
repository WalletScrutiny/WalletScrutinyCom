---
title: ZMEX
date: 2026-07-24
website: https://www.zmexglobal.com/
appCountry: us
redirect_from:
- /android/co.zmex.app/
- /iphone/com.zmexglobal.app/
- /mobile/com.zmexglobal.app/
android:
  appId: co.zmex.app
  users: 1000
  appCountry: us
  released: 2026-07-10
  updated: 2026-08-13
  version: 3.11.20
  icon: co.zmex.app.png
  meta: ok
  verdict: custodial
  developerName: Zoomex
iphone:
  appId: com.zmexglobal.app
  idd: '6711352543'
  appCountry: us
  released: 2024-10-28
  updated: 2026-08-16
  version: 3.11.20
  reviews: 61
  icon: com.zmexglobal.app.jpg
  meta: ok
  verdict: custodial
  developerName: zmex fintech limited

---

## App Description

ZMEX is a cryptocurrency trading app published by zmex fintech limited, listed on the App Store as `com.zmexglobal.app` and on Google Play under the separate identifier `co.zmex.app` (whose Play developer is listed as *Zoomex*). Its store listings describe spot trading and perpetual-contract (derivatives) trading with leverage, covering Bitcoin, Ethereum and several hundred other cryptocurrencies, together with copy trading and buying crypto by credit or debit card. The provider describes security measures including a multi-signature cold/hot wallet system and two-factor authentication.

## Testing and Analysis

We were unable to test the app: it is not available for download in our country. This assessment is therefore based on publicly available documentation, retrieved 2026-07-24.

**ZMEX is a lightweight build of the Zoomex exchange.** The Android listing names its developer *Zoomex* directly, and both listings give Zoomex's contact channels — support email `support@zoomex.com`, `x.com/zoomexofficial`, `t.me/zoomex_com`. It describes itself as a trimmed client (*"40% smaller,"* with "secondary features" such as copy trading, launchpad and rewards removed) that keeps the core trading and *"Asset Management: Monitor balances and transactions."* Account and custody are handled by the shared Zoomex backend.

**It is a custodial exchange, not a self-custody wallet.** The product is built around spot and perpetual-contract (derivatives) trading with leverage of up to 120–150x, and the provider states it holds assets in a *"multi-sig cold/hot wallet system."* No private key or seed phrase is exposed to the user, and none is mentioned in any listing or document.

**Unlike a closed buy/sell-only app, it does support moving real crypto in and out.** Zoomex's help centre documents on-chain deposits and withdrawals: *"A crypto deposit is the transfer of crypto from an external wallet or another exchange via blockchain transaction to your Zoomex account"* ([How to Make a Deposit to Your Zoomex account](https://zoomex.zendesk.com/hc/en-us/articles/34681720707865)), and a dedicated *"Crypto Deposit / Withdrawal page"* lists supported coins and required confirmations ([FAQ – On chain deposits](https://zoomex.zendesk.com/hc/en-us/articles/34686090551961)). Bitcoin withdrawals are supported. We confirmed this on the Zoomex side; we could not view the ZMEX-branded app's own deposit screen, as we could not install it.

**Verdict: custodial.** ZMEX credits balances to accounts whose keys the provider holds; users do not control their funds and depend on the provider's solvency, policies and compliance decisions. Because the coins can be deposited from and withdrawn to a user-controlled address, this is a custodial exchange rather than a closed "no send/receive" system. Custody rests with the provider, so the review ends here: there is no user-held key material to audit, and source availability and reproducibility do not arise.
