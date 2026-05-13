---
wsId: rumbleWallet
title: 'Rumble Wallet: Tip With Crypto'
altTitle: 
authors:
- danny
users: 10000
appId: com.rumble.rumblewallet
alternativeStores: 
appCountry: 
released: 2026-01-19
updated: 2026-05-01
version: 2.0.4
reviews: 10
website: https://wallet.rumble.com
repository: 
icon: com.rumble.rumblewallet.png
bugbounty: 
meta: ok
verdict: nosource
date: 2026-01-12
signer: 
twitter: rumblevideo
social:
- https://www.linkedin.com/company/rumblevideo
- https://www.youtube.com/@rumblevideo
redirect_from: 
developerName: Rumble Inc
builds: 
features: 

---

## App Description 

Rumble Wallet is a non-custodial cryptocurrency wallet designed primarily for Rumble content creators and their audiences, with a strong emphasis on tipping and withdrawals tied to the Rumble ecosystem. The app explicitly claims support for Bitcoin and Tether, positioning Bitcoin less as a general-purpose savings or payments tool and more as a medium for creator tips, earnings, and payouts. 

Functionally, the wallet is oriented around fast in-app transfers, creator tipping, and fiat on-ramps via MoonPay, rather than advanced Bitcoin wallet features such as coin control, custom fee selection, or privacy tooling. As a result, Rumble Wallet appears best suited for users who already participate in the Rumble platform and want a convenient way to receive, tip, and cash out Bitcoin or USDT, rather than for users seeking a standalone, privacy-focused Bitcoin wallet for long-term self-custody or advanced on-chain usage.

## Testing and Analysis

We installed the app but did not manage to initialize it. A bug kept closing the app after it displays the splash screen.

From their [FAQ](https://wallet.rumble.com/support/docs/get-started/set-up-your-rumble-wallet):

> Your secret phrase is a randomly generated set of 12 words... Because you are the sole custodian of your wallet, you need to ensure that only you have access to the secret phrase.

While the underlying framework (Tether's open-source WDK) is publicly available, Rumble Inc. has not made the Rumble Wallet app code itself open-source. 

[No public repository](https://github.com/search?q=%22com.rumble.rumblewallet%22&type=code) (such as GitHub) for the com.rumble.rumblewallet application code is currently linked in official documentation or the Play Store listing.

This app is **not source available**.