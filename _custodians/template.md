---
# Basic Information
layout: reviewCustodian
title: ""  # Full legal name of the company
platformReview:
  type: custodians
  appId: ""  # Lowercase, no spaces, used as identifier
icon: ""  # Company logo filename (jpg/jpeg/png)

custodian:
  # Crunchbase company profile URL
  crunchbaseUrl: ""

  leadership:
    # Format: 🏴 "Country Name" (use country flag emoji)
    jurisdiction: ""
    # Number of years since founding
    yearsInBusiness: ""
    ceo:
      name: ""
      position: ""
      # Format: "YYYY-present" or "YYYY-YYYY"
      tenure: ""
      nationality: ""
      # Path to CEO photo in /images/wIcons/custodians/leadership/
      photo: ""
      social:
        twitter: ""  # X/Twitter profile URL
        linkedin: ""  # LinkedIn profile URL
        github: ""   # Optional: GitHub profile URL
    # Key team members and their roles
    team:
      - name: ""
        role: ""
    # Source URL for team information
    teamSource: ""

  # Mobile Apps
  androidApp:
    name: ""  # App name as shown in Play Store
    url: "/android/[package.name]"  # Internal review URL

  iphoneApp:
    name: ""  # App name as shown in App Store
    url: "/iphone/[bundle.id]"  # Internal review URL
  
  webApp:
    name: ""  # Web wallet name
    url: "/others/[domain]"  # Internal review URL

  browserExtension:
    name: ""  # Extension name
    url: "/others/ext.[name]"  # Internal review URL

  # Hot/Cold Wallet Design
  hotColdDesign:
    # Status options:
    # - "published": Full documentation available
    # - "outdated": Documentation exists but not current
    # - "partial": Some documentation available
    # - "none": No documentation available
    status: ""
    # Format: YYYY-MM-DD
    lastUpdated: 
    # Detailed description of storage architecture
    details: ""
    # URL to official documentation
    documentation_url: ""
    # Optional: Additional analysis of the design
    analysis: ""
    # Optional: Additional documentation URLs
    supporting_urls:
      - ""

  # Bitcoin Focus Assessment
  bitcoinFocus:
    # Status options:
    # - "bitcoin-only": Exclusively Bitcoin
    # - "bitcoin-optimized": Bitcoin primary focus with limited alts
    # - "multi-currency": Multiple cryptocurrencies supported
    status: ""
    # Number of tradable assets
    tradableAssets: ""
    # Number of trading pairs
    tradingPairs: ""
    # Number of assets available for custody
    custodyAssets: ""
    # URL to complete asset listing
    CompleteList: ""

  # Proof of Reserves
  proofOfReserves:
    # Status options and explanations:
    # - "cryptographic": Uses cryptographic verification (e.g., Merkle Tree)
    # - "traditional-audit": Uses traditional financial audits
    # - "partial": Incomplete or limited proof system
    # - "none": No proof of reserves system
    status: ""
    # Detailed explanation of proof system
    details: ""
    # How often audits/verifications occur
    auditFrequency: ""
    # Year of last audit/verification
    lastAudit: ""
    # URL to audit report or verification system
    auditUrl: ""
    # Current development status if applicable
    developmentStatus: ""
    # URL to development updates/roadmap
    developmentUrl: ""

  # Operational Metrics
  operations:
    # Format: "X BTC" (exact number if known)
    btcCustodied: ""
    # Source URL for BTC custody data
    SourceBTC: ""
    # Format: "$X" or "$XB" for billions
    AssetsUnderCustody: ""
    # Source URL for AUC data
    SourceAUC: ""
    # Monthly active users
    MonthlyTransactingUsers: ""
    # Source URL for user metrics
    SourceMTU: ""
    # Year of last MTU update
    LastUpdatedMTU: ""

  # Security Track Record
  trackRecord:
    # Brief overview of security history
    history: ""
    # List of security incidents
    incidentHistory:
      - description: ""
        date: ""  # Format: "Month YYYY"
        url: ""   # URL to incident report/news
    # Source for incident information
    sourceIncidents: ""
    # Most recent incident date
    lastIncident: ""
    # Insurance coverage details
    insuranceCoverage: ""
    # URL to insurance terms
    insuranceTermsUrl: ""

  # Business Model
  businessModel:
    # Primary business type
    type: ""
    # List of services offered
    services:
      - name: ""
        url: ""  # URL to service documentation
    # Revenue sources
    revenueStreams:
      - type: ""
        details: ""

  # Risk Assessment
  riskAssessment:
    # Boolean: offers derivative trading
    derivatives: 
    # List of derivative products if applicable
    derivativesList:
      - name: ""
        url: ""
    # Boolean: lists meme coins
    memecoins: 
    # List of meme coins if applicable
    memecoinList:
      - name: ""
        url: ""
    # Boolean: offers gambling features
    gambling: 

  # Bitcoin Ecosystem Contribution
  bitcoinContribution:
    # Boolean: contributes to FOSS development
    fossDevelopment: 
    # Boolean: conducts research
    research: 
    # Boolean: supports protocol development
    protocolSupport: 
    # URL to research publications
    research_url: ""
    # List of contributions
    contributions:
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
    # List of security features
    features:
      - ""
    # Boolean: uses custom security infrastructure
    customInfrastructure: 
    # Details of security measures
    details: ""
---
