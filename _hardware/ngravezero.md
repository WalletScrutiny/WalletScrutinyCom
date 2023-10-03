---
title: NGRAVE ZERO
appId: ngravezero
authors:
- kiwilamb
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 130
- 72
- 14
weight: 6.3
provider: NGRAVE
providerWebsite: https://www.ngrave.io/
website: https://www.ngrave.io/products/zero
shop: https://shop.ngrave.io/
country: BE
price: 398EUR
repository: https://github.com/ngraveio/zero-firmware
issue: 
icon: ngravezero.png
bugbounty: 
meta: ok
verdict: nosource
date: 2022-10-08
signer: 
reviewArchive: 
twitter: ngrave_official
social:
- https://twitter.com/ngrave_official
- https://www.linkedin.com/company/ngrave-io
- https://instagram.com/ngrave.io
- https://www.facebook.com/ngrave.io
- https://github.com/ngraveio
features: 

---

This hardware wallet offers features including a 4-inch touch screen, camera, fingerprint sensor, and runs a custom OS which [NGRAVE claims](https://www.ngrave.io/zero) is EAL7 certified.

NGRAVE ZERO comes with a companion app called [LIQUID](https://www.ngrave.io/liquid). To sync with the hardware wallet, ZERO generates a QR code to be scanned by the app.

## Creating wallets

[There are tutorials on how to use this product in NGRAVE's YouTube channel.](https://www.youtube.com/channel/UCJDIZfcaACOTMT_tc3IKaAg/featured)

Users can choose between [a mnemonic wallet](https://www.youtube.com/watch?v=75VrZdq5mpY) and [an NGRAVE wallet](https://www.youtube.com/watch?v=yrnRy6eXupI). A mnemonic wallet provides the user with a 24-word seed phrase. On the other hand, an NGRAVE wallet provides the user with a key of 64 characters that are split into 8 groups of 8 characters. 
NGRAVE's other product, [GRAPHENE](https://www.ngrave.io/en/graphene), was specifically designed to hold these keys.


## Signing transactions

[Video tutorial here.](https://www.youtube.com/watch?v=3FDmQUObAvc)

ZERO has a companion app called LIQUID. This is where users are allowed to make transactions. After the transaction is initialized, the user is provided with a QR code and asked to scan it using the ZERO device. The user then sees the details of the transaction such as the amount, the fee, and the recipient's bitcoin address. To verify the transaction, ZERO requires the user's pin and/or fingerprint. Afterwards, ZERO provides the user with a QR code for the now-signed transaction. Finally, the user must use LIQUID to scan the new QR-code and the transaction is verified. 

Unfortunately, LIQUID has received critical ratings on the Play Store as users report problems scanning QR codes.

> [Tylor Steinberger](https://play.google.com/store/apps/details?id=io.ngrave.liquid&hl=en&gl=US&pli=1)<br>
  ★☆☆☆☆ February 5, 2022 <br>
       I backed this on indiegogo, and I've been so excited to receive it and finally get setup now that I have some money I can put onto my hardware wallet, and the app literally can't scan its own QR code to synchronize. I want this to succeed, but that's a pretty poor experience. Please fix and I'll give a better review!
       
NGRAVE replies:

> March 24, 2022 <br>
> Hi Tylor, Some (mostly newer) phone models have issues with the QR-codes. We have some improvements ready in the upcoming firmware update that should solve this. If you keep having issues, you can aways reach out to support@ngrave.io.

## Source Code

Although we found its official repository on Github, the NGRAVE ZERO's source code is unfortunately not up for review. The README states that "This repo will contain the ZERO's firmware" which may mean NGRAVE is planning to make its source public in the future, but as of this review the repository is empty and has not been updated since 2021. 
