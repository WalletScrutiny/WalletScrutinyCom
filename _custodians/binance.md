---
layout: reviewCustodian
title: "Binance Holdings Limited"
platformReview:
  type: custodians
  appId: binance
icon: binance.png

custodian:
  crunchbaseUrl: "https://www.crunchbase.com/organization/binance"
  leadership:
    jurisdiction: 🇰🇾 "Cayman Islands"
    yearsInBusiness: "8"
    ceo:
      name: "Richard Teng"
      position: "CEO"
      tenure: "2023-present"
      nationality: "Singaporean"
      photo: "/images/wIcons/custodians/leadership/binance-richard-teng.png"
      social:
        twitter: "https://x.com/_richardteng"
        linkedin: "https://www.linkedin.com/in/richard-teng-3497b527"
    team:
      - name: "Richard Teng"
        role: "CEO"
      - name: "Rachel Conlan"
        role: "Chief Marketing Officer"
      - name: "Jeff Li"
        role: "Vice President of Product"
      - name: "Norman Chen"
        role: "Chief Financial Officer"
      - name: "Eleanor Hughes"
        role: "General Counsel"
      - name: "Tigran Gambaryan"
        role: "VP of Global Intelligence and Investigations"
    teamSource: "https://www.binance.com/en/blog/leadership"

  androidApp:
    name: "Binance: Bitcoin Marketplace & Crypto Wallet"
    url: "/android/com.binance.dev"

  iphoneApp:
    name: "Binance: Buy & Sell Bitcoin Crypto"
    url: "/iphone/com.czzhao.binance"
  
  webApp:
    name: "Binance: Web Wallet"
    url: "https://www.binance.com/en"
    icon: "fas fa-globe"

  hotColdDesign:
    status: "published"
    lastUpdated: 2023-07-01
    details: "Binance employs a multi-tier and multi-cluster system architecture. The majority of user funds are stored in cold wallets secured by multi-signature technology, with a smaller portion in hot wallets for liquidity and daily operations."
    documentation_url: "https://www.binance.com/en/blog/421499824684900346/Binance-Security-The-Fundamentals-of-Safeguarding-Your-Funds-and-Data"
    analysis: "Through multi-signature protocols, hardware-based key management, and real-time risk monitoring, Binance strives to minimize single points of failure. Their cold storage ensures most assets remain offline, protected from online threats."
    supporting_urls:
      - "https://www.binance.com/en/blog"
      - "https://www.binance.com/en/security"
      - "https://www.binance.com/en/blog/421499824684900346"

  bitcoinFocus:
    status: "multi-currency"
    tradableAssets: "Over 350"
    tradingPairs: "Over 1300"
    custodyAssets: "Over 600"
    CompleteList: "https://www.binance.com/en/markets"

  proofOfReserves:
    status: "cryptographic"
    details: "Binance launched a Merkle Tree-based proof-of-reserves system in late 2022 and has publicly disclosed wallet addresses. External auditor involvement was temporarily paused in December 2022."
    auditFrequency: "Ongoing internal verifications"
    lastAudit: "2022"
    auditUrl: "https://www.binance.com/en/blog/ecosystem/binances-proof-of-reserves-how-users-can-verify-their-assets-496670067205387072"
    developmentStatus: "Continuous refinement of on-chain proof-of-reserves"
    developmentUrl: "https://www.binance.com/en/proof-of-reserves"

  operations:
    # 2.3 Incident Response (score: 0-5/5)
    # Providing a link to a public incident response policy (+2 pts)
    incidentResponsePolicy: "" # URL to public incident response policy/documentation
    # Providing a link to a public incident disclosure page (+3 pts)
    incidentDisclosure: "" # URL to public incident disclosure page
    users: "128M"
    cryptographicProof:
      btcAmount: "622K BTC"
      totalAssets: ""
      lastUpdated: "2024-01-30"
      source: "Binance Proof of Reserves"
      sourceUrl: "https://www.binance.com/en/proof-of-reserves"
      valid: true

    thirdPartyAudit:
      btcAmount: "620K BTC"
      totalAssets: "$181B USD"
      lastUpdated: "2024-01-30"
      source: "Arkham Intelligence"
      sourceUrl: "https://intel.arkm.com/explorer/entity/binance"
      valid: true

    selfReported:
      btcAmount: ""
      totalAssets: ""
      lastUpdated: ""
      source: ""
      sourceUrl: ""
      valid: false

  trackRecord:
    history: "Multiple regulatory challenges and leadership changes, including CZ's departure in 2023"
    incidentHistory:
      - description: "Former CEO CZ pleads guilty to federal charges, steps down"
        date: "November 2023"
        url: "https://www.justice.gov/opa/pr/binance-and-ceo-plead-guilty-federal-charges-agree-pay-over-4-billion-criminal-monetary"
      - description: "7,000 BTC stolen from a Binance hot wallet"
        date: "May 2019"
        url: "https://www.binance.com/en/blog/365189201383344128"
      - description: "Alleged KYC data leak"
        date: "August 2019"
        url: "https://www.coindesk.com/markets/2019/08/07/binance-probing-kyc-data-alleged-leak"
      - description: "$100M BNB Chain exploit"
        date: "October 2022"
        url: "https://www.binance.com/en/blog/ecosystem/the-bnb-chain-ecosystem-and-binance-exchange-update-3910070746874562153"
    sourceIncidents: "https://www.binance.com/en/blog"
    lastIncident: "November 2023"

  businessModel:
    type: "Exchange & Custody"
    services:
      - name: "Spot Trading"
        url: "https://www.binance.com/en/trade/BTC_USDT"
      - name: "Futures & Derivatives"
        url: "https://www.binance.com/en/futures"
      - name: "Margin Trading"
        url: "https://www.binance.com/en/margin-fee"
      - name: "Binance Earn (Staking, Savings)"
        url: "https://www.binance.com/en/earn"
      - name: "Binance NFT"
        url: "https://www.binance.com/en/nft/home"
      - name: "Institutional Services"
        url: "https://www.binanceinstitutional.com/"
      - name: "Binance Launchpad"
        url: "https://launchpad.binance.com/"
      - name: "Binance Pay"
        url: "https://pay.binance.com/"
    revenueStreams:
      - type: "Transaction Fees"
        details: "Percentage-based fees on spot, margin, and futures trades"
      - type: "Custody and Other Fees"
        details: "Asset listings, margin lending, staking, and various services"

  riskAssessment:
    derivatives: true
    derivativesList:
      - name: "Binance Futures"
        url: "https://www.binance.com/en/futures"
      - name: "Binance Options"
        url: "https://www.binance.com/en/option"
    memecoins: true
    memecoinList:
      - name: "DOGE"
        url: "https://www.binance.com/en/trade/DOGE_USDT"
      - name: "SHIB"
        url: "https://www.binance.com/en/trade/SHIB_USDT"
      - name: "FLOKI"
        url: "https://www.binance.com/en/trade/FLOKI_USDT"
      - name: "PEPE"
        url: "https://www.binance.com/en/trade/PEPE_USDT"
      - name: "BABYDOGE"
        url: "https://www.binance.com/en/trade/BABYDOGE_USDT"
      - name: "SANTOS"
        url: "https://www.binance.com/en/trade/SANTOS_USDT"
    gambling: false

  bitcoinContribution:
    fossDevelopment: false
    research: true
    protocolSupport: true
    research_url: "https://research.binance.com/"
    contributions:
      - name: "Binance Charity Foundation"
        url: "https://www.binance.charity/"
      - name: "Binance Academy"
        url: "https://academy.binance.com/"
      - name: "BNB Chain Ecosystem Funding"
        url: "https://www.bnbchain.org/en"
  
  userAccess:
    kycRequired: true
    kycLevel: "Tiered"
    withdrawalLimits:
      status: "tiered"
      documentation_url: "https://www.binance.com/en/support/faq/360034243591"

  # 1.2 Key Management - Multi-Sig (score: 0/10) and Hardware (score: 0/10)
  # 2. Infrastructure - Certifications (score: 0/10)
  # 5. User Security - Authentication (score: 0/5) and Transaction Security (cont'd)
  security:
    # Note: Methodology terms (Comprehensive/Basic/Non-existent) are implemented via specific checks for the same detail levels
    features:
      - "2FA"
      - "Hardware Key (U2F/FIDO2)"
      - "Address Whitelisting"
      - "Multi-signature Wallets"
      - "Cold Storage"  # 1.2: Multi-Sig (+5 pts). 1.3: Hardware Security (+5 pts). Alternative terms for Multi-Sig: TSS, MPC, Threshold Signing in hotColdDesign.details
    customInfrastructure: true  # Setting to true would give +5 more pts in 1.3 Hardware Security for specific details (total 10 pts)
    details: "Binance operates its own servers and implements real-time risk monitoring. Private keys for the majority of funds are secured via cold storage with multi-signature setups."  # For 1.2: Add detailed implementation info here for +5 pts (total 10 pts). For 1.3: Adding "Ledger", "Trezor", or "HSM" would also give +5 more pts (total 10 pts)
    
    # 2.1 Security Certifications (score: 9+/10)
    # Note: Each certification is worth 3 points, up to a max of 10 points (3 pts per certification)
    certifications:
      - name: "ISO/IEC 27001"
        issuer: "International Organization for Standardization (ISO) and International Electrotechnical Commission (IEC)"
        details: "Information Security Management System standard"
        url: "https://www.binance.com/en/blog/compliance/binance-receives-coveted-security-and-privacy-certifications-3367416538721239104"
      - name: "ISO/IEC 27701"
        issuer: "International Organization for Standardization (ISO) and International Electrotechnical Commission (IEC)"
        details: "Privacy Information Management System standard"
        url: "https://www.binance.com/en/blog/compliance/binance-receives-coveted-security-and-privacy-certifications-3367416538721239104"
      - name: "SOC 2 Type II"
        issuer: "American Institute of Certified Public Accountants (AICPA)"
        details: "Evaluates an organization's information systems relevant to security, availability, processing integrity, confidentiality, and privacy over a specified period"
        url: "https://www.binance.com/en/blog/all/strengthening-security-and-transparency-binance-secures-soc-2-type-2-and-soc-1-type-1-certifications-1685407653774568727"
      - name: "SOC 1 Type I"
        issuer: "American Institute of Certified Public Accountants (AICPA)"
        details: "Assesses the design of an organization's internal controls over financial reporting at a specific point in time"
        url: "https://www.binance.com/en/blog/all/strengthening-security-and-transparency-binance-secures-soc-2-type-2-and-soc-1-type-1-certifications-1685407653774568727"
    
    # 5.1 Authentication (score: 0-5/5)
    twoFactor: true  # Set to true for +3 pts
    biometric: false  # Set to true for +2 more pts
    
    # 5.2 Transaction Security (score: 0-5/5)
    withdrawalConfirmations: true  # Set to true for +2 pts
    addressWhitelisting: true  # Set to true for +2 pts
    withdrawalLimits: true  # Set to true for +1 pt
    
    # 2.2 Security Audits (score: 0-10/10)
    securityAudits:
      performed: true               # Set to true for +5 pts (basic security audit evidence)
      frequency: "Regular"          # Optional: describes audit frequency
      lastAuditDate: "2023"        # Optional: date of most recent audit
      auditReports:                # Adding report with URL gives +3 more pts (transparency)
        - year: 2023
          url: "https://www.binance.com/en/blog/all/proof-of-reserves-2023-a-year-of-unprecedented-transparency-2700251412210925520"
          vendor: "Mazars"
      insuranceCoverage: "SAFU - $1 billion USD"     # Setting to non-empty gives +2 more pts (insurance coverage)
      insuranceCoverageURL: "https://www.binance.com/en/blog/community/binance-secure-asset-fund-for-users-safu-updates-421499824684900469"  # Optional: URL to insurance policy details

---