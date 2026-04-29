---
title: Bitkey
appId: blockhww
authors:
- danny
released: 2024-03-14
discontinued: 
updated: 2026-04-29
version: 2024.50.0
binaries: https://github.com/proto-at-block/bitkey/
dimensions:
- 66
- 60
- 14
weight: 79
provider: Block
providerWebsite: https://block.xyz/
website: https://bitkey.world
shop: https://bitkey.world/en-US/products/bitkey
country: US
price: 250USD
repository: https://github.com/proto-at-block/bitkey
icon: blockhww.png
bugbounty: https://support.bitkey.world/hc/en-us/articles/19812055576852-How-do-I-report-potential-security-issues
meta: ok
verdict: custodial
appHashes: 
date: 2024-03-14
signer: 
twitter: Bitkey
social:
- https://www.linkedin.com/company/bitkey-official
- https://www.facebook.com/profile.php?id=100088526238789
- https://www.instagram.com/ownbitkey
builds: 
features:
- fingerprint
- foss
- multiSig
- nfc

---

**Disclaimer**: The WalletScrutiny project is sponsored by Spiral, a subsidiary of Block.

This product has a companion app: {% include walletLink.html wallet='android/world.bitkey.app' verdict='true' %}.

## Update, 2026-04-29: New Hardware Revision

Block announced a new Bitkey device at Bitcoin 2026 (April 27–29, 2026). The new hardware features an OLED touchscreen — a significant departure from the original 2023 model, which had no screen or physical buttons. The original form factor (56×62×13mm, 65g, $150) is superseded; the new device ships at 66×60×13.6mm, 79g, and $250. All analysis below reflects the **new 2026 revision**.

## Description

