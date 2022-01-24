---
title: "Hardbit Wallet"
appId: hardbit
authors:
- danny
released: 2020-06-07
discontinued: # date
updated: 2021-05-11
version: 1.0
dimensions: [48, 88, 12.8]
weight: 
website: http://www.hardbit.cn/
shop: 
company: 
companywebsite: 
country: 
price: 
repository: https://github.com/hardbitcn
issue:
icon: hardbit.png
bugbounty:
verdict: nosource
date: 2022-01-21
signer:
reviewArchive:


providerTwitter: 
providerLinkedIn: 
providerFacebook: 
providerReddit: 
---


Announced in [CoinTelegraph](https://cointelegraph.com/news/china_releases_hardbit_hardware_wallet) on May 10, 2014 the Hardbit wallet seems to have fallen prey to China's stringent cryptocurrency regulations. Its website is still accessible but displays a warning. There are also indications that the product is no longer available for sale - such as its 'Buy' page no longer working.

From what information we've gathered, the device is also known as the HB01M, which comes with a companion app for Android. However, this app is not available in the Play Store and is only available as an APK in a [Baidu domain](https://pan.baidu.com/s/1hqSYqP2). 

> Communication method: scan QR code. All data are transmitted via QR code, including account balance data,payment request data, transaction data.

Hardbit's [Technical Whitepaper](http://hardbit.cn/index.php/techonology/3-whitepaper):

> This system completely shield the private key from the online software, and improve the safety of the Bitcoin account. And more important, this mechanism needs 0 trust between the offline and online software thanks to the manual intervention in the signature process, the open communication protocol between the offline and online software, and multiple confirmations from the offline and online softwares. In other words, the Bitcoin will not be lost even if either or both of the offline and online software is malicious software.

## Can the private keys be created offline?

Yes. The private key is shown via a QR code.

## Are the private keys shared? 

The HB01M interacts with the companion app via the QR code. ([Page 11 of the Hardbit User Manual](https://pan.baidu.com/s/1ntjw0BJ))

## Does the device display the receive address for confirmation?

Yes.

## Does the interface have a display screen and buttons which allows the user to confirm transaction details?

Yes.

## Is it reproducible?

Only the [companion app's source code](https://github.com/hardbitcn/HardbitSafetyCheck) is shared via the Hardbit repository. We have **not been able to find the firmware and other associated libraries** for the actual device. 