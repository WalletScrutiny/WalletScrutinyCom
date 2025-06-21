---
title: Bit-Card.de
appId: bitcard.de
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: 5C-Basic GmbH & Co.
providerWebsite: 
website: https://web.archive.org/web/20141219044928/http://www.bit-card.de/
shop: 
country: DE
price: 1USD
repository: 
issue: 
icon: bitcard.de.png
bugbounty: 
meta: defunct
verdict: prefilled
date: 2022-05-19
signer: 
twitter: 
social: 
features: 

---

## Background

The service has long ceased its operations. The archives are from 2014.

> All cards are produced pursuant to ISO 7816 ID-1 standard in the size 86 x 54 mm (3⅜" × 2⅛"). The sandwich configuration with a black core and specially produced security hologram provide first-class protection against modification and counter fitting. In an effort to protect the card against wear and tear and environmental influences, we use the exceptional high-quality retransfer-procedure and cover the printed surface with a protective coating.

The cards come in different versions:

**Encrypted cards**

> Encrypted-Cards are cards whose private key is encrypted in accordance with BIP 0038. They offer a particularly high level of protection since the private key has been generated in encrypted form and stored on the card that way, just so that it cannot become known to either us or any third parties. Decrypting your private key is only possible using your passphrase.
>
> In order to create a passphrase-protected card, you will first of all have to generate an intermediate code. The intermediate code is transmitted to us during the ordering process.(You can, for example, do this on the website bit2factor.org. Further options are to use the programs provided by Casascius (The source code can be found on github) or our own tool (The source code can be found on github), which is based on Casascius' program. (We recommend you to generate the intermediate code on a system without an Internet connection.) Make sure to store the passphrase used very carefully. Without your passphrase you will not be in a position to use the credit on the card! With the confirmation code, you can check, at any time, in the above-mentioned programs, whether the passphrase belongs to the card received. The security hologram does not have to be removed for that purpose.

Since the service is no longer online, we could not clarify this segment in the web form: 

> Intermediate Code ("begins with "passphrase")

We are not sure if the service is asking the user to provide the passphrase to be encrypted. If yes, then the provider might have copies of the passphrase and the private key. 

**Wallet cards** 

> Wallet-Cards are a safe and easy way to store Bitcoins via handy credit card format. Wallet-Cards are not topped up by us and are especially suitable as a replacement for the traditional paper wallet, or for conveying non-standard amounts.

**Receive Cards**
> Receive-Cards make it easy to share your Bitcoin address with friends and customers and receive payments.
 
The user provides the public address via web form. The provider prints this on the card. 

## Analysis 

Since the provider is no longer operating, we are not able to verify if our assumption is correct. From what we understand, the passphrase is sent to the provider via web form. Whether they make copies of it or not, we would not be able to know. What we do know is that the **encrypted** card variant *does have a printout of the private key*.  
