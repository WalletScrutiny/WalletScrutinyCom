---
wsId: balletcrypto
title: "Ballet Crypto"
altTitle: 
authors:

appId: com.balletcrypto
appCountry: 
idd: 1474912942
released: 2019-09-11
updated: 2021-03-04
version: "1.14.3"
score: 4.93574
reviews: 249
size: 103522304
developerWebsite: https://www.balletcrypto.com/
repository: 
issue: 
icon: com.balletcrypto.jpg
bugbounty: 
verdict: nosource # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2021-03-11
reviewStale: true
signer: 
reviewArchive:


providerTwitter: BalletCrypto
providerLinkedIn: company/balletcrypto
providerFacebook: balletcrypto.global
providerReddit: BalletCrypto

redirect_from:

---

> Ballet Crypto is an app that acts as a companion to your Ballet product,
  allowing you to manage your cryptocurrencies, check their market value and add
  additional ones to your wallet.

> *Privacy Guaranteed<br>
  The app does not store your wallet’s private keys. It also does not track,
  store or transmit your personal or financial data outside the app.

This app is the companion app to BIP38 encrypted private key "paper" wallets.
The idea is that the company *Ballet Global Inc.* sells credit card sized tokens
that carry an address, a private key and a password while the app itself doesn't
store the private keys.

We usually classify companion apps that do not store private keys as "not a wallet"
but here the security aspects of the "hardware wallet" as they call it are so
blatantly different that we have to consider the app a wallet anyway.

Yes, the provider claims that the private keys doesn't get stored in the app but
in contrast to actual hardware wallets that never expose the private keys to
companion apps, this BIP38 wallet's private keys get reconstructed in the app,
supposedly to do a send but we are all about verification, so we would like to
know if we could audit the app to see if it really doesn't secretly send the
private keys to some server.

The other obvious issue is that **the private keys are all generated by the provider!**
The cards they sell are what protects the keys. There is no way of knowing if
anybody in the supply chain is keeping copies. The founder of the company Bobby
Lee, a well known figure in the Bitcoin space
[acknowledges that trust is needed but emphasizes that he is trustworthy](https://www.youtube.com/watch?v=JmbfYlNAuSM).
In the spirit of "Don't trust - verify!" we would/will certainly file this
"hardware wallet" also as not verifiable but the companion app given the lack of
source code is also **not verifiable**.