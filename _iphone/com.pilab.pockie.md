---
wsId: pockieWallet
title: Pockie Wallet - Crypto Wallet
altTitle: 
authors:
- danny
appId: com.pilab.pockie
appCountry: us
idd: '6448715234'
released: 2023-08-02
updated: 2025-08-11
version: 1.4.10
reviews: 10
website: http://pockie.io
repository: 
icon: com.pilab.pockie.jpg
bugbounty: 
meta: ok
verdict: nosource
date: 2025-11-26
signer: 
twitter: Pockie_io
social: 
features:
- fingerprint
- hd
- multiAccount
developerName: PiLab Co.,Ltd

---

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="fingerprint" quote="Use your PIN or biometrics to unlock your wallet." source="Store" %}

{% include featureEvidence.html feature="hd" quote="How should I store my recovery phrase and private key? Do not share your recovery phrase and private key with anyone! Make sure to store them in a safe place and remember that smart phones or emails can be hacked." source="Website" comment="Recovery phrase (mnemonic) backup is mentioned, indicating HD wallet structure per BIP39." %}

{% include featureEvidence.html feature="multiAccount" quote="When importing a wallet using a recovery phrase, Pockie imports the main account. Please use private keys to import additional accounts under the same recovery phrase." source="Website" %}