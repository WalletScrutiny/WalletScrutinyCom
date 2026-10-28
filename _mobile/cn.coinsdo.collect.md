---
title: 'CoinGet: Secure Assets Deposit'
date: 2026-10-28
authors:
- leo
website: http://www.coinsdo.com
twitter: CoinsDogroup
android:
  appId: cn.coinsdo.collect
  users: 1000
  appCountry: us
  released: Aug 10, 2022
  updated: 2026-10-09
  version: 2.1.5.730
  icon: cn.coinsdo.collect.webp
  meta: ok
  verdict: nosource
  developerName: COINSDO

---

## App Description

CoinGet is an enterprise app by CoinsDo for collecting customer deposits. Its Play Store description says it is "designed specifically for corporates" and asks users to "Visit www.coinsdo.com to apply for a corporate account". The app generates large numbers of deposit addresses from one wallet, notifies the business through an API when funds arrive, and automatically sweeps the funds to collection addresses that the business configures. The description lists Bitcoin (BTC) among more than 35 supported blockchains. CoinsDo describes CoinGet as self-custodial.

## Analysis

- **Bitcoin support.** The Play Store description lists "Bitcoin (BTC)" among the supported blockchains. Received coins can be swept to other addresses: the [CoinGet FAQ](https://coinsdo.gitbook.io/docs/coinget/faq) says "you are allowed to sweep your assets to any other wallets or custodians/exchanges as you wish", including hardware wallets such as Trezor or Ledger.
- **Custody.** The [setup guide](https://coinsdo.gitbook.io/docs/coinget/setup/add-coinget-client) says the app shows "the CoinGet client's mnemonic phrase" during initialisation and warns: "If it is lost or forgotten, you may lose access to the assets in your client." The [guide to restoring a client](https://coinsdo.gitbook.io/docs/coinget/how-to/restoring-an-old-coinget-client) restores it from that mnemonic. The [CoinGet product page](https://waas.coinsdo.com/en/coinget) states: "CoinsDo never holds your private keys." The FAQ adds: "all of CoinsDo's products are self-custody based". We take this as a self-custodial wallet, based on CoinsDo's documentation. We did not test the app.
- **Dependence on CoinsDo.** The app is not stand-alone. It is bound to a "CoinGet Center" account by a binding code. Changes to the collection addresses are signed in a separate CoinsDo app, [CoinSign](https://coinsdo.gitbook.io/docs/coinget/setup/configure-collection-address). The FAQ also mentions a client "validity" that can expire and has to be extended through CoinsDo.
- **Source code.** The developer's GitHub account [github.com/CoinsDo](https://github.com/CoinsDo) has 12 public repositories, mostly Go libraries and forks, plus a `wallet-sdk`, an MCP server and an "agentic-wallet" integration. None of them is the CoinGet app. A GitHub repository search for `cn.coinsdo.collect` and for "coinget coinsdo" found nothing, and a code search for the appId found nothing. A published SDK is not the app's source code.
- **Related listing.** The same provider's consumer wallet, [CoinWallet](/mobile/com.coinsdo.wallet/), is already listed, also without source code.

CoinsDo's documentation describes the keys as staying on the user's device, but we found no public source code for the app, so this cannot be verified. See [our methodology](/methodology/#nosource).

**No source for current release found**
