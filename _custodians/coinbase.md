---
layout: reviewCustodian
title: "Coinbase, Inc."
platformReview:
  type: custodians
  appId: coinbase
icon: coinbase.jpg

custodian:
  leadership:
    jurisdiction: 🇺🇸 "United States"
    yearsInBusiness: "11"
    ceo:
      name: "Brian Armstrong"
      position: "CEO, Co-founder and Chairman of the Board"
      tenure: "2012-present"
      nationality: "American"
      photo: "/images/wIcons/custodians/leadership/coinbase-brian-armstrong.jpeg"
      social:
        twitter: "https://twitter.com/brian_armstrong"
        linkedin: "https://www.linkedin.com/in/barmstrong"
        github: "https://github.com/barmstrong"
    team:
      - name: "Brian Armstrong"
        role: "CEO, Co-founder and Chairman of the Board"
      - name: "Emile Choi"
        role: "President & Chief Operating Officer"
      - name: "Alesia Haas"
        role: "Chief Financial Officer"
      - name: "L.J. Brock"
        role: "Chief People Officer"
      - name: "Paul Grewal"
        role: "Chief Legal Officer"
      - name: "Gregory Tusar"
        role: "VP, Institutional Product"

  androidApp:
    name: "Coinbase: Buy Bitcoin & Crypto"
    url: "/android/com.coinbase.android"

  iphoneApp:
    name: "Coinbase: Buy Bitcoin & Crypto"
    url: "/iphone/com.vilcsak.bitcoin2"
  
  webApp:
    name: "Coinbase: Web Wallet"
    url: "/others/com.coinbase.web"

  browserExtension:
    name: "Coinbase: Buy Bitcoin & Crypto"
    url: "/others/ext.coinbase"

  hotColdDesign:
    status: "outdated"
    lastUpdated: 2018-12-19
    details: "98% of funds in cold storage. Multi-signature architecture..."
    documentation_url: "https://www.coinbase.com/blog/a-behind-the-scenes-look-at-the-biggest-and-quietest-crypto-transfer-on"
    analysis: "Coinbase’s cold storage has gone through a number of evolutions through the years as the cryptocurrency space has evolved and matured. Coinbase’s standard for truly cold storage is that multiple geographically separated humans in the real world should be forced to perform physical actions to enable a transaction after reviewing transaction details. If that isn’t true, we don’t think it’s actually cold storage."
    supporting_urls:
      - "https://www.coinbase.com/blog/production-threshold-signing-service"
      - "https://help.coinbase.com/en/prime/trading-and-funding/cold-storage-transaction-faqs"

  bitcoinFocus:
    status: "multi-currency"
    tradableAssets: "Over 240"
    tradingPairs: "More than 300"
    custodyAssets: "Over 425"
    CompleteList: "https://coinbase.bynder.com/m/337c9f06d83b903a/original/Coinbase-Assets-Supported-Pairs.pdf"

  proofOfReserves:
    status: "traditional-audit"
    details: "Coinbase relies on traditional financial audits by Deloitte rather than cryptographic proof of reserves. They have granted funding to Veridise to develop a native proof of reserves system, but this is not yet implemented."
    auditFrequency: "Annual"
    lastAudit: "2023"
    auditUrl: "https://www.coinbase.com/blog/coinbase-releases-2022-transparency-report"
    developmentStatus: "In development via Veridise grant"
    developmentUrl: "https://www.coinbase.com/blog/announcing-the-first-coinbase-grant-recipients"

  bitcoinFocus:
    status: "multi-currency"
    tradableAssets: "Over 240"
    tradingPairs: "More than 300"
    custodyAssets: "Over 425"
    CompleteList: "https://coinbase.bynder.com/m/337c9f06d83b903a/original/Coinbase-Assets-Supported-Pairs.pdf"

  operations:
    btcCustodied: "2.5M BTC"
    trackRecord: "No major security incidents"
    incidentHistory: ""
    lastIncident: ""
    insuranceCoverage: "$255M coverage"

  businessModel:
    type: "Exchange & Custody"
    services:
      - "Buy/Sell Crypto"
      - "Staking"
    restrictedCountries:
      - "Iran"
      - "North Korea"

  bitcoinContribution:
    fossDevelopment: true
    research: false
    protocolSupport: false
    details: "Occasionally sponsors open-source Bitcoin dev."

  userAccess:
    kycRequired: true
    kycLevel: "Advanced"
    withdrawalLimits:
      daily: "100 BTC"
      monthly: "300 BTC"

  security:
    features:
      - "2FA"
      - "FIDO2"
      - "Withdrawal Whitelisting"
    customInfrastructure: true
    details: "They run their own servers with dedicated HSMs."
---

*(Markdown content for your page can go here. This text appears below the partial output, or you can leave it blank if you just want the partial’s content.)*
