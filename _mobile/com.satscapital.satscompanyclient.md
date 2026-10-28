---
title: 'SATS: Bitcoin Cashback'
date: 2026-10-28
authors:
- leo
website: https://www.satscapital.com.br
redirect_from:
- /iphone/com.satscapital.satsClient/
android:
  appId: com.satscapital.satscompanyclient
  users: 10000
  appCountry: us
  released: Oct 31, 2024
  updated: 2026-10-16
  version: 2.18.1
  icon: com.satscapital.satscompanyclient.webp
  meta: ok
  verdict: nosendreceive
  developerName: Sats Capital
iphone:
  appId: com.satscapital.satsClient
  idd: '6737625497'
  appCountry: br
  released: '2024-11-04T08:00:00Z'
  updated: 2026-10-16
  version: 2.18.3
  reviews: 15
  icon: com.satscapital.satsClient.webp
  meta: ok
  verdict: wip
  developerName: SatsCapital

---

## App Description

SATS: Bitcoin Cashback is published by Sats Capital (SATS CAPITAL LTDA., Brazil). Users shop at partner stores such as Shopee, Casas Bahia and AliExpress through the app, and part of the store's commission is credited to them as satoshis. The Play Store description promises "Watch your balance grow and withdraw whenever you want". The app has no way to buy or deposit bitcoin.

## Analysis

- **Bitcoin support.** The [Terms of Use](https://www.satscapital.com.br/termos) define cashback as a refund in Brazilian reais with "automática conversão em ativo digital Bitcoin (BTC)". Balances are shown in satoshis.
- **Custody.** The [Security page](https://www.satscapital.com.br/seguranca) says: "Não somos uma carteira. A custódia dos seus satoshis é feita por parceiros especializados em segurança de criptoativos" (we are not a wallet; your satoshis are held by partners specialised in crypto security). It adds that the satoshis are kept in partners' cold wallets.
- **No deposits.** Balances come only from cashback. Neither the Play Store description, the [website](https://www.satscapital.com.br) nor the Terms describe sending bitcoin into the app.
- **Withdrawals: conflicting statements.** The Security page says "A qualquer momento você pode transferir seus satoshis para sua carteira pessoal (Lightning)" (you can move your satoshis to your own Lightning wallet at any time), and the homepage lists "Saque em Bitcoin" (Bitcoin withdrawal). The Terms of Use, titled "Termo de Usuário - Versão Experimental do Sistema Sats Capital", say the opposite in capitals: "A VERSÃO EXPERIMENTAL E ATUAL DO SISTEMA SATS CAPITAL AINDA NÃO PERMITE O RESGATE DOS SATOSHIS (BITCOIN) OBTIDOS ATRAVÉS DE CASHBACK" (the current experimental version does not yet allow redeeming the satoshis earned as cashback). The Terms also say that registered data and cashback information "podem arbitrariamente ser apagadas do sistema" (may be deleted arbitrarily). We did not install the app and could not check which statement holds.

Bitcoin cannot be deposited into SATS, and the provider's binding terms say the earned satoshis cannot yet be withdrawn. We therefore rate it [no send/receive](/methodology/#nosendreceive). If Lightning withdrawals are confirmed to work, the app would still be custodial, because the satoshis are held by the provider's custody partners.

**Can't send or receive bitcoins**
