---
title: Trezor Safe 3
appId: trezorSafe3
authors:
- danny
- leo
released: 2023-10-12
discontinued: 
updated: 2023-12-06
version: 2.6.4
binaries: https://github.com/trezor/data/tree/master/firmware/t2b1
dimensions:
- 59
- 32
- 7
weight: 14
provider: Trezor
providerWebsite: 
website: https://trezor.io
shop: https://trezor.io/trezor-safe-3
country: CZ
price: 79USD
repository: https://github.com/trezor/trezor-firmware
issue: https://github.com/trezor/trezor-firmware/issues/3663
icon: trezorSafe3.png
bugbounty: https://trezor.io/learn/a/how-to-report-an-issue
meta: ok
verdict: nonverifiable
date: 2024-03-30
signer: 
reviewArchive: 
twitter: trezor
social:
- https://www.facebook.com/trezor.io
- https://www.reddit.com/r/TREZOR
features: 

---

This is the latest model of the Trezor hardware wallets and it does feature a
so called "secure element" or SE in short. With that, our first worry is if we
have a firmware to review at all. Popular products like the
{% include walletLink.html wallet='hardware/ledgerNanoS' verdict='true' %} trade
transparency for "security" by running their sofware on chips where the provider
does not allow them to disclose the source, putting the provider in a position
where any update could put funds at risk with no way of independent scrutiny.

As Trezor has been struggling with these SEs for a long time, to the point of
working on [their own SE](https://tropicsquare.com/) that would allow scrutiny,
while always working with truely open source, this product is probably doing the
right thing, too. But ... how can we verify?

It took quite long to find mentions of firmware verifiability for the
{{ page.title }} but as metioned in a reply to
[this issue](https://github.com/trezor/trezor-firmware/issues/3418),

> the Safe 3 firmware is the same type and format as the TT so the exact same
  instructions apply.
> 
> the only change (which we do need to document) is that the path to the TS3
  binary is `build/core-r/fimware/firmware.bin`, and similarly for the model T
  the path changes to `core-t`

This is great but if for example the keys get created by only the SE, we are
back at having to trust its unknown code, right? So how exactly do they use the
SE?

[This article](https://trezor.io/learn/a/secure-element-in-trezor-safe-3) has
answers.

> We do not run code on the chip itself. The Secure Element simply stores a
  secret that can be used to decrypt the recovery seed, i.e., it never actually
  knows what your recovery seed is.

This is good. It implies that the SE neither generates the secret, following the
same path as for example the
{% include walletLink.html wallet='hardware/bitBox2' verdict='true' %}.

So, where is the firmware to be found? Quite a long search doesn't yield a
binary to download and their chatbot appears to not understand us neither.

In the [repo](https://github.com/trezor/data/tree/master/firmware) where we can
find the firmware for their other products, we can see cryptic descriptors
`t1b1`, `t2b1` and `t2t1` which according to
[this code](https://github.com/trezor/trezor-firmware/blob/1e3e7f808b623366a6fcfad855be6490e6f1d879/python/src/trezorlib/models.py#L39)
translate as follows:

```
TREZOR_ONE = T1B1
TREZOR_T = T2T1
TREZOR_R = T2B1
TREZOR_SAFE3 = T2B1
TREZOR_T3T1 = T2B1
TREZOR_DISC1 = DISC1
TREZOR_DISC2 = DISC2
```

So ... `T2B1` is the right one. Let's see ...

```
$ wget https://data.trezor.io/firmware/t2b1/trezor-t2b1-2.6.4{,-bitcoinonly}.bin
$ sha256sum *.bin
3940dc0615c651104baf0e10147550d4ad2e44e2ef317a94ed36245e3e016bf2  trezor-t2b1-2.6.4.bin
203d5d8d50ced8d75086c418ba2ee4cb9b2857df27821767c935922db4f30184  trezor-t2b1-2.6.4-bitcoinonly.bin
...
$ git clone https://github.com/trezor/trezor-firmware.git
$ git checkout core/v2.6.4 
$ bash -c "./build-docker.sh --skip-legacy core/v2.6.4"
...
Fingerprints:
7558899d0e9a551738c5e29b4b27741d00a472fc8f9e47eddbfc983fc236cddd build/core-R/bootloader/bootloader.bin
5ac16cb5002aa607908be376378a7fd1a1bc18f7b05e7a047cb1365840cc93ef build/core-R/firmware/firmware.bin
7558899d0e9a551738c5e29b4b27741d00a472fc8f9e47eddbfc983fc236cddd build/core-R-bitcoinonly/bootloader/bootloader.bin
013d595fc621c12324afd90721c6a37d055d853f6af54d5432e27e6a425656dd build/core-R-bitcoinonly/firmware/firmware.bin
3302cba4ab90b667aec6049d2299ff08fa13613beb624b338f3275fee04aaf7a build/core-T/bootloader/bootloader.bin
441faa92156e8ae0b8247f9434c3ec8cf6ffd872f16fc593b22c4460dfd93913 build/core-T/firmware/firmware.bin
3302cba4ab90b667aec6049d2299ff08fa13613beb624b338f3275fee04aaf7a build/core-T-bitcoinonly/bootloader/bootloader.bin
e78da8a00354dd1223da081600f881b71bd297dd565e7a2c0a9880e52575d127 build/core-T-bitcoinonly/firmware/firmware.bin
$ cp ../trezor-t2b1-2.6.4-bitcoinonly.bin trezor-t2b1-2.6.4-bitcoinonly.bin.zeroed
$ cp ../trezor-t2b1-2.6.4.bin trezor-t2b1-2.6.4.bin.zeroed
$ dd if=/dev/zero of=trezor-t2b1-2.6.4.bin.zeroed bs=1 seek=5567 count=65 conv=notrunc
$ dd if=/dev/zero of=trezor-t2b1-2.6.4-bitcoinonly.bin.zeroed bs=1 seek=5567 count=65 conv=notrunc
$ sha256sum *.zeroed
4f3d50525bfa59d05385b92999be1c44a6ec52109ec30f81101483f1c4fcf8a4  trezor-t2b1-2.6.4.bin.zeroed
b3ccb868d1850726b62ff2ee394a0e2cb461326f31ac4cce3f18f7fd9f70062f  trezor-t2b1-2.6.4-bitcoinonly.bin.zeroed
```

That doesn't match the expected

```
5ac16cb5002aa607908be376378a7fd1a1bc18f7b05e7a047cb1365840cc93ef build/core-R/firmware/firmware.bin
013d595fc621c12324afd90721c6a37d055d853f6af54d5432e27e6a425656dd build/core-R-bitcoinonly/firmware/firmware.bin
```

This binary is currently **not verifiable** and we will investigate this
further.

{% include asciicast %}
