---
title: Ryder
appId: ryder.one
authors:
- danny
released: 2023-11-01
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 41
- 55
- 15
weight: 45
provider: Ryder (Marvin Janssen)
providerWebsite: 
website: https://www.ryder.id/
shop: https://www.indiegogo.com/projects/ryder-one-stress-free-crypto-wallet-for-everyone
country: SG
price: 179USD
repository: https://github.com/Light-Labs/protocol
issue: 
icon: ryder.one.png
bugbounty: 
meta: ok
verdict: unreleased
appHashes: 
date: 2024-10-31
signer: 
twitter: Ryder_ID
social:
- https://www.instagram.com/ryder.btc/
- https://discord.gg/EA7SapF5hp
features: 

---

<iframe width="560" height="315" src="https://www.youtube.com/embed/mnZ6mb7CbY4?si=_pyCHphkQ6rDyk5o" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Update 2024-10-22

Two years later and we see that there has been some major development. There are some changes when it comes to how it looks. Although it is currently in pre-order on its own website, there are indications in its indiegogo page that they were able to raise funds and ship some devices. 

It was able to raise $225,152 SGD by 766 backers at the end of 2023. 

<iframe width="560" height="315" src="https://www.youtube.com/embed/yafEu5ApDok?si=ratGA8UyYbsghPHm" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

From the video, shipping would be delayed for 3 months more for security audits.

## Technical Specifications

- No seed phrases
- 100% offline
- No ports, no wireless connections (except NFC)
- AMOLED Touch Display (1.6" 320x360 px )
- Wireless charging
- Tempered glass, aluminium body, polycarbonate edge
- 200mAh lithium-ion rechargeable battery
- Supports 1,000+ digital currencies
- Secure button is directly connected to the Secure Element (EAL6+ Infineon SLC38)

## Analysis

From the unboxing video, we see that the Ryder device:
1. has to be paired with a mobile phone prior to activation. 
2. The user is then asked to input a passcode, and then the device generates the private keys offline using the secure element. 
3. Once the private keys and the wallet is created, the backup must be transferred by tapping another device called the NFC Recovery Tag near the Ryder One.
4. The backup is also performed on the paired mobile phone.
- Users can have more than 1 recovery tag
- Users can have social backups 

This system is called the TapSafe Recovery system which is based on Shamir Secret Sharing. [Watch the description for TapSafe Recovery System](https://www.youtube.com/watch?v=iQs8ZsO5GvQ)

To confirm transactions, the user has to tap the Ryder One two times on the paired NFC phone. [Watch it in action here](https://youtu.be/dIBUpqcWcp4?si=EizVBxpXvw7lWL_b&t=78)

### Private keys can be created offline ✅
### Private keys are not shared ❌ 
### Device displays receive address for confirmation ✅ 
### Interface ✅ 
### Reproducibility ❌

## Verdict

Until the device is widely available commercially, it is still **unreleased**.

## Product Description 2022-04-27

> the current Ryder prototype is a full implementation of the current Blockstack authentication algorithm
>
> Blockstack is a blockchain-based ecosystem where users retain control over their identities and data. 
>
> It currently features new wallet generation in hardware, recovery via seed input, identity selection, and more. To be compatible with the current authentication flow, it still exports the app private key, but this is merely a temporary measure to guarantee compatibility. The prototype is fully functional and can be used today. 

Marvin Janssen is the co-founder of Ryder. He envisions Ryder to be part of a "[hardware identity keychain.](https://marvinjanssen.medium.com/beyond-the-private-key-building-a-blockstack-hardware-identity-keychain-46418d90efd2)". This schema is further discussed in this diagram:
![](https://miro.medium.com/max/1400/1*aeVwQDXHvnGQh6F2rN9fpw.png) 

Ryder [received a grant of 5,000 USD from the Stacks Foundation](https://www.youtube.com/watch?v=bDuDW--LIr8) in 2021. It is in this video where they stated that they incorporated in Singapore.

## Analysis

Janssen stated that *"I really hope Ryder can be more than just another crypto wallet."* They have sent out the first batch of watches to what he described as the "pioneers". 

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">It is programming day. <a href="https://t.co/U8bnASMScM">pic.twitter.com/U8bnASMScM</a></p>&mdash; Ryder.btc (@Ryder_ID) <a href="https://twitter.com/Ryder_ID/status/1356743693911293952?ref_src=twsrc%5Etfw">February 2, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

He continues: 

> The Pioneers will provide the first feedback and allow us to reach the next milestone: a crowdfunding campaign. The next big task is to get Ryder up to speed and see how we can fit it into the Stacks 2.0 ecosystem.

As of April 8, 2022, Ryder is currently holding a pre-sale for Ryder NFTs. The NFTs are said to be redeemable for the device itself. 

> 2% of the sale will go to Ryder Open Hardware Development Fund
>
> There are seven Ryder NFT pledger tiers. Each comes with benefits and incentives packages as a thank you to our early supporters. Additionally, each tier comes with its unique rewards. Of course, the higher the tier, the better the reward.

The "basic" tier costs 50 STX. [1 STX costs roughly 1.27 USD as of 2022-04-08](https://coinmarketcap.com/currencies/stacks/). STX is currently trading in Binance.

Many of the specifics for the project - which encompasses not just the hardware wallet but other things as well, are discussed more thoroughly on their discord channel: 

> louise nakamoto — 11/18/2021<br>
@here another update for the maker community, in terms of manufacturing and where we are at. The general strategy is to work with a design house to deliver the 1st version of Ryder. We finished the commercial specification doc and from this document, the Technical Consultant will create a technical specification which he is currently doing. In this technical doc, we will describe the device functionality and pre-select device components which will be forwarded to the Design House as the preliminary technical vision. Shoutout to @bongbong for sending some choices on this. 
> 
> Before we move forward to the design house, we're still ironing out the following together with the technical consultant
>
> - Hardware requirements to support existing Ryder's firmware 
> - Hardware and software protection technologies
> - Efforts for implementing firmware drivers for porting Ryder's firmware from the hardware abstraction
> - Material Selection

If we're not mistaken, the only way to currently "purchase" the hardware wallet is by participating in the NFT pre-sale they're holding. Although prototypes of the device has clearly been seen online, it is not available for purchase through conventional means - such as a shopping cart. As such we determine this device as not yet released until further notice.




