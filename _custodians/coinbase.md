---
layout: reviewCustodian
title: "Coinbase, Inc."
platformReview:
  type: custodians
  appId: coinbase
icon: coinbase.png

custodian:
  crunchbaseUrl: "https://www.crunchbase.com/organization/coinbase"
  leadership:
    jurisdiction: 🇺🇸 "United States"
    yearsInBusiness: "13"
    ceo:
      name: "Brian Armstrong"
      position: "CEO, Co-founder and Chairman of the Board"
      tenure: "2012-present"
      nationality: "American"
      photo: "/images/wIcons/custodians/leadership/coinbase-brian-armstrong.png"
      social:
        twitter: "https://x.com/brian_armstrong"
        linkedin: "https://www.linkedin.com/in/barmstrong"
        github: "https://github.com/barmstrong"
    team:
      - name: "Brian Armstrong"
        role: "CEO, Co-founder and Chairman of the Board"
      - name: "Emile Choi"
        role: "President & Chief Operating Officer"
      - name: "Alesia Haas"
        role: "Chief Financial Officer"
      - name: "L.J. Brock"
        role: "Chief People Officer"
      - name: "Paul Grewal"
        role: "Chief Legal Officer"
      - name: "Gregory Tusar"
        role: "VP, Institutional Product"
    teamSource: "https://investor.coinbase.com/governance/management/default.aspx"

  androidApp:
    name: "Coinbase: Buy Bitcoin & Crypto"
    url: "/android/com.coinbase.android"

  iphoneApp:
    name: "Coinbase: Buy Bitcoin & Crypto"
    url: "/iphone/com.vilcsak.bitcoin2"
  
  webApp:
    name: "Coinbase: Web Wallet"
    url: "/others/com.coinbase.web"
    icon: "fas fa-globe"

  browserExtension:
    name: "Coinbase: Buy Bitcoin & Crypto"
    url: "/others/ext.coinbase"

  hotColdDesign:
    status: "published"
    lastUpdated: 2021-05-04
    details: "Coinbase employs a Threshold Signing Service (TSS) with multi-party cryptographic signing, HSM-enforced security, and comprehensive key protection measures. 98% of funds are in cold storage with air-gapped key management and geographic distribution."
    documentation_url: "https://www.coinbase.com/blog/production-threshold-signing-service"
    analysis: "Coinbase's security infrastructure combines TSS, HSMs, and multi-party controls to protect billions in customer assets. Their approach eliminates single points of failure through consensus-based deployments, anomaly detection, and immutable logging."
    supporting_urls:
      - "https://www.coinbase.com/blog/production-threshold-signing-service"
      - "https://help.coinbase.com/en/prime/trading-and-funding/cold-storage-transaction-faqs"
      - "https://www.coinbase.com/blog/a-behind-the-scenes-look-at-the-biggest-and-quietest-crypto-transfer-on"

  bitcoinFocus:
    status: "multi-currency"
    tradableAssets: "Over 240"
    tradingPairs: "More than 300"
    custodyAssets: "Over 425"
    CompleteList: "https://coinbase.bynder.com/m/337c9f06d83b903a/original/Coinbase-Assets-Supported-Pairs.pdf"

  proofOfReserves:
    status: "traditional-audit"
    details: "Coinbase relies on traditional financial audits by Deloitte rather than cryptographic proof of reserves. They have granted funding to Silver Sixpence to develop a native proof of reserves system, but this is not yet implemented."
    auditFrequency: "Annual"
    lastAudit: "2023"
    auditUrl: "https://www.sec.gov/ix?doc=/Archives/edgar/data/1679788/000167978824000022/coin-20231231.htm"
    developmentStatus: "Proof-of-Reserves in development via Silver Sixpence grant"
    developmentUrl: "https://www.coinbase.com/blog/proof-of-reserves-grant"

  operations:
    users: "110M"
    cryptographicProof:
      btcAmount: ""
      totalAssets: ""
      lastUpdated: ""
      source: ""
      sourceUrl: ""
      valid: false
    
    thirdPartyAudit:
      btcAmount: "887K BTC"
      totalAssets: "$124B"
      lastUpdated: "2025-01-30"
      source: "Arkham Intelligence"
      sourceUrl: "https://intel.arkm.com/explorer/entity/coinbase"
      valid: true

    selfReported:
      btcAmount: ""
      totalAssets: "$137B"
      lastUpdated: "2024-10-30"
      source: "Q3 2024 Coinbase Shareholder Letter"
      sourceUrl: "https://investor.coinbase.com/files/doc_financials/2024/q3/Q3-24-Shareholder-Letter.pdf"
      valid: true

    notes: |
      <p>Coinbase Wrapped Bitcoin (cbBTC) is a wrapped version of Bitcoin backed 1:1 by BTC held by Coinbase, enabling users to interact with their BTC across multiple blockchain networks. The token allows users to send and receive BTC on Ethereum, Base, Solana, and Arbitrum networks while maintaining a unified BTC balance.</p>

      <table>
        <tr>
          <th colspan="2">cbBTC Reserves and Distribution</th>
        </tr>
        <tr>
          <td>Total BTC Reserve</td>
          <td>26,887.68 BTC</td>
        </tr>
        <tr>
          <td>Total cbBTC Supply</td>
          <td>26,876.71 cbBTC</td>
        </tr>
        <tr>
          <th colspan="2">Network Distribution</th>
        </tr>
        <tr>
          <td>Ethereum</td>
          <td>16,470.468 cbBTC</td>
        </tr>
        <tr>
          <td>Base</td>
          <td>7,655.391 cbBTC</td>
        </tr>
        <tr>
          <td>Solana</td>
          <td>2,699.461 cbBTC</td>
        </tr>
        <tr>
          <td>Arbitrum</td>
          <td>51.395 cbBTC</td>
        </tr>
      </table>

      <p><strong>Important Note:</strong> The cbBTC reserves (26,887.68 BTC) represent only a small portion of Coinbase's total Bitcoin holdings, which according to Arkham Intelligence amount to approximately 887,000 BTC. cbBTC is specifically designated for cross-chain functionality and should not be confused with Coinbase's total Bitcoin custody.</p>

  trackRecord:
    history: "Multiple security incidents affecting customer accounts"
    incidentHistory:
      - description: "Third-party bank data exposure affecting 154 customers' transaction data and personal information"
        date: "July 2024"
        url: "https://cybernews.com/news/coinbase-third-party-breach"
      - description: "Account compromise affecting over 6,000 customers through phishing attacks"
        date: "October 2021"
        url: "https://thecyberexpress.com/coinbase-cyber-attack-customer-data-sale"
      - description: "SMS-based two-factor authentication vulnerability exploited, affecting over 6,000 accounts"
        date: "March-May 2021"
        url: "https://therecord.media/hackers-bypass-coinbase-2fa-to-steal-customer-funds"
    sourceIncidents: "https://status.coinbase.com/"
    lastIncident: "July 2024"

  businessModel:
    type: "Exchange & Custody"
    services:
      - name: "Cryptocurrency Trading"
        url: "https://help.coinbase.com/en/coinbase/trading-and-funding"
      - name: "Institutional Custody"
        url: "https://www.coinbase.com/prime/custody"
      - name: "Coinbase Prime"
        url: "https://www.coinbase.com/prime"
      - name: "Private Client Services"
        url: "https://www.coinbase.com/private-client"
      - name: "Institutional Services"
        url: "https://www.coinbase.com/institutional"
      - name: "Staking Services"
        url: "https://www.coinbase.com/en-gb/earn"
      - name: "NFTs"
        url: "https://help.coinbase.com/en/wallet/nft-management/nft-overview"
      - name: "Coinbase Commerce"
        url: "https://www.coinbase.com/en-gb/commerce"
    revenueStreams:
      - type: "Transaction Fees"
        details: "Variable percentage based on trade volume and payment method"
      - type: "Custody Fees"
        details: "Based on assets under custody"

  riskAssessment:
    derivatives: true
    derivativesList:
      - name: "Coinbase Derivatives"
        url: "https://www.coinbase.com/en-gb/derivatives"
      - name: "Coinbase Futures"
        url: "https://www.coinbase.com/en-gb/international-exchange"
    memecoins: true
    memecoinList:
      - name: "DOGE"
        url: "https://exchange.coinbase.com/trade/DOGE-USD"
      - name: "SHIB"
        url: "https://exchange.coinbase.com/trade/SHIB-USD"
      - name: "FLOKI"
        url: "https://exchange.coinbase.com/trade/FLOKI-USD"
      - name: "PEPE"
        url: "https://exchange.coinbase.com/trade/PEPE-USD"
      - name: "GIGA"
        url: "https://exchange.coinbase.com/trade/GIGA-USD"
      - name: "TRUMP"
        url: "https://exchange.coinbase.com/trade/TRUMP-USD"
    gambling: false

  bitcoinContribution:
    fossDevelopment: true
    research: true
    protocolSupport: true
    research_url: "https://www.coinbase.com/en-gb/public-policy/advocacy/institute"
    contributions:
      - name: "Crypto Community Fund (2020)"
        url: "https://www.coinbase.com/blog/coinbase-will-sponsor-two-bitcoin-core-developers-with-first-crypto"
      - name: "Donation to Brink ($3.6M, 2024)"
        url: "https://bitcoinmagazine.com/business/coinbases-givecrypto-donates-3-6-million-to-brink-to-fund-bitcoin-developers"
      - name: "Gitcoin Partnership ($1M commitment)"
        url: "https://www.coinbase.com/blog/coinbase-commits-1-million-for-public-goods-in-partnership-with-gitcoin"

  userAccess:
    kycRequired: true
    kycLevel: "Advanced"
    withdrawalLimits:
      status: "tiered"
      documentation_url: "https://help.coinbase.com/en/exchange/funding/deposit-and-withdrawal-limits"

  # 1.2 Key Management - Multi-Sig (score: 0/10) and Hardware (score: 0/10)
  # 2. Infrastructure - Certifications (score: 0/10)
  # 5. User Security - Authentication (score: 0/5) and Transaction Security (cont'd)
  security:
    # Note: Methodology terms (Comprehensive/Basic/Non-existent) are implemented via specific checks for the same detail levels
    features:
      - "2FA"
      - "FIDO2"
      - "Withdrawal Whitelisting" # 1.2: Multi-Sig (+5 pts). 1.3: Hardware Security (+5 pts). Alternative terms for Multi-Sig: TSS, MPC, Threshold Signing in hotColdDesign.details
    customInfrastructure: true # Setting to true would give +5 more pts in 1.3 Hardware Security for specific details (total 10 pts)
    details: "They run their own servers with dedicated HSMs." # For 1.2: Add detailed implementation info here for +5 pts (total 10 pts). For 1.3: Adding "Ledger", "Trezor", or "HSM" would also give +5 more pts (total 10 pts)
    
    # 2.1 Security Certifications (score: 3-6/10)
    # Note: Each certification is worth 3 points, up to a max of 10 points (3 pts per certification)
    certifications:
      - name: "SOC 1 Type 2 Certification for Coinbase Prime"
        issuer: "American Institute of Certified Public Accountants (AICPA)"
        details: "Coinbase Prime completed its first-ever SOC 1 Type 2 examination, assessing internal controls over financial reporting for the period of July 1, 2019, to December 31, 2019."
        url: "https://www.coinbase.com/blog/coinbase-inc-completes-initial-prime-broker-prime-soc-1-and-soc-2-type-2"

      - name: "SOC 2 Type 2 Certification for Coinbase Prime"
        issuer: "American Institute of Certified Public Accountants (AICPA)"
        details: "Coinbase Prime achieved SOC 2 Type 2 certification, evaluating controls related to security, availability, processing integrity, confidentiality, and privacy for the period of July 1, 2019, to December 31, 2019."
        url: "https://www.coinbase.com/blog/coinbase-inc-completes-initial-prime-broker-prime-soc-1-and-soc-2-type-2"

      - name: "SOC 1 Type 2 Certification for Coinbase Custody"
        issuer: "American Institute of Certified Public Accountants (AICPA)"
        details: "Coinbase Custody attained SOC 1 Type 2 certification, demonstrating robust internal controls over financial reporting for the period of July 1, 2019, to December 31, 2019."
        url: "https://www.coinbase.com/blog/in-another-first-coinbase-custody-attains-its-soc-1-and-soc-2-reports"

      - name: "SOC 2 Type 2 Certification for Coinbase Custody"
        issuer: "American Institute of Certified Public Accountants (AICPA)"
        details: "Coinbase Custody achieved SOC 2 Type 2 certification, affirming the effectiveness of its controls related to security, availability, processing integrity, confidentiality, and privacy for the period of July 1, 2019, to December 31, 2019."
        url: "https://www.coinbase.com/blog/in-another-first-coinbase-custody-attains-its-soc-1-and-soc-2-reports"
    
    # 5.1 Authentication (score: 0-5/5)
    twoFactor: true # Set to true for +3 pts
    biometric: true # Set to true for +2 more pts
    
    # 5.2 Transaction Security (score: 0-5/5)
    withdrawalConfirmations: true # Set to true for +2 pts
    addressWhitelisting: true # Set to true for +2 pts
    withdrawalLimits: true # Set to true for +1 pt
    
    # 2.2 Security Audits (score: 5/10)
    securityAudits:
      performed: true # Set to true for +5 pts (basic security audit evidence)
      frequency: "Annual" # Optional: describes audit frequency
      lastAuditDate: "2024" # Optional: date of most recent audit
      auditReports:
        - year: 2024
          url: "https://www.coinbase.com/blog/coinbase-inc-completes-initial-prime-broker-prime-soc-1-and-soc-2-type-2"
          vendor: "Deloitte & Touche"
      insuranceCoverage: "See Coinbase's Insurance Terms" # Setting to non-empty gives +2 more pts (insurance coverage)
      insuranceCoverageURL: "https://www.coinbase.com/legal/insurance" # Optional: URL to insurance policy details

---

Additional Information: 

Coinbase's Threshold Signing Service (TSS) is a core part of its custody solution, ensuring:

- Private keys are never fully exposed at any stage.
- Multiparty cryptographic signing replaces traditional key reconstruction.
- Nonce protection and validation processes prevent private key leaks.
- Hardware Security Modules (HSMs) enforce physical security.
- Encryption, access control, and hybrid participation reduce risks.
- These methods enhance the security of Coinbase's custodial wallets, protecting billions in customer assets from hacks, insider threats, and cryptographic attacks.

Source: https://www.coinbase.com/blog/production-threshold-signing-service

### 2016 - How Coinbase Builds Secure Infrastructure To Store Bitcoin In The Cloud

- Eliminates single points of failure by requiring multi-party control for sensitive operations.
- Restricts production access to vetted employees, with strict monitoring & immutable logging.
- Cold storage security via air-gapped key management, Shamir's Secret Sharing, and geographic key distribution.
- Anomaly detection & kill switches for immediate threat response.
- Consensus-based deployments prevent unauthorized or malicious changes.
- Full Dockerization for consistent, repeatable, and secure deployments.

