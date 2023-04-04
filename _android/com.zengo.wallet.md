---
wsId: ZenGo
title: 'ZenGo: Crypto & Bitcoin Wallet'
altTitle: 
authors:
- leo
- emanuel
users: 500000
appId: com.zengo.wallet
appCountry: 
released: 2020-01-19
updated: 2023-03-26
version: 5.4.1
stars: 4.4
ratings: 3936
reviews: 433
size: 
website: https://www.zengo.com
repository: https://www.github.com/kzen-networks
issue: 
icon: com.zengo.wallet.png
bugbounty: 
meta: ok
verdict: nosource
date: 2020-06-18
signer: 
reviewArchive: 
twitter: zengo
social: 
redirect_from:
- /com.zengo.wallet/
- /posts/com.zengo.wallet/
features: 

---

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

