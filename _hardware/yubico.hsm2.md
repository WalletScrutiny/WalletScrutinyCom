---
title: Yubico HSM2
appId: yubico.hsm2
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 12
- 13
- 3.1
weight: 1
provider: Yubico
providerWebsite: https://www.yubico.com/
website: https://www.yubico.com/products/hardware-security-module/
shop: 
country: US
price: 650USD
repository: 
issue: 
icon: yubico.hsm2.png
bugbounty: 
meta: ok
verdict: nowallet
date: 2022-05-18
signer: 
reviewArchive: 
twitter: Yubico
social:
- https://www.linkedin.com/company/Yubico/
- https://www.facebook.com/Yubikey
- https://www.instagram.com/Yubico/
- https://www.youtube.com/c/Yubico
features: 

---

## Product Description 

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I looked. It supports secp256k1, so it can sign bitcoin transactions. This might be the consumer HSM that we&#39;ve been looking for.</p>&mdash; Jimmy Song (송재준) (@jimmysong) <a href="https://twitter.com/jimmysong/status/925971027816882176?ref_src=twsrc%5Etfw">November 2, 2017</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

The product brief for the {{ page.title }} can be downloaded [here](https://resources.yubico.com/53ZDUYE6/at/q4bsft-z2wi8-fo7aqg/213367-Collateral-YubiHSM2-Product-brief-update-r3.pdf).

> With the YubiHSM 2 SDK, developers building solutions for cryptocurrency exchanges can rapidly integrate the HSM to protect cryptographic keys and keep sensitive financial information safe. 

Product Specifications: 

> Cryptographic Interfaces
- PKCS#11 API version 2.40
- Microsoft CNG via the Yubico Key Storage
- Provider (KSP), both 32 and 64-bit DLLs
- Full access to device capabilities through Yubico’s
- YubiHSM Core Libraries (C, Python)
>
> RSA
> - 2048, 3072, and 4096 bit keys
> - Signing: PKCS#1 v1.5 and PSS
> - Decryption: PKCS#1 V1.5 and OAEP
>
> Elliptic Curve Cryptography (ECC)
> - Curves: secp224r1, secp256r1, secp256k1, secp384r1, secp521r, bp256r1, bp384r1, bp512r1, Ed25519
> - Signing: ECDSA (all except Ed25519), EdDSA (Ed25519 only)
> - Derivation: ECDH (all except Ed25519)
>
> Hashing functions
> - SHA-1, SHA-256, SHA-384, SHA-512
>
> Key wrap
> - Import and export using NIST-approved AES CCM

## Analysis 

As Jimmy Song [noted](https://twitter.com/jimmysong/status/925971027816882176), the device has the "potential" to be at least a bitcoin transaction signing device. That tweet was made in 2017, and since then no significant development has been made to further this push. At the price of $650 USD, it is comparatively costlier than the "average" personal cryptocurrency hardware wallet.

Secondly, it has no display or buttons to allow potential users (should the feature be introduced) to confirm transactions. 

As it is, the device **does not serve as a wallet**. 