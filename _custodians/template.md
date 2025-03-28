---
# Template Version: Alpha 2
# This template contains the standard structure for custodian reviews.
# Please fill in all relevant fields and remove any that don't apply.
layout: reviewCustodian
title: ""  # Full legal name of the company
platformReview:
  type: custodians
  appId: ""  # Lowercase, no spaces, used as identifier
icon: ""  # Company logo filename (jpg/jpeg/png)

custodian:
  crunchbaseUrl: ""  # Crunchbase company profile URL

  leadership:
    jurisdiction: ""  # Format: 🏴 "Country Name" (use country flag emoji)
    yearsInBusiness: ""  # Number of years since founding
    ceo:
      name: ""
      position: ""
      tenure: ""  # Format: "YYYY-present" or "YYYY-YYYY"
      nationality: ""
      photo: ""  # Path to CEO photo in /images/wIcons/custodians/leadership/
      social:
        twitter: ""  # X/Twitter profile URL
        linkedin: ""  # LinkedIn profile URL
        github: ""  # GitHub profile URL
    team:
      - name: ""
        role: ""
    teamSource: ""  # Source URL for team information

  androidApp:
    name: ""  # App name as shown in Play Store
    url: ""  # Internal review URL format: "/android/[package.name]"

  iphoneApp:
    name: ""  # App name as shown in App Store
    url: ""  # Internal review URL format: "/iphone/[bundle.id]"
  
  webApp:
    name: ""  # Web wallet name
    url: ""  # Internal review URL format: "/others/[domain]"
    icon: ""  # Optional: Font Awesome icon class

  browserExtension:
    name: ""  # Extension name
    url: ""  # Internal review URL format: "/others/ext.[name]"

  desktopApp:
    name: ""  # Desktop application name
    url: ""  # Internal review URL format
    platform: ""  # Options: "Windows", "MacOS", "Linux", or multiple comma-separated

  hotColdDesign:
    status: ""  # Options: "published", "outdated", "partial", "none"
    lastUpdated:  # Format: YYYY-MM-DD
    details: ""  # Detailed description of storage architecture
    documentation_url: ""  # URL to official documentation
    analysis: ""  # Additional analysis of the design
    supporting_urls:  # Additional documentation URLs
      - ""

  bitcoinFocus:
    status: ""  # Options: "bitcoin-only", "bitcoin-optimized", "multi-currency"
    tradableAssets: ""  # Number of tradable assets
    tradingPairs: ""  # Number of trading pairs
    custodyAssets: ""  # Number of assets available for custody
    CompleteList: ""  # URL to complete asset listing

  proofOfReserves:
    status: ""  # Options: "cryptographic", "traditional-audit", "partial", "none"
    details: ""  # Detailed explanation of proof system
    auditFrequency: ""  # How often audits/verifications occur
    lastAudit: ""  # Year of last audit/verification
    auditUrl: ""  # URL to audit report or verification system
    developmentStatus: ""  # Current development status if applicable
    developmentUrl: ""  # URL to development updates/roadmap

  operations:
    users: ""  # Number of users
    cryptographicProof:
      btcAmount: ""  # Amount of BTC verified cryptographically
      totalAssets: ""  # Total value of assets verified cryptographically
      lastUpdated: ""  # Date of last cryptographic verification
      source: ""  # Source of cryptographic verification
      sourceUrl: ""  # URL to verification source
      valid: false  # Boolean: is the proof valid and current

    thirdPartyAudit:
      btcAmount: ""  # Amount of BTC verified by third party
      totalAssets: ""  # Total value of assets verified by third party
      lastUpdated: ""  # Date of last third-party verification
      source: ""  # Name of third-party auditor
      sourceUrl: ""  # URL to audit report
      valid: false  # Boolean: is the audit valid and current
    
    selfReported:
      btcAmount: ""  # Amount of BTC self-reported
      totalAssets: ""  # Total value of assets self-reported
      lastUpdated: ""  # Date of last self-report
      source: ""  # Source of self-reported figures
      sourceUrl: ""  # URL to self-report
      valid: false  # Boolean: is the self-report valid and current

    notes: |  # Additional notes about operations (supports HTML)
      

  trackRecord:
    history: ""  # Brief overview of security history
    incidentHistory:  # List of security incidents
      - description: ""
        date: ""  # Format: "Month YYYY"
        url: ""  # URL to incident report/news
    sourceIncidents: ""  # Source for incident information
    lastIncident: ""  # Most recent incident date

  businessModel:
    type: ""  # Primary business type
    services:  # List of services offered
      - name: ""
        url: ""  # URL to service documentation
    revenueStreams:  # Revenue sources
      - type: ""
        details: ""

  riskAssessment:
    derivatives: false  # Boolean: offers derivative trading
    derivativesList:  # List of derivative products if applicable
      - name: ""
        url: ""
    memecoins: false  # Boolean: lists meme coins
    memecoinList:  # List of meme coins if applicable
      - name: ""
        url: ""
  
  # User Access Controls
  userAccess:
    # Boolean: KYC required
    kycRequired: 
    # KYC levels if applicable
    kycLevel: ""
    # Withdrawal limits
    withdrawalLimits:
      # "fixed" or "tiered"
      status: ""
      # URL to withdrawal limit documentation
      documentation_url: ""

  # Security Features
  security:
    # Note: Methodology terms (Comprehensive/Basic/Non-existent) are implemented via specific checks for the same detail levels
    features: []  # 1.2: Add "Multi-signature Wallets" for +5 pts. 1.3: Add "Cold Storage" for +5 pts. Alternative terms for Multi-Sig: TSS, MPC, Threshold Signing in hotColdDesign.details
    customInfrastructure: false  # Setting to true would give +5 more pts in 1.3 Hardware Security for specific details (total 10 pts)
    details: ""  # For 1.2: Add detailed implementation info here for +5 pts (total 10 pts). For 1.3: Adding "Ledger", "Trezor", or "HSM" would also give +5 more pts (total 10 pts)
    
    # 2.1 Security Certifications (score: 0-10/10)
    # Note: Each certification is worth 3 points, up to a max of 10 points (3 pts per certification)
    certifications:
      - name: ""
        issuer: ""
        details: ""
        url: ""
    
    # 5.1 Authentication (score: 0-5/5)
    twoFactor: false  # Set to true for +3 pts
    biometric: false  # Set to true for +2 more pts
    
    # 5.2 Transaction Security (score: 0-5/5)
    withdrawalConfirmations: false  # Set to true for +2 pts
    addressWhitelisting: false  # Set to true for +2 pts
    withdrawalLimits: false  # Set to true for +1 pt
    
    # 2.2 Security Audits (score: 0-10/10)
    securityAudits:
      performed: false               # Set to true for +5 pts (basic security audit evidence)
      frequency: ""                  # Optional: describes audit frequency
      lastAuditDate: ""             # Optional: date of most recent audit
      auditReports: []              # Adding report with URL gives +3 more pts (transparency)
      insuranceCoverage: ""         # Setting to non-empty gives +2 more pts (insurance coverage)
      insuranceCoverageURL: ""      # Optional: URL to insurance policy details

---
