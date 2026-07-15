---
wsId: openWallet
title: 'Open Wallet: BTC & ETH Wallet'
date: 2025-11-14
authors:
- danny
website: https://openwallet.finance/
twitter: openwallet_com
redirect_from:
- /android/com.finverselabs.openwallet/
- /iphone/com.finverse-labs.openwallet-mainnet/
android:
  appId: com.finverselabs.openwallet
  users: 100000
  appCountry: us
  released: 2024-07-01
  updated: 2026-06-25
  version: 2026.6.36
  reviews: 8
  icon: com.finverselabs.openwallet.png
  meta: ok
  verdict: custodial
  developerName: FinVerse Labs FZ-LLC
iphone:
  appId: com.finverse-labs.openwallet-mainnet
  idd: '6502636684'
  appCountry: ee
  released: 2024-06-18
  updated: 2026-07-13
  version: '1.53'
  reviews: 39
  icon: com.finverse-labs.openwallet-mainnet.jpg
  meta: ok
  verdict: custodial
  developerName: Finverse Labs

---

## Android

## App Description

Open Wallet is a multi-chain crypto application that integrates asset management, NFT viewing, and Web3 connectivity across several supported blockchains.

The app supports Bitcoin (BTC), according to its Play Store listing, alongside assets on networks such as Ethereum, Polygon, Arbitrum, and Optimism.

Its security model uses passkey-based authentication and a keyless recovery workflow instead of traditional BIP39 seed phrases.

Open Wallet also provides WalletConnect support for interacting with dApps and includes tools for managing NFTs and tokens across multiple EVM-compatible ecosystems.

## Analysis

We installed the app and was presented with signup and verification steps. Apart from the standard email, otp, 2fa they also asked us several times to provide our screen locking pin. They also asked us to save backup codes:

```
9b691b3d71
39178eac42
d1e70e806d
4705ae4e23
0f54cbcf95
6969277468
05e0a83105
babbbbaab8
87fdd3d7d6
b859479560
```

The private key they provided did not look like a standard Bitcoin private key: 

```
-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQghq/4mTrzBftlgOwx
UW6E0knYunnEx4nmTuZ6DSKIi+qhRANCAARpcamCLtF5EOE+k6uYNj/7QdgIYz75
R1Dk4kZRVrYEVBgSsYB4QdEnOerT8E6AuZxH0dYTyBhRckMpwTfuTtQR
-----END PRIVATE KEY-----
```

We learned that this was a `EC P-256 (secp256r1) PKCS#8 key` and not the standard Bitcoin `raw 32-byte secp256k1`

In their [terms](https://openwallet.finance/terms-conditions/), they describe themselves as non-custodial:

> 14.3.5
> OpenWallet does not, and will never, have custody or direct control over the funds, cryptocurrencies, or cryptographic tokens of End Users at any point.

What is their keyless recovery mechanism then?

> Our Solution
>
> Trustless, Secure Recovery with Evervault
>
> Open Wallet partners with Evervault to provide a keyless recovery option that removes the need for you to manage your Recovery Key directly. This is done in a trustless manner, meaning neither Open Wallet nor Evervault ever has access to your raw, unencrypted Recovery Key

That being said, we cannot access the Bitcoin signing key nor was provided the seed phrases. 

Although the app generates a valid Bitcoin receive address, it provides no mechanism to export a Bitcoin private key, no BIP39 seed phrase, no WIF key format, and no PSBT or derivation-path details associated with self-custodial Bitcoin wallets.

The “Recovery Key” provided by the app is a PKCS#8 P-256 key which cannot sign Bitcoin transactions, indicating that Bitcoin keys are not generated or stored on the user’s device.

This dual architecture—non-custodial for EVM assets but opaque and keyless for Bitcoin—suggests that Bitcoin custody is handled through a backend service rather than a user-controlled keypair.

**Supporting Observations**

- No seed phrase, WIF key, or secp256k1 private key export.
- “Recovery Key” uses P-256 → incompatible with Bitcoin signing.
- App shows no Bitcoin derivation path or wallet settings.
- BTC module operates separately from the EVM key stack.
- User cannot validate or access raw Bitcoin signing keys.
- Terms claim non-custodial design, but app design does not expose BTC keys.

Open Wallet is considered custodial under WalletScrutiny rules because users do not control the Bitcoin private keys, cannot export them, and must rely on the provider’s backend for Bitcoin transaction signing.

Even if the service claims to be “non-custodial,” the absence of user-controlled Bitcoin keys and the presence of a separate P-256 recovery model classify the entire product as **custodial**.

---

## iPhone

{% include copyFromAndroid.html %}
