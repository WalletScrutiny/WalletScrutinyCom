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
      - name: "Sheetal Ray"
        role: "Chief Operating Officer"
      - name: "Raphael Zagury"
        role: "Chief Investment Officer and Head of Research"
      - name: "Gaurav Gollerkeri"
        role: "General Manager of Swan Personal"
      - name: "Guilherme Gomes"
        role: "Chief Revenue Officer"
      - name: "Scott Kisser"
        role: "Chief Information Security Officer"
    teamSource: "https://www.swanbitcoin.com/industry/swan-announces-four-new-hires-in-january-2023/"

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

  operations:
    # 2.3 Incident Response (score: 0-5/5)
    # Providing a link to a public incident response policy (+2 pts)
    incidentResponsePolicy: "" # URL to public incident response policy/documentation
    # Providing a link to a public incident disclosure page (+3 pts)
    incidentDisclosure: "" # URL to public incident disclosure page
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
      totalAssets: ""
      lastUpdated: ""
      source: ""
      sourceUrl: ""
      valid: false

  proofOfReserves:
    status: "third-party custody"
    details: "Swan utilizes third-party qualified custodians Prime Trust and Fidelity Digital Assets"
    auditFrequency: ""
    lastAudit: ""
    auditUrl: ""

  hotColdDesign:
    status: "partial"
    lastUpdated: 2023-12-01
    details: "Swan Bitcoin uses cold storage custody solutions through Prime Trust for retail customers and Fidelity Digital Assets for institutional clients. Additionally, Swan offers the Swan Vault, a 2-of-3 multisignature setup where users control two keys stored offline on hardware devices, and the third key, the Cloud Key, is managed through the user's Swan account."
    documentation_url: "https://www.swanbitcoin.com/vault/"

  bitcoinFocus:
    status: "bitcoin-only"
    tradableAssets: "1"
    tradingPairs: "2"
    custodyAssets: "1"
    CompleteList: "https://www.swanbitcoin.com/bitcoin"

  trackRecord:
    incidentHistoryProvided: true   # Reviewed and confirmed
    history: "No major security incidents reported since inception. Swan Bitcoin has maintained a strong security posture since its founding."
    incidentHistory: []             # No known security incidents
    sourceIncidents: "https://support.swanbitcoin.com/hc/en-us"
    lastIncident: ""               # No known incidents

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
    restrictedCountries: []

  riskAssessment:
    derivatives: false
    derivativesList: []
    memecoins: false
    memecoinList: []
    gambling: false
  
  userAccess:
    kycRequired: true
    kycLevel: "Full"
    withdrawalLimits:
      status: "tiered"
      documentation_url: "https://help.swanbitcoin.com/hc/en-us/articles/17381827984535-How-does-Swan-store-my-Bitcoin-and-should-I-self-custody"

  security:
    features: ["2FA", "Whitelisted Withdrawal Addresses", "Email Confirmations"]
    customInfrastructure: false
    details: "Swan Bitcoin relies on established custodians for security infrastructure while maintaining strong platform security measures."
    certifications:
      - name: "SOC2 Type 1"
        issuer: "Independent Auditor"
        details: "SOC 2 reports are performed in accordance with the Statement on Standards for Attestation Engagements 18 (SSAE 18) attestation standard issued by the American Institute of Certified Public Accountants (AICPA)"
        url: "https://www.prnewswire.com/news-releases/swan-bitcoin-has-achieved-soc2-type-1-compliance-302257789.html"
    twoFactor: true
    biometric: true
    withdrawalConfirmations: true
    addressWhitelisting: false
    withdrawalLimits: false

    securityAudits:
      performed: true
      frequency: ""
      lastAuditDate: "2024"
      auditReports: []
      insuranceCoverage: "FDIC insurance on USD deposits, custody insurance through Prime Trust and Fidelity"
      insuranceCoverageURL: "https://www.swanbitcoin.com/legal"

  bitcoinContribution:
    fossDevelopment: true
    protocolSupport: true
    research: true
---