Bitkey is a hardware wallet made from Corian solid surface and stainless steel. Unlike traditional hardware wallets, Bitkey uses a 2-of-3 multisignature scheme: one key lives on the hardware device, one on the companion mobile app, and one on Block's servers. Any transaction requires two of the three keys. The server key is encrypted and [described as inaccessible without the customer's participation](https://bitkey.build/not-our-keys-not-our-business/).

The new hardware revision adds an OLED touchscreen and retains the fingerprint biometric sensor, NFC connectivity, and the Corian/stainless steel casing. Bitkey's current product documentation emphasizes touchscreen and fingerprint interaction and does not describe traditional physical navigation buttons.

## Key Handling and Custody

Bitkey explicitly has **no seed phrase**. There is no BIP39 mnemonic to back up or export. This is an intentional design choice. Bitkey instead promotes a seedless 2-of-3 multisig model with cloud-backed recovery and an Emergency Exit Kit. See [How Bitkey Works](https://bitkey.world/learning-hub/how-bitkey-works) and [The end of seed phrase scams](https://bitkey.build/the-end-of-seed-phrase-scams/).

The practical consequence is more specific than that. If a user still has their hardware device, access to the encrypted Emergency Exit Kit PDF stored in their cloud account, and a phone environment that still has the locally cached CSEK in Bitkey's encrypted store, Bitkey says its [Emergency Exit Kit](https://support.bitkey.world/hc/en-us/articles/24395170222868-What-is-an-Emergency-Access-Kit-and-how-does-it-work) lets them move funds without relying on Block's servers. But if the user loses both their phone and hardware at the same time, recovery depends on having set up a Recovery Contact in advance and on Bitkey's cloud-backed recovery flow.

Additionally, if the user enables Bitkey's optional Transfer without hardware feature, Block's server key can co-sign transactions **up to the user's configured spending limit** without requiring the hardware device. In that mode, the hardware wallet is not a mandatory participant in all fund movements.

Whether this constitutes custody depends on framing:
- Block does not control funds unilaterally (2-of-3 always requires the customer's key for high-value transactions).
- But Block can co-sign below the spending limit without hardware, and recovery ultimately depends on Block's servers.
- Users cannot export a standard BIP39 seed or restore Bitkey through a seed phrase.

## Analysis

| Question | Answer | Evidence |
|---|---|---|
| Can the private keys be created offline? | ❓ | Bitkey's hardware key appears to be generated on the device itself. Setup requires pairing the hardware with the companion app, and Bitkey's wallet architecture includes a third key held on the Bitkey server. Because the system relies on the phone app, a server-held key, and cloud-backed recovery features, it is not a fully air-gapped design. |
| Are the private keys shared? | ❌ | Bitkey says one of the three keys is held on the Bitkey server. For the optional Transfer without hardware feature, Bitkey co-signs transactions up to the user's daily limit without requiring the hardware device. Sources: [How Bitkey Works](https://bitkey.world/learning-hub/how-bitkey-works), [Transfer without hardware](https://support.bitkey.world/hc/en-us/articles/19427218356500-How-do-I-set-up-Transfer-without-hardware-and-a-transfer-limit). |
| Does the device display the receive address? | ✔️ | The 2026 revision has an OLED touchscreen. Address display is expected; full capability documentation from Block is pending. The original 2023/2024 device had no screen. |
| Does the interface have a display screen and buttons? | ✔️ | The new device has an OLED touchscreen display and a fingerprint sensor used for unlocking and approvals. Bitkey's current product documentation does not describe any traditional physical navigation buttons. |
| Is it reproducible? | ❓ | The Android companion app has a [verifiable build process](https://github.com/proto-at-block/bitkey/blob/main/app/verifiable-build/android/README.md) in the repository. Device firmware is published under Commons Clause (modified MIT), but byte-identical reproducible builds of the firmware have not been independently confirmed. |

### Setup

- Download the Bitkey app.
- Open the app and choose "Set up new wallet."
- Pair the hardware device with the app using NFC.
- Enroll the user's fingerprint following the app's prompts.
- Complete cloud backup (iCloud for iOS, Google account for Android).
- Establish recovery contact methods; email is mandatory.

### Multisignature

- Three keys: hardware device, mobile app, Block's servers.
- Two of three required to authorize any transaction.
- Block's server key co-signs when:
  - The hardware device is used (hardware + server), or
  - The transaction is below the customer's configured spending limit (phone + server, no hardware required).

### Recovery Options

Available recovery options [per Bitkey support](https://support.bitkey.world/hc/en-us/articles/18801968949652-What-recovery-methods-are-available):

- **Cloud recovery**: Lost/replaced phone with cloud backup available.
- **Delay + Notify**: Lost/replaced phone without cloud backup; or lost/replaced hardware device.
- **Cloud Health Check**: Lost/replaced cloud account.
- **Trusted Contacts**: Lost both hardware device and phone near simultaneously.
- **Emergency Exit Kit**: Bitkey app unavailable, or the user wants to exit without relying on Bitkey servers. Bitkey says this was formerly called the Emergency Access Kit.

The first four recovery methods are still part of Bitkey's hosted recovery design. The Emergency Exit Kit is different: Bitkey says it lets users move funds without connecting to Block or Bitkey servers, but the repo's restore path also depends on the locally cached CSEK in the app's encrypted store.

### Fingerprint Scanner

The fingerprint scanner unlocks the device and authorizes actions in the app. Bitkey says fingerprint authentication is currently the only supported way to secure and unlock the hardware device: [Do I have to use a fingerprint to secure my Bitkey hardware device?](https://support.bitkey.world/hc/en-us/articles/18843390579860-Do-I-have-to-use-a-fingerprint-to-secure-my-Bitkey-hardware-device)

## Verdict

Bitkey makes the following non-custodial claims, all of which are accurate as far as they go:

- The user holds two of the three keys (hardware device and mobile app).
- Block [states](https://bitkey.build/not-our-keys-not-our-business/) it cannot move funds without the customer's participation.
- For transactions above the user's spending limit, the hardware device must be present.
- An [Emergency Exit Kit](https://support.bitkey.world/hc/en-us/articles/24395170222868-What-is-an-Emergency-Access-Kit-and-how-does-it-work) exists as a way to move funds without Bitkey servers if the user still has their hardware device, the encrypted PDF backup, and the locally cached CSEK in the app's encrypted store.
- The 2026 revision adds an OLED touchscreen, addressing the original blind-signing concern.

WalletScrutiny's [custodial verdict definition](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/_data/verdicts/custodial.yml?ref_type=heads#L17) addresses this class of argument directly:

> *"Some services might claim their setup is super secure, that they don't actually have access to the funds, or that the access is shared between multiple parties. For our evaluation of it being a wallet, these details are irrelevant."*

The relevant test is not whether Block's architecture is well-designed or whether the claims above are true. The test is: **is the user unconditionally sovereign, under all conditions, without depending on any external party?**

The answer is no, for two reasons:

**1. Block is structurally part of the signing topology.**
Bitkey says one of the three keys is held on the Bitkey server. For the optional [Transfer without hardware](https://support.bitkey.world/hc/en-us/articles/19427218356500-How-do-I-set-up-a-transfer-limit) feature, Bitkey co-signs transactions up to the user's daily limit without requiring the hardware device. In that mode, the hardware wallet is not a mandatory participant in all fund movements. Block is therefore not merely a backup key holder; it can also act as an active co-signer for user-enabled spending flows.

**2. There is no standard seed backup, and most recovery flows are still Bitkey-defined.**
Bitkey [explicitly does not issue a BIP39 mnemonic](https://bitkey.world/learning-hub/how-bitkey-works). Most recovery flows — cloud recovery, Delay+Notify, Cloud Health Check, and Trusted Contacts — remain part of Bitkey's own recovery design. Bitkey does document a server-independent Emergency Exit Kit, but that path only helps if the user still has their hardware device, the encrypted PDF backup, and the locally cached CSEK available through the app's encrypted local store.

Bitkey removes single-point failure, but it also makes Block part of the wallet's supported spending and recovery model. Even after accounting for the Emergency Exit Kit, the provider remains inside the signing topology and inside most recovery flows. That dependency is part of the product's intended design. Under a strict reading of [WalletScrutiny's methodology](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/_data/verdicts/custodial.yml?ref_type=heads#L17), that is enough to classify Bitkey as custodial.

**Verdict: custodial.**

{% include featureEvidence.html feature="foss" quote="Software is licensed by Block, Inc. under the following MIT License (the &quot;License&quot;), and with no warranties or guarantees." source="GitHub README" %}

{% include featureEvidence.html feature="multiSig" quote="Bitkey's 2-of-3 multisig setup is built into every wallet. You hold two keys: one on your Bitkey device and one in the app. A third is encrypted on a server and can't be used without one of your other keys." source="Website" %}

{% include featureEvidence.html feature="fingerprint" quote="Fully Integrated Bitkey's app and hardware were built together from the ground up to eliminate the complexities of traditional hardware wallets." source="Website" %}

{% include featureEvidence.html feature="nfc" quote="Pair the hardware device with the app using NFC (no initial charging required)." source="Website" %}
