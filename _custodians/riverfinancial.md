---
layout: reviewCustodian
title: "River Financial Inc."
platformReview:
  type: custodians
  appId: river
icon: riverfinancial.png

custodian:
  crunchbaseUrl: "https://www.crunchbase.com/organization/river-financial"
  leadership:
    jurisdiction: 🇺🇸 "United States"
    yearsInBusiness: "6"
    ceo:
      name: "Alexander Leishman"
      position: "Founder, CEO & CTO"
      tenure: "2019-present"
      nationality: "American"
      photo: "/images/wIcons/custodians/leadership/riverfinancial-alexander-leishman.png" # Photo not found, placeholder path
      social:
        twitter: "https://x.com/Leishman"
        linkedin: "https://www.linkedin.com/in/aleishman"
        github: ""
    team:
      - name: "Alexander Leishman"
        role: "Founder, CEO & CTO"
      - name: "Julia Duzon"
        role: "Chief Operating Officer"
      - name: "Cem Paya"
        role: "Chief Security Officer"
    teamSource: "https://river.com/company"

  androidApp:
    name: "River: Buy Bitcoin Instantly"
    url: "/android/com.river.riverapp" # Confirm app URL later if needed

  iphoneApp:
    name: "River: Buy Bitcoin Instantly"
    url: "/iphone/com.river.riverapp" # Confirm app URL later if needed
  
  webApp:
    name: "River: Web Platform"
    url: "https://river.com/login"
    icon: "fas fa-globe"

  # browserExtension:
    # name: ""
    # url: ""
    # No browser extension available

  hotColdDesign:
    status: "published"
    lastUpdated: 2025-04-26
    details: "River uses in-house multi-signature cold storage for 100% of client Bitcoin, avoiding third-party custodians. Assets are air-gapped and geographically distributed."
    documentation_url: "https://river.com/security"
    analysis: "River maintains a full-reserve, cold storage architecture with multi-party key management, no lending, and strict segregation of customer funds, prioritizing maximum solvency and security."
    supporting_urls:
      - "https://river.com/reserves"

  bitcoinFocus:
    status: "bitcoin-only"
    tradableAssets: "1 (Bitcoin)"
    tradingPairs: "BTC/USD only"
    custodyAssets: "Bitcoin only"
    CompleteList: "https://river.com"

  proofOfReserves:
    status: "cryptographic"
    details: "River publishes monthly Proof-of-Reserves reports where clients can independently verify their Bitcoin balances and River’s cold storage assets."
    auditFrequency: "Monthly"
    lastAudit: "2025-04-01"
    auditUrl: "https://river.com/reserves"
    developmentStatus: "Operational"
    developmentUrl: "https://github.com/RiverFinancial/proof-of-reserves"

  operations:
    incidentResponsePolicy: "" # No public incident response policy found
    incidentDisclosure: "" # No public incident disclosure page found
    users: "Undisclosed" # Number of users not disclosed publicly
    cryptographicProof:
      btcAmount: "20K BTC" # Assets: 20,002.78134416 BTC, Liabilities: 19,660.78328476 BTC, Reserve Ratio: >100%
      totalAssets: "20K BTC"
      lastUpdated: "2025-04-02" # Based on most recent proof of reserves date
      source: "River Proof of Reserves"
      sourceUrl: "https://river.com/reserves"
      valid: true

    thirdPartyAudit:
      btcAmount: "20,438 BTC"
      totalAssets: "20,438 BTC"
      lastUpdated: "2025-04-29"
      source: "Arkham Intelligence"
      sourceUrl: "https://intel.arkm.com/explorer/entity/river"
      valid: true

    selfReported:
      btcAmount: "20,000 BTC"
      totalAssets: "20,000 BTC"
      lastUpdated: "2025-04-28"
      source: "River CEO Tweet"
      sourceUrl: "https://x.com/Leishman/status/1916882882901193154"
      valid: true

    notes: |
      <p>River provides monthly proof-of-reserves reports using on-chain verification of cold storage assets and liability proofs that allow users to verify their holdings without revealing personal information. River maintains 100%+ reserves without engaging in lending or rehypothecation.</p>

  trackRecord:
    incidentHistoryProvided: true   # must flip to true once reviewed
    incidentHistory: []             # empty array as no incidents reported
    # incidentSeverityScore: 0       # manual override (–5 to +5)
    lastIncident: ""               # Month YYYY (used only if you prefer date logic)

  businessModel:
    type: "Bitcoin Brokerage, Custody & Mining"
    services:
      - name: "Bitcoin Brokerage"
        url: "https://river.com/buy-bitcoin"
      - name: "Custodial Wallet Services"
        url: "https://river.com/wallet"
      - name: "Recurring Bitcoin Buys"
        url: "https://river.com/zero-fee"
      - name: "River Lightning Services"
        url: "https://blog.river.com/announcing-river-lightning-services-rls/"
      - name: "Estate Planning (River Inheritance)"
        url: "https://river.com/inheritance"
      - name: "Bitcoin Mining"
        url: "https://river.com/mining"
    revenueStreams:
      - type: "Transaction Fees"
        details: "Primary revenue source ($1.4B in 2024) from percentage fees on Bitcoin buys and sells"
      - type: "Interest on Cash"
        details: "Interest from cash held in partner FDIC-insured banks ($20.3M in cash and equivalents)"
      - type: "Bitcoin Mining"
        details: "Revenue from Bitcoin mining operations ($2.5M in 2024)"
      - type: "Bitcoin Appreciation"
        details: "Income from appreciation of Bitcoin held in reserve ($21.5M change in fair value in 2024)"
      - type: "Lightning Network Services"
        details: "Revenue from Bitcoin Lightning Network services"
    restrictedCountries:
      - "Non-US Territories"

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
    research_url: "https://blog.river.com/tag/engineering/"
    contributions:
      - name: "FOSS Development - Maintains open-source projects like 'bitcoinex' and 'nacha' on GitHub."
        url: "https://github.com/RiverFinancial/"
      - name: "Research - Publishes proprietary Bitcoin research through River Intelligence."
        url: "https://blog.river.com/"
      - name: "Protocol Support - Integrated Lightning Network and launched River Lightning Services (RLS)."
        url: "https://river.com/"

  userAccess:
    kycRequired: true
    kycLevel: "Advanced"
    withdrawalLimits:
      status: "standard"
      documentation_url: "https://support.river.com/kb/guide/en/what-are-my-account-limits-tqfBOlDGwq/Steps/3724391"

  security:
    features:
      - "2FA"
      - "ForceField Withdrawal Lock"
    customInfrastructure: true
    details: "In-house custody using multi-signature cold storage, with no third-party custodians involved."

    certifications:
      - name: "SOC 1 Type 2 Certification"
        issuer: "Independent Auditors"
        details: "River Financial has achieved SOC 1 Type 2 compliance for financial reporting controls."
        url: "https://blog.river.com/river-soc-1-and-2-certifications/"

      - name: "SOC 2 Type 2 Certification"
        issuer: "Independent Auditors"
        details: "River Financial has achieved SOC 2 Type 2 compliance, affirming controls for security, availability, and confidentiality."
        url: "https://blog.river.com/river-soc-1-and-2-certifications/"

    twoFactor: true
    biometric: true

    withdrawalConfirmations: true
    addressWhitelisting: true
    withdrawalLimits: true

    securityAudits:
      performed: true
      frequency: "Annual"
      lastAuditDate: "2024"
      auditReports: [] # None found, 3 points for each
      insuranceCoverage: "FDIC for Fiat Only"
      insuranceCoverageURL: "https://river.com/learn/files/11-questions-article-2024.pdf?ref=blog.river.com"

---

Additional Information:

River Financial’s custody solution emphasizes:

- Full-reserve, no-lending Bitcoin custody.
- Cold storage secured via multi-signature arrangements.
- Monthly Proof-of-Reserves allowing clients to verify solvency.
- Advanced user protections, including 2FA, device monitoring, and ForceField withdrawal limits.
- SOC 1 Type 2 and SOC 2 Type 2 compliance.

Source: https://river.com/security

