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
price: 229USD
repository: 
icon: ryder.one.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2025-11-03
signer: 
twitter: Ryder_ID
social:
- https://www.instagram.com/ryder.btc/
- https://discord.gg/EA7SapF5hp#deadLink
builds: 
features: 

---

This device's companion app is {% include walletLinkArchived.html wallet='android/id.ryder.ryderone' %}

## Updated Analysis 2025-11-03

The device has been **[released](https://ryder.id/blogs/news/ryder-one-is-now-officially-shipping-1)** on 2025-04-30.

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/WxOzGlUw5gI?si=_e65xFxVg5RhQ_mE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

The previous analysis remains. 

As of 2025-11-03, the repository for the device is still not publicly available.

This device is **not source available**.

* * *

### Previous Analysis 2025-10-03 

**1. Can the private keys be created offline?** 

They [claim](https://ryder.id/pages/ryder-terms-of-service) that:

> Seed Phrase Storage: All recovery seed phrases are generated offline within the device and securely stored in a protected environment, thereby minimising exposure to external threats or unauthorised access. 

**2. Are the private keys shared between devices?**

Here's where it gets complicated. Initial marketing indicated their desire to do-away with seed phrases. But this changed on release, and is included in their [terms and conditions page:](https://ryder.id/pages/ryder-terms-of-service)

> Recovery Seed Phrases: While Ryder One primarily relies on its TapSafe social recovery protocol, it also supports the secure generation and storage of recovery seed phrases in compliance with widely recognised industry standards, including BIP39. These seed phrases consist of a sequence of 12, 18, or 24 words that act as a master key, allowing Users to restore access to their wallet and associated digital assets if the physical device is lost or becomes unusable.

But apart from that Ryder One makes use of their **TapSafe Recovery Protocol** herein described:

> TapSafe is Ryder’s social recovery protocol integrated within the Ryder App. It enables users to generate multiple encrypted backup shares of their recovery secret using secure secret-sharing methods. These shares can be stored in different locations, such as:
>
> - A Recovery Tag (included with the device);
> - The User’s mobile device (via the Ryder App); and
> - Recovery Contact’s devices.
>
> TapSafe supports both self-managed and socially distributed recovery. A minimum of two full shares are required to reconstruct the wallet and regain access to digital assets. Shares stored by trusted individuals via the Ryder App for instance, Recovery Contacts represent partial shares for instance, 0.5 each, and must be combined to meet the required threshold for recovery.

Does Shamir-sharing on multiple other devices and social-sharing = "sharing" to other devices? If yes, then it fails this test. Otherwise, if no, we shall proceed.

**3. Does the device display the receive address for confirmation?**

[FAQ](https://ryder.id/products/ryder-one)

> All transaction approvals and cryptographic signing are conducted directly on the device, requiring explicit User confirmation via the Secure buttons. The Secure Button is physically connected to the device’s Secure Element chip and is isolated from the general-purpose hardware, ensuring that sensitive keys never leave the device and that transaction authorisation cannot be spoofed or compromised via the touch display. This design ensures Users retain ultimate control over transaction authorisation. 

**4. Does its interface have a physical button and a screen?**

Yes, see above.

**5. Is the firmware source-available?**

From their [FAQ](https://ryder.id/products/ryder-one) (scroll down)

Their answer is "yes", but we answer "no"

> Yes, Ryder One will be open source in 2025, with TapSafe Recovery permissively licensed. The source code will be opened gradually throughout the year. We’ll also invite third-party vendors to support TapSafe Recovery, much like many wallets support seed phrases today.

At the time of this writing, Ryder's repository list includes the following: 

- **stx-profiles** --- 
- **stacks-wallet-web** --- Stacks Wallet is a browser extension for managing your digital assets and connecting to apps built with the Stacks blockchain.
- **ryder-nft** --- Source code for Ryder NFT.
- **ryder-bridge-rust** --- Bridge to ryder device in rust.
- **rydcon** --- 
- **ryder-prototype-firmware-releases** --- Ryder simulator and firmware. (Only has 2 files)
- **ryder-cli-proto** --- A basic command-line interface to manage Ryder prototype devices.
- **ryder-client** --- A library to facilitate communications between an application and Ryder device.
- **community-handles** --- BNS names for communities.
- **react-native-nfc-manager** --- React Native NFC module for Android & iOS.
- **cryptoglyphs-ts** --- 
- **stacks-reference-data** --- 
- **clarity-xbtc-send-many** --- Clarity contract for sending xbtc to many recipients in one transaction.
- **media-metadata-schemas** --- A repository of known JSON metadata schemas for SIP-009 NFTs on Stacks.
- **ryder-bridge** --- 
- **ryder-proxy-proto** --- A drop-in replacement for the Blockstack Browser.

None of which is indicative of a full and currently updated firmware repository. The prototype firmware releases, has not been updated for a long time (2022) and consists only of a "simulator" in the releases and two text files.

### Verdict

The firmware's source is **not publicly-available**.

<iframe width="560" height="315" src="https://www.youtube.com/embed/mnZ6mb7CbY4?si=_pyCHphkQ6rDyk5o" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

* * *

### Previous Review 2024-10-22

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

### Analysis

From the unboxing video, we see that the Ryder device:
1. has to be paired with a mobile phone prior to activation. 
2. The user is then asked to input a passcode, and then the device generates the private keys offline using the secure element. 
3. Once the private keys and the wallet is created, the backup must be transferred by tapping another device called the NFC Recovery Tag near the Ryder One.
4. The backup is also performed on the paired mobile phone.
- Users can have more than 1 recovery tag
- Users can have social backups 

This system is called the TapSafe Recovery system which is based on Shamir Secret Sharing. [Watch the description for TapSafe Recovery System](https://www.youtube.com/watch?v=iQs8ZsO5GvQ)

To confirm transactions, the user has to tap the Ryder One two times on the paired NFC phone. [Watch it in action here](https://youtu.be/dIBUpqcWcp4?si=EizVBxpXvw7lWL_b&t=78)

#### Private keys can be created offline ✅
#### Private keys are not shared ❌ 
#### Device displays receive address for confirmation ✅ 
#### Interface ✅ 
#### Reproducibility ❌

### Product Description 2022-04-27

> the current Ryder prototype is a full implementation of the current Blockstack authentication algorithm
>
> Blockstack is a blockchain-based ecosystem where users retain control over their identities and data. 
>
> It currently features new wallet generation in hardware, recovery via seed input, identity selection, and more. To be compatible with the current authentication flow, it still exports the app private key, but this is merely a temporary measure to guarantee compatibility. The prototype is fully functional and can be used today. 

Marvin Janssen is the co-founder of Ryder. He envisions Ryder to be part of a "[hardware identity keychain.](https://marvinjanssen.medium.com/beyond-the-private-key-building-a-blockstack-hardware-identity-keychain-46418d90efd2)". This schema is further discussed in this diagram:
![](https://miro.medium.com/max/1400/1*aeVwQDXHvnGQh6F2rN9fpw.png) 

Ryder [received a grant of 5,000 USD from the Stacks Foundation](https://www.youtube.com/watch?v=bDuDW--LIr8) in 2021. It is in this video where they stated that they incorporated in Singapore.

### Analysis

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




