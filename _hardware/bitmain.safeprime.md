---
title: Bitmain SafePrime
appId: bitmain.safeprime
authors:
- danny
released: 
discontinued: 
updated: 2016-10-13
version: 
binaries: 
dimensions: 
weight: 
provider: Bitmain
providerWebsite: https://bitmain.com
website: >-
  https://file12.bitmain.com/shop-product/firmware/SafePrime%20FAQs%2013102016.pdf
shop: 
country: CN
price: 
repository: 
issue: 
icon: bitmain.safeprime.png
bugbounty: 
meta: defunct
verdict: plainkey
appHashes: 
date: 2023-04-06
signer: 
twitter: BITMAINtech
social:
- https://t.me/bitmain
- https://www.youtube.com/c/Bitmain_official
- https://www.facebook.com/BITMAIN
features: 

---

## Product Description 

We only found a user manual for this device in PDF form. That's where we derived the image and the processes involved in its operation. The file was last updated in 2016. Consider this a bit of hardware wallet archaeology. We did try to ask [Bitmain on twitter](https://twitter.com/BitcoinWalletz/status/1643907015549554688) if they still have any prototype available.  

## From the [SafePrime Manual](https://device.report/m/22d923097da8858b414014f7fbd9c756a4b5cc33b4c9d57495721eb8f64baf26.pdf)

This is still available online as of 2023-04-06.

> After installation of the MultiBit for SafePrime software, connect your SafePrime device without running the software.
> 
> NOTE: You must connect the wallet before running the software. If you run the software before connecting your device then you must re-connect your SafePrime device after ending the software program on your PC. If you still experience some issues, try restarting your PC.

## From the [SafePrime FAQ](https://file12.bitmain.com/shop-product/firmware/SafePrime%20FAQs%2013102016.pdf)

> Q. What if I lose my SafePrime wallet?
> 
> If you have lost your SafePrime wallet or decide to get a new one, you can use the 24-word recovery phrase that was generated during device setup to restore access to your bitcoins. You may also use any other wallet that supports BIP 32, BIP 39 or BIP 44
>
> Q. The touchscreen seems unresponsive while I am typing the 24-
word phrase on it?
>
> While typing the 24-word phrase on the SafePrime touchscreen interface, you can move forward ONLY after you have finished entering a letter of the alphabet. If you accidentally press a letter key while typing the 24-word phrase on your SafePrime’s touchscreen interface, none of the keys or buttons on the touchscreen will respond unless you select one of the three resulting letters (as shown in attached picture). You can then delete this letter and proceed.
>
> Q. I have finished typing the 24-word phrase on my SafePrime wallet but don’t see any wallet address on the Multibit user interface on my PC?
> 
> If you face this issue, please:
> 1. disconnect your SafePrime wallet
> 2. end the Multibit application
> 3. connect your SafePrime wallet to your PC again
> 4. start the Multibit software
> 
> Remember: Always connect your SafePrime wallet first and only then start the Multibit software program.
>
> If the wallet address still does not appear, please restart your computer and follow steps 3 and 4 above.

## Analysis 

As the user manual indicates, the device has to be connected to a desktop Windows, Linux or Mac software called [Multibit](https://www.antminer-firmware.eu/bitmain-tools/safeprime-hd-wallet/).

The device has a touchscreen interface. 

There was no specification on how the private keys can be generated. However this is how it can be [factory reset](https://file12.bitmain.com/shop-product/firmware/SafePrime%20FAQs%2013102016.pdf): 

> Q. How can I restore my SafePrime wallet’s bitcoins using the 24-word phrase?
>
> You can restore your SafePrime wallet’s bitcoins by selecting Restore Wallet under the Tools menu option in your MultiBit for SafePrime client as marked in the screenshot below.

The device seems to be heavily reliant on this Multibit software. 

## Verdict 

As this is a really old device with no further operation instructions except from the one found in a document dated 2016, we can never really be sure how exactly it worked. Does it generate keys offline independent of any other device? We don't know. Can it confirm transactions using its screen? We don't know. 

But it is heavily reliant on the desktop software as indicated in the document. For the moment, as we couldn't find claims to the contrary, 
we suspect that it **leaks keys** from the device to the desktop software. We'll change our verdict as more information gets available.
