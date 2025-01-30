---
layout: reviewCustodian
title: "Binance Holdings Limited"
platformReview:
  type: custodians
  appId: binance
icon: binance.jpeg

custodian:
  crunchbaseUrl: "https://www.crunchbase.com/organization/binance"
  leadership:
    jurisdiction: 🇰🇾 "Cayman Islands"
    yearsInBusiness: "6"
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
    url: "/iphone/binance.ios"
  
  webApp:
    name: "Binance: Web Wallet"
    url: "/others/binance.com"

  browserExtension:
    name: "Binance Chain Wallet"
    url: "/others/ext.binancechain"

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
    btcCustodied: "592,588.948"
    SourceBTC: "https://www.binance.com/en/proof-of-reserves"
    AssetsUnderCustody: "$181,067,979,424.00"
    SourceAUC: "https://www.binance.com/en/proof-of-reserves"
    MonthlyTransactingUsers: "128M+"
    SourceMTU: "https://www.binance.com/en/blog/ecosystem/binance-2023-annual-report-highlights-3810473165033754797"
    LastUpdatedMTU: "2023"

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
    insuranceCoverage: "Safu (Secure Asset Fund for Users) for emergency losses"
    insuranceTermsUrl: "https://www.binance.com/en/support/faq/the-secure-asset-fund-for-users-safu-360027414213"

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

  security:
    features:
      - "2FA"
      - "Hardware Key (U2F/FIDO2)"
      - "Address Whitelisting"
    customInfrastructure: true
    details: "Binance operates its own servers and implements real-time risk monitoring. Private keys for the majority of funds are secured via cold storage with multi-signature setups."
---