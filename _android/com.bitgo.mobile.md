---
wsId: bitGo
title: BitGo
altTitle: 
authors:
- danny
users: 10000
appId: com.bitgo.mobile
appCountry: 
released: 2022-04-15
updated: 2023-01-19
version: 1.7.0
stars: 3.1
ratings: 
reviews: 6
website: https://bitgo.com
repository: 
issue: 
icon: com.bitgo.mobile.jpg
bugbounty: 
meta: ok
verdict: custodial
appHashes: 
date: 2025-03-26
signer: 
reviewArchive: 
twitter: BitGo
social:
- https://www.youtube.com/channel/UC7ILbUGTCM83sdilLB8Qlmg
- https://www.linkedin.com/company/bitgo-inc
redirect_from: 
developerName: BitGo, Inc
features: 

---

## Update 2025-03-26

The app is available on Google Play again.

## App Description from Google Play 

> Manage time-sensitive approvals. Keep your business moving by approving or denying fund transfers, new users, and more.
>
> Get up-to-date info. Check real-time market data, view your balance, and keep up with the latest crypto news.
>
> Stay secure. The app protects your account by limiting you to approving/denying requests (not initiating them), and requires 2FA whenever you log-in or approve a request.

## From the Website 

BitGo as noted in many previous reviews, is the custodian of the custodians. It offers many custodianship services to cryptocurrency exchanges and more. 

Among its service offerings include:

- Hot Wallets
- Custodial Wallets
- Self-Managed Cold Wallets
- NFT Wallets
- Collateral Management
- Wealth Management

## Analysis 

- We signed up using the web interface 
- Once the user signs up with BitGo, he is presented with 2 options: 

### Starter or Institutional

**Starter**

> Great for individuals or companies just getting started. Create wallets, send funds, custody your assets, and muc more without an annual contract. 

**Institutional**

> Ideal for companies with significant transaction volumes or assets to store. Connect with Sales to learn how to get your institution started with BitGo. 

Both the app installed on BlueStacks 5 Pie and on our phone, issued a network connectivity error when we tried to access the Bitcoin wallet. 

We proceeded to the web based wallet. 

We were asked to fill in some wallet details with the following fields:

- Name
- Currency

Type of Wallet:

- **Custody Wallet** - BitGo manages all private keys and the wallet is insured. Contact support@bitgo.com to upgrade your enterprise with qualified custody.

- **Self-Managed Hot Wallet** - You are responsible for securing both the main private key and backup key for the wallet. BitGo holds a key to co-sign all transactions. 

- **Self-Managed Cold Wallet** - You are responsible for securing both the main user private key and backup private key for the wallet. Keys are generated offline from an air-gapped computer using the Offline Vault Console (OVC). This wallet type is not enabled for your enterprise. Please contact support@bitgo.com to learn more or to activate this product.

The user can then use his login or wallet password. 

Backup Key

The user then is given the choice on how to create the backup key.

- **Keep my backup key secure with trusted partner** - Create a backup key with our trusted partner to ensure you NEVER lose access to the funds in your wallet. Select a key recovery service below. 

- **I already have a backup key** - Do you already have an unused private/public key you created offline? Provide your public key so we can create your secure wallet. 

- **Create and store my own key** - You can create and print a backup key from your browser, but this is the most vulnerable to loss or theft. Use this method only if you plan on storing small balances.

We selected 'Create and store my own key' - the web interface lets the user download a PDF file called the BitGo Key Card, containing QR codes: 

1. *User Key* - Private key, encrypted with the wallet password

2. *Encrypted Wallet Password* - Wallet Password, encrypted client-side with a key held by BitGo

3. *Backup Key* - Backup private key, encrypted with wallet password 

4. *BitGo Public Key* - Public part of the key that BitGo will use to co-sign transactions with you on your wallet.
 
5. **Six Digit Activation Code** 

We were then asked to tick a box confirming that we printed the BitGo KeyCard and deleted the file in our computer

After that, we gained access to our Bitcoin Wallet

## Verdict 

Analyzing this service is somewhat complicated given the provision of multiple keys and multiple security measures. 

However, if we go back to the methodology, it states in 'custodial' : 

> Some services might claim their setup is super secure, that they don’t actually have access to the funds, or that the access is shared between multiple parties. For our evaluation of it being a wallet, these details are irrelevant. They might be a trustworthy Bitcoin bank and they might be a better fit for certain users than being your own bank but our investigation still stops there as we are only interested in wallets. 

One may argue that there are options for the user to provide his own keys. That might be a legitimate point of contention, but for now, we'll treat it as **custodial** since the user is not 100% in control.