---
title: Cypherock X1
appId: cypherockx1
authors:
- kiwilamb
- danny
- Vipul
- leo
- Mohammad
- keraliss
released: 2022-04-07
discontinued: 
updated: 2026-02-25
version: 0.6.3329
binaries: https://github.com/Cypherock/x1_wallet_firmware/releases/
dimensions:
- 30
- 64
- 15
weight: 200
provider: Cypherock
providerWebsite: https://cypherock.com/
website: https://www.cypherock.com/
shop: https://shop.cypherock.com/
country: IN
price: 199USD
repository: https://github.com/Cypherock/x1_wallet_firmware
icon: cypherockx1.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes:
- cacd04d1c6a5e2bd4f9c0adc56ab46e431fbb2347f29130290f02383ac8a7562
date: 2025-09-05
signer: 
twitter: CypherockWallet
social:
- https://www.linkedin.com/company/cypherockwallet
- https://www.youtube.com/playlist?list=PL0db5IfQ4iyriWCgby_rJKeG31BLoxW7k
builds:
- arch: arm
  types: bitcoin
features:
- hd
- nfc
- secEl
- tradeAlts

---

{% include featureEvidence.html feature="hd" source="[README](https://github.com/Cypherock/x1_wallet_firmware#readme)" quote="X1Wallet supports the feature to import any BIP39 compliant wallets" %}
{% include featureEvidence.html feature="nfc" source="[README](https://github.com/Cypherock/x1_wallet_firmware#readme)" quote="data exchange happens securely via NFC eliminating any risks of NFC spoofing" %}
{% include featureEvidence.html feature="secEl" source="[Website](https://www.cypherock.com/)" quote="X1 Cards are encrypted NFC-based smartcards with EAL 6+ secure elements." %}
{% include featureEvidence.html feature="tradeAlts" source="[Website](https://www.cypherock.com/)" quote="Experience fast and secure crypto swaps with Cypherock X1" %}

*Legacy verification [here](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/4b8adc136ccda7863004060fb71745394ded985f/_hardware/cypherockx1.md)*

**Disclaimer:** Vipul is the main author of this Analysis and also a contributor
at Cypherock.

Cypherock was announced in a Bitcointalk ANN thread on February 14, 2020.

Cypherock X1 uses Shamir Secret Sharing to split the private key into 5 shards. Each of the 5 shards are independently stored on the hardware components, namely the X1 Wallet and 4 NFC enabled X1 cards. By implementing a 2/5 cryptographic threshold, a user only requires the X1 Wallet and 1 X1 card to re-create the private key and conduct transactions. Additionally, users don’t need to maintain any form of seed phrase backup as the hardware components themselves act as recovery tools. Cypherock’s private key management architecture not only eliminates the single point of failure of storing private keys in a singular location, but also solves for risks associated with seed phrase backups.
 
## Key features
- The code for the X1 Wallet is [open source](https://github.com/Cypherock/x1_wallet_firmware)
- Users can create a new wallet on the device or import their existing BIP39 compatible wallet to Cypherock X1 without connecting to the internet
- The X1 Wallet is the interfacing device on which the seed regeneration and transaction operations are performed. X1 Wallet also stores 1 of the 5 Shamir shares.
- Each of the 4 remaining Shamir shares is stored in a EAL5+ tamper resistant secure element chips. These are the same smart cards that are used in commercial debit and credit cards.
- Private keys can be recovered by tapping any 1 out of the 4 X1 cards on the X1 Wallet. Shamir secret share stored in the X1 cards and X1 Wallet can optionally be protected using a PIN. The recovered keys are stored in a volatile memory on the X1 Wallet which gets wiped out as soon as the operation is done.
- As Cypherock X1 Wallet does not store the private key as a whole, it is impossible to steal crypto assets in rest state.
- X1 Wallet supports upto 4 wallet recovery phrases, which can be used for transactions or even as a backup.
- X1 Wallet user can view the portfolio of all the 4 wallets from a single screen on their PC on the companion Cypherock CySync desktop application.
- X1 Wallet provides increased security against $5 wrench attack by distributing card into different geographical locations.
- X1 Wallet provides a 5 way navigation switch to perform user actions such as screen navigation and text input.

From the [FAQ](https://www.cypherock.com/faq/): Can the company somehow steal the digital assets of the user?
- It is not possible for the company to steal the digital assets of the users. Cypherock X1 Wallet can recreate the private keys without internet access. The device needs to be connected to the internet just for broadcasting the transaction on the blockchain.
- The provider further claims to use entropy from the ATECC608A "secure element" (which is not open to public audit) as well as from the microprocessor which runs the open source code. Thus, it should be able to prevent poor entropy backdoors in the closed source of the ATECC608A.

## Public repository containing source code

- Cypherock X1 Wallet firmware is open sourced, hosted in GitHub repo: [Cypherock/x1_wallet_firmware](https://github.com/Cypherock/x1_wallet_firmware)
- Latest release source code: [Release v0.4.1290](https://github.com/Cypherock/x1_wallet_firmware/releases/tag/v0.4.1290)
- Cypherock X1 Wallet firmware is released in 2 flavors, “***initial firmware***” and “***main firmware***”.
  - ***Initial firmware*** is installed on the device during manufacturing. It provides minimum functionality such as X1 Wallet and X1 Card authentication which checks if the product is genuine or not. This firmware does not support any wallet related functionality. The initial firmware ceases to exist before any wallet activity is initiated.
  - ***Main firmware*** full fledged wallet related functionality and is installed on the device via the companion Cypherock CySync desktop application.

## Reproducibility of the release binary from the source code
- Cypherock X1 Wallet firmware binary is signed by two private keys. The signature and a signed header is appended on top of firmware binary to form the complete Cypherock X1 Wallet firmware image. 
- An important thing to note here is that the Cypherock X1 Wallet firmware release binary is compiled using Docker. 
- Fingerprint (SHA256 digest) of the latest Cypherock X1 Wallet firmware binary (unsigned) can be found on the release page: [Release v0.4.1290](https://github.com/Cypherock/x1_wallet_firmware/releases/tag/v0.4.1290)
- The docker file corresponding to the latest release can be found here: [Dockerfile v0.4.1290](https://github.com/Cypherock/x1_wallet_firmware/blob/v0.4.1290/Dockerfile)
- List of tools required to successfully build the project can be found here: [Building project](https://github.com/Cypherock/x1_wallet_firmware/tree/v0.4.1290#building-project)
- Sequence of commands run on docker can be found here: [Docker commands v0.4.1290](https://github.com/Cypherock/x1_wallet_firmware/blob/v0.4.1290/.github/workflows/containerized-build.yml)

