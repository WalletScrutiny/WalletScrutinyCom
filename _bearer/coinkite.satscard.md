---
title: CoinKite SATSCARD
appId: coinkite.satscard
authors:
- danny
released: '2022-01-24'
discontinued: 
updated: '2022-07-06'
version: '1.0.5'
binaries: 
dimensions:
- 86
- 54
- 1.2
weight: 
provider: Coinkite
providerWebsite: https://coinkite.com/
website: https://getsatscard.com/
shop: https://store.coinkite.com/store/satscard
country: CA
price: 6.99 USD
repository: 
issue: 
icon: coinkite.satscard.png
bugbounty: 
meta: ok
verdict: sealed-plainkey
date: '2023-08-03'
signer: 
reviewArchive: 
twitter: SATSCARD
social:
- https://www.facebook.com/CoinKite/
- https://www.linkedin.com/company/coinkite/
features: 

---

## Background 

<iframe width="560" height="315" src="https://www.youtube.com/embed/h-hJz9hZgLQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Updated Review 2023-08-03

- The provider claims that the product is non-custodial.

According to their [documentation found on GitHub](https://github.com/coinkite/coinkite-tap-proto/blob/master/docs/best-practices.md):

  > Highlight when the first slot is unsealed. It is not bad or wrong, but it means that the QR code printed on the card back should no longer be used. The assumption is once a slot is unsealed, the private key is public.
  >
  > Not all SATSCARD will have a printed QR on the back. For now, all cards will have the first slot picked at factory, but we may ship a SATSCARD someday with the first slot unused. In that case, the chain_code argument to setup must be provided by your app (32-byte nonce).

The NFC card has no display, and needs another app such as {% include walletLink.html wallet='android/io.nunchuk.android' verdict='true' %}. It has to be unsealed. To sign transactions, the NFC card has to be brought close to the NFC-enabled phone with a compatible app. 

## Previous Analysis 2022-04-29

## Product [FAQ](https://getsatscard.com/faq)

> What is SATSCARD™?<br />
> - Like cash in hand, pass physical Bitcoin along multiple times. Gift. Anonymous. Trust no one.
> - SATSCARD is new type of OPENDIME® in an NFC card form factor with ten times the reuse capacity.
> - Gift and trade Bitcoin physically; maximize in person trading while minimizing trust between parties.

**How do I unseal it to reveal the Bitcoin?**
> You need a companion app on a mobile phone to run the unseal command. It will ask for the spending code, a 6-digit card verification code (CVC), to authorize the change.

**Do I need this paper envelope it came in?**
> Yes! That's a special radio frequency (RF) blocking sleeve. It prevents unwanted access by RF readers with bad intentions. Be sure to insert the SATSCARD fully into the sleeve: even 5 mm sticking out can allow a sneaky reader to get a signal.

**Can I use a SATSCARD with a computer (desktop, laptop)?**
> Yes! You need a USB NFC card reader and the cktap command-line software. Or any desktop wallet that uses our open protocol.

**Why multiple slots?**
> The original OPENDIME had a single private key, and once unsealed, that's that. With ten slots, you can use a SATSCARD over and over.

**Does this replace my existing Bitcoin wallet?**
> No, you still would need a third-party wallet or Bitcoin Core to move your funds in and out of the SATSCARD.

**How do I get funds out?**
> 1. Unseal the current slot (factory default slot is zero) and export the WIF.
> 2. Import the WIF into a wallet on the blockchain and sweep the funds.

**Is the private key unique and secret?**
> Yes. SATSCARD comes with a private key for slot zero only. You can supply entropy (random numbers) to generate keys for the remaining slots as you use them. The factory-generated address is made from the block hash (at the "birth height" of the card) and a random number that never leaves the card.

**How do I see the deposit address?**
> The first slot is pre-programmed, so using the QR code on the back of the card will send funds to the first slot.

More information can be found in the [GETSATSCARD FAQ](https://getsatscard.com/faq).

## Documentation 

- [Docs and Spec subdirectory (./docs)](https://github.com/coinkite/coinkite-tap-proto/blob/master/docs)
  - [Protocol specification](https://github.com/coinkite/coinkite-tap-proto/blob/master/docs/protocol.md)
  - [NFC specification](https://github.com/coinkite/coinkite-tap-proto/blob/master/docs/nfc-spec.md)
  - [Developer's Guide and Usage Hints for TAPSIGNER](https://github.com/coinkite/coinkite-tap-proto/blob/master/docs/tapsigner-hints.md)
 
## Analysis 

As of today, April 14, 2022 the Satscard is **yet to be released**. However at the interim, there are several concerns that arise. One of them is addressed by CoinKite itself in their own FAQ: the **RF blocking sleeve.** 

Quoted:

> It prevents unwanted access by RF readers with bad intentions. Be sure to insert the SATSCARD fully into the sleeve: even 5 mm sticking out can allow a sneaky reader to get a signal.

Up to what extent is a "sneaky RF reader" with bad intentions able to do damage to the contents of a card?  

Another is the **lack of a display or of an interface** to the cards. We do understand that they're meant to be handed over physically to another person however we also recognize that requiring a mobile phone app, or another computer system with an NFC card reader in order for the receiving party to verify the contents of a card does pose some risks. 