---
wsId: protonWallet
title: 'Proton Wallet: Secure Bitcoin'
altTitle: 
authors:
- danny
users: 100000
appId: me.proton.wallet.android
alternativeStores: 
appCountry: 
released: 2025-02-04
updated: 2026-05-18
version: 1.2.6
reviews: 27
website: https://proton.me
repository: https://github.com/ProtonWallet/flutter-app
icon: me.proton.wallet.android.png
bugbounty: 
meta: ok
verdict: sourceavailable
date: 2025-05-20
signer: dcc9439ec1a6c6a8d0203f3423ee42bcc8b970628e53cb73a0393f398dd5b853
twitter: ProtonPrivacy
social:
- https://www.reddit.com/r/ProtonMail
- https://www.instagram.com/protonprivacy
- https://www.facebook.com/Proton
- https://www.linkedin.com/company/protonprivacy
- https://mastodon.social/@protonprivacy
redirect_from: 
developerName: Proton AG
builds: 
features:
- foss

---

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
