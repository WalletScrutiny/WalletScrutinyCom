---
wsId: protonWallet
title: 'Proton Wallet: Secure Bitcoin'
date: 2025-05-20
authors:
- danny
website: https://proton.me
twitter: ProtonPrivacy
social:
- https://www.reddit.com/r/ProtonMail
- https://www.instagram.com/protonprivacy
- https://www.facebook.com/Proton
- https://www.linkedin.com/company/protonprivacy
- https://mastodon.social/@protonprivacy
features:
- foss
- buyWithCC
- hd
- multiAccount
redirect_from:
- /android/me.proton.wallet.android/
- /iphone/me.proton.wallet.ios/
android:
  appId: me.proton.wallet.android
  users: 100000
  appCountry: us
  released: 2025-02-04
  updated: 2026-05-18
  version: 1.2.7
  reviews: 29
  icon: me.proton.wallet.android.png
  signer: dcc9439ec1a6c6a8d0203f3423ee42bcc8b970628e53cb73a0393f398dd5b853
  meta: ok
  verdict: sourceavailable
  developerName: Proton AG
  repository: https://github.com/ProtonWallet/flutter-app
iphone:
  appId: me.proton.wallet.ios
  idd: '6479609548'
  appCountry: us
  released: 2025-02-10
  updated: 2026-05-20
  version: 1.2.7
  reviews: 221
  icon: me.proton.wallet.ios.jpg
  meta: ok
  verdict: sourceavailable
  developerName: Proton AG
  repository: https://github.com/ProtonWallet/flutter-app

---

## Android

## Update 2025-05-20

Pursuant to the [GitHub issue we raised](https://github.com/ProtonWallet/flutter-app/issues/4), the Proton Android Wallet team has made build instructions plus a script that would help in building the app. At the time of this writing, we were able to build an apk and is in the process of building the AAB. Thus, any previous findings concerning the difficulties in building are now voided.

This makes the app **sourceavailable**, and thus open **for verification**. 

## App Description from Play

From their terms:

- Generate wallet addresses and associated private keys that you may use to send and receive digital assets;
- Associate said wallet addresses with your email address;
- Access third-party services through functionality made available by third-party service provider(s);
- View digital asset price information made available by third party service provider(s)
- Broadcast digital asset transaction data to various blockchains supported by Proton Wallet without requiring to download or install the associated blockchain-based software on your local device.

## Analysis 

As of 2024-07-25, the app is still in early access which would require an invite. If we go by its claims, then this app would be **for verification**

{% include featureEvidence.html feature="foss" quote="The code and data files in this distribution are licensed under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. See <https://www.gnu.org/licenses/> for a copy of this license." source="GitHub README" %}

An issue has been opened at [https://github.com/ProtonWallet/flutter-app/issues/4](https://github.com/ProtonWallet/flutter-app/issues/4)

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="hd" quote="Proton Wallet creates your wallet using a BIP39 standard seed phrase, ensuring seamless recovery and interoperability with other self-custodial wallets, including hardware wallets. This also means you can easily import existing wallets or recover your Proton wallets on other services." source="Store description" %}

{% include featureEvidence.html feature="multiAccount" quote="Inside each wallet, you can also create multiple BTC accounts to organize and separate your assets for better privacy. After the default wallet, subsequent wallet creations support an optional passphrase as another layer of protection. Free users can have up to 3 wallets and 3 accounts per wallet." source="Store description" %}

{% include featureEvidence.html feature="buyWithCC" quote="Proton Wallet allows you to easily acquire Bitcoin using credit cards or bank transfers from all around the world through our financial partners, with a particularly low friction process for smaller amounts." source="Website" %}

{% include featureEvidence.html feature="foss" quote="Choose a crypto wallet that's transparent, open source, optimized for Bitcoin, and puts you in control." source="Store description" %}
