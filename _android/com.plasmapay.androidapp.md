---
wsId: PlasmaPay
title: "PlasmaPay - cryptocurrency wallet and DeFi app"
altTitle: 
authors:
- danny
users: 1000
appId: com.plasmapay.androidapp
appCountry: 
released: 2019-07-31
updated: 2021-10-07
version: "2.0.4"
stars: 3
ratings: 31
reviews: 17
size: 151M
website: https://plasmapay.com/
repository: 
issue: 
icon: com.plasmapay.androidapp.png
bugbounty: 
meta: defunct
verdict: wip
date: 2021-11-17
signer: 
reviewArchive:

providerTwitter: 0xPlasma
providerLinkedIn: 0xplasma
providerFacebook: Plasmapay
providerReddit: PlasmaPay

redirect_from:

---

## App Description

> Looking for the perfect digital currency wallet? We worked hard for you to create the most secure and user-friendly app — PlasmaPay. It's not just a Wallet, it's the full Payment and Investment platform. Buy Bitcoin, Ethereum and other cryptocurrencies with credit or debit card directly from your wallet.
>
> - Biometrically authenticate with Touch ID or Face ID
> - Only you have access to your private keys and your crypto
> - Paper private key
> - Additional password for protection wallet
> - PCI DSS compliant
> - Protect your app with 4-digit-PIN
> - Advanced Two-Factor Authentication
> - Backup key to your local mobile storage

## Critical Reviews

Multiple users say that they have errors with this app. This dates back to January 2020.


