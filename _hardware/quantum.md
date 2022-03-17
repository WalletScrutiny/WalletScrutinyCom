---
title: "QUANTUM"
appId: quantum
authors:
- kiwilamb
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: [25, 65, 8]
weight: 12
provider: "SecurityArts"
providerWebsite: https://security-arts.com
website: https://security-arts.com/home
shop: https://security-arts.com/order
country: UA
price: 49USD
repository: 
issue: https://github.com/SecurityArts/QuantumManager/issues/14
icon: quantum.png
bugbounty: 
meta: ok
verdict: nosource
date: 2021-12-20
signer: 
reviewArchive: 
twitter: 
social: 
- https://github.com/SecurityArts
---

Security Arts' is a Ukrainian company. As of November 26, 2021, the [device is out of stock](https://security-arts.com/order).

## Private keys can be created offline

To begin with, [activating the device](https://security-arts.com/#activate) requires a desktop software called [Quantum Manager](https://security-arts.com/download). However, the device can be used independently of the Quantum Manager. 

[Activation information](https://security-arts.com/docs/en/intro) from Security Arts' documentation

> All QUANTUM devices are shipped inactivated. Warranty period (6 month) starts from the moment of activation. This makes warranty period independent from delivery or stockage time. Also, this is the way to make sure that your device is genuine.
>
> To activate new device, you need to have:
>
> QUANTUM device with micro USB cable.
> - Computer (Windows, Linux or Mac OS) connected to internet.
> - Installed Quantum Manager.
> - Connect the QUANTUM to PC using USB cable and wait until standard USB driver is installed, which will take about 1 minute. Launch Quantum Manager and in a drop-down window you will see a 6-digit activation code that should be entered in your device.

## Private keys are not shared 

> Especially for users with the extreme level of paranoia we came up with an idea of offline mode, in which QUANTUM operates without connecting to PC, powered from power bank or phone charger. You can create a new wallet using device UI, display its addresses as a QR code on LCD, scan it using smartphone and transfer funds to it. You can also display private key and manually rewrite it on paper for backup storage and be 100% sure that not any virus will intercept it.
>
> Lastly, the most important advice.
>
> ALWAYS DO BACKUP COPIES. Any device, even the most reliable one, can fail. However, this is not a problem in case of QUANTUM, since you can always restore data from a backup to a new device. We have developed a method for reserving all data to a separate extra-encrypted file and your data is never stored in a cloud service or on our servers.

## Device displays receive address for confirmation

> QUANTUM menu mode is the safest way to manage cryptocurrency. For example, you can create new random wallet and display address QR code on the device LCD. Then, scan this code using smartphone and send money to this wallet. Display wallet private key on the device LCD and manually make paper copy for additional backup. Thereby, you will be 100% sure that your device has never been connected to PC and your money cannot be stolen by viruses.
>
> Also, you can manually enter private key of already existing or paper backup wallet. Although manual entry is slow and inconvenient, it provides the most secure way for cryptocurrency storing.

## Interface

The device has a menu mode where the user can access the cryptocurrency wallet using the buttons on the device and an LCD screen. 

We were able to find [pictures of the device on Facebook](https://twitter.com/BitcoinWalletz/status/1464152356359053318)

## Reproducibility

The manufacturer doesn't have a dedicated social media presence on twitter and can only be contacted via their [webform](https://security-arts.com/support) or their email address. 

We were able to find their [GitHub page](https://github.com/SecurityArts) which has links to the repository of their open source desktop software the [Quantum Manager](https://github.com/SecurityArts/QuantumManager). 

It is through the Quantum Manager where the firmware for the device is updated. 

As noted in Leo's [comment on GitLab](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/merge_requests/284#note_746992469)

> It appears the firmware itself is not open source.
>
> [Here](https://github.com/SecurityArts/QuantumManager/blob/1a3ad5d4aec89c4ae06752f21b8f9bc44da35fc4/app/js/updates.js#L11) the "Quantum Manager" requests the firmware, providing a random number and the hardware wallet's serial number. This would allow to send a different firmware to each different client. Notably not providing a serial number or just random guessed integers returns errors.


