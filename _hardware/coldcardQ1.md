---
title: Coldcard Q
appId: coldcardQ1
authors:
- danny
- keraliss
released: 2022-10-05
discontinued: 
updated: 2024-07-05
version: v1.2.3Q
binaries: https://coldcard.com/downloads/
dimensions: 
weight: 
provider: Coinkite
providerWebsite: 
website: https://coldcard.com/q
shop: https://store.coinkite.com/store/cc-q1
country: CA
price: 219.99USD
repository: https://github.com/Coldcard/firmware
issue: 
icon: coldcardQ1.png
bugbounty: 
meta: outdated
verdict: reproducible
date: 2024-08-12
signer: 
reviewArchive:
- date: 2024-05-31
  version: 1.2.1Q
  appHash: 85186d87fcf6a8334e9f4c35680a505acb1ed274ffef2913d734dfa400c1f809
  gitRevision: f75bca706d73b85a627828802bc757f705bd9921
  verdict: reproducible
twitter: COLDCARDwallet
social:
- https://t.me/coldcard
features: 

---

**Updates on 2024-08-12**:

As ColdcardQ1's source code is now available, we decided to check for reproducibility. Excluding a few changes to our [test script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/scripts/test/hardware/coldCard.sh), steps to reproduce the product remain largely the same across the Coldcard series. We were able to build the binary file.

```
hexdump -C firmware-signed.bin | sed -e 's/^00003f[89abcdef]0 .*/(firmware signature here)/' > repro-got.txt
hexdump -C check-fw.bin | sed -e 's/^00003f[89abcdef]0 .*/(firmware signature here)/' > repro-want.txt
diff repro-got.txt repro-want.txt

SUCCESS.

You have built a bit-for-bit identical copy of Coldcard firmware for v1.2.3Q
+ set +ex

Hash of non-signature parts downloaded/compiled:
85186d87fcf6a8334e9f4c35680a505acb1ed274ffef2913d734dfa400c1f809  2024-07-05T1342-v1.2.3Q-q1-nosig.bin
85186d87fcf6a8334e9f4c35680a505acb1ed274ffef2913d734dfa400c1f809  firmware-nosig.bin

Hash of the signed firmware:
54da941c8df84fcb84adcc62fdd3ee97d1fc12e2a9a648551ca614fcbacade3f  /tmp/firmware/releases/2024-07-05T1342-v1.2.3Q-q1-coldcard.dfu
f222c2e6374057685900e4e3313ec9ec1931a9d1b8d8a13be13e04f80ba967f9  /tmp/firmware/stm32/built/firmware-signed.dfu

```

## Product Description 

The ColdCard Q is the newest edition of Coinkite's hardware wallets. [On its website](https://coldcard.com/docs/coldcard-q/#unique-q-highlights), it advertises the addition of new features to its series that include:

- A QWERTY keyboard as opposed to its predecessors numeric keypad.
- A larger screen
- Dual MicroSD slots
- A QR scanner

While the interface has been updated, ColdCard Q's functionality shares similarities with Mk4 such as its CPU speed, BTC transaction limit, and memory size.

> All the features of the Mk4 work the same on the Q, except many are easier to access due to dedicated keys.


You can set a PIN code for the device and are offered four options in creating a Seed Phrase:

- 12 Words
- 24 Words
- 12 Word Dice Roll
- 24 Word Dice Roll

## Reproducibility 

As ColdcardQ1's source code is now available, we decided to check for reproducibility. Excluding a few changes to our [test script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/scripts/test/hardware/coldCard.sh), steps to reproduce the product remain largely the same across the Coldcard series. We were able to build the binary file.

```
hexdump -C firmware-signed.bin | sed -e 's/^00003f[89abcdef]0 .*/(firmware signature here)/' > repro-got.txt
hexdump -C check-fw.bin | sed -e 's/^00003f[89abcdef]0 .*/(firmware signature here)/' > repro-want.txt
diff repro-got.txt repro-want.txt

SUCCESS. 

You have built a bit-for-bit identical copy of Coldcard firmware for v1.2.1Q
+ set +ex

Hash of non-signature parts downloaded/compiled:
81e9d676353402169b6e440482a7ad49c100653f5271439b06b00a77616749c1  2024-05-09T1529-v1.2.1Q-q1-nosig.bin
81e9d676353402169b6e440482a7ad49c100653f5271439b06b00a77616749c1  firmware-nosig.bin

Hash of the signed firmware:
90b1edfbe194b093258f9cda8f4add4aa3317e9ea205ff35914da7d91410fdae  /tmp/firmware/releases/2024-05-09T1529-v1.2.1Q-q1-coldcard.dfu
55f29ec5e2a476bd2cb153c465879b2dee9538c2704b19798ed262cf918838fb  /tmp/firmware/stm32/built/firmware-signed.dfu

```

Now that the firmware has been reproduced successfully, the unsigned binaries' checksums are matched. We can now mark this product as **reproducible.**
