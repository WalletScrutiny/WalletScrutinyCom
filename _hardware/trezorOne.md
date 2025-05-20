---
title: Trezor One
appId: trezorOne
authors:
- leo
- Mohammad
released: 2014-07-29
discontinued: 
updated: 2023-03-06
version: 1.12.1
binaries: https://github.com/trezor/webwallet-data/tree/master/firmware/1
dimensions:
- 60
- 30
- 6
weight: 12
provider: 
providerWebsite: 
website: https://trezor.io
shop: https://shop.trezor.io/product/trezor-one-black
country: CZ
price: 49EUR
repository: https://github.com/trezor/trezor-firmware
issue: 
icon: trezorOne.png
bugbounty: https://trezor.io/security
meta: ok
verdict: sourceavailable
appHashes:
- 859dff49705fb81e83fe6d2efcf8f739f847081037aacf4f176624009a738ed8
date: 2023-05-25
signer: 
twitter: trezor
social:
- https://www.facebook.com/trezor.io
- https://www.reddit.com/r/TREZOR
features: 

---

With our
[test script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/scripts/test/hardware/trezorOne.sh)
this is the result:

```
$ ./scripts/test/hardware/trezorOne.sh 1.12.1
...
Fingerprints:
3c694191f5b66a65cb5bb209adbf113cb40209e644b77162ba996bb7ee8f382b build/legacy/firmware/firmware.bin
985fb6a8c87f7547fb810f6c4a8331ebf19c677445810358778eb21eca78a181 build/legacy-bitcoinonly/firmware/firmware.bin
195+0 records in
195+0 records out
195 bytes copied, 0.00046023 s, 424 kB/s
195+0 records in
195+0 records out
195 bytes copied, 0.000506005 s, 385 kB/s

Hash of non-signature parts downloaded/compiled standard:
859dff49705fb81e83fe6d2efcf8f739f847081037aacf4f176624009a738ed8  trezor-1.12.1-nosig.bin
859dff49705fb81e83fe6d2efcf8f739f847081037aacf4f176624009a738ed8  build/legacy/firmware/firmware.bin

Hash of non-signature parts downloaded/compiled bitcoinonly:
683b51fb68d0b0377f5596d6e75cc5ba2b64b88563dae2ede431031565b977fa  trezor-1.12.1-bitcoinonly-nosig.bin
683b51fb68d0b0377f5596d6e75cc5ba2b64b88563dae2ede431031565b977fa  build/legacy-bitcoinonly/firmware/firmware.bin

Hash of the signed firmware:
eab18bf870d6096a2dee477a2f032dc3084a1864b6767a8f2f313a12dff2d180  trezor-1.12.1.bin
ce576268ce81d4fa7aa6a80d1c8ee01c49fdab4efaf9e0c703d899a24e168eb4  trezor-1.12.1-bitcoinonly.bin
```

That is a match. This firmware is **reproducible** for both the standard and the
bitcoinonly version.
