---
layout: reviewCustodian
title: "Kraken"
platformReview:
  type: custodians
  appId: kraken
icon: kraken.png

custodian:
  crunchbaseUrl: "https://www.crunchbase.com/organization/kraken"
  leadership:
    jurisdiction: 🇺🇸 "United States"
    yearsInBusiness: "13"
    ceo:
      name: "David Ripley"
      position: "Co-CEO"
      tenure: "2022-present"
      nationality: "American"
      photo: "/images/wIcons/custodians/leadership/kraken-david-ripley.png"
      social:
        twitter: "https://x.com/DavidLRipley"
        linkedin: "https://www.linkedin.com/in/davidripley/"
    team:
      - name: "David Ripley"
        role: "Co-CEO"
      - name: "Arjun Sethi"
        role: "Co-CEO"
      - name: "Jesse Powell"
        role: "Co-founder & Former CEO"
      - name: "Marco Santori"
        role: "Chief Legal Officer"
      - name: "Stephanie Lemmerman"
        role: "Chief Financial Officer and Board Member"
      - name: "Gilles BianRosa"
        role: "Chief Operating and Product Officer"
      - name: "Mayur Gupta"
        role: "Chief Growth & Marketing Officer @ Kraken"
    teamSource: "https://www.kraken.com/about"

  androidApp:
    name: "Kraken - Buy Bitcoin & Crypto"
    url: "/android/com.kraken.trade"

  androidApp2:
    name: "Kraken - Buy TRUMP & Bitcoin"
    url: "/android/com.kraken.invest.app"

  iphoneApp:
    name: "Kraken - Buy Bitcoin & Crypto"
    url: "/iphone/com.kraken.trade.app"
    
  iphoneApp2:
    name: "Kraken: Buy Crypto & Bitcoin"
    url: "/iphone/com.kraken.invest.app"
  
  desktopApp:
    name: "Kraken: Desktop Wallet"
    url: "/desktop/kraken"

  hotColdDesign:
    status: "published"
    lastUpdated: 2021-08-12
    details: "Kraken uses an advanced security model featuring a mix of offline cold storage, HSMs, and multi-signature wallets to ensure the safety of customer funds. Approximately 95% of funds are stored in cold wallets distributed across multiple geographic locations."
    documentation_url: "https://www.kraken.com/security"
    analysis: "Kraken prioritizes security with multi-layer encryption, strict access controls, and global cold storage distribution, ensuring robust asset protection."
    supporting_urls:
      - "https://www.kraken.com/security"
      - "https://support.kraken.com/hc/en-us/articles/360022635592"

  bitcoinFocus:
    status: "multi-currency"
    tradableAssets: "Over 220"
    tradingPairs: "More than 300"
    custodyAssets: "Over 400"
    CompleteList: "https://support.kraken.com/hc/en-us/articles/360001425846"

  proofOfReserves:
    status: "cryptographic-proof"
    details: "Kraken regularly conducts Proof of Reserves audits using cryptographic techniques, allowing users to independently verify their balances against blockchain data."
    auditFrequency: "Quarterly"
    lastAudit: "2024-Q1"
    auditUrl: "https://www.kraken.com/proof-of-reserves"

  operations:
    # 2.3 Incident Response (score: 0-5/5)
    # Providing a link to a public incident response policy (+2 pts)
    incidentResponsePolicy: "" # URL to public incident response policy/documentation
    # Providing a link to a public incident disclosure page (+3 pts)
    incidentDisclosure: "" # URL to public incident disclosure page
    users: "10M+"
    cryptographicProof:
      btcAmount: "50K BTC"
      totalAssets: "$20B"
      lastUpdated: "2024-12-31"
      source: "Kraken Proof-of-Reserves Audit"
      sourceUrl: "https://www.kraken.com/proof-of-reserves"
      valid: true
    
    selfReported:
      btcAmount: "56K BTC"
      totalAssets: "$24B"
      lastUpdated: "2024-10-30"
      source: "Q3 2024 Kraken Shareholder Report"
      sourceUrl: "https://www.kraken.com/investor-relations"
      valid: true

  trackRecord:
    incidentHistoryProvided: true   # Reviewed and confirmed
    history: "Consistent security and regulatory compliance, but has faced regulatory challenges."
    incidentHistory:
      - description: "Regulatory scrutiny from the SEC over securities offerings."
        date: "2023"
        url: "https://www.coindesk.com/kraken-sec-investigation"
        severity: "minor"            # Regulatory issue, not a security breach
        resolved: true              # Settled with SEC
      - description: "Past security incident where a bug led to unintended liquidations."
        date: "2021"
        url: "https://decrypt.co/66200/kraken-exchange-bug"
        severity: "minor"            # Technical issue affecting trading
        resolved: true              # Bug fixed and affected users compensated
    sourceIncidents: "https://status.kraken.com/"
    lastIncident: "2023"

  businessModel:
    type: "Exchange & Custody"
    services:
      - name: "Cryptocurrency Trading"
        url: "https://www.kraken.com/features"
      - name: "Institutional Custody"
        url: "https://www.kraken.com/institutions"
      - name: "Staking Services"
        url: "https://www.kraken.com/staking"
      - name: "Futures Trading"
        url: "https://www.kraken.com/futures"
    revenueStreams:
      - type: "Transaction Fees"
        details: "Varies based on volume and payment method."
      - type: "Staking Rewards"
        details: "Percentage-based on assets staked."

  riskAssessment:
    derivatives: true
    derivativesList:
      - name: "Kraken Futures"
        url: "https://www.kraken.com/futures"
    memecoins: true
    memecoinList:
      - name: "DOGE"
        url: "https://www.kraken.com/prices/doge-dogecoin-price"
      - name: "SHIB"
        url: "https://www.kraken.com/prices/shiba-inu-shib-price"
    gambling: false

  bitcoinContribution:
    fossDevelopment: true
    research: true
    protocolSupport: true
    research_url: "https://www.kraken.com/learn"
    contributions:
      - name: "Bitcoin Developer Grants"
        url: "https://blog.kraken.com/post/13312/kraken-supports-bitcoin-development/"
      - name: "Support for Open-Source Projects"
        url: "https://blog.kraken.com/post/13598/kraken-open-source/"

  userAccess:
    kycRequired: true
    kycLevel: "Advanced"
    withdrawalLimits:
      status: "tiered"
      documentation_url: "https://support.kraken.com/hc/en-us/articles/360001368283"

  # 1.2 Key Management - Multi-Sig (score: 0/10) and Hardware (score: 0/10)
  # 2. Infrastructure - Certifications (score: 0/10)
  # 5. User Security - Authentication (score: 0/5) and Transaction Security (cont'd)
  security:
    # Note: Methodology terms (Comprehensive/Basic/Non-existent) are implemented via specific checks for the same detail levels
    features: ["2FA", "Hardware Security Modules", "Bug Bounty Program"] # 1.2: Multi-Sig (+5 pts). 1.3: Hardware Security (+5 pts). Alternative terms for Multi-Sig: TSS, MPC, Threshold Signing in hotColdDesign.details
    customInfrastructure: true # Setting to true would give +5 more pts in 1.3 Hardware Security for specific details (total 10 pts)
    details: "Kraken implements cold storage security, strict access controls, and real-time monitoring." # For 1.2: Add detailed implementation info here for +5 pts (total 10 pts). For 1.3: Adding "Ledger", "Trezor", or "HSM" would also give +5 more pts (total 10 pts)
    
    # 2.1 Security Certifications (score: 3-6/10)
    # Note: Each certification is worth 3 points, up to a max of 10 points (3 pts per certification)
    certifications:
      - name: "ISO/IEC 27001:2013 Certification"
        issuer: "SGS"
        details: "An international standard for information security management systems, demonstrating Kraken's commitment to robust security practices."
        url: "https://blog.kraken.com/news/kraken-celebrates-excellence-in-cybersecurity-with-a-new-accreditation"
      - name: "SOC 2 Type I Examination"
        issuer: "Independent Third-Party Auditor"
        details: "An assessment of internal controls focused on the security and availability of systems and data."
        url: "https://blog.kraken.com/news/kraken-completes-soc-2-type-i-for-custody-and-funding-services"
    
    # 5.1 Authentication (score: 0-5/5)
    twoFactor: true # Set to true for +3 pts
    biometric: false # Set to true for +2 more pts
    
    # 5.2 Transaction Security (score: 0-5/5)
    withdrawalConfirmations: true # Set to true for +2 pts
    addressWhitelisting: true # Set to true for +2 pts
    withdrawalLimits: true # Set to true for +1 pt
    
    # 2.2 Security Audits (score: 5/10)
    securityAudits:
      performed: true # Set to true for +5 pts (basic security audit evidence)
      frequency: "Semi-annual" # Optional: describes audit frequency
      lastAuditDate: "2024-09-30" # Optional: date of most recent audit
      auditReports:                # Adding report with URL gives +3 
         - year: 2024 # more pts (transparency)
           url: "https://www.financemagnates.com/cryptocurrency/kraken-verifies-215-billion-in-client-assets-with-latest-proof-of-reserves/"
           vendor: "The Network Firm"
         - year: 2022
           url: "https://blog.kraken.com/news/kraken-completes-soc-2-type-i-for-custody-and-funding-services"
           vendor: "Independent Third-Party Auditor"
      insuranceCoverage: "Insurance for select custodial assets." # Setting to non-empty gives +2 more pts (insurance coverage)
      insuranceCoverageURL: "https://support.kraken.com/hc/en-us/articles/360001362626" # Optional: URL to insurance policy details

---

Additional Information:

Kraken maintains one of the most advanced security infrastructures in the industry, featuring:
- Cold storage security with multi-signature wallets and air-gapped key storage.
- Robust monitoring systems with real-time threat detection.
- Secure access controls to prevent unauthorized account activity.

Source: https://www.kraken.com/security
