---
title: BitSafeCard
appId: bitsafe.card
authors:
- danny
released: 2021-12-28
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: Bethino LLC
providerWebsite: 
website: https://www.bitsafecard.com/
shop: https://www.bitsafecard.com/en/Shop
country: TR
price: 
repository: 
issue: 
icon: bitsafe.card.png
bugbounty: 
meta: ok
verdict: plainkey
date: 2023-02-02
signer: 
reviewArchive: 
twitter: Bitsafecard
social: 
features: 

---

## Product Description 

The website for the product is written primarily in Turkish so some details are not very clear to us. 

For instance, in its [Introduction Page](https://www.bitsafecard.com/tr/Home/Intro):

> Hersey bukadar kolay. Kartınızın üzerindeki adrese kriptolarınızı gönderin, kartınızın arkasındaki anahtarla transfer yapın.

Translated:

> Everything is that easy. Send your crypto to the address on your card, transfer with the key on the back of your card.

**It was not clarified what sealing method was used to cover the QR code or the plaintext private key** 

In its tutorial page on [transferring bitcoin using Blockchain.com wallet](https://www.bitsafecard.com/en/Support/BitcoinTransferUsingBlockchainCom):

It was described that the private key has to be imported by scanning the QR code at the back of the card. 

> Bitcoin - Bitcoin Cash - Ethereum - Stellar arasından seçiminizi yapın (Bitcoin soğuk cüzdanı kullanıyorsanız "Bitcoin" seçin)
Sağ taraftaki "Import Address" butonuna tıklayın.
>
> "Enter your private key" bölümüne BITSAFECARD para çekme bölümündeki şifrenizi ya da QR kodunuzu okutun. Böylece kartınızdaki tüm kriptoparanız Blockchain.com 'da oluşturduğunuz elektronik cüzdana geçiş yapacaktır.

Translated:

> Choose between Bitcoin - Bitcoin Cash - Ethereum - Stellar (choose "Bitcoin" if you are using a Bitcoin cold wallet)
Click the "Import Address" button on the right.
>
> In the "Enter your private key" section, read your password or QR code in the BITSAFECARD withdrawal section. Thus, all your cryptocurrency on your card will be transferred to the electronic wallet you created on Blockchain.com.

## Analysis 

We tried to confirm whether the private key QR code is indeed sealed by [tweeting them.](https://twitter.com/BitcoinWalletz/status/1621121362302734338) 

Even if it were sealed like in other tokens such as Casascius, no other special process has been detailed in the website. No mention of encrypted passphrases or any of the sort was detailed. 

If we are correct, this exposes the private key in its QR form. Guarantees that the manufacturer is also not making copies is also insufficient and should be subject to greater scrutiny by buyers.