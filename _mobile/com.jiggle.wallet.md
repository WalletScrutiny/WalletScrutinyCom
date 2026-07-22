---
wsId: jiggleCrypto
title: "Jiggle: Crypto Wallet"
date: 2026-07-21
authors:
  - danny
website: https://jiggle.app
twitter: jiggle_app
redirect_from:
  - /android/com.jiggle.wallet/
  - /iphone/com.jiggle.cryptowallet/
android:
  appId: com.jiggle.wallet
  users: 50000
  appCountry: us
  released: 2023-05-19
  updated: 2026-07-17
  version: 3.2.2
  reviews: 37
  icon: com.jiggle.wallet.jpg
  meta: ok
  verdict: custodial
  developerName: Appia Solutions FZCO
iphone:
  appId: com.jiggle.cryptowallet
  idd: "6446089702"
  appCountry: us
  released: 2023-06-28
  updated: 2026-07-08
  version: 3.1.1
  reviews: 289
  icon: com.jiggle.cryptowallet.jpg
  meta: ok
  verdict: custodial
  developerName: Appia Solutions DMCC
---

## App Description

Jiggle Wallet is a closed-source cryptocurrency wallet supporting Bitcoin, Ethereum, Bitcoin Cash, Litecoin, USDT (ERC20), and USDC (ERC20). The app claims to use facial biometric security for wallet backup and restore, stating users can "restore at any time and only ever by you" without seed phrases or passwords.

> Your Jiggle Wallet is secured using advanced facial biometric security. Instead of the usual 12-word seed phrase required to backup and restore your wallet, your wallet can be restored at any time and only ever by you. There’s no need to write down or remember lengthy passwords that can be lost or stolen. You’ll always be able to restore your wallet wherever you are with just your face. Our advanced security ensures:

## Analysis

On retesting the current version, we found no way for the user to access or export their private keys or a recovery phrase. Backup and restore rely entirely on Jiggle's facial biometric system, which requires the provider's infrastructure to recover a wallet — the user never holds key material they can use independently of Jiggle.

By walletscrutiny.com's definition, an app that does not put the private keys in the user's hands is **custodial**: the user cannot move their funds without the provider's cooperation. Not your keys, not your coins.

Jiggle's support has stated they "do not store or have access to your private keys". We cannot verify this in a closed-source app, and it does not change the verdict: if the user cannot export the keys, the app is not verifiably self-custodial either way.

## Previous Analysis Nov 2025

*The following reflects our November 2025 testing and no longer describes the current app. It is retained for historical context only; the current verdict is set by the retest in the Analysis section above.*

Our [testing](https://x.com/BitcoinWalletz/status/1990967565913649310) at the time showed the app to be in the process of deprecation: once installed, it simply redirected to their website, and our analysis stopped there.

However, a cursory search shows that there's quite a number of people who are not happy with this app.

Multiple user reviews on [Trustpilot](https://www.trustpilot.com/review/jiggle.app) report permanent loss of funds after losing access to their QR code backups, with Jiggle support confirming they "do not store or have access to your private keys" and cannot assist in fund recovery.

On that basis we had marked the app as deprecated, pending the new release they announced. The app has since returned to a functioning state and is assessed as **custodial** in the Analysis section above.

**Some trustpilot reviews:**

> [Brian R Tubbs](https://www.trustpilot.com/reviews/6805cf7998e7516508120c3f)<br>
> ★☆☆☆☆ April 21, 2025 <br>

       I think it's wrong, that because you changed your app or upgraded it, I lose the money I had on your platform.

> [Merete Kotyk](https://www.trustpilot.com/reviews/67cd08374a4835523813f6d6)<br>
> ★☆☆☆☆ March 29, 2025 <br>

       Jiggle is full of bugs and customer service is poor
       Jiggle will take your money then claim it's not their problem. I sent my friend money, then jiggle sent an email to all their customers saying there was an update and all the funds needed to be moved or they would disappear. This is super untrustworthy and unnecessary. I helped my friend and tried to send the funds out of the jiggle wallet but it wouldn't work. Since he had me saved as a contact from the previous transaction, I decided to send the funds back to myself. This didn't work. The funds were lost and jiggle refused to help track down the money and kept telling me the transaction was confirmed, but they didn't care my money was lost and couldn't get it back to me. I do believe they are in the business of stealing from people and they are a scam app. Don't use their app. There are far better out there.

---
