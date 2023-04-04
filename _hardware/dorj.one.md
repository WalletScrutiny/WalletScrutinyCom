---
title: Dorj One
appId: dorj.one
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 72
- 27
- 7 
weight: 23
provider: 
providerWebsite: http://dorj.io/
website: https://mydorj.com
shop: https://www.datisnetwork.com/shop/dorj-one
country: IR
price: 
repository: 
issue: 
icon: dorj.one.png
bugbounty: 
meta: ok
verdict: nosource
date: 2023-04-01
signer: 
reviewArchive: 
twitter: dorjwa
social: 
---

## Product Description taken from the Dorj homepage

> - Safeguard your online accounts and identities. Enable the industry standard FIDO/U2F and use Trezor as your security token.
>
> - Try out the next-generation password management app. Encrypt passwords separately and sync them to your private cloud, hassle-free, with Dorj.
> 
> - Protect access to your servers, data, or website administration. SSH login with single or multiple sessions.

## Additional information from third-party site 

> - 1300 supported crypto-currencies
> - Screen: Monochrome 128x64
> - Connection method: micro-USB cable
> - Comes with a recovery sheet 

> - Dorj One wallet specifications
> - Appearance characteristics
> - Dimensions: 72mm x 27mm x 6.9mm
> - Weight: 23 grams
> - Screen size: 128x64 pixels
> - Body material: compressed plastic
> - Number of buttons: 2 buttons
> - Touch Screen: No
> - Display type: monochrome
> - Technical Specifications
> - Processor: ARM Cortex-M3 processor @ 120 MHz
> - Interface type: USB Type Micro-B
> - Bluetooth: No
> - Internal battery: no
> - Camera: None
> - Impact resistance: none
> - Resistant to water penetration: none
> - Ability to connect via Wi-Fi: no
> - Hardware wallet software specifications
> - Digital currency storage capacity: the possibility of storing more than 1200 types of digital assets
> - Dedicated platform: Trezor wallet
> - Software compatibility: Windows 8 or later, Mac OS version 10.11 or later, Linux, Android
> - Backup type: 12 to 24 word recovery phrase
> - Pin code type: maximum 50 characters including upper and lower case sensitive ASCII letters and symbols, numbers and spaces
> - How to implement security settings: settings and implementation through a computer or mobile phone
> - Special features:
> - Use as a security key to manage all services of Google, Facebook, GitHub, Dropbox, etc.
> - Use for two-step authentication (2FA) in various services such as > - Facebook, Dashlane, Google, Dropbox, GitHub and...
> - Has the ability to manage passwords (Password Manager)

## Analysis 

Most of the information we got from the sites are written in Persian. 

Assuming that we are going to believe all the claims on third-party websites, here are some of them: the site claims that the private keys are generated offline. It has a screen and a button, and claims to connect to an app. It also claims that the device is compatible with the Trezor suite. 

In the FAQ of an online [third-party seller](https://www.datisnetwork.com/shop/dorj-one#):

> Dorj One از زیرساخت امن Trezor استفاده میکند و نرم افزار کیف پول را با امضای ساتوشی لب که همان سازنده trezor هست برروی سخت افزار که با توجه به استاندارد های Trezor ساخته شده قرار می دهد.
>
>نرم افزار یا فریم ویر دُرج از سایت اصلی trezor بر روی درج نصب میگردد.

Translated using Google Translate:

> 14- How to be sure of the safety of the insert?
>
> Dorj One uses Trezor's secure infrastructure and puts the wallet software with the signature of Satoshi Leb, who is the creator of Trezor, on the hardware that is made according to Trezor's standards.
>
> The insert software or firmware is installed on the insert from the main trezor website.

There is a lot of difficulty in analyzing a device that we do not have physically on hand. Moreover, most of the documentation is in a foreign language, so it takes more time to search for significant bits of information. 

Here are some assumptions that unless updated with newer information, would serve as the basis for our analysis: as a Trezor clone, the makers of this device must have forked the Trezor firmware code as well as the software suite. However, we cannot find this forked repository. Simply pointing to the trezor homepage is not accurate since they must have used a different chip based on the shape of the device. It only describes this chip as a "special" chip that stores the private keys. 

It also claims to be able to connect to an Android phone and to the Exodus software. But there were no links to the app that it specifically interfaces with. 

### It claims that the private keys are not shared:

> دارایی شما در بلاکچین هر رمزارز قرار دارد و فقط کلید خصوصی دسترسی شما به دارایی تان در کیف پول نگه داری میشود و این کلید به هیج عنوان از سخت افزار خارج نمیشود و فقط در هنگام راه اندازی بصورت 24 کلمه بازیابی در اختیار شما قرار میگیرد.

Translated using Google Translate: 

> 3 Is our asset in a hardware wallet?
>
> Your property is located in the blockchain of any cryptocurrency and only the private key to access your property is kept in the wallet and this key is not removed from the hardware in any way and it is provided to you as 24 recovery words only during startup

### Verdict 

If we set aside our cynicism for a moment and believe all their claims, then we are led to one fact - there is no link to the forked Trezor code and thus, **it, in essence, does not really have publicly shared code**. We believe that simply pointing to Trezor because it is Open Source is not sufficient. Thus, our verdict.


