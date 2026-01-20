---
title: CrypotoKona
appId: com.konai.cryptokona
meta: removed
verdict: nowallet

---

## App Description from Google Play 

This is the companion app to the {% include walletLink.html wallet='hardware/konai.cryptokona' verdict='true' %}

> - Users can make an account on cryptocurrency such as Bitcoin, Ethereum, Litecoin.
> - Users can receive coin from another account and send to other individual account.
> - Every operations are possible with our CryptoKona card that have private key and use BLE technology so it's really safe from any danger.
>
> *Entitlement*
> - Camera: it allow read QR code(it represent coin address)
> - BLE: it allow connect to HD card with BLE

## Analysis 

- We installed the app but couldn't get past through the 'Please connect card via Bluetooth'
- As the companion app to {% include walletLink.html wallet='hardware/konai.cryptokona' verdict='false' %}, the private keys are stored in the hardware wallet. No other functionalities are available, unless the card is present and paired via BLE. Thus, this is **not a wallet**. 
