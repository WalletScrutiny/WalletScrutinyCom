---
wsId: WalletofSatoshi
title: Wallet of Satoshi
date: 2024-10-07
authors:
- leo
- danny
website: http://www.walletofsatoshi.com
twitter: walletofsatoshi
social:
- https://www.facebook.com/walletofsatoshi
features:
- ln
- buyWithCC
- nfc
redirect_from:
- /walletofsatoshi/
- /com.livingroomofsatoshi.wallet/
- /posts/2019/12/walletofsatoshi/
- /posts/com.livingroomofsatoshi.wallet/
- /android/com.livingroomofsatoshi.wallet/
- /iphone/com.livingroomofsatoshi.wallet/
android:
  appId: com.livingroomofsatoshi.wallet
  users: 1000000
  appCountry: us
  released: 2019-05-19
  updated: 2026-06-02
  version: 3.3.6
  reviews: 228
  icon: com.livingroomofsatoshi.wallet.png
  meta: ok
  verdict: custodial
  developerName: Wallet of Satoshi
iphone:
  appId: com.livingroomofsatoshi.wallet
  idd: 1438599608
  appCountry: jp
  released: 2019-05-20
  updated: 2026-06-02
  version: 3.3.6
  reviews: 28
  icon: com.livingroomofsatoshi.wallet.jpg
  meta: ok
  verdict: custodial
  developerName: Wallet of Satoshi

---

## Android

## Update — v3.1.7 Self-Custody Claims Review (2025-10-09)

### Summary of Change
Wallet of Satoshi announced a **“Self-Custody Mode”** in version **v3.1.7**, marketed as a major shift toward user-controlled Lightning funds.  

The update claims users can hold keys locally while maintaining usability through the Spark protocol.

---

### 1. Public Announcement
- **Official tweet (2025-10-08):** “Self-custody mode now available globally — a new Bitcoin era.”  
  ↳ [https://x.com/walletofsatoshi/status/1975876436964540434](https://x.com/walletofsatoshi/status/1975876436964540434)

---

### 2. Expert and Community Discourse

| Participant | Position | Reference |
|--------------|-----------|------------|
| **@boyacaxa / @conduition_io** | Argue that calling Spark-based mode “self-custody” is misleading because operators can rug users during transfers. | [boyacaxa](https://x.com/boyacaxa/status/1975890119187210310), [conduition_io](https://x.com/conduition_io/status/1940203020698243231) |
| **@kphur (Spark creator)** | States that operator honesty is only required at the time of transfer, and users can unilaterally exit later. | [Spark trust model](https://docs.spark.money/spark/trust-model) |
| **@TheBlueMatt / @NicolasDorier** | Contend that operators can modify software to redirect future funds, implying that full self-custody is not guaranteed. | [BlueMatt](https://x.com/TheBlueMatt/status/1940179770735829432), [Dorier](https://x.com/NicolasDorier/status/1940217999216247044) |
| **others** | Suggest renaming it “trustodial” to reflect the trust assumptions involved. | [Tweet](https://x.com/shocknet_justin/status/1939774027746484579) |

---

### 3. App Behavior (Observed)

- Settings → **Self Custody Mode** prompts the user to **log in to Backup** first.  
- Activating the mode creates a **new wallet (0 sats)** with an **independent 12-word seed phrase**.  
- Backup options include **Google Drive** and **Manual (Advanced)**.  
- Advanced mode requires biometric/PIN unlock, then shows the seed phrase, confirming through word re-entry.  
- Original custodial balance becomes hidden; switching back to “WoS Custody” restores access to the legacy balance.  
- The UI implies the two modes operate on **separate wallet instances**.

---

### 4. Verification Gaps

- Backend communication and Spark node behavior remain **unverified**.  
- Cannot yet confirm whether unilateral exit paths work without operator cooperation.  
- Current assessment relies solely on **public statements and local UI observation**.
- [Spark documentation](https://docs.spark.money/wallet/documentation/signing-interface) indicates that the 12 word seed phrases are BIP39 compliant

## Verdict

The trust and custodial model for the wallet is more nuanced. 

The user can unilaterally withdraw funds to Bitcoin L1 using the community-made spark-recovery tool. Use at your own risk: https://github.com/BlitzWallet/spark-recover

Spark is a “shared signing protocol”: https://docs.spark.money/spark/spark-tldr  
Spark operators are co-signers. For a transaction to happen, both the user’s signature and the operator’s signature are needed. The operator does not have the user’s private key.

However, self-custodial at WalletScrutiny means **exclusive user control**—the user alone can authorize spends without any third-party co-signature or trust. WoS, even with Spark, doesn’t offer this because operators must co-sign off-chain transfers. Risk exists at hand-off if operators fail to delete old keys; see Spark’s trust model: https://docs.spark.money/spark/trust-model

Thus we are retaining the **custodial** verdict.


## 2021-05-25

This is a custodial wallet according to their website's FAQ:

> It is a zero-configuration custodial wallet with a focus on simplicity and the
  best possible user experience.

and therefore **not verifiable**.

---

## iPhone

This is a custodial wallet according to their website's FAQ:

> It is a zero-configuration custodial wallet with a focus on simplicity and the
  best possible user experience.

and therefore **not verifiable**.

{% include featureEvidence.html feature="nfc" quote="Pay merchants by scanning a Lightning QR code, tapping an NFC card, or sharing your own custom Lightning Address." source="Store" %}

{% include featureEvidence.html feature="buyWithCC" quote="Yes, you can buy Bitcoin directly in the app in many countries. Tap the green &quot;Buy Bitcoin&quot; button on the main screen and follow the prompts. Availability and partners may vary by region." source="Website" %}
