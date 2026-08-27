---
wsId: dCent
title: D’CENT Wallet - Secure Crypto
date: 2022-01-10
authors:
- kiwilamb
- danny
website: https://dcentwallet.com/
twitter: DCENTwallets
social:
- https://www.facebook.com/DcentWalletGlobal
- https://github.com/DcentWallet
features:
- fingerprint
- nfc
- secEl
- tradeAlts
redirect_from:
- /android/com.kr.iotrust.dcent.wallet/
- /iphone/kr.iotrust.dcent/
android:
  appId: com.kr.iotrust.dcent.wallet
  users: 100000
  appCountry: cn
  released: 2018-10-16
  updated: 2026-07-14
  version: 9.2.1
  reviews: 1019
  icon: com.kr.iotrust.dcent.wallet.png
  meta: ok
  verdict: nosource
  developerName: IoTrust Co., Ltd
iphone:
  appId: kr.iotrust.dcent
  idd: 1447206611
  appCountry: kr
  released: 2019-01-26
  updated: 2026-07-21
  version: 9.2.1
  reviews: 85
  icon: kr.iotrust.dcent.jpg
  meta: ok
  verdict: nosource
  developerName: IoTrust Co., Ltd

---

## Android

## Update 2024-07-15

The source code for this app remains unaccounted for as of this date, thus leaving this app as **not verifiable.**


## Old Review 2021-05-03

Note that this wallet can operate as a software wallet and also used with a hardware device. This review is only in relation to the software wallet usage.<br>
As with using the wallet with a hardware device the private keys would be managed by that device and we are not reviewing that setup.

After some research on this wallet it was not clear as to how the app manages private keys, so I reached out to the twitter handle...

"Hi with the mobile wallet app, the user is given 24 words backup recovery. Do you as the provider also keep a copy of these for backup, or are they the sole ownership of the wallet user?"

And the teams speedy response....

> "D'CENT Wallet is a completely self-custody wallet. User has the sole ownership and access to the wallet and assets (privates keys) that are created in it. <br>
> The mnemonic code is created randomly when the wallet is installed. Since D'CENT (company) does not keep a backup at all, you will lose your assets if you lose the recovery words. Please be careful in handling your confidential information."

With the provider confirming they have a non-custodial wallet we need to locate some source code in order to check the wallet for reproducibility. <br>
I have contacted the provider to direct us to the correct [repository](https://github.com/DcentWallet)

However their response below, was that the source code is only partialy open source.

> Partial code open: https://github.com/DcentWallet
> The secure OS is proprietary and is not open source.
> Here is an article on the 3rd party security evaluation on D'CENT Wallet: https://medium.com/dcentwallet/coinspect-audit-of-the-dcent-wallet-b8a6cf50cfa4

They have pointed to a blog post regarding a third party audit of the software, however this is a blog and does not provide any documentation as to the audit results itself.<br>
This was pointing at there hardware device software, so I asked a little more specifically on the software wallet.

"... with the software wallet option however is that part of the source code open sourced and public?"

> app is also not open source

Our verdict: This 'wallet' claims to be non-custodial, however with no source code at the providers [github repository](https://github.com/DcentWallet) it is **not verifiable**.

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="fingerprint" quote="지문인식 콜드월렛 연동: EAL5+ 보안칩 기반 생체 인증" source="Store description" %}

{% include featureEvidence.html feature="secEl" quote="지문인식 콜드월렛 연동: EAL5+ 보안칩 기반 생체 인증" source="Store description" %}

{% include featureEvidence.html feature="tradeAlts" quote="간편 스왑 & 브릿지: $1부터 시작, 네트워크 간 교환 지원" source="Store description" %}

{% include featureEvidence.html feature="nfc" comment="(no justification provided by LLM)" %}
