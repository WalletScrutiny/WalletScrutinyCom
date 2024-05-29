---
title: Coldcard Q
appId: coldcardQ1
authors:
- danny
released: 2022-10-05
discontinued: 
updated: 2024-05-09
version: v1.2.1Q
binaries: https://coldcard.com/downloads/
dimensions: 
weight: 
provider: Coinkite
providerWebsite: 
website: https://coldcard.com/q
shop: https://store.coinkite.com/store/cc-q1
country: CA
price: 199USD
repository: https://github.com/Coldcard/firmware
issue: 
icon: coldcardQ1.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2024-05-28
signer: 
reviewArchive: 
twitter: COLDCARDwallet
social:
- https://t.me/coldcard
features: 

---

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
Need published binary for: 1.2.1Q

Copy it into ../releases

+ set +ex
xxd: /tmp/firmware/stm32/built/check-fw.bin: No such file or directory

Hash of non-signature parts downloaded/compiled:
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  2024-05-09T1529-v1.2.1Q-q1-nosig.bin
81e9d676353402169b6e440482a7ad49c100653f5271439b06b00a77616749c1  firmware-nosig.bin

Hash of the signed firmware:
90b1edfbe194b093258f9cda8f4add4aa3317e9ea205ff35914da7d91410fdae  /tmp/firmware/releases/2024-05-09T1529-v1.2.1Q-q1-coldcard.dfu
0009828c218404023d9b80c8f23077dd66989dadcd6275b3c096f44313f98e7f  /tmp/firmware/stm32/built/firmware-signed.dfu
```

We will retest this to check for errors.