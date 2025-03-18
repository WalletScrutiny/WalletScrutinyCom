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
    sourceIncidents: "https://www.bybit.com/en/announcement-info/deposit-withdraw/"
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
    research: false
    protocolSupport: false
    research_url: ""
    contributions: []

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
    details: "<p><strong>Cold Storage of Funds:</strong> The exchange claims that a significant portion of user funds are held in cold wallets offline <a href='https://cointelegraph.com/learn/articles/how-the-bybit-hack-happened'>[1]</a>. This greatly reduces the attack surface, as offline wallets are not directly reachable by hackers.</p>

<p><strong>Multisignature Authorization:</strong> All withdrawals or transfers from Bybit's cold wallets require multiple signatures. No single employee or device can unilaterally move funds – multiple private keys (held by separate trusted parties) must sign each transaction <a href='https://cointelegraph.com/learn/articles/how-the-bybit-hack-happened'>[1]</a>. This multi-sig scheme ensures that even if one key is stolen or one signer is compromised, the attacker cannot withdraw funds without the other co-signers.</p>

<p><strong>Minimal Hot Wallet Exposure:</strong> Bybit's online hot (warm) wallet is deliberately kept small and used only for operational needs <a href='https://www.certora.com/blog/bybit-hack-multisig-wallet-security'>[2]</a>. The hot wallet is refilled from cold storage as needed, rather than storing large reserves online <a href='https://www.ledgerinsights.com/bybit-crypto-exchange-suffers-largest-ever-hack-of-more-than-1-billion/'>[3]</a>. This limits the potential loss in an online breach. During normal operations, customer withdrawals are serviced from this warm wallet, while the cold wallet stays offline except when signing planned transfers.</p>

<p><strong>Hardware Wallets & Offline Signatures:</strong> Bybit's cold wallet private keys are reportedly stored on hardware wallet devices. Authorized personnel use these devices to sign transactions offline, adding a layer of protection against malware. In a recent disclosure, CEO Ben Zhou noted he used a Ledger hardware wallet to perform his signing duties for the cold wallet <a href='https://www.chaincatcher.com/en/article/2169954'>[4]</a>. The hardware wallet interface only shows transaction details for approval, ensuring the actual keys never leave the device.</p>

<p><strong>Regular Audits and Monitoring:</strong> Bybit has touted conducting regular security audits and system assessments to uncover vulnerabilities <a href='https://cointelegraph.com/learn/articles/how-the-bybit-hack-happened'>[1]</a>. They collaborate with third-party security firms to audit their wallet contracts and infrastructure. In fact, after a recent incident, Bybit brought in external forensic experts (Verichains and Sygnia) to thoroughly review their systems, which found no breach of Bybit's internal infrastructure <a href='https://www.newswire.ca/news-releases/bybit-confirms-security-integrity-amid-safe-wallet-incident-no-compromise-in-infrastructure-838573160.html'>[5]</a>. Additionally, Bybit's security team monitors wallet activity in real time – any anomalous or unauthorized transaction triggers immediate alerts. This was demonstrated during the 2025 incident when Bybit quickly detected an abnormal transfer, isolated the compromised wallet, and halted further transactions within minutes <a href='https://cointelegraph.com/learn/articles/how-the-bybit-hack-happened'>[1]</a>.</p>

<p><strong>Incident Response and Insurance:</strong> Bybit has processes to contain damage and protect users if a security event occurs. In the aforementioned incident, the team promptly froze the affected wallet, continued processing user withdrawals from other reserves, and even secured emergency loans to replenish liquidity <a href='https://www.ledgerinsights.com/bybit-crypto-exchange-suffers-largest-ever-hack-of-more-than-1-billion/'>[3]</a>. Bybit's CEO assured that all client assets remained 1:1 backed despite the hack, with the exchange's own funds covering the loss <a href='https://www.ledgerinsights.com/bybit-crypto-exchange-suffers-largest-ever-hack-of-more-than-1-billion/'>[3]</a>. While not a preventative measure, this highlights a commitment to fund security—backed by sufficient reserves and (likely) insurance arrangements—to make users whole in the event of a breach.</p>

<p><strong>Sources:</strong><br>
[1] <a href='https://cointelegraph.com/learn/articles/how-the-bybit-hack-happened'>Cointelegraph - How the Bybit Hack Happened</a><br>
[2] <a href='https://www.certora.com/blog/bybit-hack-multisig-wallet-security'>Certora - Bybit Hack Multisig Wallet Security</a><br>
[3] <a href='https://www.ledgerinsights.com/bybit-crypto-exchange-suffers-largest-ever-hack-of-more-than-1-billion/'>Ledger Insights - Bybit Crypto Exchange Suffers Largest Ever Hack</a><br>
[4] <a href='https://www.chaincatcher.com/en/article/2169954'>Chain Catcher - Article 2169954</a><br>
[5] <a href='https://www.newswire.ca/news-releases/bybit-confirms-security-integrity-amid-safe-wallet-incident-no-compromise-in-infrastructure-838573160.html'>Newswire - Bybit Confirms Security Integrity</a><br>
</p>"

---

### Additional Information

- **Bybit's Headquarters**: Bybit is headquartered in Dubai, United Arab Emirates.
- **Proof of Reserves**: Bybit regularly publishes proof of reserves to ensure transparency and trust.
- **Security Incident**: Bybit experienced a significant security incident in February 2025, resulting in the loss of over $1.4 billion in digital assets. The exchange is working to address this issue and has committed to enhancing its security measures.

This file provides a comprehensive overview of Bybit, covering its operations, security practices, and recent developments. It is essential for users to stay informed about the platform's status and any potential risks associated with it.