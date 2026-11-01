---
title: Lubanso X1
appId: lubanso
authors:
- danny
released: 2018-10-12
discontinued: 2026-10-16
updated: 
version: 
binaries: 
dimensions:
- 62
- 28
- 7
weight: 36
provider: Hangzhou LUBANSO Technology Co., Ltd
providerWebsite: https://www.lubanso.com
website: 
shop: https://www.lubanso.com/x1
country: CN
price: 898 JPY
repository: 
icon: lubanso.webp
bugbounty: 
meta: discontinued
verdict: nosource
date: 2026-10-30
signer: 
twitter: lubanso
social:
- https://t.me/lubanso
- https://www.facebook.com/LUBANSO
builds: 
features:
- hd
- secEl
- segwit

---

**Update 2026-10-30:** LUBANSO is shutting down. A [notice dated 2026-10-16](https://www.lubanso.com/) says the X1 service runs until 2026-12-31 and asks users to move their coins before then; buyers from 2026 can ask for a refund until 2026-11-30. The X1 shop page now only shows this notice. The X1 uses a standard BIP39 recovery phrase, so the coins can be restored in other wallets.

## Product Description from [Website](https://web.archive.org/web/20250905222604/https://www.lubanso.com/x1)

> - Operating System: LBTOS
> - Bank grade secure chip: EAL 4+
> - Two-way dual authentication: Authentication between server and LUBANSO wallet
> - All-alloy material - with 2.5D tempered glass
> - Support multi-currency: Already support BTC, ETH, BCH, EOS, USDT, LTC, BCD, ERC-20, EOS Token
> - Supports: BIP44, BIP49, BIP84, BIP39
> - Restore account: Restore your account in any other BIP 39 supporting device
> - Extensible architecture: Do not need to buy a new wallet to install new Apps
> - Manager App: Support Windows, Mac OS
> - Support BIP39 Chinese and English bilingual aids (mnemonics)
> - 0.96 inch display + buttons 

### Basic Operation 

> 1. Connect wallet
>
> Use the USB connection line to connect the LUBANSO X1 hardware wallet to the computer.
>
> 2. Set PIN code
>
> Set the initial PIN code for the wallet.
>
> 3. Use customer
>
> Download and turn on the computer client to start using.

## Analysis 

1. We cannot find information about the operating system: LBTOS
2. A quick search cannot find the Lubanso Manager Apps source code
- The latest version for this is v1.5.4
3. Lubanso has not made any claims that it has publicly available source
4. The device is plugged in to a desktop PC via USB and then connects to the Lubanso Manager App. 

We are inclined to note the following details: the software is proprietary and the reliance on another device could pose some risks.

{% include featureEvidence.html feature="hd" quote="Supports: BIP44, BIP49, BIP84, BIP39" source="Website" comment="BIP39 mnemonic backup and multiple derivation paths confirm HD wallet support recoverable on competitor products" %}

{% include featureEvidence.html feature="segwit" quote="Supports: BIP44, BIP49, BIP84, BIP39" source="Website" comment="BIP49 (P2SH-P2WPKH) and BIP84 (native bech32) indicate full SegWit support" %}

{% include featureEvidence.html feature="secEl" quote="Bank grade secure chip: EAL 4+" source="Website" %}
