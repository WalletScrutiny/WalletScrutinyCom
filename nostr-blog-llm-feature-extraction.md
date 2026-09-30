# Which LLM Can Actually Read a Wallet and Tell You Its Features?

*A benchmark of 11 models on Bitcoin wallet feature extraction for WalletScrutiny*

---

At [WalletScrutiny](https://walletscrutiny.com) we maintain a database of Bitcoin wallet features: does it support Lightning? Taproot? Coin control? Air-gapped signing? Each feature needs to be sourced — a quote from the app store description, README, license file, or website. For hundreds of wallets, doing this by hand doesn't scale.

So we automated it. We fed each wallet's source texts to an LLM and asked it to identify features with citations. Then we discovered the hard part: most models will *confidently make up the quotes*.

This post documents what we found when we benchmarked 11 models head-to-head on the same 6 wallets with the same source data.

---

## The Task

Each wallet in our database has cached source text: the Play Store / App Store description, the GitHub README (first 6000 chars), the LICENSE file, and scraped website text. The LLM receives all of this plus our feature list (~27 features including `ln`, `taproot`, `segwit`, `foss`, `coinCtrl`, `multiSig`, `airGapped`, `companion`, `secEl`, etc.) and must reply in YAML:

```yaml
features:
  - ln:
      source: "Store"
      quote: "Send and receive Lightning payments instantly"
  - foss:
      source: "License"
      quote: "MIT License"
  - coinCtrl:
      source: "README"
      quote: "Select which UTXOs to spend in advanced settings"
      comment: "Implies coin control functionality"
```

Rules enforced in the prompt:
- Only features with clear, explicit evidence
- Quotes must be **exact plain-text excerpts** from the named source
- Do not return features already confirmed in the existing review body
- `foss` only if the License section explicitly contains a recognized open-source license
- LN and Liquid are not the same thing — do not confuse them

For each feature claim, we ran **quote validation**: we checked whether the quoted text actually appears verbatim (or near-verbatim) in the cached source for that product. This is our primary quality signal. A claim that fails validation is labeled ❌ — the quote does not exist in the source we provided.

---

## The Products

Six `sourceavailable` wallets — three where models could find real features, three harder cases:

| Product | Platform | Notes |
|---|---|---|
| `hardware/coldcardMk4` | Hardware wallet | Dense README; `segwit`, `taproot`, `foss` all findable |
| `android/com.blitzwallet` | Android | Full website text; Lightning, store features |
| `android/it.airgap.vault` | Android | Website has "Segwit Support", companion app architecture |
| `android/io.nunchuk.android` | Android | GPL3 license clearly findable; multisig focus |
| `android/org.electrum.electrum` | Android | Rich README and website but sparse explicit feature claims |
| `desktop/bitcoincore` | Desktop | No Store; minimal website text; Tor and multisig findable |

---

## The Models

All tested via [PPQ.ai](https://ppq.ai) API. Eleven models across three test rounds:

| Model | Provider | Input $/1M | Output $/1M |
|---|---|---|---|
| Claude Sonnet 4.6 | Anthropic | $3.15 | $15.75 |
| Claude Haiku 4.5 | Anthropic | $1.05 | $5.25 |
| Claude 3.5 Haiku | Anthropic | $0.84 | $4.20 |
| Gemini 2.0 Flash Lite | Google | $0.05 | $0.21 |
| Gemini 3 Flash Preview | Google | $0.35 | $2.10 |
| DeepSeek V3.2 | DeepSeek | $0.27 | $0.40 |
| Mistral Large 3 | Mistral | $0.53 | $1.58 |
| GPT-OSS 120B | OpenAI | $0.04 | $0.20 |
| MiniMax M2.5 | MiniMax | $0.32 | $1.16 |
| GPT-5 Nano | OpenAI | $0.05 | $0.42 |
| GPT-5 Mini | OpenAI | $0.26 | $2.10 |

---

## Results

**Verified (✅)** = quote found verbatim in cached source. **Partial (⚠️)** = quote text exists in source but match is approximate. **Fabricated (❌)** = quote does not appear in source at all. Fabrication rate = (❌ + ⚠️) / total.

| Model | Found | ✅ Verified | ⚠️ Partial | ❌ Fabricated | Fab% | Median latency | Cost/product |
|---|---|---|---|---|---|---|---|
| **Claude Sonnet 4.6** | **11** | **7** | **2** | **2** | **36%** | 4,811 ms | 1.04¢ |
| Claude 3.5 Haiku | 9 | 5 | 0 | 4 | 44% | 4,834 ms | 0.24¢ |
| **DeepSeek V3.2** | **18** | **8** | **0** | **9** | **50%** | 9,929 ms | **0.05¢** |
| Claude Haiku 4.5 | 10 | 4 | 1 | 5 | 60% | 2,408 ms | 0.26¢ |
| Gemini 2.0 Flash Lite | 10 | 4 | 1 | 5 | 60% | 1,875 ms | **0.01¢** |
| Mistral Large 3 | 39† | 5 | 0 | 19 | —† | 4,007 ms | 0.12¢ |
| Gemini 3 Flash Preview | 16 | 5 | 2 | 9 | 69% | 13,719 ms | 0.09¢ |
| GPT-OSS 120B | 3 | 2 | 0 | 1 | 33% | 3,774 ms | 0.02¢ |
| MiniMax M2.5 | 2 | 1 | 0 | 1 | 50% | 11,408 ms | 0.13¢ |
| GPT-5 Nano | 0 | 0 | 0 | 0 | — | n/a | 0.05¢ |
| GPT-5 Mini | 0 | 0 | 0 | 0 | — | 26,483 ms | 0.26¢ |

†Mistral returned 39 features for AirGap Vault alone including 15 with **completely empty quotes and sources** — the parser cannot score these, so the true fabrication rate is higher than shown.

---

## Failure Patterns

### 1. The boilerplate quote (Gemini, DeepSeek, Mistral)

The most pervasive failure: the model writes a plausible generic description and presents it as if quoted from the source.

> `"Send and receive Lightning payments instantly"` — returned as a Store quote for Bitcoin Core, Nunchuk, AirGap Vault, and ColdCard. None of them say this. ColdCard doesn't even connect to the internet.

> `"Select which UTXOs to spend in advanced settings"` — returned as README quote for Blitzwallet and several others. Not in any of their READMEs.

These aren't random hallucinations — they're the model's internal representation of what a wallet *should* say, rendered as if it were evidence.

### 2. The inference quote (Claude 3.5 Haiku, DeepSeek)

The model finds real text in the source but quotes it as evidence for a feature it doesn't actually support.

> DeepSeek claims `segwit` for Blitzwallet with quote `"Using a Bitcoin QR Code"`. The string exists in the README. It says nothing about SegWit addresses. The validator passes it; a human reviewer would not.

> Claude 3.5 Haiku claims `taproot` for Electrum with quote `"Latest release: Electrum-4.7.0"`. The version string is on the website. It proves nothing about Taproot support.

These pass quote validation but fail feature validation. A secondary semantic check ("does this quote actually evidence the feature?") would catch them.

### 3. Empty-quote hallucination (Mistral Large 3)

Mistral returned features with completely empty `quote` and `source` fields — the YAML structure was there, but the evidence was absent. This is a distinct failure from fabricated quotes: the model acknowledged it had no evidence but returned the feature claim anyway.

### 4. Complete refusal (GPT-5 Nano, GPT-5 Mini)

GPT-5 Nano consistently hit the 1024-token output cap on every product, generating verbose non-YAML output rather than the requested format. Zero parseable features across all 6 products. GPT-5 Mini showed the same behavior at 26 seconds median latency.

### 5. Overconfident recall (all Gemini variants)

Both Gemini models show a pattern of inferring features from surrounding context rather than citing them:

> Gemini 3 claims `multiSig` for Bitcoin Core with quote *"Create multi-signature addresses requiring multiple keys."* Bitcoin Core does support multisig. But that exact text isn't on bitcoincore.org — the model is remembering, not reading.

---

## Per-Product Detail

### hardware/coldcardMk4

The README is the main source. Website has minimal text. No Store listing.

| Sym | Model | Feature | Quote (source) |
|---|---|---|---|
| ⚠️ | Claude Sonnet 4.6 | taproot | *"Edge will contain features that may not be ready for prime time"* (README) |
| ⚠️ | Claude Sonnet 4.6 | foss | *"To have confidence this source code tree is the same as the binary"* (README) |
| ✅ | Claude Haiku 4.5 | segwit | *"Coldcard is an Affordable, Ultra-secure & Verifiable Hardware Wallet"* (README) |
| ⚠️ | Claude Haiku 4.5 | taproot | *"Edge will contain features that may not be ready for prime time"* (README) |
| ❌ | Claude Haiku 4.5 | foss | *"you can rebuild it from source and get exactly the same bytes"* (README) |
| ❌ | Claude Haiku 4.5 | coinCtrl | *"Unlimited transaction size"* (Store) |
| ✅ | Gemini 2.0 Flash Lite | customNode | *"Get yours at [Coldcard.com]"* (README) |
| ❌ | Gemini 2.0 Flash Lite | ln | *"Send and receive Lightning payments instantly"* (Store) |
| ⚠️ | Gemini 3 Flash Preview | taproot | *"Edge will contain features that may not be ready for prime time"* (README) |
| ❌ | Gemini 3 Flash Preview | multiAccount | *"More multisig wallets possible"* (Store) |
| ❌ ×9 | Mistral Large 3 | segwit, taproot, bip158spv, ownFullNode, multiAccount, batching, coinCtrl, customNode, foss | (all fabricated) |

*Note: `foss` is tricky here. ColdCard's license is not MIT — it's a proprietary license with source-available terms. Models claiming `foss` are wrong on the facts regardless of what the cached README says.*

### android/com.blitzwallet

Full website text available. Apache 2.0 license. Uses Spark (custodial LN) and has a built-in store.

| Sym | Model | Feature | Quote (source) |
|---|---|---|---|
| ✅ | Claude Sonnet 4.6 | foss | *"Version 2.0, January 2004 http://www.apache.org/licenses/"* (License) |
| ✅ | Claude 3.5 Haiku | bip158spv | *"Self-custodial Bitcoin Lightning wallet"* (README) |
| ✅ | Claude 3.5 Haiku | cashu | *"Integrate Bitcoin Liquid Wallet"* (README) |
| ✅ | Claude 3.5 Haiku | ownLN | *"By using the Spark network"* (README) |
| ❌ | Claude 3.5 Haiku | segwit, taproot, airGapped, tradeAlts | (fabricated) |
| ✅ | Gemini 2.0 Flash Lite | ownLN | *"a React Native application that allows users to interact with the Bitcoin"* (README) |
| ✅ | Gemini 2.0 Flash Lite | buyWithCC | *"Spend Bitcoin on gift cards, VPNs, and premium services"* (Website) |
| ✅ ×6 | DeepSeek V3.2 | segwit, taproot, batching, tradeAlts, buyWithCC, coinCtrl | (verified — though segwit/taproot quotes are weak) |
| ❌ | DeepSeek V3.2 | companion | *"Web Wallet - Access your Bitcoin from any browser"* (Website) |
| ❌ ×5 | Mistral Large 3 | segwit, taproot, foss, coinCtrl + more | (fabricated) |

### android/it.airgap.vault

Website now available and says "Segwit Support" explicitly. README describes the QR-code architecture for communicating with the companion app.

**Note on `companion`:** The quote *"AirGap Wallet — The companion application to AirGap Vault"* describes AirGap **Wallet** as the companion. The `companion` feature belongs on the Wallet listing (it IS the companion), not the Vault listing. Vault is correctly tagged with `airGapped` (already in the review body, excluded from this test).

| Sym | Model | Feature | Quote (source) |
|---|---|---|---|
| ✅ | Claude Sonnet 4.6 | segwit | *"Segwit Support"* (Website) |
| ✅ | Claude Sonnet 4.6 | camera | *"Secure, one-way communication with AirGap Wallet over QR codes"* (README) |
| ⚠️ | Claude Sonnet 4.6 | companion | *"AirGap Wallet — The companion application to AirGap Vault"* (Website) — describes Wallet, not Vault |
| ✅ | Claude Haiku 4.5 | segwit | *"Segwit Support"* (Website) |
| ⚠️ | Claude Haiku 4.5 | companion | *"The [AirGap Wallet] is installed on your everyday smartphone"* (README) — describes Wallet, not Vault |
| ✅ | Gemini 3 Flash Preview | segwit | (verified) |
| ✅ | Gemini 3 Flash Preview | secEl | *"The generated secret is saved in the secure enclave of the device"* (README) |
| ✅ | Gemini 3 Flash Preview | camera | *"transferred to the offline device via QR code"* (README) |
| ⚠️ | Gemini 3 Flash Preview | companion | — describes Wallet, not Vault |
| ✅ | DeepSeek V3.2 | segwit | *"Segwit Support"* (Website) |
| ❌ | DeepSeek V3.2 | customNode | (fabricated) |
| ✅ | Mistral Large 3 | segwit | (verified) |
| ✅ | Mistral Large 3 | secEl | (verified) |
| ✅ | Mistral Large 3 | camera | (verified) |
| ⚠️ | Mistral Large 3 | companion | — describes Wallet, not Vault |
| ? ×15 | Mistral Large 3 | taproot, bip158spv, TOR, ownLN, ownFullNode, batching, buyWithCC, mix, liquid, cashu, fedimint, ecash-mint, coinCtrl, customNode | (empty quotes — unscored) |

### android/io.nunchuk.android

GPL3 license is explicit and findable. Short README (619 chars). No Store description. No LN support — this is a multisig wallet.

| Sym | Model | Feature | Quote (source) |
|---|---|---|---|
| ✅ | All 7 models that found anything | foss | *"GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007"* (License) |
| ❌ | Claude Haiku 4.5, Gemini 2.0 FL, Gemini 3 FP, DeepSeek V3.2 | ln | *"Send and receive Lightning payments instantly"* (Store) |
| ❌ | Claude Sonnet 4.6, Gemini 3 FP | ownFullNode, camera | (fabricated) |

*The `ln` fabrication across four different models on a wallet that explicitly doesn't support Lightning is a clean signal: models are pattern-matching "Bitcoin wallet" → "probably has Lightning" rather than reading.*

### android/org.electrum.electrum

Rich README and full website text. Electrum supports segwit, taproot, and Tor — but these are discussed in technical terms in the README, not as bullet-point feature claims.

| Sym | Model | Feature | Quote (source) |
|---|---|---|---|
| ✅ | Claude 3.5 Haiku | taproot | *"Latest release: Electrum-4.7.0"* (Website) |
| ❌ | Claude Haiku 4.5 | segwit | *"Electrum has played a notable role in the history of Bitcoin software"* (README) |
| ❌ | Claude Haiku 4.5 | taproot | *"Advanced Tools: Custom transaction fees, coin control, Lightning"* (Website) |
| ❌ ×5 | DeepSeek V3.2 | segwit, taproot, TOR, ownLN, airGapped | (fabricated — model knows Electrum has these, invents quotes) |
| ❌ ×5 | Mistral Large 3 | segwit, taproot, TOR, fingerprint, nfc | (fabricated) |

*Electrum is a well-known wallet. Models clearly "know" its features from training data and quote them confidently — even when the cached text doesn't contain that evidence. This is the most dangerous failure mode for a production pipeline.*

### desktop/bitcoincore

Minimal website text (238 chars after stripping). Bitcoin Core has no app store presence. But the README mentions Tor and multisig.

| Sym | Model | Feature | Quote (source) |
|---|---|---|---|
| ✅ | Claude Sonnet 4.6 | TOR | *"Bitcoin Core connects to the Bitcoin peer-to-peer network"* (README) |
| ✅ | Claude Sonnet 4.6 | multiSig | *"Bitcoin Core"* (Website) |
| ❌ ×5 | Gemini 3 Flash Preview | bip158spv, TOR, multiAccount, batching, multiSig | (fabricated from training knowledge) |

*Five of Gemini 3's claims for Bitcoin Core are features it knows Core has. The quotes are not in our cached text. Every other model returned nothing — which is arguably the more honest response given the sparse source data.*

---

## Summary

After a full semantic audit — checking whether each "verified" quote actually *proves* the claimed feature — the picture is harsher than the raw numbers suggest. Out of 19 quote-validated claims in our test set, only **6 are semantically solid**:

| Wallet | Feature | Quote | Why solid |
|---|---|---|---|
| BlitzWallet | `foss` | *"Version 2.0, January 2004 http://www.apache.org/licenses/"* | Apache 2.0 is unambiguously FOSS |
| BlitzWallet | `buyWithCC` | *"Spend Bitcoin on gift cards, VPNs, and premium services"* | Explicit |
| AirGap Vault | `segwit` | *"Segwit Support"* | Explicit |
| AirGap Vault | `camera` | *"Secure, one-way communication with AirGap Wallet over QR codes"* | Explicit |
| AirGap Vault | `secEl` | *"The generated secret is saved in the secure enclave of the device"* | Explicit |
| Nunchuk | `foss` | *"GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007"* | Explicit |

The other 13 fail for various reasons:

- **Quote in source, wrong feature:** *"Coldcard is an Affordable, Ultra-secure & Verifiable Hardware Wallet"* ≠ SegWit. *"Using a Bitcoin QR Code"* ≠ SegWit. *"View a detailed description of payments"* ≠ coin control.
- **Quote proves something else:** *"To have confidence this source code tree is the same as the binary"* proves reproducibility, not FOSS. ColdCard's license is not open source.
- **Feature belongs to the wrong product:** AirGap Vault's `companion` quote — *"AirGap Wallet — The companion application to AirGap Vault"* — describes the *other* app in the ecosystem. Vault is the airgapped signer. Wallet is the companion. The feature, if anything, belongs to the Wallet listing, not the Vault listing.
- **Version string ≠ feature:** *"Latest release: Electrum-4.7.0"* says nothing about Taproot.
- **Generic connectivity ≠ Tor:** *"Bitcoin Core connects to the Bitcoin peer-to-peer network"* does not mention Tor.
- **Wrong protocol:** *"Integrate Bitcoin Liquid Wallet"* ≠ cashu. Liquid and cashu are completely different protocols.
- **Inference without evidence:** *"By using the Spark network"* for `ownLN` — Spark is a custodial LN node, the opposite of ownLN.

On a strict reading:

| Model | Defensible finds | Cost/product | Verdict |
|---|---|---|---|
| **Claude Sonnet 4.6** | **~4–5** | 1.04¢ | Best precision; highest cost |
| **DeepSeek V3.2** | **~3–4** | **0.05¢** | Best recall; most noise |
| Claude 3.5 Haiku | ~3–4 | 0.24¢ | Good balance; conservative |
| Gemini 2.0 Flash Lite | ~2–3 | **0.01¢** | Extremely cheap; noisy |
| GPT-OSS 120B | ~1–2 | 0.02¢ | Very conservative; rarely wrong |
| Gemini 3 Flash Preview | ~2–3 | 0.09¢ | High recall, high noise |
| Mistral Large 3 | ~2–3 | 0.12¢ | Highest count, least reliable |
| GPT-5 Nano / Mini | 0 | 0.05–0.26¢ | Unusable |

---

## Which Features Can LLMs Actually Extract Reliably?

Tallying exact-quote precision across all models and all 6 products reveals a clear split:

| Feature | Times claimed | Exact quotes | Precision | Why |
|---|---|---|---|---|
| `secEl` | 2 | 2 | **100%** | "secure enclave" is rare specific terminology — appears verbatim |
| `foss` | 13 | 9 | **69%** | License text is boilerplate; GPL/Apache/MIT match near-exactly |
| `segwit` | 14 | 8 | **57%** | When explicit ("Segwit Support"), trivial. When inferred, fails. |
| `companion` | 7 | 4 | **57%** | Works when the website says it plainly; fails when model infers the architecture |
| `camera` | 7 | 3 | **43%** | Depends on README quality |
| `buyWithCC` | 3 | 2 | **67%** | Store/website feature descriptions tend to be literal |
| `taproot` | 13 | 2 | **15%** | Models know popular wallets support Taproot and assert it without explicit text |
| `TOR` | 5 | 1 | **20%** | Same — models guess from reputation |
| `coinCtrl` | 5 | 1 | **20%** | Requires recognizing UTXO selection specifically, not just "fee control" |
| `ln` | 5 | 0 | **0%** | Pure hallucination on every non-LN wallet tested |
| `ownFullNode` | 4 | 0 | **0%** | Inferred from "non-custodial" or "connect to your node" generics |
| `multiAccount` | 4 | 0 | **0%** | Inferred from "multiple wallets" or "accounts" loosely |
| `airGapped` | 2 | 0 | **0%** | Inferred from hardware wallet context |

**The pattern is clear:**

Features that LLMs can reliably find with explicit quotes:
- **License type** (`foss`) — license files are standardized boilerplate, trivially matchable
- **Explicit feature bullets** (`secEl`, `segwit` when literally stated, `buyWithCC`) — when the source says it plainly, models find it
- **Architecture described in README** (`camera`, `companion` when described) — works when the feature is described functionally

Features that LLMs consistently fabricate:
- **Features the wallet is *famous* for** (`ln` for Electrum, `TOR` for Bitcoin Core, `taproot` for ColdCard) — models substitute training memory for source text
- **Features requiring concept mapping** (`coinCtrl`, `airGapped`, `ownFullNode`) — the model must recognize that "UTXO selection" = coin control, "no internet connection" = air-gapped. Models often accept weaker evidence.
- **Protocol distinctions** (`cashu` vs `liquid`, `ownLN` vs custodial LN) — models conflate related protocols

This suggests the LLM's role should be scoped accordingly: use it for explicit, literal feature claims (license, explicit feature bullets on website/README), and rely on human judgment for inferential features (architecture, protocol distinctions, security properties).

---

## What We're Building

The goal is a pipeline where:
1. An LLM proposes features with cited quotes for all `sourceavailable` wallets (~120 products)
2. Each proposal is validated: does the quote exist in the cached source?
3. Semantic check: does the quote actually support the claimed feature?
4. Human review for anything that passes both filters before being applied

DeepSeek V3.2 at 0.05¢/product means running the full corpus costs about **$0.06**. Even Sonnet 4.6 costs **$1.25** for all 120 products. The bottleneck isn't cost — it's catching models that substitute training-data recall for evidence from the provided text.

The two remaining open problems:

**1. Inference quotes** — quotes that are in the source but don't evidence the feature. Catching these requires a secondary pass asking: "Does this quote actually say the wallet supports X?"

**2. Famous wallet bias** — well-known wallets (Electrum, Bitcoin Core) are particularly prone to fabrication because models have strong priors about their features. The prompt instruction "only cite what is in the provided text" is not sufficient.

---

## Which Model Should We Use?

209 `sourceavailable` products are in the database. At 1.04¢/product, Sonnet 4.6 costs **$2.17** for the full corpus — or about **$10/year** if re-run monthly. DeepSeek V3.2 at 0.05¢ costs **$0.10** per full run.

The cost question is essentially irrelevant. Even the most expensive model is cheap. The question is quality:

- **Sonnet 4.6** for a final human-assisted pass — lowest fabrication rate (36%), best at knowing when it doesn't know
- **DeepSeek V3.2** for a high-recall first pass — catches the most features, but half need manual verification of the quote
- A two-pass approach costs ~$0.15 for the whole corpus and likely catches more valid features than either alone

The pipeline will use DeepSeek for discovery and Sonnet to confirm ambiguous cases.

---

## Verified Features Found (Across All Models)

All features that passed quote validation (✅ exact or ⚠️ partial) in at least one model. Source links point to the actual document the quote was drawn from. Human review required before applying to production — see notes on weak quotes below.

Only claims where the quote is both present in the source *and* semantically proves the feature. Rejected claims are listed separately below.

| Wallet | WS Review | Feature | Quote | Source | Found by |
|---|---|---|---|---|---|
| BlitzWallet | [review](https://walletscrutiny.com/android/com.blitzwallet/) | `foss` | ✅ *"Version 2.0, January 2004 http://www.apache.org/licenses/"* | [License](https://github.com/BlitzWallet/BlitzWallet/blob/HEAD/LICENSE) | Sonnet 4.6 |
| BlitzWallet | [review](https://walletscrutiny.com/android/com.blitzwallet/) | `buyWithCC` | ✅ *"Spend Bitcoin on gift cards, VPNs, and premium services"* | [Website](https://blitzwalletapp.com/) | Gemini 2.0 FL, DeepSeek V3.2 |
| AirGap Vault | [review](https://walletscrutiny.com/android/it.airgap.vault/) | `segwit` | ✅ *"Segwit Support"* | [Website](https://www.airgap.it) | Sonnet 4.6, Haiku 4.5, Gemini 3 FP, DeepSeek V3.2, Mistral L3, GPT-OSS 120B |
| AirGap Vault | [review](https://walletscrutiny.com/android/it.airgap.vault/) | `camera` | ✅ *"Secure, one-way communication with AirGap Wallet over QR codes or URL-Schemes"* | [README](https://github.com/airgap-it/airgap-vault#readme) | Sonnet 4.6, Gemini 3 FP, Mistral L3 |
| AirGap Vault | [review](https://walletscrutiny.com/android/it.airgap.vault/) | `secEl` | ✅ *"The generated secret is saved in the secure enclave of the device"* | [README](https://github.com/airgap-it/airgap-vault#readme) | Gemini 3 FP, Mistral L3 |
| Nunchuk | [review](https://walletscrutiny.com/android/io.nunchuk.android/) | `foss` | ✅ *"GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007"* | [License](https://github.com/nunchuk-io/nunchuk-android/blob/HEAD/LICENSE) | All 8 models |

**Rejected claims (quote in source but doesn't prove the feature):**

| Wallet | Feature | Quote | Why rejected |
|---|---|---|---|
| ColdCard Mk4 | `taproot` | *"Edge will contain features that may not be ready for prime time, such as Taproot"* | Taproot is in the *Edge* (pre-release) branch only — not confirmed in production firmware |
| ColdCard Mk4 | `segwit` | *"Coldcard is an Affordable, Ultra-secure & Verifiable Hardware Wallet"* | Product tagline; no mention of SegWit |
| ColdCard Mk4 | `foss` | *"To have confidence this source code tree is the same as the binary"* | Reproducibility ≠ FOSS. ColdCard's license is proprietary. |
| ColdCard Mk4 | `customNode` | *"Get yours at [Coldcard.com]"* | Marketing link; unrelated to custom node connectivity |
| BlitzWallet | `tradeAlts` | *"Built-in store where you can purchase gift cards, VPNs"* | This is `buyWithCC` (buying goods), not altcoin trading |
| BlitzWallet | `cashu` | *"Integrate Bitcoin Liquid Wallet"* | Liquid ≠ cashu. Different protocols. |
| BlitzWallet | `ownLN` | *"By using the Spark network"* | Spark is custodial — the opposite of running your own node |
| BlitzWallet | `segwit` | *"Using a Bitcoin QR Code"* | QR code scanning ≠ SegWit address support |
| BlitzWallet | `coinCtrl` | *"View a detailed description of payments (date, time, fee, payment type)"* | Payment details view ≠ UTXO coin control |
| AirGap Vault | `companion` | *"AirGap Wallet — The companion application to AirGap Vault"* | The quote describes AirGap *Wallet*, not Vault. Vault is the air-gapped signer; Wallet is the hot companion. The feature, if tagged, belongs to the Wallet listing. |
| Electrum | `taproot` | *"Latest release: Electrum-4.7.0"* | Version string proves nothing |
| Bitcoin Core | `TOR` | *"Bitcoin Core connects to the Bitcoin peer-to-peer network"* | Network connectivity ≠ Tor specifically |
| Bitcoin Core | `multiSig` | *"Bitcoin Core"* | Product name alone proves nothing |

---

## Methodology

- 6 `sourceavailable` products tested across all models
- Source text: GitHub README (up to 6000 chars), license file (up to 500 chars), website text (up to 6000 chars), existing WalletScrutiny review body (up to 2000 chars). Store descriptions were empty for all Android products due to Google Play scraper blocking.
- `max_tokens: 1024` for all models
- Quote validation: exact string match after whitespace normalization; partial if ≥60% of 4-word sliding windows match
- Round 1 (4 models, reruns with clean data): claude-haiku-4.5, minimax/minimax-m2.5, openai/gpt-oss-120b, google/gemini-2.0-flash-lite-001
- Round 2 (5 models, 10 parallel workers): anthropic/claude-3.5-haiku, gemini-3-flash-preview, openai/gpt-5-mini, mistralai/mistral-large-2512, deepseek/deepseek-v3.2
- Sonnet baseline (claude-sonnet-4.6): sequential
- Latency: median over 6 calls per model (round 2 and Sonnet only)
- Pricing: PPQ.ai API rates as of February 2026

All raw results preserved in the WalletScrutiny repository.

---

*WalletScrutiny is an open-source project that tracks Bitcoin wallet security and verifiability. https://walletscrutiny.com*
