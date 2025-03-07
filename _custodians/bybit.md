---
layout: reviewCustodian
title: "Bybit FinTech Limited"
platformReview:
  type: custodians
  appId: bybit
icon: bybit.png

custodian:
  crunchbaseUrl: "https://www.crunchbase.com/organization/bybit"
  leadership:
    jurisdiction: "🇦🇪 United Arab Emirates"
    yearsInBusiness: "7"
    ceo:
      name: "Ben Zhou"
      position: "CEO and Co-founder"
      tenure: "2018-present"
      nationality: "Chinese"
      photo: "/images/wIcons/custodians/leadership/bybit-ben-zhou.jpg"
      social:
        twitter: "https://x.com/benbybit"
        linkedin: "https://www.linkedin.com/in/ben-zhou-b979ba28"
    team:
      - name: "Ben Zhou"
        role: "CEO and Co-founder"
      - name: "Jerry Li"
        role: "Head of Financial Product & Trading Tools"
      - name: "Robert MacDonald"
        role: "Chief Legal & Compliance Officer"
      - name: "Haroon Baig"
        role: "Content Creator (Technical & General)"
      - name: "Francesca Tay"
        role: "Chief Content Strategist"
      - name: "Igneus Terrenus"
        role: "Head of Communications"
    teamSource: "https://www.crunchbase.com/organization/bybit/people"

  androidApp:
    name: "Bybit: Buy & Trade Crypto"
    url: "/android/com.bybit.app"

  iphoneApp:
    name: "Bybit: Buy & Trade Crypto"
    url: "/iphone/com.bybit.app"

  webApp:
    name: "Bybit: Web Platform"
    url: "/others/com.bybit.web"

  browserExtension:
    name: "Bybit Wallet"
    url: "/others/pdliaogehgdbhbnmkklieghmmjkpigpa"

  hotColdDesign:
    status: "published"
    lastUpdated: 2024-08-15
    details: "Bybit employs a robust security architecture that includes both hot and cold storage solutions for customer funds. Hot wallets are used for immediate transaction processing, while the majority of funds are kept in cold storage to ensure long-term security. Bybit regularly publishes proof of reserves to demonstrate that customer funds are fully backed."
    documentation_url: "https://www.bybit.com/en/proof-of-reserve"
    analysis: "Bybit's security measures, including the use of hot and cold storage, are designed to balance operational efficiency with the highest standards of asset protection. Their regular proof of reserves and third-party auditing ensure that customer funds are always fully backed, providing peace of mind to users."
    supporting_urls:
      - "https://www.bybit.com/en/proof-of-reserve"
      - "https://www.hacken.io/audits/"

  bitcoinFocus:
    status: "multi-currency"
    tradableAssets: "Over 1,000"
    tradingPairs: "Over 300"
    custodyAssets: "Over 1,000"
    CompleteList: "https://www.bybit.com/en/help-center/article/Assets-List-for-Bybit-Convert"

  proofOfReserves:
    status: "cryptographic"
    details: "Bybit regularly publishes proof of reserves to demonstrate that customer funds are fully backed."
    auditFrequency: "Regularly"
    lastAudit: 2025-02-24
    auditUrl: "https://www.bybit.com/app/user/proof-of-reserve"
    developmentStatus: "Implemented"
    developmentUrl: ""

  operations:
    users: "60M+"
    cryptographicProof:
      btcAmount: "61K BTC"
      totalAssets: ""
      lastUpdated: "2025-02-20"
      source: "Bybit"
      sourceUrl: "https://www.bybit.com/app/user/proof-of-reserve"
      valid: true

    thirdPartyAudit:
      btcAmount: "63K BTC"
      totalAssets: ""
      lastUpdated: "2025-01-25"
      source: "Hacken.io"
      sourceUrl: "https://www.bybit.com/app/user/reserve-ratio"
      valid: true

    selfReported:
      btcAmount: ""
      totalAssets: "12B USD"
      lastUpdated: "2025-02-24"
      source: "Bybit"
      sourceUrl: "https://www.bybit.com/en/proof-of-reserve"
      valid: true
    notes: |
      <p>Bybit offers a range of products and services related to Bitcoin, including spot trading, derivatives trading, and staking.</p>

  trackRecord:
    history: "Major security incident in February 2025"
    incidentHistory:
      - description: "Bybit was hacked for over $1.4 billion in liquid-staked Ether (stETH), Mantle Staked ETH (mETH), and other ERC-20 tokens."
        date: "February 2025"
        url: "https://cointelegraph.com.news/Bybit-exchange-hacked"
    sourceIncidents: "https://status.bybit.com/"
    lastIncident: "February 2025"
    insuranceCoverage: "Bybit has an insurance fund for derivatives trading, but no information on general platform insurance."
    insuranceTermsUrl: "https://www.bybit.com/en/help-center/article/Insurance-Fund"

  businessModel:
    type: "Exchange & Custody"
    services:
      - name: "Cryptocurrency Trading"
        url: "https://www.bybit.com/en/trade/spot"
      - name: "Derivatives Trading"
        url: "https://www.bybit.com/en/trade/futures"
      - name: "Staking Services"
        url: "https://www.bybit.com/en/earn/savings"
      - name: "NFTs"
        url: "https://nft.bybit.com/"
    revenue Streams:
      - type: "Transaction Fees"
        details: "Variable percentage based on trade volume and payment method"
      - type: "Custody Fees"
        details: "Based on assets under custody"

  riskAssessment:
    derivatives: true
    derivativesList:
      - name: "Perpetual Contracts"
      - name: "Futures Contracts"
    memecoins: true
    memecoinList:
      - name: "DOGE"
      - name: "SHIB"
      - name: "FLOKI"
      - name: "PEPE"
    gambling: false

  bitcoinContribution:
    fossDevelopment: false
    research: true
    protocolSupport: true
    research_url: "https://www.bybit.com/en/announcement"
    contributions:
      - name: "Supporting the Bitcoin ecosystem through trading platform"

  userAccess:
    kycRequired: true
    kycLevel: "Standard"
    withdrawalLimits:
      status: "tiered"
      documentation_url: "https://www.bybit.com/en/help-center/article/Withdrawal-Limits"

  security:
    features:
      - "2FA"
      - "Withdrawal Whitelisting"
      - "Multi-signature Wallets"
      - "Cold Storage"
      - "Encryption"
      - "Access Control"
    customInfrastructure: true
    details: "Bybit uses its own servers with dedicated HSMs for added security."

  osint:
    summary: ""
    entries:
      - information: "A joint investigation by Mandiant and Safe.eth indicates that   the Bybit hack could be attributed to a compromised Safe developer laptop along with compromised AWS session tokens."
        date: "March 7, 2025"
        source: "CyberNews.com"
        source_url: "https://cybernews.com/crypto/more-details-bybit-hack"
        corroborating_source: ""
        corroborating_source_url: ""
        refutation: "None"
        refutation_source_url: "N/A"
        comment: ""
      - information: "A macOS developer's workstation was compromised via a socially engineered Docker project linked to UNC4899, leading to AWS session hijacking, MFA bypass attempts, and connections to DPRK-attributed malicious domains."
        date: "March 6, 2025"
        source: "Tal Be'ery Sec"
        source_url: "https://x.com/TalBeerySec/status/1897676078400897233"
        corroborating_source: "Safe.eth"
        corroborating_source_url: "https://x.com/safe/status/1897663514975649938"
        refutation: "None"
        refutation_source_url: "N/A"
        comment: ""
      - information: "Bybit hacker launders 100% of stolen $1.4B crypto in 10 days"
        date: "March 4, 2025"
        source: "CoinTelegraph.com"
        source_url: "https://cointelegraph.com/news/bybit-hacker-launders-1-billion-stolen-funds"
        corroborating_source: "X.com Lookonchain"
        corroborating_source_url: "https://x.com/lookonchain/status/1896859061263700337"
        refutation: ""
        refutation_source_url: ""
        comment: ""
      - information: "ZachXBT links ByBit hack with Poloniex, Phemex, and BingX hacks"
        date: "February 24, 2025"
        source: "ZachXBT"
        source_url: "https://x.com/zachxbt/status/1894004267553304723"
        corroborating_source: ""
        corroborating_source_url: ""
        refutation: "None"
        refutation_source_url: "N/A"
        comment: ""
      - information: "ByBit $1 billion hack bounty solved by zachxbt"
        date: "February 22, 2025"
        source: "ArkHam Intelligence"
        source_url: "https://x.com/arkham/status/1893033424224411885"
        corroborating_source: ""
        corroborating_source_url: ""
        refutation: "None"
        refutation_source_url: ""
        comment: ""
      - information: "Bybit hacked for over $1.4 billion (401,346 ETH)"
        date: "February 21, 2025"
        source: "CoinTelegraph"
        source_url: "https://cointelegraph.com/news/bybit-exchange-hacked"
        corroborating_source: "Whale Alert"
        corroborating_source_url: "https://whale-alert.io/transaction/ethereum/0xb61413c495fdad6114a7aa863a00b2e3c28945979a10885b12b30316ea9f072c"
        refutation: "None"
        refutation_source_url: "N/A"
        comment: ""

---

### Additional Information

- **Bybit's Headquarters**: Bybit is headquartered in Dubai, United Arab Emirates.
- **Proof of Reserves**: Bybit regularly publishes proof of reserves to ensure transparency and trust.
- **Security Incident**: Bybit experienced a significant security incident in February 2025, resulting in the loss of over $1.4 billion in digital assets. The exchange is working to address this issue and has committed to enhancing its security measures.

This file provides a comprehensive overview of Bybit, covering its operations, security practices, and recent developments. It is essential for users to stay informed about the platform's status and any potential risks associated with it.