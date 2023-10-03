---
title: imKey Pro
appId: imkeypro
authors:
- danny
released: 2020-02-28
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 64
- 38
- 2.3
weight: 8.1
provider: IMKEY PTE. LTD
providerWebsite: https://imkey.im/
website: https://imkey.im/
shop: 
country: SG
price: 109USD
repository: 
issue: 
icon: imkeypro.png
bugbounty: 
meta: ok
verdict: nosource
date: 2022-02-18
signer: 
reviewArchive: 
twitter: imkeyofficial
social: 
features: 

---

imKey is only partially Open Source. According to its [User Agreement:](https://imkey.im/tos?locale=en-us)

> Section 3.3.2 imKey software open source code may contain third-party-developed open source license and source code and the Company does not provide any guarantee for functions, non-existence of virus or vulnerabilities etc of such third-party-developed open source license and source code. Developer Users shall, at their sole discretion, decide the consequences of using imKey software open source code. Developer Users shall carefully read and then agree with relevant open source licenses and notices of the Company updated from time to time

Furthermore, this is what it has to say about its [Secure Element chip](https://support.imkey.im/hc/en-us/articles/360045069553-What-is-the-security-chip-used-by-the-hardware-wallet-):

> Open source will bring immeasurable security risks and even threaten homeland security. Therefore, open source cannot be used as a criterion for judging whether a security chip is secure, and compared to open source, black box privacy is more conducive to ensuring its security.
>
> A lot of security chip knowledge sounds rather obscure. In summary, it is recommended that when buying hardware wallets, try to buy products that use security chips and have security certification qualifications.

[imKey Pro Unboxing Video and Guide](https://www.youtube.com/watch?v=Ffc51tHNVwk)

The device is paired via Bluetooth with the {% include walletLink.html wallet='android/im.token.app' verdict='true' %}. It is also possible to pair with the [imKey Manager desktop software](https://imkey.im/manager?locale=en-us) by connecting through USB. The imKey Manager desktop software is how the device's firmware is updated.

## Private keys can be created offline - ✔️

The recovery phrase is generated in the hardware wallet after it is paired with the imToken app. 

## Private keys are not shared - ✔️

According to [official documentation](https://support.imkey.im/hc/en-us/articles/360019783833-If-I-lost-my-mobile-device-which-is-connected-to-imKey-What-should-I-do-) the private key is never shared and stays in the Secure Element chip of the hardware wallet. 

## Device displays receive address for confirmation - ✔️

Yes, the [device displays the receiving address](https://youtu.be/6cPn8gxj0_M?t=41) and is confirmed by pressing a button.

## Reproducibility - ❌

The language on imKey's website about whether the hardware wallet is open source or not is not clearly defined. There is also no link to any repository. This is also bolstered by the fact that the hardware wallet is paired with {% include walletLink.html wallet='android/im.token.app' verdict='true' %}.