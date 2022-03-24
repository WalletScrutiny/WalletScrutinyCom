---
title: CoolWallet S
appId: coolwallets
authors:
- kiwilamb
- leo
released: 2018-01-01
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 54
- 85
- 0.8
weight: 6
provider: CoolBitX
providerWebsite: https://coolbitx.com/
website: https://www.coolwallet.io/coolwallet_s
shop: https://www.coolwallet.io/product/coolwallet/
country: TW
price: 99USD
repository: 
issue: 
icon: coolwallets.png
bugbounty: 
meta: ok
verdict: plainkey
date: 2021-12-08
signer: 
reviewArchive: 
twitter: coolwallet
social:
- https://www.facebook.com/coolwallet

---

## Update Verdict 2021-12-08

As the same provider to ECOMI's {% include walletLink.html wallet='hardware/securewallet' verdict='true' %}, Cool Wallet S requires pairing with a mobile app via Bluetooth. It is through the [mobile app where the seed phrases](https://youtu.be/FqzG7jPKH_0?t=221) are displayed and not on the hardware device itself. 

Thus, in [WalletScrutiny's methodology](https://walletscrutiny.com/methodology), it fits the description of having leaky private keys:

> the private key has to be brought onto a different system that doesn’t necessarily share all the desired aspects of a hardware wallet.

## Previous Analysis 2021-08-28

This device, running weeks on a single charge connects to its companion app on

* Android {% include walletLink.html wallet='android/com.coolbitx.cwsapp' %}
* iPhone {% include walletLink.html wallet='iphone/com.coolbitx.coolwallets' %}

via Bluetooth. It features a display and a button to confirm actions.

Searching for the firmware, latest updates thereof and the source code, we find
[this FAQ question](https://help.coolwallet.io/article/77-which-operating-system-is-coolwallet-using):

> **Which Operating System Is CoolWallet Using?**<br>
  The core of CoolWallet is an ARM-based secure element. We developed the native
  card operating system with cryptocurrencies capability and enhanced security
  features.

which sounds like the firmware probably is closed source.d

The device
[uses open standards](https://help.coolwallet.io/article/58-can-i-recover-my-coolwallet-seed-to-another-wallet)
<a href='https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki'>BIP 039</a>,
<a href='https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki'>BIP 044</a> and
<a href='https://github.com/bitcoin/bips/blob/master/bip-0141.mediawiki'>BIP 141</a> for SegWit and not
<a href='https://github.com/bitcoin/bips/blob/master/bip-0049.mediawiki'>BIP 049</a>.

As suspected though ...

> **Why Is The Firmware Not Open Sourced?**<br>
  We have ongoing Black-Box test teams working to perfecting our codes and we can provide source codes of the Micro-Controller-Unit code and the firmware. However, only the trusted members of the cryptocurrency communities and/or security industry are welcomed to evaluate and audit all of our code and libraries. Thus, if you are interested to see our code, please contact us at support@coolbitx.com for more details. *An NDA (Non-disclosure Agreement) will need to be signed between you and us. This is to ensure that the shared codes are used solely for personal review.

so as we do not claim or want to be the authority and keep all our analysis
transparent, we have to stop here and conclude this product is **not verifiable**.
