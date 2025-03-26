---
layout: reviewCustodian
title: "BitGo, Inc."
platformReview:
  type: custodians
  appId: "bitgo"
icon: "bitgo.png"

custodian:
  crunchbaseUrl: "https://www.crunchbase.com/organization/bitgo"

  leadership:
    jurisdiction: 🇺🇸 "United States"
    yearsInBusiness: "11"
    ceo:
      name: "Mike Belshe"
      position: "CEO and Co-founder"
      tenure: "2013-present"
      nationality: "American"
      photo: "/images/wIcons/leadership/bitgo-mike-belshe.jpg"
      social:
        twitter: "https://x.com/mikebelshe"
        linkedin: "https://www.linkedin.com/in/mikebelshe/"
        github: ""
    team:
      - name: "Mike Belshe"
        role: "CEO and Co-founder"
      - name: "Chen Fang"
        role: "Chief Product Officer"
    teamSource: "https://www.bitgo.com/team"

  androidApp:
    name: "BitGo"
    url: "/android/com.bitgo.mobile"
  
  androidApp:
    name: "BitGo"
    url: "/android/com.bitgo.mobile"

  iphoneApp:
    name: ""
    url: ""
  
  webApp:
    name: "BitGo Wallet"
    url: "/others/com.bitgo.web"
    icon: "fas fa-globe"

  browserExtension:
    name: ""
    url: ""

  desktopApp:
    name: ""
    url: ""
    platform: ""

  hotColdDesign:
    status: "published"
    lastUpdated: 
    details: "BitGo pioneered the multi-signature wallet technology (P2SH) and implements 2-of-3 multi-signature addresses for customer funds. They have a clear separation between hot and cold storage with distinct security protocols."
    documentation_url: "https://www.bitgo.com/platform/security"
    analysis: "BitGo's security model relies on multi-signature technology that distributes key fragments across multiple secure systems, eliminating single points of failure."
    supporting_urls:
      - "https://www.bitgo.com/platform/security"

  bitcoinFocus:
    status: "multi-currency"
    tradableAssets: ""
    tradingPairs: ""
    custodyAssets: "Over 50"
    CompleteList: "https://www.bitgo.com/resources/supported-coins"

  proofOfReserves:
    status: "traditional-audit"
    details: "BitGo relies on traditional financial audits rather than cryptographic proof of reserves."
    auditFrequency: ""
    lastAudit: ""
    auditUrl: ""
    developmentStatus: ""
    developmentUrl: ""

  operations:
    users: ""
    cryptographicProof:
      btcAmount: ""
      totalAssets: ""
      lastUpdated: ""
      source: ""
      sourceUrl: ""
      valid: false

    thirdPartyAudit:
      btcAmount: ""
      totalAssets: ""
      lastUpdated: ""
      source: ""
      sourceUrl: ""
      valid: false
    
    selfReported:
      btcAmount: ""
      totalAssets: "$80B+"
      lastUpdated: ""
      source: "BitGo Official Website"
      sourceUrl: "https://www.bitgo.com"
      valid: false

    notes: |
      

  trackRecord:
    history: ""
    incidentHistory:
      - description: ""
        date: ""
        url: ""
    sourceIncidents: ""
    lastIncident: ""
    insuranceCoverage: "$700 million in insurance coverage through Lloyd's of London"
    insuranceTermsUrl: "https://www.bitgo.com/services/custody"

  businessModel:
    type: "Custody & Wallet Infrastructure"
    services:
      - name: "Institutional Custody"
        url: "https://www.bitgo.com/services/custody"
      - name: "Wallet-as-a-Service"
        url: "https://www.bitgo.com/platform"
      - name: "Staking Services"
        url: "https://www.bitgo.com/services/staking"
      - name: "APIs & SDKs"
        url: "https://www.bitgo.com/platform"
    revenueStreams:
      - type: "Custody Fees"
        details: ""
      - type: "API Access Fees"
        details: ""

  riskAssessment:
    derivatives: false
    derivativesList:
      - name: ""
        url: ""
    memecoins: false
    memecoinList:
      - name: ""
        url: ""
    gambling: false

  bitcoinContribution:
    fossDevelopment: true
    research: true
    protocolSupport: true
    research_url: ""
    contributions:
      - name: "Open Source Development"
        url: "https://github.com/BitGo"

  userAccess:
    kycRequired: true
    kycLevel: ""
    withdrawalLimits:
      status: "tiered"
      documentation_url: ""

  security:
    features:
      - "Multi-signature technology"
      - "HSM"
      - "Policy engine"
      - "Key recovery"
    customInfrastructure: true
    details: "BitGo developed their own multi-signature implementation and maintains customized security infrastructure for wallet management."

---

BitGo pioneered the use of multi-signature wallet technology in the cryptocurrency industry and has been a leader in institutional custody solutions since its founding in 2013. The company's security practices include multi-signature addresses requiring multiple approvals, policy controls, and a clear separation between hot and cold storage systems.
