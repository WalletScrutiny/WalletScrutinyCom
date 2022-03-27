---
title: SeedSigner
appId: seedsigner
authors:
- danny
- leo
released: 2020-12-20
discontinued: 
updated: 2021-11-21
version: 0.4.5
binaries: https://github.com/SeedSigner/seedsigner/releases
dimensions: 
weight: 
provider: Seed Signer
providerWebsite: 
website: https://seedsigner.com/
shop: 
country: 
price: 50USD
repository: https://github.com/SeedSigner/seedsigner
issue: https://github.com/SeedSigner/seedsigner/issues/166
icon: seedsigner.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2022-03-26
signer: 
reviewArchive: 
twitter: SeedSigner
social:
- https://t.me/joinchat/GHNuc_nhNQjLPWsS

---

The Seed Signer is a truly Open Source project that lowers the barrier for entry for airgapped multi-signature cryptocurrency hardware wallets. The code is publicly available as are the instructions for assembly. 

It claims to [solve the following problems](https://seedsigner.com/faqs/):

> - Creates a secure, air-gapped environment for private key generation
> - Enforces strict separation between private key storage and protocol software / internet
> - Lowers the barrier cost of multi-sig security (from several hundred to < $50)

## Can the private keys be created offline? 

Yes. The seed signer is airgapped.

## Are the private keys shared? 

No. The companion apps only get signed transactions and no keys.

## Does the device display the receive address for confirmation?

Yes. 

## Does the interface have a display screen and buttons which allows the user to confirm transaction details?

Yes. 

## Is it reproducible?

{{ page.title }} does share binaries, so the question is if these binaries match
the published and hopefully reviewed source code.

On their website there is a button labeled "DOWNLOAD VERSION 0.4.6" which does
not statically link to a binary but to a JavaScript document that then initiates
a download. While this is slightly suspicious, all that really matters is the
hash of the downloaded file. If you and I get the same hash, we are talking
about the same file.

Alternatively there is the
[GitHub Releases](https://github.com/SeedSigner/seedsigner/releases) where as of
now "0.4.6" is the "latest" release. Both downloads had the same sha256 hash
`1e47d997484c0396d01c87664753644e91c8e7c99f64b4cbfb048cf79bb03b1a`.

So ... how was this file created, so we can recreate it? There is not exactly
"Build Instructions". There is only a document with
[Manual Installation Instructions](https://github.com/SeedSigner/seedsigner/blob/main/docs/manual_installation.md).
And that is pretty involved. Its starting point is ... you need an RPi. Not
necessarily an RPi Zero 1.3 and the "Raspberry Pi Lite operating system, dated
2021-05-28". Being specific is important for reproducibility but the next steps
... are many and none of which to our knowledge is meant to make reproducible
modifications to the system. While many packages that are to be installed are
pinned to specific versions, this instruction:

> ```
> sudo apt-get update && sudo apt-get install -y wiringpi python3-pip \
>   python3-numpy python-pil libopenjp2-7 git python3-opencv \
>   python3-picamera libatlas-base-dev qrencode
> ```

explicitly instructs to update to whatever the latest packages are on the remote
server and install the given ten packages.

We might miss something here and might give it an actual try at some point but
for now we go with our educated guess that this product is **not verifiable**.

If you want to use this product, do not trust the binary download. Go with the
"Manual Installation Instructions" instead!

We had a little
[back-and-forth with the provider on Twitter](https://twitter.com/WalletScrutiny/status/1507201398735220736).
