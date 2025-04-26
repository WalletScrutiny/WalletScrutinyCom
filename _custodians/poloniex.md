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
      - name: "Justin Sun"
        role: "Owner"
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

  # 1. Key Management - Cold Storage (score: 0/10)
  hotColdDesign:
    status: "none"  # Possible values: "published" (+5 pts), "outdated" (+3 pts), "partial" (+5 pts), "none" (0 pts)
    lastUpdated: ""
    details: ""
    documentation_url: ""
    analysis: ""

  # 3.1 Transparency - Bitcoin Focus
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
    # 2.3 Incident Response (score: 0-5/5)
    # Providing a link to a public incident response policy (+2 pts)
    incidentResponsePolicy: "" # URL to public incident response policy/documentation
    # Providing a link to a public incident disclosure page (+3 pts)
    incidentDisclosure: "" # URL to public incident disclosure page
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
    incidentHistoryProvided: true
    incidentHistory:
      - description: "Certik Reports Poloniex BTC, TRON, and ETH wallets compromised, losing $132 million."
        date: "2023-11-10"
        url: "https://www.certik.com/resources/blog/poloniex-incident-analysis"
        severity: "major"
        resolved: true
      - description: "Scammers exploited the lack of an official Poloniex app by publishing fake 'Poloniex Exchange' and 'Poloniex Company' apps, which garnered thousands of downloads."
        date: "2023-03-23"
        severity: "minor"
        resolved: true
      - description: "Poloniex Forces Password Reset After Data Leak Found Online."
        date: "2019-12-30"
        url: "https://www.bleepingcomputer.com/news/security/poloniex-forces-password-reset-after-data-leak-found-online/"
        severity: "minor"
        resolved: true
      - description: "Lost 12.3% of Bitcoin holdings due to a hack."
        date: "2014-03-05"
        url: "https://www.coindesk.com/markets/2014/03/05/poloniex-loses-123-of-its-bitcoins-in-latest-bitcoin-exchange-hack"
        severity: "major"
        resolved: true
  # incidentSeverityScore: 0
  lastIncident: "2023-11-10"

  # 4.2 Compliance - Business Model
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

  # 4.2 Compliance - Risk Assessment
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

  # 3. Transparency - Open Source (score: 0/5)
  bitcoinContribution:
    fossDevelopment: false
    protocolSupport: false
    research: false

  # 4. Compliance - Access Controls (cont'd)
  userAccess:
    kycRequired: true
    kycLevel: "Basic to Advanced"
    withdrawalLimits:
      status: "tiered"
      documentation_url: "https://support.poloniex.com/hc/en-us/articles/360040342833-Account-Tiers-Verification-Levels-Withdrawal-Limits"

  # 1.2 Key Management - Multi-Sig (score: 0/10) and Hardware (score: 0/10)
  # 2. Infrastructure - Certifications (score: 0/10)
  # 5. User Security - Authentication (score: 0/5) and Transaction Security (cont'd)
  security:
    # Note: Methodology terms (Comprehensive/Basic/Non-existent) are implemented via specific checks for the same detail levels
    features: ["2FA", "IP Whitelisting", "Session Monitoring"] # 1.2: Multi-Sig (+5 pts). 1.3: Hardware Security (+5 pts). Alternative terms for Multi-Sig: TSS, MPC, Threshold Signing in hotColdDesign.details
    customInfrastructure: false # Setting to true would give +5 more pts in 1.3 Hardware Security for specific details (total 10 pts)
    details: "Basic industry-standard security measures, including two-factor authentication and IP whitelisting." # For 1.2: Add detailed implementation info here for +5 pts (total 10 pts). For 1.3: Adding "Ledger", "Trezor", or "HSM" would also give +5 more pts (total 10 pts)
    
    # 2.1 Security Certifications (score: 3-6/10)
    # Note: Each certification is worth 3 points, up to a max of 10 points (3 pts per certification)
    certifications:
      - name: ""
        issuer: ""
        details: ""
        url: ""
    
    # 5.1 Authentication (score: 0-5/5)
    twoFactor: true  # Set to true for +3 pts
    biometric: false  # Set to true for +2 more pts
    
    # 5.2 Transaction Security (score: 0-5/5)
    withdrawalConfirmations: true  # Set to true for +2 pts
    addressWhitelisting: true  # Set to true for +2 pts
    withdrawalLimits: false  # Set to true for +1 pt
    
    # 2.2 Security Audits (score: 5/10)
    securityAudits:
      performed: false               # Set to true for +5 pts (basic security audit evidence)
      frequency: ""           # Optional: describes audit frequency
      lastAuditDate: ""            # Optional: date of most recent audit
      auditReports:                # Adding report with URL gives +3 
         - year: "" # more pts (transparency)
           url: "" 
           vendor: ""
      insuranceCoverage: ""        # Setting to non-empty gives +2 more pts (insurance coverage)
      insuranceCoverageURL: ""     # Optional: URL to insurance policy details

---