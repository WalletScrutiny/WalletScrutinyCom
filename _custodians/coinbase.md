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
    teamSource: "https://investor.coinbase.com/governance/management/default.aspx"

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
    details: "Coinbase relies on traditional financial audits by Deloitte rather than cryptographic proof of reserves. They have granted funding to Silver Sixpence to develop a native proof of reserves system, but this is not yet implemented."
    auditFrequency: "Annual"
    lastAudit: "2023"
    auditUrl: "https://www.sec.gov/ix?doc=/Archives/edgar/data/1679788/000167978824000022/coin-20231231.htm"
    developmentStatus: "Proof-of-Reserves in development via Silver Sixpence grant"
    developmentUrl: "https://www.coinbase.com/blog/proof-of-reserves-grant"

  operations:
    btcCustodied: "887,346 BTC"
    SourceBTC: "https://intel.arkm.com/explorer/entity/coinbase"
    AssetsUnderCustody: "$273B"
    SourceAUC: "https://investor.coinbase.com/home/default.aspx"

  trackRecord:
    history: "Multiple security incidents affecting customer accounts"
    incidentHistory:
      - description: "Third-party bank data exposure affecting 154 customers' transaction data and personal information"
        date: "July 2024"
        url: "https://cybernews.com/news/coinbase-third-party-breach"
      - description: "Account compromise affecting over 6,000 customers through phishing attacks"
        date: "October 2021"
        url: "https://thecyberexpress.com/coinbase-cyber-attack-customer-data-sale"
      - description: "SMS-based two-factor authentication vulnerability exploited, affecting over 6,000 accounts"
        date: "March-May 2021"
        url: "https://therecord.media/hackers-bypass-coinbase-2fa-to-steal-customer-funds"
    sourceIncidents: "https://status.coinbase.com/"
    lastIncident: "July 2024"
    insuranceCoverage: "See Coinbase's Insurance Terms"
    insuranceTermsUrl: "https://www.coinbase.com/legal/insurance"

  businessModel:
    type: "Exchange & Custody"
    services:
      - name: "Cryptocurrency Trading"
        url: "https://help.coinbase.com/en/coinbase/trading-and-funding"
      - name: "Institutional Custody"
        url: "https://www.coinbase.com/prime/custody"
      - name: "Coinbase Prime"
        url: "https://www.coinbase.com/prime"
      - name: "Private Client Services"
        url: "https://www.coinbase.com/private-client"
      - name: "Institutional Services"
        url: "https://www.coinbase.com/institutional"
      - name: "Staking Services"
        url: "https://www.coinbase.com/en-gb/earn"
      - name: "NFTs"
        url: "https://help.coinbase.com/en/wallet/nft-management/nft-overview"
      - name: "Coinbase Commerce"
        url: "https://www.coinbase.com/en-gb/commerce"
    revenueStreams:
      - type: "Transaction Fees"
        details: "Variable percentage based on trade volume and payment method"
      - type: "Custody Fees"
        details: "Based on assets under custody"

  riskAssessment:
    derivatives: true
    memecoins: true
    gambling: false

  bitcoinContribution:
    fossDevelopment: true
    research: true
    protocolSupport: true
    research_url: "https://www.coinbase.com/en-gb/public-policy/advocacy/institute"
    contributions:
      - name: "Crypto Community Fund (2020)"
        url: "https://www.coinbase.com/blog/coinbase-will-sponsor-two-bitcoin-core-developers-with-first-crypto"
      - name: "Donation to Brink ($3.6M, 2024)"
        url: "https://bitcoinmagazine.com/business/coinbases-givecrypto-donates-3-6-million-to-brink-to-fund-bitcoin-developers"
      - name: "Gitcoin Partnership ($1M commitment)"
        url: "https://www.coinbase.com/blog/coinbase-commits-1-million-for-public-goods-in-partnership-with-gitcoin"

  userAccess:
    kycRequired: true
    kycLevel: "Advanced"
    withdrawalLimits:
      status: "tiered"
      documentation_url: "https://help.coinbase.com/en/exchange/funding/deposit-and-withdrawal-limits"

  security:
    features:
      - "2FA"
      - "FIDO2"
      - "Withdrawal Whitelisting"
    customInfrastructure: true
    details: "They run their own servers with dedicated HSMs."
---

*(Markdown content for your page can go here. This text appears below the partial output, or you can leave it blank if you just want the partial’s content.)*
