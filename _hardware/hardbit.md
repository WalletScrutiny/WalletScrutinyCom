---
title: Hardbit Wallet
appId: hardbit
authors:
- danny
released: 2020-06-07
discontinued: 
updated: 2021-05-11
version: '1'
binaries: 
dimensions:
- 48
- 88
- 13
weight: 
provider: 
providerWebsite: 
website: http://www.hardbit.cn/
shop: 
country: 
price: 
repository: 
issue: 
icon: hardbit.png
bugbounty: 
meta: defunct
verdict: wip
appHashes: 
date: 2022-02-17
signer: 
reviewArchive: 
twitter: 
social:
- https://github.com/hardbitcn
features: 

---

Announced in [CoinTelegraph](https://cointelegraph.com/news/china_releases_hardbit_hardware_wallet) on May 10, 2014 the Hardbit wallet seems to have fallen prey to China's stringent cryptocurrency regulations. Its website is still accessible but displays a warning. There are also indications that the product is no longer available for sale - such as its 'Buy' page no longer working.

From what information we've gathered, the device is also known as the HB01M, which comes with a companion app for Android. However, this app is not available in the Play Store and is only available as an APK in a [Baidu domain](https://pan.baidu.com/s/1hqSYqP2). 

> Communication method: scan QR code. All data are transmitted via QR code, including account balance data,payment request data, transaction data.

Hardbit's [Technical Whitepaper](http://hardbit.cn/index.php/techonology/3-whitepaper):

> This system completely shield the private key from the online software, and improve the safety of the Bitcoin account. And more important, this mechanism needs 0 trust between the offline and online software thanks to the manual intervention in the signature process, the open communication protocol between the offline and online software, and multiple confirmations from the offline and online softwares. In other words, the Bitcoin will not be lost even if either or both of the offline and online software is malicious software.

The HB01M interacts with the companion app via the QR code. ([Page 11 of the Hardbit User Manual](https://pan.baidu.com/s/1ntjw0BJ))

The process detailed in its [whitepaper](http://hardbit.cn/index.php/techonology/3-whitepaper) is as follows:

> 5.1 Create a user account in a hardware wallet (fill in password, generate a public and private key pair, use the password to encrypt private key. Only save the encrypted private key)
>
> 5.2 Apply for receiving Bitcoin from hardware wallet (display the address, amount, and QR code)
>
> 5.3 Payer retrieves the address (copy the text or scan the QR code)
>
> 5.4 Payer pays 
>
> 5.5 Hardware wallet requests to refresh the balance (QR code displays the address)
>
> 5.6 Online software receiveds the request to refresh balance (scan the QR code)
>
> 5.7 Online software gets the transaction record of this address from the Bitcoin network
>
> 5.8 Online software displays the transaction record (QR code)
>
> 5.9 Hardware wallet receives the transaction record (scan the QR code)
> 
> 5.10 Hardware wallet gets the payment address and amount (scan the QR code or manually input)
> 
> 5.11 Hardware wallet generates unsigned payment transaction
>
> 5.12 User inputs the password and hardware wallet signs the transaction
>
> 5.13 Hardware wallet displays payment transaction (QR code)
>
> 5.14 Online software screens the payment transaction
>
> 5.15 Online software verifies the payment transaction (user can confirm manually)
>
> 5.16 Online software broadcast this transaction to the Bitcoin network

Only the [companion app's source code](https://github.com/hardbitcn/HardbitSafetyCheck) is shared via the Hardbit repository. We have **not been able to find the firmware and other associated libraries** for the actual device. It is hard to find other information pertaining to this product. Most of its marketing seems to have ended in 2015.   