> [Ashish Nath](https://play.google.com/store/apps/details?id=com.plasmapay.androidapp&reviewId=gp%3AAOqpTOEFQgvEnqKww0ugdUtIgAWpliu54tDzLnKOQphPuNUtPyc738QTNygFAktkRhaiNoSjQCYq8HLX6Nd-QIg)<br>
  ★☆☆☆☆ January 17, 2020 <br>
       No way to create usd wallet always showing error
>       
> [63 Grams](https://play.google.com/store/apps/details?id=com.plasmapay.androidapp&reviewId=gp%3AAOqpTOF65be3LbWhJ_HAYBQvhWkhqcnmdsvW4f74xw6lq4JzfS-jHccWfOiAiK6-sygxT64adcDCZS-W_KYyE1A)<br>
  ★☆☆☆☆ January 22, 2021 <br>
       Always an error
>       
> [Granit Lushaku](https://play.google.com/store/apps/details?id=com.plasmapay.androidapp&reviewId=gp%3AAOqpTOGiCKu40nTYO5tn1tD2nytxlZqbROmMvvuUPtSgsjWY3IVjEovf3VrsGZi_GkTegMeH9p4IjbLlmQh_FLA)<br>
  ★☆☆☆☆ November 24, 2020 <br>
       Can't sign up error on capcha  
>      
> [Andrew Herkenhoff](https://play.google.com/store/apps/details?id=com.plasmapay.androidapp&reviewId=gp%3AAOqpTOHfQlWtVxs-smnUUSgGn_Xpf3l9x6OEK3RORKG2BqvtDu_lymuxR0LydNDwTvJtaEa7WOWYukw2e73QJoE)<br>
  ★☆☆☆☆ July 9, 2021 <br>
       This app does not appear to be functional. I can not activate my account, that is assuming it actually loads. Seemed like it had promise but it just doesn't work.
       
  
## Private Keys are mentioned in the [Terms of Use](https://plasmapay.com/terms-of-use)

> As a bitcoin wallet, the Service enables you to interface with the bitcoin network to view and transmit information about a public cryptographic key commonly referred to as a bitcoin address – sometimes referred to herein as a “bitcoin account”. To transmit information about a bitcoin account to the bitcoin network, the **private key(s)** corresponding with the bitcoin account is required. The Service requires three private cryptographic keys to be associated with each Bitcoin or Plasma wallet and PlasmaPay controls only one of these private keys. Two of the three private keys associated with a bitcoin wallet are needed to effect a “transfer” of bitcoin from a bitcoin account (i.e., disassociate bitcoin from one bitcoin wallet and re-associate bitcoin with another bitcoin wallet). Once the bitcoin network recognizes the information you send from the Service and validates it, the information is broadcasted to other individuals and companies in the bitcoin network and the Service cannot be used by you to cancel or reverse bitcoin-to-bitcoin transactions.

## [Plasma Pay Legal Documents](https://plasmapay.com/legal-documents)

> **Section 5.1 PlasmaPay Wallets**
> All registered users may establish and fund only one PlasmaPay Wallet to facilitate transactions on the PlasmaPay platform. You are the only one owner of the funds of your PlasmaPay Wallet. PlasmaPay does not aggregate and hold the digital assets of your or other users' PlasmaPay Wallet in a dedicated custodial account. All funds stored in the PlasmaPay wallet are owned and controlled only by the user through the use of a private key.

## Security Measures

Section 6 of its [Security Policy](https://plasmapay.com/legal-documents) mentions that user funds are stored in **cold-storage**:

> The purpose of the PlasmaPay’s security framework is to ensure that there are strict measures and practices in place to protect customer assets against any eventualities and threats. **The majority of customer digital assets (e.g., bitcoin) are held in our offline wallet systems** (Cold storage) as well as with the industry’s most reputable liquidity providers and crypto custodians. We are conducting periodical stress tests and security audits to ensure compliance with the strictest security standards.

### Section 6.1 Digital Asset security

> **Digital asset security is supported by the following solutions**:
- **Cold Storage**. Offline wallet system (Cold storage) provides an important security measure against hacking, theft or loss. Asset transfers from the Cold storage require actions of multiple employees. All private keys are stored in safe deposit boxes and vaults distributed geographically.
- **Hot Wallets**. The hot wallet keys are generated, stored and managed in HSM (hardware security modules) serviced by Azure Key Vault. HSM’s hardware has been evaluated according to FIPS publication 140-2 with a rating of Level 2.

## Source Code

No mention has been made referring to Plasma Pay as an open source project. What it refers to in its [legal-documentation](https://plasmapay.com/legal-documents) is the open source nature of the underlying protocols that govern the cryptocurrencies that function within its software.

## Verdict

We were not able to log in via the Android app. So we signed up via the web app. They asked for our email, phone number and name. Then they asked to verify the email address. We then logged in and created a Bitcoin wallet. We were asked to create a wallet password. Afterwards, the PDF key card was then automatically downloaded. The PDF file had an Activation Code, a QR code and a 12-word mnemonic phrase. We believe that the QR code is the private key. 

Even though the private key is provided in a PDF file by way of a web download, we believe that this is still a custodial service. 

Add to the fact that there is no mention of sharing their code on their website, and [no relevant or related code on Github](https://github.com/search?p=3&q=com.plasmapay.androidapp&type=Code), we believe this project is not open source.

Even though they claim to provide the private keys, their clause on account termination, closure and suspension give us pause as to what extent they can control the user's funds.

We included a [Section 6.7](https://plasmapay.com/legal-documents) here for reference:

> If PlasmaPay suspends or closes your account, or terminates your use of PlasmaPay Services for any reason, we will provide you with notice of our actions unless a court order or other legal process prohibits PlasmaPay from providing you with such notice. You acknowledge that PlasmaPay's decision to take certain actions, including limiting access to, suspending, or closing your account, may be based on confidential criteria that are essential to PlasmaPay's risk management and security protocols. You agree that PlasmaPay is under no obligation to disclose the details of its risk management and security procedures to you. You will be permitted to transfer Digital Currency or funds associated with your Digital Currency Wallet and/or your PlasmaPay Wallet for ninety (90) days after Account deactivation or cancellation **unless such transfer is otherwise prohibited**

The key phrase "**unless such transfer is otherwise prohibited**" make us believe that Plasmapay can freeze the user's account on legal grounds even though they claim that only the user controls the funds. This makes it permissioned.

It is hard to conclude this app as a custodial offering as it provides the keys, meaning that **the user has access to his funds.** Our findings in their fine-print could also be interpreted as their wallet not facilitating the control of private keys but them not having the private keys neither.

But at the moment, the app itself is not functional. As there are reviews dating back from January reporting errors, we conclude that this "wallet" is **defunct.**