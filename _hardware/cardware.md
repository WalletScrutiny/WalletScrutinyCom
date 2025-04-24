---
title: Cardware
appId: cardware
authors:
- danny
released: 2025-02-28
discontinued: 
updated: 2025-02-28
version: v1.0.0
binaries: 
dimensions:
- 86
- 54
- 11
weight: 60
provider: Cardware Wallet (Pty) Ltd.
providerWebsite: 
website: https://www.cardwarewallet.com
shop: https://www.cardwarewallet.com/btcproducts
country: ZA
price: 77USD
repository: https://github.com/cardware-wallet/cardware-hardware
issue: https://github.com/cardware-wallet/cardware-hardware/issues/1
icon: cardware.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes: 
date: 2025-04-02
signer: 
reviewArchive: 
twitter: CardwareWallet
social:
- https://t.me/cardwarewallet
- https://discord.com/invite/dgDXR85CXB
- https://www.linkedin.com/company/cardware-wallet
features: 

---

## Device Description

1. **Form Factor**: Cardware Wallet is a hardware cryptocurrency wallet with a transparent circuit board design that allows visual verification of internal components.

2. **Air-Gapped Security**: 100% air-gapped device with no internet, Bluetooth, or Wi-Fi connectivity, operating completely offline.

3. **Power System**: Powered via USB-C with only power and ground connections active; all data lines are physically disconnected and visibly verifiable through the transparent design.

4. **Key Generation**: Supports multiple high-entropy key generation methods:
   - Hashed video streams (capturing random pixel data)
   - D20 dice rolls (64 times)
   - D6 dice rolls (100 times)

5. **Secure Element**: Utilizes an EAL6+ certified secure element chip for key storage and cryptographic operations.

6. **Firmware Architecture**: Non-upgradable firmware stored in secure, read-only memory to prevent unauthorized modifications.

7. **Memory Protection**: Incorporates read/write protection mechanisms on both the secure element chip and STM32 microcontroller.

8. **Transaction Signing**: Secure transaction signing via QR codes while keeping private keys isolated.

9. **Multi-Signature Support**: Supports multisig wallets requiring multiple private keys to authorize transactions.

10. **Wallet Structure**: Supports BIP-32 compliant Hierarchical Deterministic (HD) wallets.

11. **Cryptocurrency Support**: Available in two versions:
    - BTC-Only Version
    - BTC and EVM Version (supporting Bitcoin, Ethereum, ERC-20 tokens, and EVM-compatible blockchains)

12. **Backup Solution**: Utilizes a 24-word mnemonic seed phrase with a provided steel seed phrase sheet for physical backup.

## Analysis

1. **Are the private keys created offline?** ✅
   *"Cardware Wallet is an 100% air-gapped, 100% offline hardware wallet" and "High Entropy Key Generation: Cardware Wallet uses hashed video streams or repeated dice rolls (D20 or D6) to generate highly unpredictable private keys."*

2. **Are the private keys shared?** ✅
   *The device emphasizes that "private keys never connect to external networks" and utilizes a "secure element chip for key storage" with "read/write protection" to prevent unauthorized access.*

3. **Does the device display receive address for confirmation?** ✅
   *Yes. This is seen in this [video demonstration.](https://youtu.be/ZpyfffAOCTU?si=IHydjxWeRamOB8Np)*

4. **Does the device have a screen interface and button?** ✅
   *Yes.*

5. **Is the firmware reproducible?** 
   *The firmware is described as "fixed and non-upgradable". The firmware's repository is [available.](https://github.com/cardware-wallet/cardware-hardware)*

We filed an [issue](https://github.com/cardware-wallet/cardware-hardware/issues/1) with them. For now, this device is **for verification** 
