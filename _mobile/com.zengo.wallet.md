---
wsId: ZenGo
title: 'Zengo: Crypto & Bitcoin Wallet'
date: 2026-10-30
authors:
- leo
- emanuel
- danny
website: https://www.zengo.com
twitter: zengo
redirect_from:
- /com.zengo.wallet/
- /posts/com.zengo.wallet/
- /android/com.zengo.wallet/
- /iphone/kzencorp.mobile.ios/
android:
  appId: com.zengo.wallet
  users: 1000000
  appCountry: us
  released: 2020-01-19
  updated: 2026-10-05
  version: 10.2.1
  reviews: 607
  icon: com.zengo.wallet.webp
  meta: ok
  verdict: nosource
  developerName: ZenGo
iphone:
  appId: kzencorp.mobile.ios
  idd: 1440147115
  appCountry: us
  released: 2019-06-07
  updated: 2026-10-05
  version: 10.2.1
  reviews: 4397
  icon: kzencorp.mobile.ios.webp
  meta: ok
  verdict: nosource
  developerName: ZenGo Ltd.

---

## Android

**Update 2026-10-30:** Still no app source code. Zengo's
[GitHub account](https://github.com/ZenGo-X) has its cryptography libraries but
no repository for the wallet app, and its
[open source page](https://zengo.com/zengo-and-open-source/) still says the app
and server code are closed source. The verdict stays
{% include verdictBadge.html verdict="nosource" type='short' %}.

**Update 2024-07-13:**

No changes have been observed concerning this app's source code availability.

**Update 2021-03-08:** As
[Emanuel mentioned here](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/158),
ZenGo [claims](https://www.zengo.com/zengo-and-open-source/) what we are doing
is impossible:

> It is important to note,
  that even if we had exposed our code, there is no good way to verify that the
  downloaded mobile app was indeed created from it.

That is exactly what we are doing here. Let's see if ZenGo answers to
[our tweet](https://twitter.com/WalletScrutiny/status/1369071552722010121).

# The original analysis

This app claims on Google Play:

> **Never worry about losing your private keys again**<br>
> With ZenGo’s advanced cryptography, there is no private key. Instead, the
  responsibility of signing transactions is divided between us and our
  customers, so that neither party sees the other's secret information. It also
  means that you never have to worry about managing private keys again. It makes
  ZenGo the simplest and safest crypto wallet.

which sounds scary. If you don't have to worry about private keys, who does have
them? If they lose them or go out of business, can you still use your money?

Also if they don't use established standards, can you still spend your coins if
their wallet stops working? They [claim you can](https://zengo.com/?p=1268).

> **Stay in control**<br>
> ZenGo does not have access to your funds. All transactions happen directly on
  the blockchain. With securely encrypted biometrics and our password-free
  security, only you control your funds.

Again, "only you control your funds" sounds good but with the rest of the
comment it's a bit confusing.

On their website we find more details:

> **Backing up your wallet is just as simple.** An encrypted copy of your device
  share is stored on the ZenGo server, and the decryption code is stored
  separately in your personal iCloud (iOS) or Google (Android) account. Only
  with your 3D biometric face map can you access the encrypted share. 

Does that mean that with a photo of you (and probably without) a google engineer
can access your backup? That's a bit scary.

So they claim it is non-custodial but do they share the source code? On that,
they link to
[this blog post](https://medium.com/zengo/zengo-and-open-source-5d0df5c07abf)
where they conclude:

> As open-sourcing our code is a step we cannot take back, we prefer to take a
  cautious approach to it. We already released some portions of our code and
  intend to gradually release more and more of our software as open source as we
  gain more confidence in out process and more momentum within the community.

... but for audits, it doesn't need to be "Open Source" in the sense of this
quote. It can just be public code. For audits only.

Their decision to not be transparent earns them the verdict **not verifiable**.

---

## iPhone

**Update 2026-10-30:** As on Android, we found no source code for the app. The
verdict stays {% include verdictBadge.html verdict="nosource" type='short' %}.

On their website we find:

> **Backing up your wallet is just as simple.** An encrypted copy of your device
  share is stored on the ZenGo server, and the decryption code is stored
  separately in your personal iCloud (iOS) or Google (Android) account. Only
  with your 3D biometric face map can you access the encrypted share. 

Does that mean that with a photo of you (and probably without) a google engineer
can access your backup? That's a bit scary.

So they claim it is non-custodial but do they share the source code? On that,
they link to
[this blog post](https://medium.com/zengo/zengo-and-open-source-5d0df5c07abf)
where they conclude:

> As open-sourcing our code is a step we cannot take back, we prefer to take a
  cautious approach to it. We already released some portions of our code and
  intend to gradually release more and more of our software as open source as we
  gain more confidence in out process and more momentum within the community.

... but for audits, it doesn't need to be "Open Source" in the sense of this
quote. It can just be public code. For audits only.

Their decision to not be transparent earns them the verdict **not verifiable**.
