---
title: SecuX StreamPro
appId: secuxstreampro
authors:
- danny
icon: secuxstreampro.png
date: 2022-05-17
website: https://secuxtech.com/secux-payment-terminal
twitter: SecuXwallet
social:
- https://www.linkedin.com/company/secuxtech
- https://www.facebook.com/secuxtech
- https://www.instagram.com/secuxtechnology/
- https://www.youtube.com/channel/UCfSfjbBHYgGIOcQJoB5hotQ
provider: SecuX Technology Inc.
providerWebsite: https://secuxtech.com
country: TW
meta: ok
verdict: wip

---

The {{ page.title }} is manufactured by the same company that manufactured these products: 

- {% include walletLink.html wallet='hardware/secuxstonew10' verdict="true" %} 
- {% include walletLink.html wallet='hardware/secuxstonew20' verdict="true" %}
- {% include walletLink.html wallet='hardware/secuxstonev20' verdict="true" %} 

> The SecuX Stream Pro is an offline payment framework including P22 payment terminal, App SDK and server container and it is designed for payment service provider, not for consumers and merchants.

On [its homepage](https://secuxtech.com/secux-payment-terminal), it is described as the "World’s first Bluetooth LE payment crypto payment solution."

In order to evaluate the product, potential users have to request for an [Payment Evaluation Kit](https://secuxtech.com/secuxtech-download/Payment-EvKit/EvKit-Quick-Start-Guide.pdf). 

Initially, information that's readily available about this device describes the process as:

> 01 Merchant Authorization <br />
Upon entering the correct amount at cashier, SecuX StreamPro enables crypto payment by generating a scannable one-time QR code.
>
> 02 Customer Confirmation <br />
> Customer confirms and processes payment with biometric authentication such as fingerprint or facial recognition.

<iframe width="560" height="315" src="https://www.youtube.com/embed/Zrz3GNNV2AU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Evaluation

> SecuX Crypt Payment solution is the first open and end-to-end building blocks to realize cryptocurrency payment in multiple retail scenarios in a low cost and easy-to-use manner.
>
There are 4 key features of the solution:
1. Open API supporting multiple cryptocurrencies and white-label wallet apps support dynamic & flexibility business requirement in the retail business.
2. Hardware-based security design establishes a high standard of secure cryptocurrencies in payment and storage applications.
3. Smart IoT-based payment terminals fulfill various offline payment scenarios including street booth, store, restaurant, vending machine, parking gate…etc.
4. The payment terminal does not require an Internet connection, which has the advantages of low cost and easy deployment.

## Merchant Dashboard Portal

> Merchant Dashboard puts you in charge and stay on the top as a business manager and team leader. It offers a comprehensive understanding of analytic information such as payment history, account information, sales data, and statistics.

This is accessible [here](https://pmsweb-sandbox.secuxtech.com/SecuXPMS/PortalLogin.html).

> SecuX Merchant Portal is a cloud service as part of SecuX Payment EvKit. Merchant Portal allows you to manage the payment terminal device and merchant accounts, view payment history and portal dashboard.
>
> We provide merchant server service API for our customers to integrate required micro services into their own App.
>
> Before evaluation, please activate your Merchant Portal account first. You will receive an invitation email from SecuX Support Team to show you how to do it. 
>
> After registration, you can access again to your portal account from https://pmsweb-sandbox.secuxtech.com/SecuXPMS/PortalLogin.html. we will have your basic company information ready on your Merchant Portal based on the information provided if any

## The Devices

There are two main devices, the P22 and the P20. Either of these come with the SecuX evPay app, the app SDK, the merchant dashboard portal account and the API.  

The device pictured on this review is the P22. 

> P22 - Designed with a keyboard and dual LCD displays (merchant-facing and consumer-facing). P22 is designed for placing on the checkout counter in the store. It can be powered by a fixed USB power source or AA battery.

## SecuX evPay

The Android app for the SecuX evPay can be found [here](https://play.google.com/store/apps/details?id=com.secuxtech.mysecuxpay). 

We installed the app and it required registration. After we registered, the app detected that our phone did not have NFC. It then asked us to pair the app via bluetooth to another device. We assume that the other device should be the P22. 

This process is further described on [this PDF file](https://secuxtech.com/secuxtech-download/Payment-EvKit/EvKit-Quick-Start-Guide.pdf).

## Analysis 

The evaluation kit is a demo account that uses tokens and not actual cryptocurrency. We would have to verify with SecuX if the P22 device does have a wallet or whether they **host wallets on their account** via the Merchant Dashboard.  
