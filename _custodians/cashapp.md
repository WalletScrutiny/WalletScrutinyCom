---

layout: reviewCustodian
title: "Cash App"
platformReview:
  type: custodians
  appId: "cashapp"
icon: "cashapp.png"

custodian:
  crunchbaseUrl: "https://www.crunchbase.com/organization/square"

  leadership:
    jurisdiction: "🇺🇸 United States"
    yearsInBusiness: "11"
    ceo:
      name: "Jack Dorsey"
      position: "As CEO & Chairman of Block, Inc."
      tenure: "2013-present"
      nationality: "American"
      photo: "/images/wIcons/custodians/leadership/cashapp-jack-dorsey.png"
      social:
        twitter: "https://twitter.com/jack"
        linkedin: ""
        github: "https://github.com/jack"
    team:
      - name: "Amrita Ahuja"
        role: "CFO & COO of Block, Inc."
      - name: "Brian Grassadonia"
        role: "Ecosystem Lead at Block, Inc. (formerly CEO of Cash App)"
      - name: "Catherine Ferdon"
        role: "Chief Marketing Officer at Cash App"
      - name: "Guillaume Forget"
        role: "Engineering Leadership at Cash App"
    teamSource: "https://www.linkedin.com/company/cash-app"

  androidApp:
    name: "Cash App"
    url: "/android/com.squareup.cash"

  iphoneApp:
    name: "Cash App"
    url: "/iphone/com.squareup.cash"
  
  webApp:
    name: "Cash App Web"
    url: "https://cash.app"
    icon: "/android/com.squareup.cash"

  hotColdDesign:
    status: "none"
    lastUpdated: 
    details: "Cash App provides custodial Bitcoin services for its users, maintaining control of the private keys. Block (the parent company) has separately developed Bitkey, a self-custody Bitcoin wallet solution, as a distinct product from Cash App."
    architecture: 
    documentation_url: ""
    analysis: <p>Cash App's Bitcoin offering is fully custodial, where Cash App manages the private keys on behalf of users.</p>
    supporting_urls:
      - ""

  bitcoinFocus:
    status: "bitcoin-only"
    tradableAssets: ""
    tradingPairs: ""
    custodyAssets: ""
    CompleteList: ""

  proofOfReserves:
    status: "none"
    details: ""
    auditFrequency: ""
    lastAudit: ""
    auditUrl: ""
    developmentStatus: ""
    developmentUrl: ""

  operations:
    users: "60M"
    cryptographicProof:
      btcAmount: ""
      totalAssets: ""
      lastUpdated: ""
      source: ""
      sourceUrl: ""
      valid: false

    thirdPartyAudit:
      btcAmount: "8485 BTC"
      totalAssets: ""
      lastUpdated: "2025-03-18"
      source: "BitcoinTreasuries.net"
      sourceUrl: "https://bitcointreasuries.net/entities/block"
      valid: true
    
    selfReported:
      btcAmount: ""
      totalAssets: ""
      lastUpdated: ""
      source: ""
      sourceUrl: ""
      valid: 

    notes: |
      <p>Block (formerly Square), the parent company of Cash App, announced $2.16 billion in Bitcoin revenue for Q1 2023. Cash App allows users to buy, sell, and hold Bitcoin in a custodial environment, where Cash App maintains control of the private keys.</p>
      <p>While Block in its SEC filings, indicates the amount of BTC on a quarterly basis - this is the amount it holds for investment - and not the amount it custodies for its customers.</p>
      <p><strong>1. Bitcoin Investment (Owned by Block)</strong></p>
      <ul>
          <li>Block holds Bitcoin for investment purposes, which it measures at fair value.</li>
          <li>As of December 31, 2024, the fair value of Block’s Bitcoin investment is $792.3 million.</li>
      </ul>

      <p><strong>2. Bitcoin Held for Cash App Customers (Custodial Bitcoin)</strong></p>
      <ul>
          <li>Cash App allows users to store Bitcoin in Block’s digital wallets.</li>
          <li>This Bitcoin is not recorded as an asset on Block’s balance sheet.</li>
      </ul>


  trackRecord:
    history: "Cash App is a subsidiary of Block Inc. (formerly Square), which has a strong focus on Bitcoin as part of its financial services. Jack Dorsey, CEO of Block, is a vocal Bitcoin advocate."
    incidentHistory:
      - description: ""
        date: ""
        url: ""
    sourceIncidents: ""
    lastIncident: ""
    insuranceCoverage: ""
    insuranceTermsUrl: ""

  businessModel:
    type: "Financial Services"
    services:
      - name: "Digital Payments"
        url: "https://cash.app"
      - name: "Bitcoin Trading"
        url: "https://cash.app/bitcoin"
    revenueStreams:
      - type: "Transaction Fees"
        details: "Fees on Bitcoin purchases and sales"
      - type: "Payment Processing"
        details: "Fees on payment services"

  riskAssessment:
    derivatives: false
    derivativesList:
      - name: ""
        url: ""
    memecoins: false
    memecoinList:
      - name: ""
        url: ""
  
  bitcoinContribution:
    fossDevelopment: true
    research: true
    protocolSupport: true
    research_url: "https://spiral.xyz/"
    contributions:
      - name: "Lightning Development Kit (LDK)"
        url: "https://spiral.xyz/"
      - name: "Bitcoin Development Kit (BDK)"
        url: "https://spiral.xyz/"
      - name: "Bitcoin Design Community"
        url: "https://bitcoinmagazine.com/business/spiral-launches-bitcoin-design-foundation-to-boost-adoption"
      - name: "Summer of Bitcoin"
        url: "https://www.tftc.io/summer-of-bitcoin-renewed-funding-spiral/"
      - name: "Daniela Brozzoni"
        url: "https://www.coindesk.com/tech/2022/07/12/how-i-became-a-bitcoin-developer-fresh-out-of-high-school"
      - name: "Christoph Ono"
        url: "https://spiral.xyz/blog/spiral-quarterly-update-q3-2022/"
      - name: "Sean Gilligan"
        url: "https://www.nobsbitcoin.com/spiral-issues-grant-for-sean-giligan-design-grants-bdf/"
      - name: "Johannes Hofmann"
        url: "https://spiral.xyz/blog/spiral-quarterly-update-q3-2022/"
      - name: "Josh Kitman"
        url: "https://spiral.xyz/blog/spiral-quarterly-update-q3-2022/"

  
  userAccess:
    kycRequired: true
    kycLevel: "Standard identity verification required for using Bitcoin features"
    withdrawalLimits:
      status: "tiered"
      documentation_url: "https://cash.app/help"

  security:
    features:
      - "Two-factor authentication"
      - "PIN protection"
      - "Face/Touch ID"
    customInfrastructure: true
    details: "Cash App implements standard security measures for its custodial Bitcoin services, where the app retains control of private keys for Bitcoin held within user accounts."

---
