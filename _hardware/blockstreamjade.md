---
title: Jade
appId: blockstreamjade
authors:
- kiwilamb
- leo
- danny
- keraliss
released: 2021-01-01
discontinued: 
updated: 2025-03-14
version: 1.0.34
binaries: https://jadefw.blockstream.com/bin/jade/index.json
dimensions:
- 24
- 60
- 17
weight: 21
provider: Blockstream Corporation Inc.
providerWebsite: https://blockstream.com/
website: https://blockstream.com/jade/
shop: https://store.blockstream.com/products/blockstream-jade-hardware-wallet
country: CA
price: 79USD
repository: https://github.com/Blockstream/jade
issue: 
icon: blockstreamjade.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes:
- c88b3d38deddec7265878885b4f1ff952d5ac56d202861a9ce9a6e2b84006280
- 83098f274244f1b676a2f161da155e6c3444f0a30450fd758a26046a88654ce2
- e056250e6f75cda5b14a91cc8aef6edcf6a9875cdae2f41ea9b96bd88fdd0e46
- e38355055873ed9ab10c19cb425a64497589c78c7dad041ec351599e2c2c1b52
date: 2025-04-04
signer: 
twitter: Blockstream
social:
- https://www.linkedin.com/company/blockstream
- https://www.facebook.com/Blockstream
- https://t.me/blockstream
- https://www.youtube.com/channel/UCZNt3fZazX9cwWcC9vjDJ4Q
features: 

---

We modified the build script due to this [issue](https://github.com/Blockstream/Jade/issues/191). 
A temporary workaround is to add a line in the script that would remove the '--recursive' flag to prevent the cloning of the problematic QEMU submodule.

```
`$ ./scripts/test/hardware/blockstreamjade.sh 1.0.34`
...
Results:
40f7b83466ae356a7a118e2b422bfec144bb91f0313d1f0456747d0dafecf6a8  jade_1.0.34_10_ble.bin
c88b3d38deddec7265878885b4f1ff952d5ac56d202861a9ce9a6e2b84006280  jade_1.0.34_10_ble.built.bin
c88b3d38deddec7265878885b4f1ff952d5ac56d202861a9ce9a6e2b84006280  jade_1.0.34_10_ble_stripped.bin
550cf11c1b87d050790238589852c0900cf63091a43c03ba5445c7549340d694  jade_1.0.34_10_ble.bin.gz
The Jade firmware version 1.0.34 10_ble is reproducible with above hashes.
ef04943a338cc43cc6fe13fa3c8d8884af9d2e638377b55ff0ccb0ae6145c39b  jade_1.0.34_10_noR.bin
83098f274244f1b676a2f161da155e6c3444f0a30450fd758a26046a88654ce2  jade_1.0.34_10_noR.built.bin
83098f274244f1b676a2f161da155e6c3444f0a30450fd758a26046a88654ce2  jade_1.0.34_10_noR_stripped.bin
34e48638e8c09c4d69f1ab1cf6f5b54a935a256fec01958e8ae5cdd28a8b0c74  jade_1.0.34_10_noR.bin.gz
The Jade firmware version 1.0.34 10_noR is reproducible with above hashes.
045238a9f0631bd14fc877938fca9d2b8c600a1042c6bcf2ce78468aaffdaaad  jade_1.0.34_11_ble.bin
e056250e6f75cda5b14a91cc8aef6edcf6a9875cdae2f41ea9b96bd88fdd0e46  jade_1.0.34_11_ble.built.bin
e056250e6f75cda5b14a91cc8aef6edcf6a9875cdae2f41ea9b96bd88fdd0e46  jade_1.0.34_11_ble_stripped.bin
018fa89c8d294725ccad9470b18e5a10464d6092063e4673163e5703df933476  jade_1.0.34_11_ble.bin.gz
The Jade firmware version 1.0.34 11_ble is reproducible with above hashes.
6be404cddceb89ecf134548ca9ca8a5ae113a9ba55f3ad5e7365b5346ef240a2  jade_1.0.34_11_noR.bin
e38355055873ed9ab10c19cb425a64497589c78c7dad041ec351599e2c2c1b52  jade_1.0.34_11_noR.built.bin
e38355055873ed9ab10c19cb425a64497589c78c7dad041ec351599e2c2c1b52  jade_1.0.34_11_noR_stripped.bin
b3e0e7d88ee60950c4be253a05bbd229a6758cba1cdc03a9ad8bc94731259159  jade_1.0.34_11_noR.bin.gz
The Jade firmware version 1.0.34 11_noR is reproducible with above hashes.

```

Firmware version 1.0.34 of {{ page.title }} is **reproducible**

{% include asciicast %}
