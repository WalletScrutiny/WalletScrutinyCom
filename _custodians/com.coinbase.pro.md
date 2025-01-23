---
layout: reviewCustodian
title: "Coinbase Pro"
wsId: coinbasepro
score: 0
appId: com.coinbase.pro
users: 1000000
# BeginSample front matter 
# Question 1
hotColdDesign:
  published: true
  details: >-
    98% of funds in cold storage. Multi-signature architecture.
    Geographic distribution of private keys.
  documentation_url: "https://www.coinbase.com/security"
  lastUpdated: "2024-01-15"
  rating: 4

# Question 2
bitcoinFocus:
  bitcoinOnly: false
  bitcoinOptimized: true
  supportedAssets:
    - BTC
    - ETH
    - USDC
  bitcoinFeatures:
    - lightning
    - taproot
    - rbf
    - psbt
  details: >-
    Advanced bitcoin infrastructure with institutional focus

# Question 3
proofOfReserves:
  supported: true
  frequency: "monthly"
  lastProof: "2024-01-01"
  verificationUrl: "https://www.coinbase.com/proof-of-reserves"
  details: >-
    Monthly proof of reserves with public verification

# Question 4-5: Leadership and Jurisdiction
leadership:
  team:
    - name: "Brian Armstrong"
      role: "CEO"
      location: "USA"
  jurisdiction: "United States"
  yearsInBusiness: 12
  
# Question 6-7: Assets and Track Record
operations:
  btcCustodied: "987,654 BTC"
  trackRecord:
    incidentHistory: >-
      No major security incidents in 12 years of operation
    lastIncident: "N/A"
    
# Question 8: Business Risk Profile
businessModel:
  services:
    - spot
    - derivatives
    - staking
  restrictedCountries:
    - "Iran"
    - "North Korea"
    - "Syria"
    
# Question 9: Bitcoin Ecosystem Contribution
bitcoinContribution:
  fossDevelopment: true
  protocolSupport: true
  research: true
  details: >-
    Active contributor to Bitcoin Core, Lightning Network development
    
# Question 10-11: User Requirements
userAccess:
  kycRequired: true
  kycLevel: "advanced"
  withdrawalLimits:
    daily: "100 BTC"
    monthly: "1000 BTC"
    
# Question 12: Security Features
security:
  features:
    - "2FA"
    - "FIDO2"
    - "vaults"
    - "address whitelisting"
  customInfrastructure: true
  details: >-
    Custom-built security infrastructure with multiple layers of protection

# End Sample front matter
appCountry: 
website: http://pro.coinbase.com/
icon: com.coinbase.pro.jpg
date: 2023-11-02
signer: 
reviewArchive: 
twitter: CoinbasePro
social:
- https://www.facebook.com/coinbase
- https://twitter.com/coinbase
redirect_from:
- /com.coinbase.pro/
- /posts/com.coinbase.pro/
developerName: Coinbase Android
features: 

---

Coinbase Pro, launched in 2012 as GDAX (Global Digital Asset Exchange) before rebranding, is the professional trading platform of Coinbase, one of the largest cryptocurrency exchanges in the world. Based in the United States and regulated by multiple jurisdictions, it serves as a major fiat-to-crypto gateway and institutional-grade custodian for digital assets.

The platform implements a sophisticated custody solution that combines offline cold storage for the majority of assets with insured hot wallets for daily trading operations. As a regulated US entity, Coinbase Pro maintains strict compliance with federal and state regulations, including SOC certifications, and has established itself as one of the most trusted names in cryptocurrency custody.

Despite its strong security track record and institutional focus, Coinbase Pro operates as a fully custodial service where users do not control their private keys. The platform balances security with usability through features like whitelisted withdrawal addresses, time locks, and multi-user accounts for institutional clients, while maintaining high liquidity and trading functionality for active traders.

## Detailed Analysis
