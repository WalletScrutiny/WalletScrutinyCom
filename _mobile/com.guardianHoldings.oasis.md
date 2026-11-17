---
title: 오아시스 거래소
date: 2026-10-31
authors:
- leo
website: https://oasisexc.com/
android:
  appId: com.guardianHoldings.oasis
  users: 500
  appCountry: us
  updated: 2026-01-16
  version: 1.0.7
  icon: com.guardianHoldings.oasis.webp
  meta: fewusers
  verdict: custodial
  developerName: Oasis Exchange
iphone:
  appId: com.guardianHoldings.oasis
  idd: '6504232616'
  appCountry: kr
  released: '2024-07-17T07:00:00Z'
  updated: 2026-03-11
  version: 1.0.9
  reviews: 1
  icon: com.guardianHoldings.oasis.webp
  meta: ok
  verdict: custodial
  developerName: (주) 가디언홀딩스

---

**⚠️ Warning:** We could not confirm that this exchange is open for trading. Oasis Exchange's notices say trading and deposits were suspended for a "renewal" from March 2024, and that suspension was extended to the end of 2025. Bitcoin deposits and withdrawals have been suspended since February 2023, and we found no notice that they resumed. The company's website now says it is not an exchange at all. Its legal pages call themselves samples that still need legal review.

## App Description

This is the app of 오아시스 거래소 (Oasis Exchange), a South Korean crypto exchange run by (주)가디언홀딩스 (Guardian Holdings) in Gangnam, Seoul. The Play description introduces it as a "Virtual asset business operator (VASP) approved by the Financial Services Commission of the Republic of Korea" and promises "fast and stable trading at the level of securities company MTS". We list two earlier Oasis Exchange apps, {% include walletLink.html wallet='android/com.oasisexc.app' verdict='true' %} and {% include walletLink.html wallet='android/com.oasisexcflutter.app' verdict='true' %}.

## Analysis

- **History.** Oasis Exchange [stopped withdrawals](https://oasisexc.com/notice) of many coins in January 2021 after voice-phishing money came in through rented accounts. In September 2021 it closed its won market and moved to "코인 마켓" (coin markets) with "거래 기축 코인 : USDT/BTC" ("base coins: USDT/BTC"). It says its VASP filing with the Korea Financial Intelligence Unit was "2022 년 1 월 26 일 신고 수리 결정" ("accepted on January 26, 2022"). In February 2022 [The Bell](https://www.thebell.co.kr/free/content/ArticleView.asp?key=202202240301470580107874) reported that its largest shareholder planned to sell a majority stake and that daily volume had fallen to about one million won. In March 2025 it handed the return of won deposits that customers had never withdrawn to the Korea Digital Asset Protection Foundation. All dated statements here are from Oasis Exchange's [notice board](https://oasisexc.com/notice) unless linked otherwise.
- **Bitcoin support.** BTC was one of the two base coins of the coin market from September 2021. A notice from February 21, 2023 reads "비트코인(BTC), 클레이튼(KLAY), 클레이튼 계열(KCT) 입출금 일시 중지 안내" ("temporary suspension of BTC, KLAY and KCT deposits and withdrawals") because of a wallet system check. It promises a separate notice once the network is stable. The notice board has a resumption notice for ETH from April 2023, but none for BTC.
- **Current state.** A notice from February 2024 announced a renewal with "이용불가 : 거래, 입금" ("unavailable: trading, deposits") from March 1, 2024, while withdrawals stayed available. A follow-up notice extended this to June 30, 2024, and then lists "추가 연장 일정: 2025년 7월1일 부터 ~ 2025년 12월 31일 까지" ("further extension: July 1 to December 31, 2025"). Notices from October 30, 2026 still address exchange users, about withdrawal restrictions to unregistered exchanges and to Binance. The [FAQ](https://oasisexc.com/static/oasis/resources/faq.html) on the same website, however, answers "OASIS는 거래소 서비스인가요?" ("Is OASIS an exchange service?") with "아닙니다" ("No") and describes a B2B settlement infrastructure. Its [terms](https://oasisexc.com/static/oasis/legal/terms.html) say "본 문서는 도입 검토용 예시이며, 실제 서비스 전 법률 검토가 필요합니다" ("this document is a sample for adoption review and needs legal review before actual service").
- **Custody.** Users deposit coins to addresses Oasis Exchange controls and trade balances on its books. Its January 2021 notice says "핫월렛과 콜드월렛의 비중을 나누어 회원 자산을 안전하게 보관하고 있습니다" ("we keep members' assets safe by dividing them between hot and cold wallets"). It adds that it deposits part of its assets at a large partner exchange for liquidity. The keys belong to the exchange, not to the user.

If the app works at all, it gives access to an exchange account where Oasis Exchange holds the coins, so it is {% include verdictBadge.html verdict="custodial" type='short' %}. The iPhone app is published by (주)가디언홀딩스 with the same description, so the same applies to it.

**Custodial: The provider holds the keys**
