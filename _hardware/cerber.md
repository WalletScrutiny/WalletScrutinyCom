---
title: CERBER
appId: cerber
authors:
- kiwilamb
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions:
- 54
- 86
- 4
weight: 12
provider: Cerber Money Security
providerWebsite: https://cerberwallet.ru
website: https://cerberwallet.ru
shop: https://cerberwallet.ru
country: RU
price: 3500RUB
repository: 
issue: 
icon: cerber.png
bugbounty: 
meta: defunct
verdict: wip
date: 2022-11-25
signer: 
reviewArchive: 
twitter: 
social: 

---

## Updated Review 2022-11-25

The domains and social media accounts for the Cerber Wallet are now no longer accessible. Marking it as defunct until further updates are available.

## Old Review

It's worth noting that there is another cryptocurrency hardware wallet provider with the name of "Cerber Wallet". The domain for the other wallet provider is cerber.net.

### Private keys can be created offline

The translated website claims that it is "[compatible with Trezor](https://twitter.com/BitcoinWalletz/status/1463803143712505857)"

[Trezor replied](https://twitter.com/Trezor/status/1463819090582192129) and voiced out its opinion that it may be a fork since both their software and hardware are open-source.

> Keys do not leave the protected storage, which allows using it even on an infected computer.

> After the payment order is generated, it goes into the wallet and you can check the recipient's address and amount. If they match what you entered on the computer, you confirm the transaction. Signing with an electronic signature takes place directly on the wallet. After that, the signed document enters the computer and is sent to the network.

Translated from:

> Представляем Вашему вниманию аппаратный криптокошелек CERBER WALLET. Ключи не покидают защищенное хранилище, что позволяет его использовать даже на зараженном компьютере. После формирования платежного поручения оно попадает в кошелек и можно сверить адрес получателя и сумму. Если они совпадают с тем, что Вы ввели на компьютере, Вы подтверждаете транзакцию. Подписание электронной подписью происходит непосредственно на кошельке. После этого подписанный документ попадает в компьютер и отправляется в сеть. На данный момент реализована поддержка основных валют: Bitcoin, Bitcoin Cash, Bitcoin Gold, Zcash, Litecoin, Dash, Etherium. Ключи на устройстве защищены PIN кодом. В случае поломки или утери устройства ключи можно восстановить на любом кошельке, который поддерживает стандарт BIP39 (генерация ключа из 24 секретных слов которые вы записываете в момент инициализации кошелька).

### Private keys are not shared 

> The first time you use it, you need to initialize the device. First, enter the PIN. The numbers are displayed on the device in the plate in random order, and we enter them on the computer in the appropriate places in the table with hidden numbers. Next, the key is generated and you need to write down 24 words. It is IMPORTANT to keep these words secret, because in case of loss or breakage of the key, only they will help you to restore your key. There is also a risk of theft if an intruder learns these words. This completes the device setup.

## Interface

Interestingly, with a bit of searching, we were able to find a few [pictures of the device](https://twitter.com/BitcoinWalletz/status/1463806581590482947), one of which displays an OLED screen which tells the user to visit trezor.io/start. 

## Reproducibility

Open source was not mentioned anywhere in cerberwallet.ru. 

Without having our hands on the actual device, we suspect that Cerber may have borrowed code from Trezor since it links to Trezor both on the website and on the device. 

With that said, the hardware wallet has a very limited footprint online. We were only able to find two websites that mention it and the postings practically copied from the main website. 

It is highly likely that this hardware wallet's code cannot be verified.

## Old Review 2021-08-15

The website and information of this wallet is only available in Russian.

