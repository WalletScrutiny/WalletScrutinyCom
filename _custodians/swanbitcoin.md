---
layout: reviewCustodian
title: "Swan Bitcoin"
platformReview:
  type: custodians
  appId: swan
icon: swanbitcoin.png

custodian:
  crunchbaseUrl: "https://www.crunchbase.com/organization/swan-bitcoin"
  leadership:
    jurisdiction: 🇺🇸 "United States"
    yearsInBusiness: "4"
    ceo:
      name: "Cory Klippsten"
      position: "CEO"
      tenure: "2019-present"
      nationality: "American"
      photo: "/images/wIcons/custodians/leadership/swanbitcoin-cory-klippsten.png"
      social:
        twitter: "https://x.com/coryklippsten"
        linkedin: "https://www.linkedin.com/in/coryklippsten"
    team:
      - name: "Cory Klippsten"
        role: "CEO"
      - name: "Yan Pritzker"
        role: "CTO"
      - name: "Brandon Quittem"
        role: "Head of Marketing"
    teamSource: "https://www.swanbitcoin.com/about"

  androidApp:
    name: "Swan Bitcoin: Buy & Invest Bitcoin"
    url: "/android/com.swanbitcoin.android"

  iphoneApp:
    name: "Swan Bitcoin: Buy & Invest"
    url: "/iphone/com.swanbitcoin.app"
  
  webApp:
    name: "Swan Bitcoin"
    url: "https://www.swanbitcoin.com"
    icon: "fas fa-globe"

  hotColdDesign:
    status: "published"
    lastUpdated: 2023-12-01
    details: "Swan Bitcoin uses cold storage custody solutions through Prime Trust for retail customers and Fidelity Digital Assets for institutional clients."
    documentation_url: "https://help.swanbitcoin.com/hc/en-us"
    analysis: "Swan emphasizes security through established institutional custody providers rather than managing custody infrastructure directly."
    supporting_urls:
      - "https://www.swanbitcoin.com/security"

  bitcoinFocus:
    status: "bitcoin-only"
    tradableAssets: "1"
    tradingPairs: "2"
    custodyAssets: "1"
    CompleteList: "https://www.swanbitcoin.com/bitcoin"

  proofOfReserves:
    status: "third-party custody"
    details: "Swan utilizes third-party qualified custodians Prime Trust and Fidelity Digital Assets"
    auditFrequency: 
    lastAudit:  
    developmentStatus: 
    developmentUrl: 

  operations:
    users: 
    cryptographicProof:
      btcAmount: 
      totalAssets: 
      lastUpdated: 
      source: 
      sourceUrl: 
      valid: false

    thirdPartyAudit:
      btcAmount: 
      totalAssets: 
      lastUpdated: 
      source: 
      sourceUrl: 
      valid: false

    selfReported:
      btcAmount: 
      totalAssets: 
      lastUpdated: 
      source: 
      sourceUrl: 
      valid: false

  trackRecord:
    history: "No major security incidents reported since inception"
    incidentHistory: []
    sourceIncidents: 
    lastIncident: 
    insuranceCoverage: "FDIC insurance on USD deposits, custody insurance through Prime Trust and Fidelity"
    insuranceTermsUrl: "https://www.swanbitcoin.com/legal"

  businessModel:
    type: "Bitcoin Investment Platform"
    services:
      - name: "Bitcoin Purchase"
        url: "https://www.swanbitcoin.com/buy-bitcoin"
      - name: "Automatic Savings"
        url: "https://www.swanbitcoin.com/savings"
      - name: "Private Client Services"
        url: "https://www.swanbitcoin.com/private-client"
      - name: "IRA Services"
        url: "https://www.swanbitcoin.com/ira"
      - name: "Mining"
        url: "https://www.swanbitcoin.com/mining"
    revenueStreams:
      - type: "Transaction Fees"
        details: "Fee per bitcoin purchase"
      - type: "Private Client Services"
        details: "Fees for high-net-worth services"

  riskAssessment:
    derivatives: false
    derivativesList: []
    memecoins: false
    memecoinList: []
    gambling: false

  bitcoinContribution:
    fossDevelopment: true
    research: true
    protocolSupport: true
    research_url: "https://www.swanbitcoin.com/bitcoin-resources"
    contributions:
      - name: "Swan Signal"
        url: "https://www.swanbitcoin.com/signal"
      - name: "Swan Private Research"
        url: "https://www.swanbitcoin.com/private"
      - name: "Bitcoin Educational Content"
        url: "https://www.swanbitcoin.com/learn"
  
  userAccess:
    kycRequired: true
    kycLevel: "Full"
    withdrawalLimits:
      status: "tiered"
      documentation_url: "https://help.swanbitcoin.com"

  security:
    features:
      - "2FA"
      - "Whitelisted Withdrawal Addresses"
      - "Email Confirmations"
    customInfrastructure: false
    details: "Swan Bitcoin relies on established custodians for security infrastructure while maintaining strong platform security measures."

---