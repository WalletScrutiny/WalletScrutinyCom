---
title: "HyperMate G"
appId: hypermateg
authors:
- kiwilamb
- danny
- leo
released: 2020-04-13
discontinued: # date
updated: 2021-09-22
version: 4.1.7
dimensions: [38, 64, 2.3]
weight: 
website: https://hyperpay.me/hypermatepro/g
shop: https://shop.hyperpay.tech/products/crypto-hardware-wallet-hypermate-g
company: HyperPay
companywebsite: https://hyperpay.tech/
country: HK
price: 129USD
repository: https://github.com/hyperpayorg/hardwallet
issue: https://github.com/hyperpayorg/hardwallet/issues/4
icon: hypermateg.png
bugbounty:
meta: ok
verdict: nosource
date: 2021-12-12
signer:
reviewArchive:


providerTwitter: HyperPay_tech
providerLinkedIn: 
providerFacebook: hyperpayofficial
providerReddit: 
---


HyperMate G is about the size of a credit card and has buttons and a screen. These help the user to verify and confirm transactions. The wallet can connect via Bluetooth.

\([Unboxing video featuring the product.](https://tbm-auth.alicdn.com/e99361edd833010b/JigtJkBfR5TWOuRWJJB/ict5sRLBnWoCGDpGqCp_268558942153_hd_hq.mp4?auth_key=1637901597-0-0-33bbbc34f296640fa8afdd65d93ce9be)\)

  
## Private keys can be created offline and are not shared
 
> HyperMate wallet will NOT enable Bluetooth or USB connection before the wallet initialization process is completed in order to guarantee that the initialization process is completely conducted in an offline environment.
 
After setting up the hardware wallet, you can create a wallet and set a PIN. Afterwards, you are provided with the 12/24-word mnemonic.
 
## Device displays receive address for confirmation
 
 The official [help center](https://hyperpayhelp.zendesk.com/hc/en-us/articles/4409741620495-RECEIVE-PAYMENTS) states that this is possible. 
 
 > Receiving payments can be done offline without connecting your HyperMate mobile application. Press “up” and “OK” together to enter the menu and select “My Address” and mainnet to find your receive address, and you can press “down” to display the QR code of your address.
 
 It also shows [a picture](https://hyperpayhelp.zendesk.com/hc/article_attachments/4409734271759/mceclip0.jpg) of the receive address on this wallet's screen.
 
 ## Code and Reproducibility

 On their website they link to a GitHub account that also features a repository
 called [hardwallet](https://github.com/hyperpayorg/hardwallet) but it's not
 clear what to make of this. There are no clear build instructions and neither
 is there any version tagged. According to
 [their official Twitter](https://twitter.com/Hyperpay_tech/status/1440563446681010180)
 the latest version is `4.1.7` from 2021-09-22 but their repository has no such
 tag. In fact it has
 [no tags at all](https://github.com/hyperpayorg/hardwallet/tags).

 [The commit history](https://github.com/hyperpayorg/hardwallet/commits/master)
 is also rather curious. 14 commits with the last commit half a year before the
 latest release `4.1.7`. That
 [last commit](https://github.com/hyperpayorg/hardwallet/commit/1e9f498b69567102b2679386b7759c14be27c961#diff-30663e890bef06f6e1d74fa964e25d82781e8f95c62995ec3e3f3fd00bbf9f6a)
 adds the folder `HardWalletSDK` to the project. GitHub describes the commit:

 > 773 changed files with 116,778 additions and 0 deletions

 The content of that folder is actually the "SDK" of
 {% include walletLink.html wallet='hardware/jubiterblade' verdict='true' %}:
 [JubiterWallet/JubiterSDK_C](https://github.com/JubiterWallet/JubiterSDK_C)

 With the missing build instructions but above all missing commits leading up to
 the latest release, we find this product to be **not verifiable**.
