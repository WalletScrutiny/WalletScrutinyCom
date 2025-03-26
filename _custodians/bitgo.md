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
      photo: "/images/wIcons/custodians/leadership/bitgo-mike-belshe.png"
      social:
        twitter: "https://x.com/mikebelshe"
        linkedin: "https://www.linkedin.com/in/mikebelshe/"
        github: ""
    team:
      - name: "Mike Belshe"
        role: "CEO and Co-founder"
      - name: "Chen Fang"
        role: "COO"
      - name: "Ed Reginelli"
        role: "CFO"
      - name: "Jeff Horowitz"
        role: "Chief Compliance Officer"
      - name: "Krishna Juvvadi"
        role: "Chief Legal Officer"
      - name: "Jody Mettler"
        role: "President, BitGo Trust"
      - name: "Mark Azad"
        role: "CRO"
      - name: "Michelle Neufeld"
        role: "Deputy CCO And BSA Officer"
      - name: "Sebastian Giloth"
        role: "Deputy CCO/CRO Germany"
      - name: "Abel Seow"
        role: "Managing Director"
      - name: "Chris Steele"
        role: "Chief Risk Officer"
      - name: "J. Baylor Myers"
        role: "Vice President, Corporate Development"
      - name: "Nuri Chang"
        role: "VP Of Product"
    teamSource: "https://theorg.com/org/bitgo/teams/leadership-team"

  androidApp:
    name: "BitGo"
    url: "/android/com.bitgo.mobile"
  
  androidApp:
    name: "BitGo"
    url: "/iphone/com.bitgo.mobile"

  iphoneApp:
    name: "BitGo Harbor"
    url: "/android/com.bitgo.harbor"

  iphoneApp:
    name: "BitGo Harbor"
    url: "/iphone/com.bitgo.harbor"
  
  webApp:
    name: "BitGo Wallet"
    url: "https://app.bitgo.com"
    icon: "fas fa-globe"

  hotColdDesign:
    status: "published"
    lastUpdated: "2025-03-26"
    details: "BitGo pioneered the multi-signature wallet technology (P2SH) and implements 2-of-3 multi-signature addresses for customer funds. They have a clear separation between hot and cold storage with distinct security protocols. In their cold storage solution, all three keys are held by BitGo in physically separated, offline environments. For hot wallets, BitGo offers a hybrid approach where the user controls one key, BitGo controls another, and a backup key is stored offline for disaster recovery."
    documentation_url: "https://www.bitgo.com/platform/security"
    analysis: "BitGo's security architecture has evolved to include both Multi-Signature (Multi-Sig) and Threshold Signature Scheme (TSS) technologies. For Multi-Sig, they implement a 2-of-3 model where multiple keys must authorize transactions, preventing single points of failure. Their TSS implementation improves upon traditional MPC solutions by maintaining detailed transaction logs for accountability, using purpose-built Hardware Security Modules (HSMs) specifically designed for cryptocurrency security, implementing a hybrid approach to key storage, and having their code open-sourced and peer-reviewed. BitGo's cold storage is backed by bank-grade security with keys stored in air-gapped environments, while their hot wallets incorporate policy controls like whitelisting, velocity limits, and role-based permissions. TSS was introduced to support a broader range of coins more quickly and to reduce transaction fees, all without compromising security."
    supporting_urls:
      - "https://www.bitgo.com/platform/security"
      - "https://www.bitgo.com/resources/blog/introducing-bitgo-tss/"
      - "https://www.bitgo.com/resources/blog/bitgo-tss-a-technical-deep-dive/"
      - "https://www.bitgo.com/products/custody-wallets/"
      - "https://www.bitgo.com/resources/wallet-and-custody-guide/"

  bitcoinFocus:
    status: "multi-currency"
    tradableAssets: ""
    tradingPairs: ""
    custodyAssets: "79 of the top 100 digital assets and more"
    CompleteList: "https://developers.bitgo.com/coins"

  proofOfReserves:
    status: "traditional-audit"
    details: "BitGo relies on traditional financial audits rather than cryptographic proof of reserves. While BitGo doesn't publish cryptographic proof of reserves for their own operations, they provide tools for their customers to implement proof of reserves for their end-users."
    auditFrequency: "Not disclosed"
    lastAudit: "Not disclosed"
    auditUrl: ""
    developmentStatus: "Provides API tools for customer proof of reserves"
    developmentUrl: "https://developers.bitgo.com/guides/wallets/proof-of-reserves"

  operations:
    users: "2000+"
    cryptographicProof:
      btcAmount: ""
      totalAssets: ""
      lastUpdated: ""
      source: ""
      sourceUrl: ""
      valid: false

    thirdPartyAudit:
      btcAmount: "1,773 BTC"
      totalAssets: ""
      lastUpdated: "2025-03-26"
      source: "Arkham Intelligence"
      sourceUrl: "https://intel.arkm.com/explorer/entity/bitgo"
      valid: true
    
    selfReported:
      btcAmount: ""
      totalAssets: "$100B USD"
      lastUpdated: "2025-02-27"
      source: "BitGo Official Website"
      sourceUrl: "https://www.bitgo.com/resources/blog/bitgo-is-the-1-staking-platform/"
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
      - "SOC 2 Type 2 certified"
    customInfrastructure: true
    details: "BitGo developed their own multi-signature implementation and maintains customized security infrastructure for wallet management."
    certifications:
      - name: "SOC 2 Type 2"
        issuer: "Deloitte & Touche LLP"
        details: "Verifies BitGo's security and operational controls through rigorous third-party audit"
        url: "https://www.bitgo.com/company/security/"

---

BitGo pioneered the use of multi-signature wallet technology in the cryptocurrency industry and has been a leader in institutional custody solutions since its founding in 2013. The company's security practices include multi-signature addresses requiring multiple approvals, policy controls, and a clear separation between hot and cold storage systems.
