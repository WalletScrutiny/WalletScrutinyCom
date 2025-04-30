---
layout: reviewCustodian
title: "Xapo Bank"
platformReview:
  type: custodians
  appId: xapobank
icon: xapobank.png

custodian:
  crunchbaseUrl: "https://www.crunchbase.com/organization/xapo-bank"
  leadership:
    jurisdiction: "Gibraltar"
    yearsInBusiness: "Founded in 2013, established as Xapo Bank in 2021"
    ceo:
      name: "Seamus Rocca"
      position: "CEO"
      tenure: "2021-present"
      nationality: "British"
      photo: "/images/wIcons/custodians/leadership/xapobank-seamus-rocca.png"
      social:
        twitter: 
        linkedin: "https://www.linkedin.com/in/seamus-rocca-38430b15/"
        github:
    team:
      - name: "Seamus Rocca"
        role: "CEO"
      - name: "Wences Casares"
        role: "Executive Chairman and Founder"
      - name: "Federico Murrone"
        role: "Co-Founder"
      - name: "Diego Valenzuela"
        role: "Director and General Counsel"
      - name: "Joey Garcia"
        role: "Director and Chief Legal and Regulatory Officer"
      - name: "Micky Malka"
        role: "Non-Executive Director"
      - name: "Timothy Sloan"
        role: "Independent Non-Executive Director"
      - name: "Anju Patwardhan"
        role: "Independent Non-Executive Director"
    teamSource: "https://www.xapobank.com/en/expertise"


  androidApp:
    name: "Xapo Bank: Save in BTC & USD"
    url: "/android/com.xapo.bank"

  iphoneApp:
    name: "Xapo Bank: Save in BTC & USD"
    url: "/iphone/com.xapo.bank"
  
  # webApp:
    # name: 
    # url:
    # icon:

  # browserExtension:
    # name:
    # url:

  hotColdDesign:
    status: "published"
    lastUpdated: "2025-04-01"
    details: |
      Xapo Bank employs a hybrid wallet infrastructure combining hot wallets for operational liquidity and cold storage vaults for long-term asset protection. The cold storage system is designed with multiple layers of security, including biometric access controls, armed guards, and 24/7 surveillance. Their infrastructure emphasizes physical and digital security measures to safeguard client assets.

      The bank utilizes Multi-Party Computation (MPC) protocols, where continuously regenerating “shards” of a master key are created using a threshold-based signing mechanism. Each shard is encrypted and stored in separate, undisclosed locations, ensuring that no single person, including security team members, knows the complete key configuration at any given time. This technology is open source and has not had any known vulnerabilities.

      Additionally, Xapo Bank integrates hardware security keys into its multi-layered security approach, providing an extra physical line of defense. Using a physical key for Vault withdrawals ensures that funds remain securely under the user's control at all times.
    documentation_url: "https://www.xapobank.com/en/security/our-security-system"
    analysis: |
      Xapo Bank's approach to wallet security combines advanced cryptographic techniques with robust physical safeguards. The use of MPC protocols for key management minimizes the risk of single points of failure, and the integration of hardware security keys adds an additional layer of protection for Vault withdrawals. However, specific technical details regarding the hot wallet infrastructure, such as the use of multi-signature schemes or hardware security modules, are not disclosed. The lack of detailed technical documentation limits a comprehensive assessment of their wallet design's robustness.
    supporting_urls:
      - "https://www.xapobank.com/en/faq/safety"
      - "https://www.xapobank.com/en/blog/the-bybit-hack-why-crypto-security-must-evolve-and-how-xapo-bank-stays-ahead"
 

  bitcoinFocus:
    status: "multi-currency"
    tradableAssets: "Bitcoin, Ethereum, Cardano, Polygon"
    tradingPairs: "USD to Cryptocurrency"
    custodyAssets: "Bitcoin, Ethereum, Cardano, Polygon, USDC, USDT"
    CompleteList: "https://www.xapobank.com/en/faq/features/which-banks-can-you-buy-bitcoin-or-ethereum-from"

  proofOfReserves:
    status: "traditional-audit"
    details: "Xapo Bank undergoes regular audits by third-party auditors to ensure the accuracy of their reserve balances."
    auditFrequency: "Annually"
    lastAudit: "2024"
    auditUrl: "https://www.xapobank.com/en/blog/security-or-convenience-which-should-you-prioritise-for-your-bitcoin"
    developmentStatus: ""
    developmentUrl: ""

  operations:
    users: "Undisclosed" 
    cryptographicProof:
      btcAmount: ""
      totalAssets: ""
      lastUpdated: ""
      source: ""
      sourceUrl: ""
      valid: false
    
    thirdPartyAudit:
      btcAmount: "38.9K BTC"
      totalAssets: "$3.68B"
      lastUpdated: "2025-04-30"
      source: "Bitcointreasuries.net"
      sourceUrl: "https://bitcointreasuries.net/entities/xapo"
      valid: true

    selfReported:
      btcAmount: "38.9K BTC"
      totalAssets: "$3.68B"
      lastUpdated: "2023"
      source: "Xapo Bank Blog"
      sourceUrl: "https://www.xapobank.com/en/blog/xapo-bank-insights-on-cash-crypto-payment-trends-q3-2023-report"
      valid: true

    notes: |
      The amount often-reported "38,931 BTC" has not been updated since 2023.

  trackRecord:
    incidentHistoryProvided: true
    incidentHistory:
      - description: ""
        date: ""
        url: ""
        severity: ""
        resolved: ""
    # incidentSeverityScore: 0
    sourceIncidents: ""
    lastIncident: ""

  businessModel:
    type: "Private Bank & Crypto Custody"
    services:
      - name: "Bitcoin Banking"
        url: "https://www.xapobank.com/en/banking/hodl"
      - name: "Interest-Bearing Accounts"
        url: "https://www.xapobank.com/en/banking/earn"
      - name: "Stock Market Trading"
        url: "https://www.xapobank.com/en/banking/grow"
      - name: "Bitcoin-Backed Loans"
        url: "https://www.xapobank.com/en/banking/bitcoin-loans"
      - name: "Cryptocurrency Trading"
        url: "https://www.xapobank.com/en/banking/grow"
      - name: "Debit Card Services"
        url: "https://www.xapobank.com/en/banking/transact"
    revenueStreams:
      - type: "Annual Membership Fee"
        details: "As of September 16, 2024, Xapo Bank charges an annual membership fee of $1,000. This fee covers premium banking services, including a USD bank account, international debit card, and secure vault access. The fee is automatically deducted when the account balance reaches at least $1,000 or the equivalent in Bitcoin."
      - type: "Trading Fees"
        details: "Xapo Bank applies a flat 1% fee on each cryptocurrency and stock trade. Additional regulatory fees, such as the SEC fee and the Trading Activity Fee (TAF), apply to stock transactions."
      - type: "Interest Spread"
        details: "The bank generates revenue from the difference between the returns earned from investing customer deposits in short-term, highly rated money market instruments and the interest paid to customers. Notably, Xapo Bank passes more than 80% of the yield generated back to its members."
      - type: "Bitcoin-Backed Loans"
        details: "Xapo Bank offers Bitcoin-backed loans of up to $1 million, allowing members to borrow against their BTC holdings without selling them. Loans are available in terms of 30, 90, 180, or 365 days, with low-interest APRs and no minimum installments."
      - type: "Debit Card FX Spread"
        details: "Members enjoy zero foreign exchange (FX) fees when using the Xapo Bank metal debit card. The bank generates revenue through the FX spread on currency conversions during transactions."
      - type: "Bitcoin Cashback Program"
        details: "Xapo Bank offers up to 1% cashback in Bitcoin on purchases made with the Xapo Bank debit card. This program encourages card usage and generates revenue through increased transaction volumes."

  riskAssessment:
    description: "Xapo Bank maintains a conservative approach to cryptocurrency offerings, focusing on established cryptocurrencies with substantial market capitalization, historical performance, and longevity. The bank does not offer derivatives or memecoins, aligning with its commitment to security and regulatory compliance."
    derivatives: false
    derivativesList: []
    memecoins: false
    memecoinList: []
    gambling: false

  bitcoinContribution:
    fossDevelopment: false
    research: false
    protocolSupport: false
    research_url: ""
    contributions:
      - name: "Title Sponsorship of Bitcoin 2024 Conference"
        url: "https://coinedition.com/btc-inc-announces-xapo-bank-as-title-sponsor-of-the-bitcoin-conference/"
      - name: "Integration of Bitcoin Lightning Network"
        url: "https://www.xapobank.com/en/blog/beyond-hodling-how-xapo-bank-makes-bitcoin-easy-to-use"
      - name: "Launch of $200M Bitcoin-Denominated Hedge Fund with Hilbert Capital"
        url: "https://www.coindesk.com/business/2024/08/27/crypto-bank-xapo-to-manage-200m-bitcoin-denominated-hedge-fund-with-hilbert-capital"

  userAccess:
    kycRequired: true
    kycLevel: "Full KYC with passport verification, proof of address, and liveness check"
    withdrawalLimits:
      status: "Daily limits apply for card purchases and ATM withdrawals"
      documentation_url: "https://www.xapobank.com/en/faq/transactions/what-are-my-xapo-cards-spending-limits"

  security:
    features:
      - "Multi-Party Computation (MPC) key management with sharded key storage"
      - "Hardware security key support (e.g., YubiKey) for BTC Vault withdrawals"
      - "Biometric authentication (fingerprint, facial recognition)"
      - "Two-Factor Authentication (2FA)"
      - "Zero Trust Security Model with AI-powered threat detection"
      - "24/7 system monitoring and intrusion detection"
      - "48-hour withdrawal hold for Vault funds"
      - "Location-based transaction restrictions"
      - "Real-time transaction alerts"
      - "Card freeze capability via app"
    customInfrastructure: true
    details: |
      Xapo Bank employs a sophisticated security infrastructure combining Multi-Party Computation (MPC) protocols with sharded key storage across undisclosed locations. This approach ensures that no single individual has access to complete private keys. The integration of hardware security keys, such as YubiKey, adds an additional layer of protection for BTC Vault withdrawals. The bank's Zero Trust Security Model, complemented by AI-powered threat detection, ensures continuous verification of internal requests and proactive defense against potential threats. Biometric authentication and Two-Factor Authentication (2FA) further enhance account security. Additional features like 48-hour withdrawal holds, location-based transaction restrictions, real-time alerts, and card freeze capabilities provide users with comprehensive control over their assets.
  certifications:
    - name: "SOC 2 Type II"
      issuer: "Independent Third-Party Auditor"
      details: "Demonstrates adherence to stringent security controls over time, ensuring the protection of customer data and continuous monitoring of systems."
      url: "https://www.xapobank.com/en/blog/security-or-convenience-which-should-you-prioritise-for-your-bitcoin"
    - name: "PCI DSS"
      issuer: "Payment Card Industry Security Standards Council"
      details: "Ensures secure handling of cardholder data to prevent fraud and data breaches."
      url: "https://www.xapobank.com/en/blog/the-bybit-hack-why-crypto-security-must-evolve-and-how-xapo-bank-stays-ahead"
  twoFactor: true
  biometric: true
  withdrawalConfirmations: true
  addressWhitelisting: false
  withdrawalLimits: true
  securityAudits:
    performed: true
    frequency: "Annual"
    lastAuditDate: "2024-12-31"
    auditReports:
      - year: 2024
        url: "https://www.xapobank.com/en/blog/security-or-convenience-which-should-you-prioritise-for-your-bitcoin"
        vendor: "Independent Third-Party Auditor"
    insuranceCoverage: "Fiat deposits are protected under the Gibraltar Deposit Guarantee Scheme up to €100,000. BTC Vault funds are not insured."
    insuranceCoverageURL: "https://customersupport.xapo.com/en_us/are-my-funds-in-the-vault-insured-HymZ4ZAYn"

---
