---
layout: reviewCustodian
title: "Poloniex, LLC"
platformReview:
  type: custodians
  appId: "poloniex"
icon: "poloniex.png"

custodian:
  crunchbaseUrl: "https://www.crunchbase.com/organization/poloniex"

  leadership:
    jurisdiction: 🇸🇨 "Seychelles"
    yearsInBusiness: "11"
    ceo:
      name: "Justin Sun"
      position: "Owner"  # Note: He’s often the public face, though his exact title may vary; adjust if needed
      tenure: "2019-present"
      nationality: "Chinese-Grenadian"  # Reflects his Chinese birth and Grenadian citizenship
      photo: "/images/wIcons/custodians/leadership/poloniex-justin-sun.png"  
      social:
        twitter: "@JustinSunTron"
        linkedin: "https://www.linkedin.com/in/justinsuntron/"  
        github: ""    
    team:
      - name: ""
        role: ""
    teamSource: ""

  androidApp:
    name: "Poloniex - Crypto Exchange"
    url: "/android/com.plunien.poloniex"

  iphoneApp:
    name: "Poloniex Crypto Exchange"
    url: "/iphone/com.plunien.app.Poloniex"

  webApp:
    name: "Poloniex Web Exchange"
    url: "https://poloniex.com"
    icon: "fas fa-globe"

  hotColdDesign:
    status: "partial"
    lastUpdated: 2021-10-01
    details: "Poloniex employs a hot and cold-wallet infrastructure, with the majority of customer funds held in cold storage. Specific operational details and cryptographic methods are not extensively published or independently verifiable."
    documentation_url: "https://support.poloniex.com/hc/en-us/articles/360040031234-Account-Security"
    analysis: "Poloniex has historically maintained hot/cold wallet balances but lacks comprehensive public transparency or multi-signature details available from other custodians."
    supporting_urls:
      - "https://support.poloniex.com/hc/en-us/articles/360040031234-Account-Security"

  bitcoinFocus:
    status: "multi-currency"
    tradableAssets: "300+"
    tradingPairs: "500+"
    custodyAssets: "300+"
    CompleteList: "https://poloniex.com/markets"

  proofOfReserves:
    status: "partial"
    details: <p>"As of 2025-03-14, Poloniex claims to have 101.01% Total Reserve Ratio. Poloniex generates the underlying data block by linking the hashed UID and balance of each user. They then generate a Merkle tree based on all users' data. The Merkle root will change if any account ID or balance in the leaf node changes. Every user can verify whether their assets are included in the leaf node."</p> <p>We labelled this as partial, because Poloniex does not specify how much BTC holdings it has and lists only 13 altcoins."</p>
    Merkle Root Hash: "d18e3652b1282a4b98e2d8e2234ecc476cc71cc967a5b9ff2233777f5d3e0e52"
    auditFrequency: "Monthly"
    lastAudit: "2025-03-01"
    auditUrl: "https://poloniex.com/topic/security/proof-of-reserves?version=20250301"
    developmentStatus: "Hidden/Removed"
    developmentUrl: "https://github.com/poloniex/tools-go-merkle-verify"

  operations:
    users: "10M+"
    
    cryptographicProof:
      btcAmount: "Undisclosed"
      totalAssets: "Undisclosed"
      lastUpdated: "2025-03-01"
      source: "Poloniex"
      sourceUrl: "https://poloniex.com/topic/security/proof-of-reserves?version=20250301"
      valid: true
      comment: "Poloniex does not display all assets on record. As of the time of writing, it only displays 13 assets."

    thirdPartyAudit:
      btcAmount: ""
      totalAssets: ""
      lastUpdated: ""
      source: ""
      sourceUrl: ""
      valid: false

    selfReported:
      btcAmount: ""
      totalAssets: ""
      lastUpdated: ""
      source: ""
      sourceUrl: ""
      valid: false

    notes: |
      <p>Poloniex is a centralized cryptocurrency exchange offering trading in hundreds of cryptocurrencies. It was acquired by Circle in 2018 and later divested to Polo Digital Assets, Ltd., a Seychelles-based firm associated with TRON founder Justin Sun.</p>

  trackRecord:
    history: "Multiple past security incidents and regulatory issues, highlighting vulnerabilities in platform security."
    incidentHistory:
      - description: "Certik Reports Poloniex BTC, TRON, and ETH wallets compromised, losing $132 million."
        date: "2023-11-10"
        url: "https://www.certik.com/resources/blog/poloniex-incident-analysis"
      - description: "Scammers exploited the lack of an official Poloniex app by publishing fake “Poloniex Exchange” and “Poloniex Company” apps, which garnered thousands of downloads​"
        date: "2023-03-23"
      - description: "Poloniex Forces Password Reset After Data Leak Found Online"
        date: "2019-12-30"
        url: "https://www.bleepingcomputer.com/news/security/poloniex-forces-password-reset-after-data-leak-found-online/"
      - description: "Lost 12.3% of Bitcoin holdings due to a hack."
        date: "2014-03-05"
        url: "https://www.coindesk.com/markets/2014/03/05/poloniex-loses-123-of-its-bitcoins-in-latest-bitcoin-exchange-hack"
    sourceIncidents: "https://support.poloniex.com/hc/en-us"
    lastIncident: "2023-11-10"
    insuranceCoverage: "Not publicly disclosed. In its terms and conditions page, it states: Digital Assets held in your Account are not subject to deposit insurance protection, including without limitation, the Federal Deposit Insurance Corporation insurance or Securities Investor Protection Corporation protections or any equivalent schemes outside of the United States."
    insuranceTermsUrl: "https://poloniex.com/support/terms"

  businessModel:
    type: "Centralized Exchange"
    services:
      - name: "Cryptocurrency Spot Trading"
        url: "https://poloniex.com/markets"
      - name: "Futures Trading"
        url: "https://poloniex.com/futures/"
      - name: "Margin Trading"
        url: "https://poloniex.com/marginTrading"
      - name: "Crypto Lending"
        url: "https://poloniex.com/lending"
      - name: "Poloniex Earn (Staking)"
        url: "https://poloniex.com/earn"
    revenueStreams:
      - type: "Transaction Fees"
        details: "Fees based on 30-day trading volume; maker/taker fee structure"
      - type: "Margin Interest"
        details: "Interest income from margin lending"

  riskAssessment:
    derivatives: true
    derivativesList:
      - name: "Poloniex Futures"
        url: "https://poloniex.com/futures/"
    memecoins: true
    memecoinList:
      - name: "DOGE"
        url: "https://poloniex.com/markets/DOGE_USDT"
      - name: "SHIB"
        url: "https://poloniex.com/markets/SHIB_USDT"
      - name: "PEPE"
        url: "https://poloniex.com/markets/PEPE_USDT"
    gambling: false

  bitcoinContribution:
    fossDevelopment: false
    research: false
    protocolSupport: false
    research_url: ""
    contributions: []

  userAccess:
    kycRequired: true
    kycLevel: "Basic to Advanced"
    withdrawalLimits:
      status: "tiered"
      documentation_url: "https://support.poloniex.com/hc/en-us/articles/360040342833-Account-Tiers-Verification-Levels-Withdrawal-Limits"

  security:
    features:
      - "2FA"
      - "IP Whitelisting"
      - "Session Monitoring"
    customInfrastructure: false
    details: "Basic industry-standard security measures, including two-factor authentication and IP whitelisting."
    certifications:
      - name: ""
        issuer: ""
        details: ""
        url: ""

---