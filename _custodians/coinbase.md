---
layout: reviewCustodian
title: "Coinbase, Inc."
platformReview:
  type: custodians
  appId: coinbase
icon: coinbase.jpg

custodian:
  crunchbaseUrl: "https://www.crunchbase.com/organization/coinbase"
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
    status: "published"
    lastUpdated: 2021-05-04
    details: "Coinbase employs a Threshold Signing Service (TSS) with multi-party cryptographic signing, HSM-enforced security, and comprehensive key protection measures. 98% of funds are in cold storage with air-gapped key management and geographic distribution."
    documentation_url: "https://www.coinbase.com/blog/production-threshold-signing-service"
    analysis: "Coinbase's security infrastructure combines TSS, HSMs, and multi-party controls to protect billions in customer assets. Their approach eliminates single points of failure through consensus-based deployments, anomaly detection, and immutable logging."
    supporting_urls:
      - "https://www.coinbase.com/blog/production-threshold-signing-service"
      - "https://help.coinbase.com/en/prime/trading-and-funding/cold-storage-transaction-faqs"
      - "https://www.coinbase.com/blog/a-behind-the-scenes-look-at-the-biggest-and-quietest-crypto-transfer-on"

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
    cryptographicProof:
      btcAmount: ""
      totalAssets: ""
      lastUpdated: ""
      sourceUrl: ""
      valid: false
    
    thirdPartyAudit:
      btcAmount: "887,417 BTC"
      totalAssets: "$124,259,457,664.10"
      lastUpdated: "2025-01-30"
      sourceUrl: "https://intel.arkm.com/explorer/entity/coinbase"
      valid: true

    selfReported:
      btcAmount: ""
      totalAssets: "$137B"
      lastUpdated: "2024-10-30"
      sourceUrl: "https://investor.coinbase.com/files/doc_financials/2024/q3/Q3-24-Shareholder-Letter.pdf"
      valid: true

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
    derivativesList:
      - name: "Coinbase Derivatives"
        url: "https://www.coinbase.com/en-gb/derivatives"
      - name: "Coinbase Futures"
        url: "https://www.coinbase.com/en-gb/international-exchange"
    memecoins: true
    memecoinList:
      - name: "DOGE"
        url: "https://exchange.coinbase.com/trade/DOGE-USD"
      - name: "SHIB"
        url: "https://exchange.coinbase.com/trade/SHIB-USD"
      - name: "FLOKI"
        url: "https://exchange.coinbase.com/trade/FLOKI-USD"
      - name: "PEPE"
        url: "https://exchange.coinbase.com/trade/PEPE-USD"
      - name: "GIGA"
        url: "https://exchange.coinbase.com/trade/GIGA-USD"
      - name: "TRUMP"
        url: "https://exchange.coinbase.com/trade/TRUMP-USD"
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

Additional Information: 

Coinbase's Threshold Signing Service (TSS) is a core part of its custody solution, ensuring:

- Private keys are never fully exposed at any stage.
- Multiparty cryptographic signing replaces traditional key reconstruction.
- Nonce protection and validation processes prevent private key leaks.
- Hardware Security Modules (HSMs) enforce physical security.
- Encryption, access control, and hybrid participation reduce risks.
- These methods enhance the security of Coinbase’s custodial wallets, protecting billions in customer assets from hacks, insider threats, and cryptographic attacks.

Source: https://www.coinbase.com/blog/production-threshold-signing-service

### 2016 - How Coinbase Builds Secure Infrastructure To Store Bitcoin In The Cloud

- Eliminates single points of failure by requiring multi-party control for sensitive operations.
- Restricts production access to vetted employees, with strict monitoring & immutable logging.
- Cold storage security via air-gapped key management, Shamir’s Secret Sharing, and geographic key distribution.
- Anomaly detection & kill switches for immediate threat response.
- Consensus-based deployments prevent unauthorized or malicious changes.
- Full Dockerization for consistent, repeatable, and secure deployments.

Conclusion: 
