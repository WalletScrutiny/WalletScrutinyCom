---
title: Ballet Crypto Bitcoin Block
appId: balletcrypto.bitcoinblock
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 80
- 80
- 10
weight: 283
provider: Ballet
providerWebsite: https://www.balletcrypto.com
website: https://www.balletcrypto.com/en/block/techspec/
shop: 
country: US
price: 
repository: 
issue: 
icon: balletcrypto.bitcoinblock.png
bugbounty: 
meta: ok
verdict: prefilled
date: '2022-05-18'
signer: 
reviewArchive: 
twitter: BalletCrypto
social:
- https://www.linkedin.com/company/balletcrypto
- https://www.facebook.com/balletcrypto.global
features: 

---

## Background 

The {{ page.title }} is another product from Ballet Crypto 

- {% include walletLink.html wallet='bearer/balletcryptopure' verdict='true' %}
- {% include walletLink.html wallet='bearer/balletcryptoreal' verdict='true' %}
- {% include walletLink.html wallet='bearer/balletcryptopro' verdict='true' %}

## Product Description 

> Bitcoin BLOCKs contain the entire coinbase reward of a newly-mined block. This includes both the base block reward of 6.25 BTC as well as all transaction fees mined in that block.

## "Virgin Bitcoins"

> The bitcoins come straight from our mining pool partner, mined directly from the coinbase transaction in each block, straight to your physical Bitcoin BLOCK, with no intermediate hops. These bitcoins have no prior transaction history, and thus provide the highest level of privacy.

The concept the provider is getting at here is "taint" and goes back to a [Case Law ruling in England of 1758 (Miller vs. Race)](https://legaldictionary.lawin.org/miller-v-race/). "Does the recipient have to care about the origin or history of a bank note?" Judges ruled "No!" as otherwise bank notes simply wouldn't work as money. Bitcoin today has no such ruling in its favor and some actors already seize or reject Bitcoins that by their assumptions are the proceeds of illegal activities. The provider here is offering "virgin" as in "freshly minted" Bitcoins under the assumption that those are without any history attached.

The claim that these coins "provide the highest level of privacy" obviously is false as the provider knows the identity of the buyer. If those coins themselves now are used in a crime, law enforcement would have a name and address to go ask about it. That is the opposite of "privacy".

## Private Keys

> Bitcoin BLOCKs are made using Ballet’s innovative Two-Factor Key Generation (2FKG) process, which utilizes the industry standard BIP38 process to split the private key into two components (the BIP38 passphrase and the encrypted private key). Bitcoin BLOCKs are manufactured in two separate steps in two different locations around the world. This provides what we consider to be the highest level of private key security for the customer.

Included in the block are the following: 

> 1. Block number
> 2. Block reward
> 3. Serial number
> 4. Bitcoin address (QR code)
> 5. Bitcoin address (text)
> 6. Tamper-evident scratch-off
> 7. BIP38 passphrase
> 8. Encrypted private key (QR code)
> 9. Encrypted private key (text)
> 10. Honeycomb pattern indicating tampering

Unlike other Ballet Crypto products, potential buyers would have to contact Ballet if they are interested. This is not available in their online store.

## Analysis 

Ballet Crypto's [2FKG process](https://www.balletcrypto.com/en/2FKG/) has been tackled before in the reviews noted above. The CEO, Bobby Lee even put up a *[hacking challenge](https://www.bobbylee.com/blogs/news/21-000-to-hack-ballet-wallets#:~:text=It's%20to%20show%20that%20BIP38,hack%20and%20steal%20the%20funds.)* for 2 BTC. 

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Over $21,000 in bounty to hack my two <a href="https://twitter.com/BalletCrypto?ref_src=twsrc%5Etfw">@BalletCrypto</a> wallets: <a href="https://twitter.com/hashtag/takebobbysbitcoin?src=hash&amp;ref_src=twsrc%5Etfw">#takebobbysbitcoin</a><br>1) I show you the encrypted private key; you guess the passphrase!<br>2) I show you the BIP38 passphrase, you find the private key.<a href="https://t.co/K1AqgBlmCi">https://t.co/K1AqgBlmCi</a></p>&mdash; Bobby Lee - Ballet: World&#39;s EASIEST wallet! (@bobbyclee) <a href="https://twitter.com/bobbyclee/status/1289055457521238017?ref_src=twsrc%5Etfw">July 31, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script><br />

In the challenge, he displays 2 {% include walletLink.html wallet='bearer/balletcryptoreal' %} cards. One with the encrypted private key in full display and the other with the passphrase displayed. Hackers would try to find the passphrase for the former, and the private key for the other.    

The premise is that 'collusion' between two parties in the manufacturing process is in the realm of possibility. As to the BIP-38 encrypted passphrase, the $5 wrench attack does have the potential to coerce the owner to give up his passphrase under duress. 

This leads us to a similar verdict about the **dangers of having the private keys printed on the bearer token**.