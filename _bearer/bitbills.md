---
title: "Bitbills"
appId: bitbills
authors:
- danny
released: 2011-05-09
discontinued: 2012-05-15
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: "Bitbills Inc."
providerWebsite: http://bitbills.com/
website: 
shop: 
country: US
price: 
repository: 
issue: 
icon: bitbills.png
bugbounty: 
meta: defunct
verdict: prefilled
date: 2022-03-11
signer: 
reviewArchive: 
twitter: 
social:
---

## Product Description 

Bitbills have been attributed to Douglas Feigelson who filed Patent No. [US20130166455A1](https://patents.google.com/patent/US20130166455A1/en) on December 23, 2011 under BITBILLS, INC. The patent was published on June 27, 2013. 

The patent's title is "Creating and using digital currency". The abstract reads: 

> Among other things, a physical device carries value and can be physically delivered in a transaction. The physical device includes a representation of the value carried by the physical device. The representation is usable to transfer the value from the physical device to a digital domain. A security feature can change from a state indicating that the value carried by the physical device has not been compromised to a state indicating that the value carried by the physical device may have been compromised. The change in state is detectable, the representation of the value carried by the physical device being inaccessible except in a manner that causes the security feature to change state.

The patent filing generated [some discussions about the ethics](https://bitcointalk.org/index.php?topic=247364.0) of patenting what was supposed to be related to Open Source technology.

In response, another provider, [cryptocoinwalletcards filed a 301 Citation of Prior Artwork](https://www.reddit.com/r/Bitcoin/comments/1o2j14/cryptocoinwalletcards_files_301_citation_of_prior/) against Bitbills in 2013.

When it was first [announced on Bitcointalk](https://bitcointalk.org/index.php?topic=7724.0) on May 9, 2011, the poster described it as the first physical incarnation of Bitcoins. It was announced even earlier than the {% include walletLink.html wallet='bearer/casascius' verdict='true' %} which was announced on December of the same year.

**How it worked via [Bitcointalk](https://bitcointalk.org/index.php?topic=3334918.0)**

> A Bitbill is a plastic card that holds the cryptographic key that will allow the face value amount of the card to be spent. The key is on a QR code embedded within the card such that it cannot be read without the card showing evidence of tampering. Additionally, the card has a hologram affixed to ensure that the card is not a counterfeit.
> 
> The intention is that the card will be left unopened and then can be treated as money by being acceptable at face value when making a transaction in-person at a retailer, for example. At any time, the card can be opened and the funds spent through the Bitcoin payment network. Once the card has been opened it will no longer be acceptable as payment anywhere else due to the fact that its private key has already been revealed.

Bitbills come in denominations of 1, 5, 10 or 20 bitcoins.

[Archived FAQ via the Wayback Machine](https://web.archive.org/web/20110729071712/http://bitbills.com/faq.html)

> Do you keep a copy of the cards' private keys?
> 
> After each card has been produced and proven functional, we delete all records of the private key. This means that once the card leaves our hands, we can no longer access the associated bitcoins (be aware, this means we also can't help if you lose or destroy your card).

[Pricing](https://web.archive.org/web/20110719224647/http://bitbills.com/order.html)

> Cards cost their face value plus a small fee. Shipping is ฿0.25 to anywhere in the US, and ฿0.60 to most international locations. We offer a 25% fee discount for any order of 10 or more Bitbills cards.

## Analysis 

Like the Casascius coins, and amidst the controversy of the patent filing, Bitbills' vulnerability hangs on the fact that the provider will have to print the private key on the card itself. The wording on the descriptions provided in the Bitcointalk thread details how the cards are no longer acceptable once the the card has been opened. This seemingly takes for granted the fact that **somebody had to print the QR code in the first place**. Bitbills ceased production in May 15, 2012.